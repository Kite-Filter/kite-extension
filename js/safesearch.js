const lsSafeSearch = localStorage.getItem('safeSearch');
const safeSearch = lsSafeSearch ? JSON.parse(lsSafeSearch) : ['proxy'];

function updateBlocked() {
    localStorage.setItem('safeSearch', JSON.stringify(safeSearch));
}

function blockSite() {
    window.location.href = 'https://kite-filter.github.io/blocked/';
}

const regex = new RegExp(safeSearch.join('|'), 'i');
if (regex.test(document.body.innerText)) {
     blockSite();
};

setInterval(updateBlocked, 30000);