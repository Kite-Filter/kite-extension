chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = details.url;

  if (url.startsWith('data:')) {
    chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('pages/blocked.html') });
  };
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = details.url;

  if (url.startsWith('file://')) {
    const extensions = ['.html', '.mhtml', '.htm', '.html5', '.xhtml', '.shtml', '.phtml', '.dhtml'];

    if (extensions.some(extension => url.toLowerCase().endsWith(extension))) {
      chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('pages/blocked.html') });
    };
  };
});

function removeBookmarklets() {
  chrome.bookmarks.getTree((bookmarkTreeNodes) => {
    const allBookmarks = extractBookmarks(bookmarkTreeNodes);
    const javascriptBookmarks = allBookmarks.filter(bookmark => /^javascript:/i.test(bookmark.url));
    const dataBookmarks = allBookmarks.filter(bookmark => /^data:/i.test(bookmark.url));

    removeBookmarks(javascriptBookmarks);
    removeBookmarks(dataBookmarks);
  });
};

function extractBookmarks(bookmarkNodes) {
  const bookmarks = [];

  function processNode(node) {
    if (node.url) {
      bookmarks.push({ id: node.id, url: node.url });
    };
    if (node.children) {
      for (const child of node.children) {
        processNode(child);
      };
    };
  };

  for (const node of bookmarkNodes) {
    processNode(node);
  };
  return bookmarks;
}

function removeBookmarks(bookmarks) {
  bookmarks.forEach((bookmark) => {
    chrome.bookmarks.remove(bookmark.id);
  });
};

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    removeBookmarklets();
  };
});

chrome.bookmarks.onCreated.addListener(() => {
  removeBookmarklets();
});

chrome.webNavigation.onBeforeNavigate.addListener((details) => {
  const url = details.url;

  if (url.startsWith('http://')) {
    const httpsUrl = url.replace(/^http:/, 'https:');

    chrome.tabs.update(details.tabId, { url: httpsUrl });
  };
});