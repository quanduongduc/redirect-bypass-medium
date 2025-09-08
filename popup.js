// Popup script for Medium Bypass Extension

document.addEventListener("DOMContentLoaded", function () {
  const redirectCurrentBtn = document.getElementById("redirectCurrent");
  const openFreediumBtn = document.getElementById("openFreedium");

  // Handle "Open Current Page in Freedium" button
  redirectCurrentBtn.addEventListener("click", async function () {
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      if (tab && tab.url) {
        // Check if current page is a Medium-related site
        const isMediumSite = tab.url.match(
          /https:\/\/(.*\.)?medium\.com\/.*|https:\/\/towardsdatascience\.com\/.*|https:\/\/hackernoon\.com\/.*|https:\/\/betterprogramming\.pub\/.*|https:\/\/.*\.plainenglish\.io\/.*/
        );

        if (isMediumSite) {
          const freediumUrl = `https://freedium.cfd/${tab.url}`;
          chrome.tabs.create({ url: freediumUrl });
          window.close();
        } else {
          // Update button text to show it's not a Medium page
          redirectCurrentBtn.textContent = "❌ Not a Medium page";
          setTimeout(() => {
            redirectCurrentBtn.textContent = "📖 Open Current Page in Freedium";
          }, 2000);
        }
      }
    } catch (error) {
      console.error("Error redirecting current page:", error);
    }
  });

  // Handle "Visit Freedium.cfd" button
  openFreediumBtn.addEventListener("click", function () {
    chrome.tabs.create({ url: "https://freedium.cfd/" });
    window.close();
  });

  // Check if current tab is a Medium site and update UI accordingly
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const currentTab = tabs[0];
    if (currentTab && currentTab.url) {
      const isMediumSite = currentTab.url.match(
        /https:\/\/(.*\.)?medium\.com\/.*|https:\/\/towardsdatascience\.com\/.*|https:\/\/hackernoon\.com\/.*|https:\/\/betterprogramming\.pub\/.*|https:\/\/.*\.plainenglish\.io\/.*/
      );

      if (isMediumSite) {
        redirectCurrentBtn.style.background = "rgba(76, 175, 80, 0.3)";
        redirectCurrentBtn.style.borderColor = "rgba(76, 175, 80, 0.5)";
      } else {
        redirectCurrentBtn.style.opacity = "0.6";
        redirectCurrentBtn.title = "This page is not a Medium article";
      }
    }
  });
});
