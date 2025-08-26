function renderList(subs) {
  const list = document.getElementById("list");
  list.innerHTML = "";
  subs.forEach(s => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `
      <div><b>[${s.time}]</b> ${s.text}</div>
      <div style="color:#555; font-size: 0.9em;">Words: ${s.words.join(", ")}</div>
    `;
    list.appendChild(div);
  });
}

chrome.storage.local.get({ savedSubs: [] }, (data) => {
  renderList(data.savedSubs);
});

document.getElementById("clear").addEventListener("click", () => {
  chrome.storage.local.set({ savedSubs: [] }, () => {
    renderList([]);
  });
});
document.getElementById("toggleInvisibleCC").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, { action: "toggleInvisibleCC" });
  });
});

