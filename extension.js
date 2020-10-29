//listen and assign variables right away.
//chrome.runtime.OnInstalled.addListener(function() {
//  chrome.storage.sync.set({server: 'SaveYourServer'}, function() {
  //  console.log('var initialized');
  //});
//});


var addButton = document.getElementById("addBMClick");
var gotoBookMark = document.getElementById("gotoBookMarkClick");
var apiRequestLoc = "/api?type=new&bm=";

addButton.onclick = function() {
  //this handles sending URI to Tabby
  var xhr = new XMLHttpRequest();
  var userURI = "";

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.storage.sync.get(['server'], function(resultServer) {
    var activeTab = tabs[0];
    userURI = activeTab.url;
    //xhr.open("GET", "https://localhost:44320/api?type=new&bm="+ userURI, true);
    xhr.open("GET", resultServer.server + apiRequestLoc + userURI, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          var resp = JSON.parse(xhr.responseText);
        //parsing this data will help determine if the request was successfull.
          if (resp == "Success") {
            logSuccess();
          } else {
            logFailure(resp);
          }
        } else {
          logFailure(xhr.status);
        }
      }
    }
    xhr.send();

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
