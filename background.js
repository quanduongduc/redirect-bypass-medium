const urlsList = [
  "https://medium.com/*",
  "https://towardsdatascience.com/*",
  "https://hackernoon.com/*",
  "https://medium.freecodecamp.org/*",
  "https://psiloveyou.xyz/*",
  "https://betterhumans.coach.me/*",
  "https://codeburst.io/*",
  "https://theascent.pub/*",
  "https://*.medium.com/*",
  "https://medium.mybridge.co/*",
  "https://uxdesign.cc/*",
  "https://levelup.gitconnected.com/*",
  "https://itnext.io/*",
  "https://entrepreneurshandbook.co/*",
  "https://proandroiddev.com/*",
  "https://blog.prototypr.io/*",
  "https://thebolditalic.com/*",
  "https://blog.usejournal.com/*",
  "https://blog.angularindepth.com/*",
  "https://blog.bitsrc.io/*",
  "https://blog.devartis.com/*",
  "https://blog.maddevs.io/*",
  "https://blog.getambassador.io/*",
  "https://uxplanet.org/*",
  "https://instagram-engineering.com/*",
  "https://calia.me/*",
  "https://productcoalition.com/*",
  "https://engineering.opsgenie.com/*",
  "https://android.jlelse.eu/*",
  "https://robinhood.engineering/*",
  "https://blog.hipolabs.com/*",
  "https://ux.shopify.com/*",
  "https://engineering.talkdesk.com/*",
  "https://blog.codegiant.io/*",
  "https://tech.olx.com/*",
  "https://netflixtechblog.com/*",
  "https://hackingandslacking.com/*",
  "https://blog.kotlin-academy.com/*",
  "https://blog.securityevaluators.com/*",
  "https://blog.kubernauts.io/*",
  "https://blog.coffeeapplied.com/*",
  "https://unbounded.io/*",
  "https://writingcooperative.com/*",
  "https://*.plainenglish.io/*",
  "https://*.betterprogramming.pub/*",
  "https://blog.doit-intl.com/*",
  "https://eand.co/*",
  "https://techuisite.com/*",
  "https://levelupprogramming.net/*",
  "https://betterhumans.pub/*",
  "https://betterprogramming.pub/*",
  "https://pub.towardsai.net/*",
  "https://bettermarketing.pub/*",
  "https://themakingofamillionaire.com/*",
  "https://medium.datadriveninvestor.com/*",
  "https://bootcamp.uxdesign.cc/*",
  "https://*.baos.pub/*",
  "https://www.inbitcoinwetrust.net/*",
  "https://blog.prototypr.io/*",
  "https://blog.devgenius.io/*",
];

const blacklistUrls = ["https://towardsdev.com/*"];

// Create a new Web Worker
const worker = new Worker("worker.js");

// List url and mirrors:
const mirrors = [
  "https://readmedium.com/",
  "https://freedium.cfd/",
  "https://freedium-mirror.vercel.app/",
  "https://freedium-miror-saqg.vercel.app/",
];

// Create a promisified version of the asynchronous operation
async function checkUrl(url) {
  const result = false;
  try {
    const response = await fetch(url, {
      method: "HEAD",
      mode: "cors",
    });
    result = response.ok;
  } catch (e) {
    console.log("Error", e);
    result = false;
  }
}

// Event handler for onBeforeRequest and onUpdated
function requestHandler(details) {
  if (details.method !== "GET") {
    return { cancel: false }; // Don't redirect
  }

  // if details.url is in blacklistUrls, return { cancel: false }
  for (let i = 0; i < blacklistUrls.length; i++) {
    if (details.url.includes(blacklistUrls[i])) {
      return { cancel: false };
    }
  }

  // If details.url contain word "global-identity", return { cancel: false }
  if (details.url.includes("global-identity")) {
    return { cancel: false };
  }

  let isFound = false;
  let redirectUrl = "";
  for (let i = 0; i < mirrors.length; i++) {
    // if (mirrors[i].includes("freedium")) {
    redirectUrl = mirrors[i] + details.url.replace("https://", "https:/");
    // } else {
    //   redirectUrl = mirrors[i] + details.url;
    // }
    // console.log("re2 " + redirectUrl);
    // const callUrl = checkUrl(redirectUrl);
    const callUrl = true;
    // console.log("Call url", callUrl);
    checkUrl(redirectUrl).then((status) => {
      console.log("Status", status);
      callUrl = status;
    });
    if (callUrl) {
      isFound = true;
      break;
    }
  }

  if (isFound) {
    return { redirectUrl }; // Redirect to the desired URL
  } else {
    return { cancel: false }; // Don't redirect
  }
}

// Add event listener for onBeforeRequest
chrome.webRequest.onBeforeRequest.addListener(
  requestHandler,
  {
    urls: urlsList,
    types: ["main_frame"],
  },
  ["blocking"]
);
