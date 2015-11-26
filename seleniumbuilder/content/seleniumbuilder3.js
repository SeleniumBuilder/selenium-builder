// Establish sebuilder namespace.
var sebuilder = {};
/** The tab node that is highlighted green (can be used to get a reference to the content). */
sebuilder.recordingTab = null;
/** The window we're recording in, if different from the one in the recordingTab. */
sebuilder.customRecordingWindow = null;
/** The window that contains the recorder. */
sebuilder.recorderWindow = null;
/** Document load listeners, mapped from window to listener. */
sebuilder.docLoadListeners = {};

sebuilder.logMessage = function(aMessage) {
  var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
      .getService(Components.interfaces.nsIConsoleService);
  consoleService.logStringMessage(aMessage);
}

/** Set an alternate window to record in that's not the window of the recordingTab. */
sebuilder.setCustomRecordingWindow = function(newWindow) {
  sebuilder.customRecordingWindow = newWindow;
};

/** @return The content window we're recording in. */
sebuilder.getRecordingWindow = function() {
  if (sebuilder.customRecordingWindow) { return customRecordingWindow; }
  return getBrowser().getBrowserForTab(sebuilder.recordingTab).contentWindow;
};

/** Moves the content window we're recording into the foreground. */
sebuilder.focusRecordingTab = function() {
  if (sebuilder.customRecordingWindow) {
    sebuilder.customRecordingWindow.focus();
    return;
  }
  getBrowser().selectedTab = sebuilder.recordingTab;
  window.focus();
};

/** Moves the Selenium Builder window into the foreground. */
sebuilder.focusRecorderWindow = function() {
  sebuilder.focusRecordingTab();
  sebuilder.recorderWindow.focus();
};

/** @return The main browser window we're recording in. */
sebuilder.getBrowser = function() {
  return window;
};

/** Shuts down SeBuilder. */
sebuilder.shutdown = function() {
  if (sebuilder.recordingTab) {
    sebuilder.recordingTab.style.setProperty("background-color", "", "");
  }
  if (sebuilder.recorderWindow) {
    sebuilder.recorderWindow.close();
  }
  sebuilder.recorderWindow = null;
};

/**
 * Add a listener to be notified when the document in win changes. There can only be one
 * listener per window. (Though the code can be easily improved using arrays and splicing
 * if this becomes a problem.)
 */ 
sebuilder.addDocLoadListener = function(win, l) {
  sebuilder.docLoadListeners[win] = l;
};

sebuilder.removeDocLoadListener = function(win, l) {
  delete sebuilder.docLoadListeners[win];
};

sebuilder.prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);

sebuilder.browserType = function() { return "firefox"; }

sebuilder.pluginRepository = function() {
  return sebuilder.prefManager.getCharPref("extensions.seleniumbuilder3.plugins.repository");
};

sebuilder.setPluginRepository = function(rep) {
  sebuilder.prefManager.setCharPref("extensions.seleniumbuilder3.plugins.repository", rep);
};

sebuilder.boot = function() {
  // If we've already booted just put the GUI into the foreground.
  if (sebuilder.recorderWindow) {
    sebuilder.recorderWindow.focus();
    return;
  }
  
  // Save the tab the user has currently open: it's the one we'll record from.
  sebuilder.recordingTab = getBrowser().mCurrentTab;
  
  if (sebuilder.getRecordingWindow().location.href.substring(0, "about:".length) == "about:") {
    sebuilder.getRecordingWindow().location = "http://www.sebuilder.com";
  }

  // Make it obvious which tab is recording by turning it green!
  sebuilder.recordingTab.style.setProperty("background-color", "#bfee85", "important");
  
  sebuilder.recorderWindow = window.open("chrome://seleniumbuilder3/content/html/gui.html", "seleniumbuilder", "width=550,height=600,top=50,left=50,toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,copyhistory=no,resizable=yes");
    
  // Install a listener with the browser to be notified when a new document is loaded.
  try {
    var observerService = Components.classes["@mozilla.org/observer-service;1"].getService(
        Components.interfaces.nsIObserverService);
    var observer = {
      observe: function (doc) {
        if (sebuilder.docLoadListeners[doc.defaultView]) {
          sebuilder.docLoadListeners[doc.defaultView]();
        }
      }
    };
    observerService.addObserver(observer, "document-element-inserted", false);
  } catch (e) {
    dump(e);
  }
  
  sebuilder.booter = setInterval(function() {
    if (sebuilder.recorderWindow.wrappedJSObject.boot) {
      sebuilder.recorderWindow.wrappedJSObject.boot(sebuilder);
      clearInterval(sebuilder.booter);
    }
  }, 100);
};

