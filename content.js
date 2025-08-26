let latestSubtitle = "";

// 观察字幕 DOM
const observer = new MutationObserver(() => {
  const captionNodes = document.querySelectorAll(".ytp-caption-segment");
  let text = "";
  captionNodes.forEach(node => {
    text += node.innerText + " ";
  });
  if (text.trim()) {
    latestSubtitle = text.trim();
  }
});

function startObserving() {
  const container = document.querySelector(".ytp-caption-window-container");
  if (container) {
    observer.observe(container, { childList: true, subtree: true });
  }
}

// 页面加载后等一会再挂观察器
setTimeout(startObserving, 2000);

// 接收 background.js 的请求
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "getSubtitle") {
    sendResponse({ subtitle: latestSubtitle });
  }
});
// 添加隐藏字幕的 CSS
function hideSubtitleText() {
  if (document.getElementById("cc-style")) return;

  const style = document.createElement("style");
  style.id = "cc-style";
  style.innerHTML = `
    /* 隐藏所有字幕文字 */
    .ytp-caption-segment {
      color: rgba(0,0,0,0) !important;
      text-shadow: none !important;
    }
    /* 隐藏字幕容器背景 */
    .ytp-caption-window-container,
    .ytp-caption-window-rollup {
      background: none !important;
    }
  `;
  document.head.appendChild(style);
}

// 恢复字幕文字
function showSubtitleText() {
  const style = document.getElementById("cc-style");
  if (style) style.remove();
}

// 切换开关
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "toggleInvisibleCC") {
    const style = document.getElementById("cc-style");
    if (style) {
      showSubtitleText();
    } else {
      hideSubtitleText();
    }
  }
});

// 页面加载时自动隐藏字幕
hideSubtitleText();

