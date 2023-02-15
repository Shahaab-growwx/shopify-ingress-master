function triggerCheckout(payload) {
  var ifrm = document.createElement("iframe");
  ifrm.id = "growwx-iframe";
  ifrm.setAttribute("src", getIframeUrl());
  if (isMobile()) {
    console.log("Mobile");
    ifrm.style.width = "100%";
    ifrm.style.height = "100%";
    ifrm.style.border = "none";
    ifrm.allowFullscreen = true;
    ifrm.style.position = "fixed";
    ifrm.style.top = "0px";
    ifrm.style.left = "0px";
    ifrm.style.bottom = "0px";
    ifrm.style.right = "0px";
    ifrm.style.overflow = "unset";
    ifrm.style.zIndex = "9999999999";
  } else {
    console.log("Desktop view not supported");
  }
  document.body.appendChild(ifrm);
  document.body.style.overflow = "hidden";
  window.addEventListener("message", function (e) {
    if (e.data && e.data.event === "unload-iframe") {
      var iframe = document.getElementById("growwx-iframe");
      iframe.parentNode.removeChild(iframe);
      document.body.style.overflow = "auto";
    }
    if (e.data && e.data.event === "navigate") {
      this.window.location.replace(e.data.location);
    }
    if (e.data && e.data.event === "setItem") {
      this.localStorage.setItem(e.data.key, e.data.value);
    }
    if (e.data && e.data.event === "removeItem") {
      this.localStorage.removeItem(e.data.key);
    }
  });
  ifrm.onload = function () {
    publishLocalStorage();
  };
}

function publishLocalStorage() {
  console.log("publishLocalStorage");
  var localStorageMap = {};
  for (var i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    localStorageMap[key] = localStorage.getItem(key);
  }
  var iframe = document.getElementById("growwx-iframe");
  iframe.contentWindow.postMessage(
    { event: "storageSync", dataMap: localStorageMap },
    "*"
  );
}

function isMobile() {
  return screen.width <= 480;
}

function getPayload() {
  return "eyJjYXJ0Ijp7InRvdGFsX3ByaWNlIjo1LCJ0b3RhbF9kaXNjb3VudCI6MCwiaXRlbV9jb3VudCI6MSwiaXRlbXMiOlt7ImlkIjoiODA2NzE0MTA3NTI2MSIsInF1YW50aXR5IjoxLCJ2YXJpYW50X2lkIjoiNDQzMzEyODYyMDA2MzciLCJ0aXRsZSI6IlNlbWkgU3BoZXJlIFBsYW50ZXIgV2l0aCBTdGFuZCIsInByaWNlIjo1LCJvcmlnaW5hbF9wcmljZSI6NSwiZGlzY291bnRlZF9wcmljZSI6NSwidG90YWxfZGlzY291bnQiOjAsImRpc2NvdW50cyI6W10sInNrdSI6Ijg5MDQxMzA4OTc5NTUiLCJ1cmwiOiIvcHJvZHVjdHMvc2VtaS1zcGhlcmUtcGxhbnRlci13aXRoLXN0YW5kIiwiaW1hZ2UiOiJodHRwczovL2Nkbi5zaG9waWZ5LmNvbS9zL2ZpbGVzLzEvMDcwMS8yNjU2Lzc3NDEvcHJvZHVjdHMvYWhpczEta3UxbmcuanBnIn1dLCJyZXF1aXJlc19zaGlwcGluZyI6dHJ1ZSwiY3VycmVuY3kiOiJJTlIiLCJpdGVtc19zdWJ0b3RhbF9wcmljZSI6NSwiY2FydF9sZXZlbF9kaXNjb3VudF9hcHBsaWNhdGlvbnMiOltdfSwibWlkIjoiNTRkMWJiYTctOTExNC00YmViLTlmMzQtYWQ3NGM5NDI5OGNmIn0=";
//   return "eyJjYXJ0Ijp7InRvdGFsX3ByaWNlIjozOTk5LCJ0b3RhbF9kaXNjb3VudCI6MCwiaXRlbV9jb3VudCI6MSwiaXRlbXMiOlt7ImlkIjoiNzg5NDY3NTA2MzAzMCIsInF1YW50aXR5IjoxLCJ2YXJpYW50X2lkIjoiNDQ2MjU2NTIzODM5OTAiLCJ0aXRsZSI6IkVsZWdhbnQgU2lsdmVyIFJvb20gcGxhbnRlciIsInByaWNlIjozOTk5LCJvcmlnaW5hbF9wcmljZSI6Mzk5OSwiZGlzY291bnRlZF9wcmljZSI6Mzk5OSwidG90YWxfZGlzY291bnQiOjAsImRpc2NvdW50cyI6W10sInNrdSI6Ijg5MDQxMzA4OTc5NTUiLCJ1cmwiOiIvcHJvZHVjdHMvZWxlZ2FudC1zaWx2ZXItcm9vbS1wbGFudGVyIiwiaW1hZ2UiOiJodHRwczovL2Nkbi5zaG9waWZ5LmNvbS9zL2ZpbGVzLzEvMDY2Ni84NDU1LzE0MTQvcHJvZHVjdHMvSW1hZ2UtNC03MXpTbTZibEJLTC5fQUNfVUwzMjAuanBnIn1dLCJyZXF1aXJlc19zaGlwcGluZyI6dHJ1ZSwiY3VycmVuY3kiOiJJTlIiLCJpdGVtc19zdWJ0b3RhbF9wcmljZSI6Mzk5OSwiY2FydF9sZXZlbF9kaXNjb3VudF9hcHBsaWNhdGlvbnMiOltdfSwibWlkIjoiMTc2OWNkYWMtMThhMy00YWQ3LWFiNzEtYTI2ZTVkNjNlYjhhIn0=";
}

// function getIframeUrl() {
//   return "http://localhost:3000/?payload=" + getPayload();
// }
function getIframeUrl() {
  const NGROK = "https://19fa-103-240-163-112.in.ngrok.io"
  const LOCALHOST = "http://localhost:3000"
  return NGROK + "/?payload=" + getPayload();
}