sebuilder.getInternalFile = function(path, callback) {
  var MY_ID = "seleniumbuilder@sebuilder.com";
  // We may be on FF 4 or later
  Components.utils.import("resource://gre/modules/AddonManager.jsm");
  AddonManager.getAddonByID(MY_ID, function(addon) {
    callback(addon.getResourceURI(path).QueryInterface(Components.interfaces.nsIFileURL).file);
  });
};

/**
 * Loads the given URL from the file system given a chrome:// URL.
 */
sebuilder.loadFile = function(url, success, error) {
  var data = "";
  // Get rid of the random number get-string meant to discourage caching.
  if (url.match("[?]")) {
    url = url.split("?")[0];
  }
  var prefix = "chrome://seleniumbuilder3/";
  var path = "chrome/" + url.substring(prefix.length);
  var MY_ID = "seleniumbuilder@sebuilder.com";
  var theFile = null;
  Components.utils.import("resource://gre/modules/AddonManager.jsm");
  AddonManager.getAddonByID(MY_ID, function(addon) {
    theFile = addon.getResourceURI(path).QueryInterface(Components.interfaces.nsIFileURL).file;
    var data = null;
    try {
      data = sebuilder.readFile(theFile);
    } catch (e) {
      error(e);
      return;
    }
    success(data);
  });
};

sebuilder.readPath = function(path) {
  var theFile = Components.classes["@mozilla.org/file/local;1"]
      .createInstance(Components.interfaces.nsILocalFile);
  theFile.initWithPath(path);
  return sebuilder.readFile(theFile);
}

sebuilder.readFile = function(theFile) {
  var fstream = Components.classes["@mozilla.org/network/file-input-stream;1"]
      .createInstance(Components.interfaces.nsIFileInputStream);
  var cstream = Components.classes["@mozilla.org/intl/converter-input-stream;1"]
      .createInstance(Components.interfaces.nsIConverterInputStream);
  fstream.init(theFile, -1, 0, 0);
  cstream.init(fstream, "UTF-8", 0, 0); // you can use another encoding here if you wish

  var str = {};
  var read = 0;
  var data = "";
  do { 
    read = cstream.readString(0xffffffff, str); // read as much as we can and put it in str.value
    data += str.value;
  } while (read != 0);
  cstream.close(); // this closes fstream
  return data;
};

sebuilder.decodeBase64 = function(data) {
  return window.atob(data);
};

sebuilder.writeBinaryFile = function(path, data) {
  var theFile = Components.classes["@mozilla.org/file/local;1"]
      .createInstance(Components.interfaces.nsILocalFile);
  theFile.initWithPath(path);
  var outputStream = Components.classes["@mozilla.org/network/file-output-stream;1"]
      .createInstance(Components.interfaces.nsIFileOutputStream);
  outputStream.init(theFile, -1, -1, 0);
  outputStream.write(data, data.length);
  outputStream.close();
};

// Import the Services module for future use, if we're not in a browser window where it's already loaded.
Components.utils.import('resource://gre/modules/Services.jsm');

// Create a constructor for the builtin supports-string class.
sebuilder.nsSupportsString = Components.Constructor("@mozilla.org/supports-string;1", "nsISupportsString");
sebuilder.SupportsString = function(str) {
  // Create an instance of the supports-string class
  var res = sebuilder.nsSupportsString();

  // Store the JavaScript string that we want to wrap in the new nsISupportsString object
  res.data = str;
  return res;
};

// Create a constructor for the builtin transferable class
sebuilder.nsTransferableConstructor = Components.Constructor("@mozilla.org/widget/transferable;1", "nsITransferable");

// Create a wrapper to construct a nsITransferable instance and set its source to the given window, when necessary
sebuilder.Transferable = function(source) {
  var res = sebuilder.nsTransferableConstructor();
  if ('init' in res) {
    // When passed a Window object, find a suitable provacy context for it.
    if (source instanceof Ci.nsIDOMWindow) {
      // Note: in Gecko versions >16, you can import the PrivateBrowsingUtils.jsm module
      // and use PrivateBrowsingUtils.privacyContextFromWindow(sourceWindow) instead
      source = source.QueryInterface(Ci.nsIInterfaceRequestor).getInterface(Ci.nsIWebNavigation);
    }
    res.init(source);
  }
  return res;
};

