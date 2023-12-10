const blockedURLs = ['example.com'];
const blockedTLDs = ['.ga'];

// Site Blocker
function isBlocked(url, blockedList) {
    for (const blockedItem of blockedList) {
        const regex = new RegExp(`^(?:[a-zA-Z0-9-]+:\\/\\/)?(?:[a-zA-Z0-9-]+\\.)?${blockedItem.replace(/\./g, '\\.')}`, 'i');
        if (url.match(regex)) {
            return true;
        }
    }
    return false;
}

// TLD Blocker
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

function blockSite() {
    chrome.runtime.sendMessage({ action: 'block' });
}

// External Site Load Fix
function handleElementCreation(element) {
    const elementURL = element.src || element.data || element.href;

    if (elementURL && (isBlocked(elementURL, blockedURLs) || isBlockedTLD(elementURL, blockedTLDs))) {
        blockSite();
    }
}

// Block on Inital Load
if (isBlocked(window.location.href, blockedURLs) || isBlockedTLD(window.location.href, blockedTLDs)) {
    blockSite();
}

// Check Elements
const blockedElements = document.querySelectorAll('iframe, object, embed');
blockedElements.forEach(handleElementCreation);

// Block Elements
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.tagName === 'IFRAME' || node.tagName === 'OBJECT' || node.tagName === 'EMBED') {
                handleElementCreation(node);
            }
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });
