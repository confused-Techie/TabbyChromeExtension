var saveServer = document.getElementById('serverAddressButton');
var saveTimeout = document.getElementById('statusTimeoutButton');
var debugCheckbox = document.getElementById('debuggingSlider');

//should start onLoad, assigns the current value of the server to the Form, if one
window.addEventListener('load', function load(event) {
  chrome.storage.sync.get(['server'], function(result) {
    document.getElementById("serverAddress").placeholder = result.server;
  });
  chrome.storage.sync.get(['statusTimeout'], function(result) {
    document.getElementById("statusTimeout").placeholder = result.statusTimeout;
  });
  chrome.storage.sync.get(['debug'], function(result) {
    if (result.debug) {
      var checkbox = document.getElementById('debuggingSlider');
      checkbox.checked = true;
    }
    //if not checked leave at default which is unchecked
  });
});

saveServer.onclick = function() {
  var serverLocation = document.getElementById("serverAddress").value;
  chrome.storage.sync.set({server: serverLocation}, function() {
    chrome.storage.sync.get(['debug'], function(debug) {
      if (debug.debug) {
        console.log('Server saved as: '+document.getElementById("serverAddress").value);
      }
    });
    chrome.storage.sync.get(['server'], function(result) {
      chrome.storage.sync.get(['debug'], function(debug) {
        if (debug.debug) {
          console.log('Server settings currently: ' + result.server);
        }
      });
      new Notification("Tabby", {
        icon: "images/tabbyIcon48.png",
        body: "Server Saved Successfully!"
      });
    });
  });
}

saveTimeout.onclick = function() {
  var timeoutSetting = document.getElementById("statusTimeout").value;
  chrome.storage.sync.set({statusTimeout: timeoutSetting}, function() {
    chrome.storage.sync.get(['debug'], function(debug) {
      if (debug.debug) {
        console.log('Status Timeout Saved as: '+document.getElementById("statusTimeout").value);
      }
    });
    new Notification("Tabby", {
      icon: "images/tabbyIcon48.png",
      body: "Status Timeout Saved Successfully!"
    });
  });
}

debugCheckbox.addEventListener( 'change', e => {
  if (e.target.checked) {
    chrome.storage.sync.set({debug: true}, function() {
      console.log("Debugging Enabled...");
    });
    //e.target.checked = false; this can force the state
  } else {
    chrome.storage.sync.set({debug: false}, function() {
      console.log("Debugging Disabled...");
    });
  }
});
