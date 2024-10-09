// List url and mirrors:
const mirrors = [
  "https://readmedium.com/",
  "https://freedium.cfd/",
  "https://freedium-mirror.vercel.app/",
  "https://freedium-miror-saqg.vercel.app/",
];

self.onmessage = function (event) {
  const url = event.data;
  const proxyUrl = "https://cors-anywhere.herokuapp.com/";
  const targetUrl = proxyUrl + url;

  var xhr = new XMLHttpRequest();
  xhr.open("GET", targetUrl, true); // true for asynchronous
  xhr.onload = function () {
    if (xhr.status == 200) {
      self.postMessage(true);
    } else {
      self.postMessage(false);
    }
  };
  xhr.onerror = function () {
    self.postMessage(false);
  };
  xhr.send();
};
