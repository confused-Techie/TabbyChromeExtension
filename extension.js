
var addButton = document.getElementById("addBMClick");

addButton.onclick = function() {
  //this handles sending URI to Tabby
  var xhr = new XMLHttpRequest();
  var userURI = "";

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    userURI = activeTab.url;
    xhr.open("GET", "https://localhost:44320/api?type=new&bm="+ userURI, true);
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
}

function logSuccess() {
  document.getElementById("statusMessage").innerHTML = "Status: Successfully Saved.";
}

function logFailure(respIssue) {
  document.getElementById("statusMessage").innerHTML = "Status: ERROR: "+ respIssue;
}
