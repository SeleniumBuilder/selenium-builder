/**
 * Listeners for keeping track of which page we're on and whether we're loading.
*/

builder.pageState = {};

builder.pageState.currentUrl = null;
builder.pageState.pageLoading = false;
builder.pageState.listeners = [];

builder.pageState.setCurrentUrl = function(currentUrl) {
  builder.pageState.currentUrl = currentUrl;
  builder.pageState.broadcastChange();
};

builder.pageState.setPageLoading = function(pageLoading) {
  builder.pageState.pageLoading = pageLoading;
  builder.pageState.broadcastChange();
};

builder.pageState.set = function(currentUrl, pageLoading) {
  builder.pageState.currentUrl = currentUrl;
  builder.pageState.pageLoading = pageLoading;
  builder.pageState.broadcastChange();
};

builder.pageState.broadcastChange = function() {
  for (var i = 0; i < builder.pageState.listeners.length; i++) {
    builder.pageState.listeners[i](builder.pageState.currentUrl, builder.pageState.pageLoading);
  }
};

builder.pageState.addListener = function(l) {
  builder.pageState.listeners.push(l);
};

builder.pageState.removeListener = function(l) {
  if (builder.pageState.listeners.indexOf(l) !== -1) {
    builder.pageState.listeners.splice(builder.pageState.listeners.indexOf(l), 1);
  }
};

builder.registerPostLoadHook(function() {
  // Attach a listener to the recorder tab that tells us when the page is being loaded. This
  // allows for waitForPageToLoad events to be generated, for recorders to be attached to
  // newly opened pages, and for local playback to notice when it can go to the next step.
  builder.loadlistener.attach(
      /* root window */ window.bridge.getRecordingWindow(),
      /* window */ window.bridge.getRecordingWindow(),
      /* load */ function(url) {
        builder.pageState.set(url, false);
      },
      /* unload */ function() {
        builder.pageState.setPageLoading(true);
      }
  );
});

/**
 * Listens for new windows being created while recording is going on and offers the option to
 * switch recording to them.
 */
builder.PopupWindowObserver = function() {};
builder.PopupWindowObserver.prototype = {
  observe: function(aSubject, aTopic, aData) {
    /*if (typeof builder == 'undefined') { return; } 
    if (aTopic == "domwindowopened") {
      aSubject.addEventListener("DOMContentLoaded", function (event) {
        var newWindow = event.target.defaultView;
        // Only do this in record mode as otherwise we'll get those popups while playing back or
        // just navigating.
        if (builder.interface.getCurrentInterface() == 'record') {
          // Ignore about windows and chrome windows.
          if ((newWindow.location.href.indexOf("about:") == -1) &&
              (newWindow.location.href.indexOf("chrome://") == -1))
          {
            window.focus();
            if (confirm("We detected a new popup, would you like to \ngenerate commands to select it?")) {
              builder.interface.record_action('waitForPopUp', { windowID:"null", timeout: 3000 });
              builder.interface.record_action('selectWindow', { windowID: newWindow.name }); 
              // Set the focus to the popup window
              builder.setRecordWindow(newWindow);
              aSubject.content.focus();
            }
          }
        }
      }, true);
    } else {
      // If a window has closed.
      if (aSubject.content && aSubject.content.wrappedJSObject.location.href.indexOf("about:") == -1) {
        window.focus();
        if (builder.interface.getCurrentInterface() == 'record') {
          if (confirm("We detected a popup has closed, would you like to \ngenerate commands to close it?")) {
            builder.interface.record_action('close', { });
            builder.interface.record_action('selectWindow', { windowID: "null"});
            builder.setRecordWindow(null);
          }
        }
      }
    }*/
  }
};

var ww = Components.classes["@mozilla.org/embedcomp/window-watcher;1"].getService(Components.interfaces.nsIWindowWatcher);
ww.registerNotification(new builder.PopupWindowObserver());



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }