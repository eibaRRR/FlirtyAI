// Service worker. Captures the visible tab and returns a data URL.
chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  if (msg?.type === "CAPTURE_TAB") {
    chrome.tabs.captureVisibleTab(undefined, { format: "jpeg", quality: 90 }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        sendResponse({ ok: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ ok: true, dataUrl });
      }
    });
    return true; // async
  }
});
