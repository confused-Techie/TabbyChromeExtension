//console.log("backgroung running");


chrome.runtime.onMessage.addListener( function(msg, sender, sendResponse) {
  chrome.storage.sync.get(['debug'], function(debug) {
    if (debug.debug) {
      console.log("Background Service Running...");
    }
  });
  if (msg.server == "reload") {
    reloadStatus(sendResponse);
  } else {
  //msg will be the URL to submit to the server.
  var xhr = new XMLHttpRequest();
  var userURI = msg.server;
  var apiRequestLoc = "/api?type=new&bm=";
  chrome.storage.sync.get(['debug'], function(debug) {
    if (debug.debug) {
      console.log("URI to send to server: "+userURI);
    }
  });

  chrome.storage.sync.get(['server'], function(resultServer) {
    xhr.open("GET", resultServer.server + apiRequestLoc + userURI, true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          chrome.storage.sync.get(['debug'], function(debug) {
            if (debug.debug) {
              console.log("Request StatusCode is 200 OK");
            }
          });
          var resp = JSON.parse(xhr.responseText);
          //parse to see result
          if (resp == "Success") {
            //this is the right format for all return statements
            var d = new Date();
            chrome.storage.sync.set({lastStatus: "Success", lastStatusTime: d.getTime()}, function() {

            });
            chrome.storage.sync.get(['debug'], function(debug) {
              if (debug.debug) {
                console.log("Should save Success response...");
              }
            });
            chrome.browserAction.setBadgeBackgroundColor({color: "#00ba41"});
            chrome.browserAction.setBadgeText({text: "OK"});
            sendResponse({response: "Success"});
          } else {
            var d = new Date();
            chrome.storage.sync.set({lastStatus: resp, lastStatusTime: d.getTime()}, function() {

            });
            chrome.browserAction.setBadgeBackgroundColor({color: "#ba0000"});
            chrome.browserAction.setBadgeText({text: "ERR"});
            sendResponse({response: resp});

          }
        } else {
          var dd = new Date();
          chrome.storage.sync.set({lastStatus: xhr.status, lastStatusTime: dd.getTime()}, function() {

          });
          chrome.browserAction.setBadgeBackgroundColor({color: "#ba0000"});
          chrome.browserAction.setBadgeText({text: "ERR"});
          sendResponse({response: xhr.status});

        }
      }
    }
    xhr.send();
  });
}
return true;
});


function reloadStatus(sendResponse) {
  chrome.storage.sync.get(['debug'], function(debug) {
    if (debug.debug) {
      console.log("Checking if status should be reloaded...");
    }
  });

  chrome.storage.sync.get(['lastStatusTime'], function(statusTimeResult) {
    if (statusTimeResult.lastStatusTime != null) {
      var dd = new Date();
      chrome.storage.sync.get(['statusTimeout'], function(statusTimeout) {
        chrome.storage.sync.get(['debug'], function(debug) {
          if (debug.debug) {
            console.log("Status Timeout is: "+statusTimeout.statusTimeout);
          }
        });
        var debugTimeoutExpiry = statusTimeResult.lastStatusTime+parseInt(statusTimeout.statusTimeout);
        chrome.storage.sync.get(['debug'], function(debug) {
          if (debug.debug) {
            console.log("Current Time: " +dd.getTime()+" || Expiry: "+debugTimeoutExpiry);
          }
        });
      if (dd.getTime() > statusTimeResult.lastStatusTime + parseInt(statusTimeout.statusTimeout)) {
        chrome.storage.sync.get(['debug'], function(debug) {
          if (debug.debug) {
            console.log("Status has expired...");
          }
        });
        chrome.browserAction.setBadgeText({text: ""});
        sendResponse({response: "Expired"});
      } else {
        chrome.storage.sync.get(['debug'], function(debug) {
          if (debug.debug) {
            console.log("Status has not expired...");
          }
        });
        chrome.storage.sync.get(['lastStatus'], function(statusResult) {
          if (statusResult.lastStatus == "Success") {
            chrome.storage.sync.get(['debug'], function(debug) {
              if (debug.debug) {
                console.log("Status was a Success");
              }
            });
            sendResponse({response: "Success"});
          } else {
            chrome.storage.sync.get(['debug'], function(debug) {
              if (debug.debug) {
                console.log("Status was an ERROR");
              }
            });
            sendResponse({response: statusResult.lastStatus});
          }
        });
      }
    });
    }
  });
  return true;
}

chrome.runtime.onInstalled.addListener(function(details) {
  if (details.reason == "install") {
    new Notification("Tabby Installation", {
      icon: "images/tabbyIcon48.png",
      body: "Make sure to save your Server URL, thanks for installing!"
    });
    //on first install set StatusTimeout to default value
    chrome.storage.sync.set({statusTimeout: 15000});
    //also set the debug to off
    chrome.storage.sync.set({debug: false});
  } else if (details.reason == "update") {
    var thisVersion = chrome.runtime.getManifest().version;
    new Notification("Tabby Updated", {
      icon: "images/tabbyIcon48.png",
      body: "Tabby updated from "+details.previousVersion+" to "+thisVersion+", make sure your Server URL is saved!"
    });

  }
  //this will only fire when the extension is updated or first installed
  //ignoring chrome_update or shared_module_update
});
