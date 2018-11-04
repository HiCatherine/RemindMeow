
/*var time = /(..)(:..)/.exec(new Date());     // The prettyprinted time.
  var hour = time[1] % 12 || 12;               // The prettyprinted hour.
  var period = time[1] < 12 ? 'a.m.' : 'p.m.'; // The period of the day. */

var local = chrome.storage.local;

const alarms = ['break_alarm', 'water_alarm'];
const default_options = {
  hardcore: false,

  break_enabled: true,
  break_time: 1,
  break_length: 1,
  break_number: 1,

  water_enabled: true,
  water_time: 2,
  water_number: 1,

  bedtime_enabled: true,
  bed_hour: 3,
  bed_minute: 9,

  blocking: false,
}

function doIfRunning(callback) {
  chrome.alarms.getAll((alarms) => {
    if (alarms.length != 0) {
      callback();
    }
  });
}

function setBlocking(blocking) {
  local.set({ blocking: blocking });
}

function setHardcore(hardcore) {
  local.set({ hardcore: hardcore });
}

function setBreakAlarm() {
  local.get(['break_enabled', 'break_time', 'break_length'], (data) => {
    if (data["break_enabled"]) {
      chrome.alarms.create("break_alarm", { when: Date.now() + 60 * 1000 * data["break_time"] });
    }
  });
}

function setBreakTime(minutes, length) {
  console.log(minutes);
  console.log(length);
  local.set({ break_time: minutes, break_length: length }, () => {
    setBreakAlarm();
  })
}

function enableBreakAlarm() {
  local.set({ break_enabled: true }, () => {
    setBedtimeAlarm();
  });
}

function disableBreakAlarm() {
  local.set({ break_enabled: false }, () => {
    chrome.alarms.clear("break_alarm");
  });
}

function setWaterTime(minutes) {
  local.set({ water_time: minutes }, () => {
    setWaterAlarm();
  })
}

function setWaterAlarm() {
  local.get(['water_enabled', 'water_time'], (data) => {
    if (data["water_enabled"]) {
        chrome.alarms.create("water_alarm", { when: Date.now() + 60 * 1000 * data["water_time"] });
    }
  });
}

function enableWaterAlarm() {
  local.set({ water_enable: true }, () => {
    setWaterAlarm();
  });
}

function disableWaterAlarm() {
  local.set({ water_enable: false }, () => {
    chrome.alarms.clear("water_alarm");
  });
}

function startRelativeAlarms() {
  savedAlarms = [];

  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == "break_alarm") {
      local.get('break_number', (data) => {
        /*new Notification("Walk around!", {
          icon: 'cat-icon.png',
          body: 'This is walk break #' + data["break_number"],
        });*/

        local.get('hardcore', (h) => {
          if (h["hardcore"]) {
            chrome.notifications.create({
              type: 'basic',
              title: "Walk around!",
              iconUrl: 'cat-icon.png',
              message: 'HARDCORE MODE. ALL SITES ARE BLOCKED.',
            });


            setBlocking(true);
          } else {
            chrome.notifications.create({
              type: 'basic',
              title: "Walk around!",
              iconUrl: 'cat-icon.png',
              message: 'This is walk break #' + data["break_number"],
            });
          }

          local.set({ break_number: data["break_number"] + 1 }, () => {
            local.get(['break_time', 'break_length'], (data) => {
              if (h["hardcore"]) {
                setTimeout(() => {
                  setBlocking(false);
                  chrome.notifications.create({
                    type: 'basic',
                    title: 'Your break is over!',
                    iconUrl: 'cat-icon.png',
                    message: 'You can visit any site now.',
                  });
                }, 60 * 1000 * data["break_length"]);
              }
              chrome.alarms.create("break_alarm", { when: Date.now() + 60 * 1000 * (data["break_time"] + data["break_length"]) });
            });
          });
        });
      });
    } else if (alarm.name == "water_alarm") {
      local.get('water_number', (data) => {
        /*new Notification("Drink water!", {
          icon: 'cat-icon.png',
          body: 'This is water break #' + data["water_number"],
        });*/
        chrome.notifications.create({
          type: 'basic',
          title: "Drink water!",
          iconUrl: "cat-icon.png",
          message: 'This is water break #' + data["water_number"],
        });

        local.set({ water_number: data["water_number"] + 1 }, () => {
          local.get('water_time', (data) => {
            chrome.alarms.create("water_alarm", { when: Date.now() + 60 * 1000 * data["water_time"] });
          });
        });
      })
    }
  });

  setBreakAlarm();
  setWaterAlarm();
  /*local.get(['break_alarm', 'water_alarm'], (data) => {
    chrome.alarms.create("break_alarm", { when: Date.now() + 60 * 1000 * data["break_alarm"] });
    chrome.alarms.create("water_alarm", { when: Date.now() + 60 * 1000 * data["water_alarm"] + 2000 });
  });*/
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
  local.get(['bedtime_enabled', 'bed_hour', 'bed_minute'], (data) => {
    if (data["bedtime_enabled"]) {
      chrome.alarms.create("bedtime_alarm", { when: nextDate(data["bed_hour"], data["bed_minute"]).getTime() });
    }
  });
}

function enableBedtimeAlarm() {
  local.set({ bedtime_enabled: true }, () => {
    setBedtimeAlarm();
  });
}

function disableBedtimeAlarm() {
  local.set({ bedtime_enabled: false }, () => {
    chrome.alarms.clear("bedtime_alarm");
  });
}

function startAbsoluteAlarms() {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name == "bedtime_alarm") {
      chrome.notifications.create({
        type: 'basic',
        title: "Time to go to bed!",
        iconUrl: "cat-icon.png",
        message: "Sleep well!",
      });

      setBedtimeAlarm();
    }
  });

  setBedtimeAlarm();
}

function setBedtime(hour, minute) {
  local.set({ bed_hour: hour, bed_minute: minute }, () => {
    setBedtimeAlarm();
  })
}

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
