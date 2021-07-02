chrome.runtime.onInstalled.addListener(function () {
	chrome.storage.local.get(["blocked", "duration"], function (local) {
		if (!Array.isArray(local.blocked)) {
			chrome.storage.local.set({ blocked: [] });
		}

		if (!(local.duration instanceof Date && !isNaN(local.duration.valueOf()))) {
			chrome.storage.local.set({ duration: Date.now() });
		}
	});
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
	const url = changeInfo.pendingUrl || changeInfo.url;
	if (!url || !url.startsWith("http")) {
		return;
	}

	const hostname = new URL(url).hostname;

	chrome.storage.local.get(["blocked"], function (local) {
		const { blocked} = local;
		if (Array.isArray(blocked) && blocked.find(domain => hostname.includes(domain))) {
			chrome.tabs.remove(tabId);
		}
	});
});