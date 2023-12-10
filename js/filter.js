chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'block') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const currentTab = tabs[0];
        chrome.tabs.update(currentTab.id, { url: chrome.runtime.getURL('pages/blocked.html') });
      });
    };
  });