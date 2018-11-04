$(() => {
  $('#go-to-options').click(() => {
    chrome.runtime.openOptionsPage();
  });
})
