
/*var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day. */

var local = chrome.storage.local;

const alarms = ['break_alarm', 'water_alarm'];
const default_options = {
  hardcore: false,
  break_alarm: 1,
  break_number: 0,
  water_alarm: 2,
  water_number: 0,

  bed_hour: 3,
  bed_minute: 9,
}

function doIfRunning(callback) {
  chrome.alarms.getAll((alarms) => {
    if (alarms.length != 0) {
      callback();
    }
  });
}

function startRelativeAlarms() {
  savedAlarms = [];

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == "break_alarm") {
      local.get('break_number', (data) => {
        /*new Notification("Walk around!", {
          icon: 'icon-temp.png',
          body: 'This is walk break #' + data["break_number"],
        });*/
        chrome.notifications.create({
          type: 'basic',
          title: "Walk around!",
          iconUrl: 'icon-temp.png',
          message: 'This is walk break #' + data["break_number"],
        });

        local.set({ break_number: data["break_number"] + 1 }, () => {
          local.get('break_alarm', (data) => {
            chrome.alarms.create("break_alarm", { when: Date.now() + 60 * 1000 * data["break_alarm"] });
          });
        });
      });
    } else if (alarm.name == "water_alarm") {
      local.get('water_number', (data) => {
        /*new Notification("Drink water!", {
          icon: 'icon-temp.png',
          body: 'This is water break #' + data["water_number"],
        });*/
        chrome.notifications.create({
          type: 'basic',
          title: "Drink water!",
          iconUrl: "icon-temp.png",
          message: 'This is water break #' + data["water_number"],
        });

        local.set({ water_number: data["water_number"] + 1 }, () => {
          local.get('water_alarm', (data) => {
            chrome.alarms.create("water_alarm", { when: Date.now() + 60 * 1000 * data["water_alarm"] });
          });
        });
      })
    }
  });

  local.get(['break_alarm', 'water_alarm'], (data) => {
    chrome.alarms.create("break_alarm", { when: Date.now() + 60 * 1000 * data["break_alarm"] });
    chrome.alarms.create("water_alarm", { when: Date.now() + 60 * 1000 * data["water_alarm"] + 2000 });
  });
}

function nextDate(hour, minute) {
  now = new Date();
  today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, minute);
  if (today < now) {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, hour, minute);
  } else {
    return today;
  }
}

function setBedtimeAlarm() {
  local.get(['bed_hour', 'bed_minute'], (data) => {
    chrome.alarms.create("bedtime_alarm", { when: nextDate(data["bed_hour"], data["bed_minute"]).getTime() });
  });
}

function startAbsoluteAlarms() {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == "bedtime_alarm") {
      chrome.notifications.create({
        type: 'basic',
        title: "Time to go to bed!",
        iconUrl: "icon-temp.png",
        message: "Sleep well!",
      });

      setBedtimeAlarm();
    }
  });

  setBedtimeAlarm();
}

chrome.runtime.onMessage.addListener((message, sender, respond) => {

});

function install() {
  local.set(default_options, () => {
    console.log("Stored initial options.");
  });

  startRelativeAlarms();
  startAbsoluteAlarms();
}


function windowCreated() {
  chrome.alarms.getAll((alarms) => {
    if (alarms.length == 0) {
      startRelativeAlarms();
      startAbsoluteAlarms();
    }
  });

  console.log("Loaded extension");
}


function updateFilters(urls) {
   if(chrome.webRequest.onBeforeRequest.hasListener(blockRequest))
     chrome.webRequest.onBeforeRequest.removeListener(blockRequest);
   chrome.webRequest.onBeforeRequest.addListener(blockRequest, {urls: ["*://*.facebook.com/*", "*://*.facebook.net/*"]}, ['blocking']);
}

function windowRemoved() {
  chrome.windows.getAll((windows) => {
    if (windows.length == 0) {
      chrome.alarms.clearAll();
    }
  })
}

function focusChanged(window) {

}

function startup() {
  startRelativeAlarms();
  startAbsoluteAlarms();
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
