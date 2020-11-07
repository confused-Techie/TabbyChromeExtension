
window.addEventListener('load', function load(event) {
  chrome.runtime.sendMessage({server: "reload"}, function(response) {
    if (response.response == "Success") {
      logSuccess();
    } else if (response.response == "Expired") {
      //do nothing we can let the default text take over
    } else {
      logFailure(response.response);
    }
  });
});


var addButton = document.getElementById("addBMClick");
var gotoBookMark = document.getElementById("gotoBookMarkClick");



addButton.onclick = function() {

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    chrome.runtime.sendMessage({server: activeTab.url}, function(response) {
      if (response.response == "Success") {
        logSuccess();
      } else {
        logFailure(response.response);
      }
    });

  });
}

gotoBookMark.onclick = function() {
  chrome.storage.sync.get(['server'], function(resultServer) {
    if (resultServer != null) {
      chrome.tabs.create({'url': resultServer.server});
    } else {
      logFailure("Make sure to Set a Server");
    }
  });
}

function logSuccess() {
  document.getElementById("statusMessage").innerHTML = "Status: Successfully Saved.";
}



function logFailure(respIssue) {
  document.getElementById("statusMessage").innerHTML = "Status: ERROR: "+ respIssue;
}
