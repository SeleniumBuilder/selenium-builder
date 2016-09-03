var builder = {};
builder.version = "3.1.2";

builder.loader = {};

builder.loader.ds = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
builder.loader.ios = Components.classes["@mozilla.org/network/io-service;1"].getService(Components.interfaces.nsIIOService);

builder.loader.showProgressBar = function() {
  document.getElementById('booting-done').style.display = 'block';
  document.getElementById('booting-notdone').style.display = 'block';
};

builder.loader.hideProgressBar = function() {
  document.getElementById('booting-done').style.display = 'none';
  document.getElementById('booting-notdone').style.display = 'none';
};

builder.loader.setProgressBar = function(halfPercents, text) {
  var fileEl = document.getElementById('booting-file');
  var tEl = document.createTextNode(text);
  if (fileEl.firstChild) {
    fileEl.removeChild(fileEl.firstChild);
  }
  fileEl.appendChild(tEl);
  document.getElementById('booting-done').style.width = halfPercents + 'px';
  document.getElementById('booting-notdone').style.width = (201 - halfPercents) + 'px';
  document.getElementById('booting-notdone').style.left = halfPercents + 'px';
  builder.loader.showProgressBar();
};

builder.loader.getProfilePath = function(relativePath) {
  var els = relativePath.split("/");
  var f = builder.loader.ds.get("ProfD", Components.interfaces.nsIFile);
  f.append("SeBuilder");
  for (var i = 0; i < els.length; i++) {
    f.append(els[i]);
  }
  return builder.loader.ios.newFileURI(f).spec;
};

builder.loader.loadScripts = function() {
  builder.loader.loadNextScript(arguments, 0);
};

builder.loader.loadNextScript = function(l, index) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  var path = l[index];
  if (path.charAt(0) == "%") {
    script.setAttribute('src', builder.loader.getProfilePath(path.substring(1)) + "?" + Math.random());
  }
  else {
    // Force no caching.
    script.setAttribute('src', path + "?" + Math.random());
  }
  // Above line may not work due to security reasons, so let's try a different
  // way too.
  document.getElementsByTagName('head')[0].appendChild(script);
  builder.loader.setProgressBar(200 * index / l.length, path);
  window.setTimeout(function() {
    if (index < l.length - 1) {
      builder.loader.loadNextScript(l, index + 1);
    }
  }, 30);
};

builder.loader.loadNextMainScript = function() {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  var path = builder.loader.mainScripts[builder.loader.mainScriptIndex++];
  if (path.charAt(0) == "%") {
    script.setAttribute('src', builder.loader.getProfilePath(path.substring(1)) + "?" + Math.random());
  }
  else {
    // Force no caching.
    script.setAttribute('src', path + "?" + Math.random());
  }
  // Above line may not work due to security reasons, so let's try a different
  // way too.
  document.getElementsByTagName('head')[0].appendChild(script);
  builder.loader.setProgressBar(200 * builder.loader.mainScriptIndex / builder.loader.mainScripts.length, path);
  if (path.charAt(0) == "%") {
    window.setTimeout(builder.loader.loadNextMainScript, 50);
  }
};

builder.loader.loadListOfScripts = function(scripts, callback) {
  builder.loader.loadNextListScript(scripts, 0, callback);
}

builder.loader.loadNextListScript = function(scripts, index, callback) {
  var script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  // Force no caching.
  script.setAttribute('src', scripts[index] + "?" + Math.random());
  // Above line may not work due to security reasons, so let's try a different
  // way too.
  document.getElementsByTagName('head')[0].appendChild(script);
  builder.loader.setProgressBar(200 * index / scripts.length, scripts[index]);
  window.setTimeout(function() {
    if (index < scripts.length - 1) {
      builder.loader.loadNextListScript(scripts, index + 1, callback);
    } else {
      if (callback) { callback(); }
    }
  }, 30);
};

/** Functions that get executed once everything has been loaded. */
builder.postLoadHooks = [];

/** Register a function to be executed once everything has been loaded. */
builder.registerPostLoadHook = function(f) {
  if (builder.loaded) {
    f();
  } else {
    builder.postLoadHooks.push(f);
  }
};

/** Functions that get executed before shutdown. */
builder.preShutdownHooks = [];

builder.registerPreShutdownHook = function(f) {
  builder.preShutdownHooks.push(f);
};

builder.loader.mainScriptIndex = 0;

builder.loader.mainScripts = [
  "builder/utils.js",
  "builder/i18n/translate.js",
  "builder/i18n/en.js",
  "builder/i18n/de.js",
  "builder/i18n/fr.js",
  "builder/i18n/jp.js",
  "builder/i18n/pt-br.js",
  "builder/i18n/nl.js",
  "builder/io.js",
  "builder/url.js",
  "builder/script.js",
  "builder/loadlistener.js",
  "builder/verifyexplorer.js",
  "builder/plugins.js",
  "builder/pagestate.js",
  "builder/gui.js",
  "builder/gui/menu.js",
  "builder/gui/suite.js",
  "builder/views/booting.js",
  "builder/views/startup.js",
  "builder/views/script.js",
  "builder/views/plugins.js",
  "builder/selenium2/selenium2.js",
  "builder/selenium2/io/io.js",
  "builder/selenium2/io/formats/json.js",
  "builder/selenium2/io/formats/java_new.js",
  "builder/selenium2/io/formats/java_junit.js",
  "builder/selenium2/io/formats/java_testng.js",
  "builder/selenium2/io/formats/ruby.js",
  "builder/selenium2/io/formats/python.js",
  "builder/selenium2/io/formats/python_unittest.js",
  "builder/selenium2/io/formats/phpunit.js",
  "builder/selenium2/io/formats/phpunitwebdriver_facebook.js",
  "builder/selenium2/io/formats/php.js",
  "builder/selenium2/io/formats/node-wd.js",
  "builder/selenium2/io/formats/node-wd-promises.js",
  "builder/selenium2/io/formats/node-selenium-webdriver.js",
  "builder/selenium2/io/formats/node-mocha.js",
  "builder/selenium2/io/formats/node-protractor.js",
  "builder/selenium2/io/formats/csharp_new.js",
  "builder/selenium2/io/formats/csharp_new_nunit.js",
  "builder/selenium2/io/formats/english.js",
  "builder/locator.js",
  "builder/suite.js",
  "builder/stepdisplay.js",
  "builder/selenium2/playback.js",
  "builder/selenium2/rcPlayback.js",
  "builder/selenium2/recorder.js",
  "builder/selenium2/docs.js",
  "builder/record.js",
  "builder/dialogs/dialogs.js",
  "builder/dialogs/exportscript.js",
  "builder/dialogs/exportsuite.js",
  "builder/dialogs/rc.js",
  "builder/dialogs/record.js",
  "builder/dialogs/runall.js",
  "builder/dialogs/variables.js",
  "builder/dialogs/inputs.js",
  "builder/dialogs/settings.js",
  "builder/gui/translate.js",
  "builder/datasource/sources.js",
  "builder/datasource/none.js",
  "builder/datasource/manual.js",
  "builder/datasource/json.js",
  "builder/datasource/xml.js",
  "builder/datasource/csv.js",
  "builder/ignition.js"
];

if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
