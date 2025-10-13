// Manifest V3 Service Worker for Medium Bypass Extension
// The redirect logic is now handled by declarativeNetRequest rules in rules.json

// Check if Freedium is available
async function checkFreediumAvailability() {
  try {
    const response = await fetch("https://freedium.cfd/", {
      method: "HEAD",
      mode: "no-cors",
      cache: "no-cache",
    });
    return true; // If fetch completes without error, assume it's working
  } catch (error) {
    console.log("Freedium main site unavailable, using mirror");
    return false;
  }
}

// Get the appropriate Freedium URL
async function getFreediumUrl() {
  // First check if we have a cached value
  const stored = await chrome.storage.local.get("freediumBaseUrl");
  if (stored.freediumBaseUrl) {
    return stored.freediumBaseUrl;
  }

  // Otherwise check availability
  const isMainAvailable = await checkFreediumAvailability();
  const url = isMainAvailable
    ? "https://freedium.cfd/"
    : "https://freedium-mirror.cfd/";
  await chrome.storage.local.set({ freediumBaseUrl: url });
  return url;
}

// Store the current Freedium URL and switch rulesets
async function updateFreediumUrl() {
  const isMainAvailable = await checkFreediumAvailability();
  const baseUrl = isMainAvailable
    ? "https://freedium.cfd/"
    : "https://freedium-mirror.cfd/";

  await chrome.storage.local.set({ freediumBaseUrl: baseUrl });

  // Switch between rulesets based on availability
  const enableRuleset = isMainAvailable
    ? "medium_redirect_rules"
    : "medium_redirect_rules_mirror";
  const disableRuleset = isMainAvailable
    ? "medium_redirect_rules_mirror"
    : "medium_redirect_rules";

  try {
    await chrome.declarativeNetRequest.updateEnabledRulesets({
      enableRulesetIds: [enableRuleset],
      disableRulesetIds: [disableRuleset],
    });
    console.log(
      `Switched to ${isMainAvailable ? "main" : "mirror"} ruleset: ${baseUrl}`
    );
  } catch (error) {
    console.error("Failed to switch rulesets:", error);
  }

  return baseUrl;
}

// Service worker installation
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log("Medium Bypass Extension installed/updated");

  // Check availability and enable the appropriate ruleset
  await updateFreediumUrl();
});

// Periodically check Freedium availability (every 30 minutes)
chrome.alarms.create("checkFreedium", { periodInMinutes: 30 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "checkFreedium") {
    updateFreediumUrl();
  }
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
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "redirectToFreedium" && info.pageUrl) {
    const baseUrl = await getFreediumUrl();
    const freediumUrl = `${baseUrl}${info.pageUrl}`;
    chrome.tabs.create({ url: freediumUrl });
  }
});

// Optional: Handle extension icon clicks
chrome.action.onClicked.addListener(async (tab) => {
  if (
    tab.url &&
    tab.url.match(
      /https:\/\/(.*\.)?medium\.com\/.*|https:\/\/towardsdatascience\.com\/.*|https:\/\/hackernoon\.com\/.*/
    )
  ) {
    const baseUrl = await getFreediumUrl();
    const freediumUrl = `${baseUrl}${tab.url}`;
    chrome.tabs.create({ url: freediumUrl });
  }
});
