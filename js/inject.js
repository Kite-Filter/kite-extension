const lsBlockedURLs = localStorage.getItem('blockedURLs');
const lsBlockedTLDs = localStorage.getItem('blockedTLDs');
const lsYtAllowlist = localStorage.getItem('ytAllowlist');

const blockedURLs = lsBlockedURLs ? JSON.parse(lsBlockedURLs) : ['example.com', 'krunker.io'];
const blockedTLDs = lsBlockedTLDs ? JSON.parse(lsBlockedTLDs) : ['.tech'];
const ytAllowlist = lsYtAllowlist ? JSON.parse(lsYtAllowlist) : ['zBePOfn5FIg'];

function updateBlocked() {
    localStorage.setItem('blockedURLs', JSON.stringify(blockedURLs));
    localStorage.setItem('blockedTLDs', JSON.stringify(blockedTLDs));
    localStorage.setItem('ytAllowlist', JSON.stringify(ytAllowlist));
}

function blockSite() {
    window.location.href = 'https://kite-filter.github.io/blocked/';
}

function isBlocked(url, blockedList) {
    for (const blockedItem of blockedList) {
        const regex = new RegExp(`^(?:[a-zA-Z0-9-]+:\\/\\/)?(?:[a-zA-Z0-9-]+\\.)?${blockedItem.replace(/\./g, '\\.')}`, 'i');
        if (url.match(regex)) {
            return true;
        }
    }
    return false;
}

function isBlockedTLD(url, blockedTLDList) {
    const urlParts = url.split('/');

    if (urlParts.length >= 3) {
        const domain = urlParts[2];

        for (const blockedTLD of blockedTLDList) {
            const regex = new RegExp(`\\${blockedTLD}$`, 'i');

            if (domain.match(regex)) {
                return true;
            }
        }
    }
    return false;
}

function isYouTubeShorts(url) {
    return /youtube\.com\/shorts\//.test(url);
}

function isYouTubePost(url) {
    return /youtube\.com\/post\//.test(url);
}

function isYouTubeCommunity(url) {
    return /youtube\.com\/.*\/community/.test(url);
}

function isVideo(url) {
    const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/watch\?v=/;
    return youtubeRegex.test(url);
}

function getVideoID(url) {
    const urlParams = new URLSearchParams(new URL(url).search);
    return urlParams.get('v');
}

function isVideoAllowed(url, allowlist) {
    const videoID = getVideoID(url);
    return allowlist.includes(videoID);
}

function blockVideos() {
    const currentURL = window.location.href;
    if ((isVideo(currentURL) || isYouTubeShorts(currentURL) || isYouTubeCommunity(currentURL) || isYouTubePost(currentURL)) && !isVideoAllowed(currentURL, ytAllowlist)) {
        blockSite();
    }
    if (isBlocked(currentURL, blockedURLs) || isBlockedTLD(currentURL, blockedTLDs)) {
        blockSite();
    }
}

function handleElementCreation(element) {
    const elementURL = element.src || element.data || element.href;

    if (elementURL && (isBlocked(elementURL, blockedURLs) || isBlockedTLD(elementURL, blockedTLDs))) {
        blockSite();
    }
}

blockVideos();

const blockedElements = document.querySelectorAll('iframe, object, embed');
blockedElements.forEach(handleElementCreation);

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
            if (node.tagName === 'IFRAME' || node.tagName === 'OBJECT' || node.tagName === 'EMBED') {
                handleElementCreation(node);
            }
        });
    });

    blockVideos();
});

observer.observe(document.body, { childList: true, subtree: true });
setInterval(updateBlocked, 30000);
