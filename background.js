
/*var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day. */

var set = chrome.storage.local.set;
var get = chrome.storage.local.get;

const alarms = ['break_alarm'];
const default_options = {
  hardcore: false,
  break_alarm: 0.1,
  break_number: 0,
  water_alarm: 0.2,
  water_number: 0,
}

function doIfRunning(callback) {
  chrome.alarms.getAll((alarms) => {
    if (alarms.length != 0) {
      callback();
    }
  });
}

function startAlarms() {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == "break_alarm") {
      get('break_number', (data) => {
        new Notification("Walk around!", {
          icon: 'icon-temp.png',
          body: 'This is walk break #' + data["break_number"],
        });

        set({ break_number: data["break_number"] + 1 }, () => {
          get('break_alarm', (data) => {
            chrome.alarms.create("break_alarm", { when: Date.now() + 60 * 1000 * data["break_alarm"] });
          });
        });
      });
    } else if (alarm.name == "water_alarm") {
      get('water_number', (data) => {
        new Notification("Drink water!", {
          icon: 'icon-temp.png',
          body: 'This is water break #' + data["water_number"],
        });

        set({ water_number: data["water_number"] + 1 }, () => {
          get('water_alarm', (data) => {
            chrome.alarms.create("water_alarm", { when: Date.now() + 60 * 1000 * data["water_alarm"] });
          });
        });
      })
    }
  });


  chrome.alarms.create("break_alarm", { when: Date.now() + 3000 });
  chrome.alarms.create("water_alarm", { when: Date.now() + 3000 });
}

function install() {
  set(default_options, () => {
    console.log("Stored initial options.");
  });

  startAlarms();
}

function windowCreated() {
  chrome.alarms.getAll((alarms) => {
    if (alarms.length == 0) {
      startAlarms();
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

function windowRemoved() {
  chrome.windows.getAll((windows) => {
    if (windows.length == 0) {
      chrome.alarms.clearAll();
    }
  })
}

function focusChanged() {
  console.log("focus changed");
}

function startup() {
  startAlarms();
}

function suspend() {
  console.log("suspending");
}


chrome.runtime.onInstalled.addListener(install);
chrome.windows.onCreated.addListener(windowCreated);
chrome.windows.onRemoved.addListener(windowRemoved);
chrome.windows.onFocusChanged.addListener(focusChanged);
chrome.runtime.onStartup.addListener(startup);
chrome.runtime.onSuspend.addListener(suspend);
