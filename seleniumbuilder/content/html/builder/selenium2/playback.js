/**
 * Code for playing back Selenium 2 scripts locally. Stub.
*/

builder.selenium2.playback = {};

builder.selenium2.playback.runTest = function(postPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback, initialVars) {
  alert("Not implemented yet!");
};

builder.selenium2.playback.continueTestBetween = function(startStepID, endStepID, postPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback) {
  alert("Not implemented yet!");
};

builder.selenium2.playback.runTestBetween = function(startStepID, endStepID, postPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback) {
  alert("Not implemented yet!");
};

builder.selenium2.playback.canPlayback = function() {
  return true; // qqDPS Lies
};

if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
