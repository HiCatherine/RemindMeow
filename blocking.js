var blocked = `

<style>
  .banner {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  h5 {
    font-size: 72px;
    font-weight: 500;
  }
</style>
<div class="banner">
  <h5>Stand up and stretch! Meow!</h5></div>

`;

var local = chrome.storage.local;

local.get('blocking', (data) => {
  if (data["blocking"]) {
    $("body").empty();
    $("body").append(blocked);
  }
})
