chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.set({ blockedSites: [], enabled: true });
  });
  
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.action === "updateRules") updateBlockingRules();
  });
  
  async function updateBlockingRules() {
    const { blockedSites = [], enabled = true } = await chrome.storage.sync.get();
    await chrome.declarativeNetRequest.updateDynamicRules({ removeRuleIds: [1, 2, 3, 4, 5] });
  
    if (!enabled) return;
  
    const rules = blockedSites.map((site, index) => ({
      id: index + 1,
      priority: 1,
      action: { type: "block" },
      condition: {
        urlFilter: site,
        resourceTypes: ["main_frame"]
      }
    }));
  
    chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules
    });
  }
  