// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

'use strict';

{
    "name": "Getting Started Example",
    "version": "1.0",
    "description": "Build an Extension!",
    "permissions": ["storage"],
    "background": {
      "scripts": ["background.js"],
      "persistent": false
    },
    "manifest_version": 2
}

chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });
});