// update date
function updateDate() {
    const now = new Date();
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    document.getElementById('currentDate').textContent = now.toLocaleDateString('en-US', options);
}

// get current tab
async function getCurrentTab() {
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    return tabs[0];
}

// get domain from url
function getDomain(url) {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return 'unknown';
    }
}

// format time
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// load stats from storage
function loadStats() {
    chrome.storage.local.get(['sitesToday', 'totalTime', 'breaksTaken'], function(data) {
        document.getElementById('sitesToday').textContent = data.sitesToday || 0;
        document.getElementById('totalTime').textContent = (data.totalTime || 0) + 'm';
        document.getElementById('breaksTaken').textContent = data.breaksTaken || 0;
    });
}

// timer
let seconds = 0;
setInterval(() => {
    seconds++;
    document.getElementById('timer').textContent = formatTime(seconds);
}, 1000);

// initialize
document.addEventListener('DOMContentLoaded', async function() {
    updateDate();
    loadStats();

    const tab = await getCurrentTab();
    if (tab && tab.url) {
        const domain = getDomain(tab.url);
        document.getElementById('currentSite').textContent = domain;
        document.getElementById('currentUrl').textContent = tab.url;
    }

    // break button
    document.getElementById('breakBtn').addEventListener('click', function() {
        chrome.storage.local.get(['breaksTaken'], function(data) {
            const breaks = (data.breaksTaken || 0) + 1;
            chrome.storage.local.set({ breaksTaken: breaks });
            document.getElementById('breaksTaken').textContent = breaks;
        });
        alert('take a 5 minute break');
    });

    // track button
    document.getElementById('trackBtn').addEventListener('click', function() {
        alert('site added to watchlist');
    });
});