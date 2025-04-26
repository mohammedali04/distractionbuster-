const toggle = document.getElementById("toggleBlock");
const urlInput = document.getElementById("urlInput");
const addBtn = document.getElementById("addBtn");
const clearBtn = document.getElementById("clearBtn");
const blockedList = document.getElementById("blockedList");

function renderList(sites) {
  blockedList.innerHTML = "";
  for (const site of sites) {
    const li = document.createElement("li");
    li.textContent = site;
    blockedList.appendChild(li);
  }
}

chrome.storage.sync.get(["blockedSites", "enabled"], (res) => {
  renderList(res.blockedSites || []);
  toggle.checked = res.enabled ?? true;
});

toggle.addEventListener("change", () => {
  chrome.storage.sync.set({ enabled: toggle.checked }, () => {
    chrome.runtime.sendMessage({ action: "updateRules" });
  });
});

addBtn.addEventListener("click", () => {
  const url = urlInput.value.trim();
  if (!url) return;
  chrome.storage.sync.get("blockedSites", (res) => {
    const updated = [...(res.blockedSites || []), url];
    chrome.storage.sync.set({ blockedSites: updated }, () => {
      renderList(updated);
      chrome.runtime.sendMessage({ action: "updateRules" });
      urlInput.value = "";
    });
  });
});

clearBtn.addEventListener("click", () => {
  chrome.storage.sync.set({ blockedSites: [] }, () => {
    renderList([]);
    chrome.runtime.sendMessage({ action: "updateRules" });
  });
});
