const blockedURLs = ['example.com'];
const blockedTLDs = ['.io'];
const currentURL = window.location.href;

// Site Block Check
function isBlocked(url, blockedList) {
    for (const blockedItem of blockedList) {
        const regex = new RegExp(`^(?:[a-zA-Z0-9-]+:\\/\\/)?(?:[a-zA-Z0-9-]+\\.)?${blockedItem.replace(/\./g, '\\.')}`, 'i');
        if (url.match(regex)) {
            return true;
        }
    }
    return false;
}

// TLD Block Check
function isBlockedTLD(url, blockedTLDList) {
    const domain = url.split('/')[2];
    for (const blockedTLD of blockedTLDList) {
        const regex = new RegExp(`\\${blockedTLD}$`, 'i');
        if (domain.match(regex)) {
            return true;
        }
    }
    return false;
}

// Block Site
if (isBlocked(currentURL, blockedURLs)) {
    chrome.runtime.sendMessage({ action: 'block' });
}

// Block TLD
if (isBlockedTLD(currentURL, blockedTLDs)) {
    chrome.runtime.sendMessage({ action: 'block' });
}
