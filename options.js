var local = chrome.storage.local;

$(() => {
  $('#remindSleep').click(remindSleep);
  $('#bedtime').click(setBedtime);
  $('#saveDrinkData').click(saveDrink);
  $('#drinkWater').click(drinkWater);
  $('#takeBreak').click(takeBreak);
  $('#saveBreakData').click(SetbreakProperties);
  $('#hardcore').click(hardcore);

  local.get(null, (data) => {
    $('#remindSleep').prop('checked', data["bedtime_enabled"]);
    $('#drinkWater').prop('checked', data["water_enabled"]);
    $('#takeBreak').prop('checked', data["break_enabled"]);
    $('#hardcore').prop('checked', data["hardcore"]);

    var hour = data["bed_hour"];
    if (hour < 12) {
      $('#bedtime_ampm').val('am');
    } else {
      $('#bedtime_ampm').val('pm');
      hour -= 12;
    }
    if (hour < 10) {
      hour = '0' + hour;
    } else {
      hour = hour + '';
    }
    $('#bedtime_hour').val(hour);
    var minute = data["bed_minute"];
    if (minute < 10) {
      minute = '0' + minute;
    } else {
      minute = minute + '';
    }
    $('#bedtime_minute').val(minute);

    $('#waterFrequency').val(data["water_time"]);
    $('#breakFrequency').val(data["break_time"]);
    $('#breakLength').val(data["break_length"]);
  });
})

function setBedtime() {
  console.log('yeet');
  var hour = parseInt($('#bedtime_hour').val());
  if ($('#bedtime_ampm').val() == 'pm') {
    hour += 12;
  }
  var minute = parseInt($('#bedtime_minute').val());
  chrome.runtime.getBackgroundPage((window) => {
    window.setBedtime(hour, minute);
  });
}

function remindSleep() {
  if ($('#remindSleep').prop('checked')) {
    chrome.runtime.getBackgroundPage((window) => {
      window.enableBedtimeAlarm();
    });
  } else {
    chrome.runtime.getBackgroundPage((window) => {
      window.disableBedtimeAlarm();
    });
  }
}

function saveDrink() {
  var minutes = parseFloat($('#waterFrequency').val());
  chrome.runtime.getBackgroundPage((window) => {
    window.setWaterTime(minutes);
  });
}

function drinkWater() {
  if ($('#drinkWater').prop('checked')) {
    chrome.runtime.getBackgroundPage((window) => {
      window.enableWaterAlarm();
    });
  } else {
    chrome.runtime.getBackgroundPage((window) => {
      window.disableWaterAlarm();
    });
  }
}

function takeBreak() {
  if ($('#takeBreak').prop('checked')) {
    chrome.runtime.getBackgroundPage((window) => {
      window.enableBreakAlarm();
    });
  } else {
    chrome.runtime.getBackgroundPage((window) => {
      window.disableBreakAlarm();
    });
  }
}

function SetbreakProperties() {
  var minutes = parseFloat($('#breakFrequency').val());
  var length = parseFloat($('#breakLength').val());
  chrome.runtime.getBackgroundPage((window) => {
    window.setBreakTime(minutes, length);
  });
}

function hardcore() {
  chrome.runtime.getBackgroundPage((window) => {
    window.setHardcore($("#hardcore").prop('checked'));
  });
}