sebuilder.getClipboardString = function() {
  var trans = sebuilder.Transferable();
  trans.addDataFlavor("text/unicode");
  Services.clipboard.getData(trans, Services.clipboard.kGlobalClipboard);
  var str       = {};
  var strLength = {};
  trans.getTransferData("text/unicode", str, strLength);
  if (str) {
    return str.value.QueryInterface(Ci.nsISupportsString).data;
  } else {
    return null;
  }
};

sebuilder.setClipboardString = function(dataString) {
  var trans = sebuilder.Transferable(window);
  trans.addDataFlavor("text/unicode");
  // We multiply the length of the string by 2, since it's stored in 2-byte UTF-16
  // format internally.
  trans.setTransferData("text/unicode", sebuilder.SupportsString(dataString), dataString.length * 2);
  Services.clipboard.setData(trans, null, Services.clipboard.kGlobalClipboard);
};

sebuilder.showFilePicker = function(window, title, mode, defaultDirPrefName, handler, defaultFileName) {
  var nsIFilePicker = Components.interfaces.nsIFilePicker;
  var fp = Components.classes["@mozilla.org/filepicker;1"].createInstance(nsIFilePicker);
  fp.init(window, title, mode);
  var defaultDir = sebuilder.prefManager.getCharPref(defaultDirPrefName, null);
  if (defaultDir) {
    fp.displayDirectory = sebuilder.SeFileUtils.getFile(defaultDir);
  }
  if (defaultFileName) {
    fp.defaultString = defaultFileName;
  }
  var res = fp.show();
  if (res == nsIFilePicker.returnOK || res == nsIFilePicker.returnReplace) {
    sebuilder.prefManager.setCharPref(defaultDirPrefName, fp.file.parent.path);
    return handler(fp);
  } else {
    return null;
  }
};

sebuilder.SeFileUtils = {
  getProfileDir: function() {
    return Components.classes["@mozilla.org/file/directory_service;1"]
      .getService(Components.interfaces.nsIProperties)
      .get("ProfD", Components.interfaces.nsILocalFile);
  },
  
  getTempDir: function() {
    return Components.classes["@mozilla.org/file/directory_service;1"]
      .getService(Components.interfaces.nsIProperties)
      .get("TmpD", Components.interfaces.nsILocalFile);
  },
  
  getUnicodeConverter: function(encoding) {
    var unicodeConverter = Components.classes["@mozilla.org/intl/scriptableunicodeconverter"].createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
    try {
      unicodeConverter.charset = encoding;
    } catch (error) {
      throw "setting encoding failed: " + encoding;
    }
    return unicodeConverter;
  },
  
  openFileOutputStream: function(theFile) {
    var stream = Components.classes["@mozilla.org/network/file-output-stream;1"].createInstance(Components.interfaces.nsIFileOutputStream);
    stream.init(theFile, 0x02 | 0x08 | 0x20, 420, 0);
    return stream;
  },

  openFileInputStream: function(theFile) {
    var stream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
    stream.init(theFile, 0x01, 00004, 0);
    var sis = Components.classes["@mozilla.org/scriptableinputstream;1"].createInstance(Components.interfaces.nsIScriptableInputStream);
    sis.init(stream);
    return sis;
  },

  openURLInputStream: function(url) {
    const ioService = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
    var stream = ioService.newChannelFromURI(ioService.newURI(url, null, null)).open();
    var sis = Components.classes['@mozilla.org/scriptableinputstream;1'].createInstance(Components.interfaces.nsIScriptableInputStream);
    sis.init(stream);
    return sis;
  },

  readFile: function(theFile) {
    var stream = this.openFileInputStream(theFile);
    var content = stream.read(stream.available());
    stream.close();
    return content;
  },

  readURL: function(url) {
    var stream = this.openURLInputStream(url);
    var content = stream.read(stream.available());
    stream.close();
    return content;
  },

  getFile: function(path) {
    var theFile = Components.classes['@mozilla.org/file/local;1'].createInstance(Components.interfaces.nsILocalFile);
    theFile.initWithPath(path);
    return theFile;
  },

  fileURI: function(theFile) {
    return Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService).
      newFileURI(theFile).spec;
  },

  splitPath: function(theFile) {
    var max = 100;
    var result = [];
    var i = 0;
    while (i < max && theFile && 
       theFile.path != "/" &&
       !theFile.path.match(/^[a-z]:$/i)) {
      result.unshift(theFile.leafName);
      if ("." == theFile.leafName || ".." == theFile.leafName) {
        break;
      }
      theFile = theFile.parent;
      i++;
    }
    return result;
  }
};
