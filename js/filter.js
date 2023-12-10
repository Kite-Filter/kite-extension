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
    chrome.tabs.update(details.tabId, { url: chrome.runtime.getURL('pages/disabled.html') });
  }
});