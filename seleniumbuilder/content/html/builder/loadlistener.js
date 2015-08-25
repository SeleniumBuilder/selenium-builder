/**
 * Listens for page loads/unloads. Call on window.bridge.getRecordingWindow() to get the record
 * window to listen on.
 */
builder.loadlistener = {};

/**
 * Apply this function to the frame specified and to all sub-frames
 *
 * @param {Window} the frame to start with
 * @param {Function(Window, int)} the function to call - second arg is level
 * @param {int} the level we've descended to
 */
builder.loadlistener.on_all_frames = function(frame, funct, level) {
  funct(frame, level);
  var iframeCount = frame.window.frames.length;
  var iframeArray = frame.window.frames;
  for (var i = 0; i < iframeCount; i++) {
    try {
      builder.loadlistener.on_all_frames(iframeArray[i], funct, level + 1);
    } catch(error) {
      dump(error);
    }
  }
};
  
/**
 * Attaches a load listener to the given window which calls the relevant callback on page load
 * and unload.
 * @param rootW The window whose URL to report to the load_callback
 * @param w The window to attach the listener to
 * @param load_callback Function called with the rootW's location on load
 * @param unload_callback Function called on unload
 */
builder.loadlistener.attach = function(rootW, w, load_callback, unload_callback) {
  w.__selenium_builder_load_listener = builder.loadlistener.getUnloadListener(rootW, w, load_callback, unload_callback);
  w.addEventListener('unload', w.__selenium_builder_load_listener, false);
};

builder.loadlistener.detach = function(w) {
  if (w.__selenium_builder_load_listener) {
    w.removeEventListener('unload', w.__selenium_builder_load_listener, false);
  }
};

builder.loadlistener.getUnloadListener = function(rootW, w, load_callback, unload_callback) {
  return function() {
    unload_callback();
    if (w === rootW) {
      builder.loadlistener.executeAfterPageLoad(w, function() {
        load_callback(rootW.document.location.toString());
        builder.loadlistener.attach(rootW, w, load_callback, unload_callback);
      });
    } else {
      load_callback(rootW.document.location.toString());
      builder.loadlistener.attach(rootW, w, load_callback, unload_callback);
    }
  };
};

/**
 * Execute function fn once window w has reloaded. Uses a Firefox observerService observer
 * attached in seleniumBuilder.js (window.bridge).
 */
builder.loadlistener.executeAfterPageLoad = function(w, fn) {
  // This used to use a more complex series of event listeners, but it turns out that this is
  // bad for when we are recording: the user was able to click on things before we attached
  // listeners.
  // However, for playback, we do want to wait until the page is truly truly loaded, which is why
  // the code in selenium1/playback.js now uses the code previously resident here. 
  window.bridge.addDocLoadListener(w, function() {
    fn();
    window.bridge.removeDocLoadListener(w);
  });
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }