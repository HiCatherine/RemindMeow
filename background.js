function store(key, value) {
  chrome.storage.local.set({key: value});
}

function get(key, callback) {
  chrome.storage.local.get(key, callback);
}

function install() {
  var default_options = {
    hardcore: false,
    alarm_break_min: 45,
  }

  chrome.storage.local.set(default_options, () => {
    console.log("Stored initial options.");
  });

  chrome.alarms.create("test", {
    when: Date.now() + 3000
  });

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == "test") {
      var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
      var hour = time[1] % 12 || 12;               // The prettyprinted hour.
      var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day.

      new Notification(hour + time[2] + ' ' + period, {
        icon: 'icon-temp.png',
        body: 'This is the time.'
      });
    }
  });

  console.log("Loaded extension");


function blockRequest(details) {
   return {cancel: true};
}

function updateFilters(urls) {
   if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest))
     chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
   chrome.webRequest.onBeforeRequest.addListener(blockRequest, {urls: ["*://*.facebook.com/*", "*://*.facebook.net/*"]}, ['blocking']);
}

updateFilters();
}

chrome.runtime.onInstalled.addListener(function() {
  install();
});
