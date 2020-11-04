var saveServer = document.getElementById('serverAddressButton');

//should start onLoad, assigns the current value of the server to the Form, if one
window.addEventListener('load', function load(event) {
  chrome.storage.sync.get(['server'], function(result) {
    document.getElementById("serverAddress").placeholder = result.server;
  });
});

saveServer.onclick = function() {
  var serverLocation = document.getElementById("serverAddress").value;
  chrome.storage.sync.set({server: serverLocation}, function() {
    console.log('Server saved as: '+document.getElementById("serverAddress").value);
    chrome.storage.sync.get(['server'], function(result) {
      console.log('Server settings currently: ' + result.server);
      new Notification("Tabby", {
        icon: "images/tabbyIcon48.png",
        body: "Server Saved Successfully!"
      });
    })
  });
}
