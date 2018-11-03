chrome.runtime.onInstalled.addListener(function() {
  console.log("Yeet");
  var value = 5;
  chrome.storage.local.set({key: value}, function() {
    console.log('Value is set to ' + value);
  });

  chrome.alarms.create("test", {
    when: Date.now() + 3000
  });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == "test") {
      alert("Yeet");
    }
  });
});

chrome.runtime.onStartup.addListener(function() {
  chrome.storage.local.get(['key'], function(result) {
    console.log('Value currently is ' + result.key);
  });
});
