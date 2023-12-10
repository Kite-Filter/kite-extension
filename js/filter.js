// Block Site
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'block') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      chrome.tabs.update(currentTab.id, { url: chrome.runtime.getURL('pages/blocked.html') });
    });
  }
});

// Block Data: URLs
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = details.url;

  if (url.startsWith('data:')) {
    chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('pages/blocked.html') });
  }
});

// Block Local HTML Files
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = details.url;

  if (url.startsWith('file://')) {
    const extensions = ['.html', '.mhtml', '.htm', '.html5', '.xhtml', '.shtml', '.phtml', '.dhtml'];

    if (extensions.some(extension => url.toLowerCase().endsWith(extension))) {
      chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('pages/blocked.html') });
    }
  }
});

// Remove Bookmarklets (javascript: and data:)
function removeBookmarklets() {
  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    const allBookmarks = extractBookmarks(bookmarkTreeNodes);
    const javascriptBookmarks = allBookmarks.filter(bookmark => /^javascript:/i.test(bookmark.url));
    const dataBookmarks = allBookmarks.filter(bookmark => /^data:/i.test(bookmark.url));

    removeBookmarks(javascriptBookmarks);
    removeBookmarks(dataBookmarks);
  });
}

// Extract Bookmakrs
function extractBookmarks(bookmarkNodes) {
  const bookmarks = [];

  function processNode(node) {
    if (node.url) {
      bookmarks.push({ id: node.id, url: node.url });
    }
    if (node.children) {
      for (const child of node.children) {
        processNode(child);
      }
    }
  }

  for (const node of bookmarkNodes) {
    processNode(node);
  }

  return bookmarks;
}

// Remove Bookmarks
function removeBookmarks(bookmarks) {
  bookmarks.forEach((bookmark) => {
    chrome.bookmarks.remove(bookmark.id);
  });
}

// Run on Installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    removeBookmarklets();
  }
});

// Run on Bookmark Creation
chrome.bookmarks.onCreated.addListener(() => {
  removeBookmarklets();
});

// Enfore HTTPS
chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = details.url;

  if (url.startsWith('http://')) {
    const httpsUrl = url.replace(/^http:/, 'https:');
    
    // Check if Site Supports HTTPS
    fetch(httpsUrl, { method: 'HEAD' })
      .then(response => {
        if (response.ok) {
          chrome.tabs.update(details.tabId, { url: httpsUrl });
        } else {
          chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('pages/blocked.html') });
        };
      })
      .catch(() => {
        chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('pages/blocked.html') });
      });
  };
});