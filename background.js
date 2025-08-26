chrome.commands.onCommand.addListener((command) => {
  if (command === "save_subtitle") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, { action: "getSubtitle" }, (response) => {
        const subtitle = response?.subtitle;
        if (subtitle) {
          const words = subtitle.match(/\b[a-zA-Z']+\b/g) || [];
          chrome.storage.local.get({ savedSubs: [] }, (data) => {
            const newSubs = data.savedSubs;
            newSubs.push({
              text: subtitle,
              words: words.map(w => w.toLowerCase()),
              time: new Date().toLocaleString()
            });
            chrome.storage.local.set({ savedSubs: newSubs });
          });
        }
      });
    });
  }
});
