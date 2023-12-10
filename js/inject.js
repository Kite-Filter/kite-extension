const blocked = [`example.com`];
const currentURL = window.location.href;
  
function isBlocked(url, blockedList) {
    for (const blockedItem of blockedList) {
        const regex = new RegExp(`^(?:[a-zA-Z0-9-]+:\\/\\/)?(?:[a-zA-Z0-9-]+\\.)?${blockedItem.replace(/\./g, '\\.')}`, 'i'); // Regex is scawy D:
        if (url.match(regex)) {
            return true;
        };
    };
    return false;
};

if (isBlocked(currentURL, blocked)) {
    chrome.runtime.sendMessage({ action: 'block' }); // Filter.js
};