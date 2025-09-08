// Manifest V3 Service Worker for Medium Bypass Extension
// The redirect logic is now handled by declarativeNetRequest rules in rules.json

// Service worker installation
chrome.runtime.onInstalled.addListener((details) => {
  console.log("Medium Bypass Extension installed/updated");

  // Enable the declarative net request rules
  chrome.declarativeNetRequest
    .updateEnabledRulesets({
      enableRulesetIds: ["medium_redirect_rules"],
    })
    .then(() => {
      console.log("Redirect rules enabled");
    })
    .catch((error) => {
      console.error("Failed to enable redirect rules:", error);
    });
});

// Optional: Add a context menu item for manual redirect
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "redirectToFreedium",
    title: "Open in Freedium",
    contexts: ["page"],
    documentUrlPatterns: [
      "https://medium.com/*",
      "https://*.medium.com/*",
      "https://towardsdatascience.com/*",
      "https://hackernoon.com/*",
      "https://betterprogramming.pub/*",
      "https://*.betterprogramming.pub/*",
      "https://*.plainenglish.io/*",
    ],
  });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "redirectToFreedium" && info.pageUrl) {
    const freediumUrl = `https://freedium.cfd/${info.pageUrl}`;
    chrome.tabs.create({ url: freediumUrl });
  }
});

// Optional: Handle extension icon clicks
chrome.action.onClicked.addListener((tab) => {
  if (
    tab.url &&
    tab.url.match(
      /https:\/\/(.*\.)?medium\.com\/.*|https:\/\/towardsdatascience\.com\/.*|https:\/\/hackernoon\.com\/.*/
    )
  ) {
    const freediumUrl = `https://freedium.cfd/${tab.url}`;
    chrome.tabs.create({ url: freediumUrl });
  }
});
