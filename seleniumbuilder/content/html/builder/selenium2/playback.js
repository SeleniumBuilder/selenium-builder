/**
 * Code for playing back Selenium 2 scripts locally. Stub.
*/

builder.selenium2.playback = {};

/** The script being played back. */
builder.selenium2.playback.script = null;
/** The step being played back. */
builder.selenium2.playback.currentStep = null;
/** The step after which playback should pause. */
builder.selenium2.playback.finalStep = null;
/** The function to call with a result object after the run has concluded one way or another. */
builder.selenium2.playback.postPlayCallback = null;
/** The function to call when playback has started. */
builder.selenium2.playback.jobStartedCallback = null;
/** The result object returned at the end of the run. */
builder.selenium2.playback.playResult = null;
/** Whether the user has requested test stoppage. */
builder.selenium2.playback.stopRequest = false;
/** Stored variables. */
builder.selenium2.playback.vars = {};
/** Whether playback is currently paused on a breakpoint. */
builder.selenium2.playback.pausedOnBreakpoint = false;

builder.selenium2.playback.runTest = function(postPlayCallback, jobStartedCallback, stepStateCallback, runPausedCallback, initialVars) {
  var script = builder.getScript();
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
