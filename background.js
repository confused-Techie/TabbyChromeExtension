//console.log("backgroung running");


chrome.runtime.onMessage.addListener( function(msg, sender, sendResponse) {
//function tabbyBackground(msg) {
  console.log("tabbyBackground");
  if (msg.server == "reload") {
    reloadStatus(sendResponse);
  } else {
  //msg will be the URL to submit to the server.
  var xhr = new XMLHttpRequest();
  var userURI = msg.server;
  var apiRequestLoc = "/api?type=new&bm=";
  console.log(userURI);
  chrome.storage.sync.get(['server'], function(resultServer) {
    xhr.open("GET", resultServer.server + apiRequestLoc + userURI, true);
    xhr.onreadystatechange = function() {
      console.log("Ready state has changed. Likely meaning it sent");
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          console.log("StatusCode 200");
          var resp = JSON.parse(xhr.responseText);
          //parse to see result
          if (resp == "Success") {
            //this is the right format for all return statements
            var d = new Date();
            chrome.storage.sync.set({lastStatus: "Success", lastStatusTime: d.getTime()}, function() {

            });
            console.log("Should save Success response...");
            sendResponse({response: "Success"});
          } else {
            var d = new Date();
            chrome.storage.sync.set({lastStatus: resp, lastStatusTime: d.getTime()}, function() {

            });
            sendResponse({response: resp});

          }
        } else {
          var dd = new Date();
          chrome.storage.sync.set({lastStatus: xhr.status, lastStatusTime: dd.getTime()}, function() {

          });

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
  console.log("Checking if status should be reloaded...");

  chrome.storage.sync.get(['lastStatusTime'], function(statusTimeResult) {
    if (statusTimeResult.lastStatusTime != null) {
      var dd = new Date();
      if (dd.getTime() > statusTimeResult.lastStatusTime + 15000) {
        console.log("Status has expired...");
        sendResponse({response: "Expired"});
      } else {
        console.log("Status has not expired...");
        chrome.storage.sync.get(['lastStatus'], function(statusResult) {
          if (statusResult.lastStatus == "Success") {
            console.log("Status was Success");
            sendResponse({response: "Success"});
          } else {
            console.log("Status was an ERROR");
            sendResponse({response: statusResult.lastStatus});
          }
        });
      }
    }
  });
  return true;
}
