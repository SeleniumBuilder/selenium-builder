/** Code for managing plugins */
builder.plugins = {};

// States
builder.plugins.NOT_INSTALLED = "NOT_INSTALLED";
builder.plugins.INSTALLED     = "INSTALLED";
builder.plugins.TO_INSTALL    = "TO_INSTALL";
builder.plugins.TO_UNINSTALL  = "TO_UNINSTALL";
builder.plugins.TO_UPDATE     = "TO_UPDATE";

builder.plugins.DISABLED   = "DISABLED";
builder.plugins.ENABLED    = "ENABLED";
builder.plugins.TO_ENABLE  = "TO_ENABLE";
builder.plugins.TO_DISABLE = "TO_DISABLE";

builder.plugins.ds = Components.classes["@mozilla.org/file/directory_service;1"]
    .getService(Components.interfaces.nsIProperties);
builder.plugins.ios = Components.classes["@mozilla.org/network/io-service;1"]
    .getService(Components.interfaces.nsIIOService);
builder.plugins.db = null;

builder.plugins.downloadingCount = 0;
builder.plugins.startupErrors = [];

builder.plugins.MAX_HEADER_VERSION = 1;
builder.plugins.PLUGINS_BUILDER_VERSION = 1;

// Plugins can register zero-arg functions for safe shutdown here.
builder.plugins.shutdownFunctions = [];

// List of {"id":, "version"} objects.
builder.plugins.bundledPlugins = [];

// List of files to load in.
builder.plugins.toLoad = [];

builder.plugins.getGotoPluginsView = function() {
  return sebuilder.prefManager.getBoolPref("extensions.seleniumbuilder3.plugins.gotoPluginsView");
};

builder.plugins.setGotoPluginsView = function(b) {
  sebuilder.prefManager.setBoolPref("extensions.seleniumbuilder3.plugins.gotoPluginsView", b);
};

/**
 * Will call callback with a list of {identifier, installState, enabledState, installedInfo, repositoryInfo} of all plugins.
 */
builder.plugins.getListAsync = function(callback) {
  builder.plugins.getRemoteListAsync(function(repoList, error) {
    if (error) { callback(null, error); return; }
    builder.plugins.getInstalledIDs(function(installedList) {
      var repoMap = {};
      if (repoList) {
        for (var i = 0; i < repoList.length; i++) {
          repoMap[repoList[i].identifier] = repoList[i];
        }
      }
      var installedMap = {};
      for (var i = 0; i < installedList.length; i++) {
        installedMap[installedList[i]] = true;
      }
      var result = [];
      
      // Add all installed plugins.
      builder.plugins.promiseLoop(installedList, function(id, done) {
        builder.plugins.getState(id, function(line) {
          line.identifier = id;
          line.installedInfo = builder.plugins.getInstalledInfo(id);
          if (repoMap[id]) {
            line.repositoryInfo = repoMap[id];
          }
          result.push(line);
          done();
        });
      })
      .then(function() {
        // Add all non-installed plugins.
        for (var i = 0; i < repoList.length; i++) {
          var id = repoList[i].identifier;
          if (installedMap[id]) { continue; }
          result.push({
            "identifier": id,
            "installState": builder.plugins.NOT_INSTALLED,
            "enabledState": builder.plugins.ENABLED,
            "installedInfo": null,
            "repositoryInfo": repoList[i]
          });
        }
        
        callback(result, error);
      }, function(error) { alert("start_2 uninstall DB error " + error ); });
    });
  });
};

builder.plugins.isUpdateable = function(info) {
  if (!info.installedInfo || !info.repositoryInfo) {
    return false;
  }
  if (!info.repositoryInfo.browsers[sebuilder.browserType()]) {
    return false;
  }
  return !builder.plugins.checkMaxVersion(info.installedInfo.pluginVersion, info.repositoryInfo.browsers[sebuilder.browserType()].pluginVersion);
};

builder.plugins.isPluginTooNew = function(info) {
  info = info.repositoryInfo.browsers[sebuilder.browserType()];
  if (!info) { return false; }
  return info.builderMinVersion && !builder.plugins.checkMinVersion(info.builderMinVersion + "", builder.version);
};

builder.plugins.isPluginTooOld = function(info) {
  info = info.repositoryInfo.browsers[sebuilder.browserType()];
  if (!info) { return false; }
  return info.builderMaxVersion && !builder.plugins.checkMaxVersion(info.builderMaxVersion + "", builder.version);
};

builder.plugins.createDir = function(f) {
  if (!f.exists() || !f.isDirectory()) {  
    f.create(Components.interfaces.nsIFile.DIRECTORY_TYPE, 0774);  
  }
};

builder.plugins.isValidID = function(str) {
  return str && str.match(/^[0-9a-zA-Z_]{3,32}$/);
};

builder.plugins.getBuilderDir = function() {
  var f = builder.plugins.ds.get("ProfD", Components.interfaces.nsIFile);
  f.append("SeBuilder3");
  builder.plugins.createDir(f);
  return f;
};

builder.plugins.getPluginsDir = function() {
  var f = builder.plugins.getBuilderDir();
  f.append("plugins");
  builder.plugins.createDir(f);
  return f;
};

builder.plugins.getInstalledIDs = function(done) {
  builder.plugins.db.execute("SELECT identifier FROM state WHERE installState = '" + builder.plugins.TO_INSTALL + "'").then(function(toInstallRows) {
    for (var i = 0; i < toInstallRows.length; i++) {
      var id = toInstallRows[i].getResultByIndex(0);
      result.push(id);
      toInstall[id] = true;
    }
    var result = [];
    var toInstall = {};
    var f = builder.plugins.getPluginsDir();
    var en = f.directoryEntries;
    while (en.hasMoreElements()) {
      var child = en.getNext();
      var leafName = child.QueryInterface(Components.interfaces.nsIFile).leafName;
      if (child.QueryInterface(Components.interfaces.nsIFile).isHidden()) {
        continue;
      }
      if (!toInstall[leafName] && builder.plugins.isValidID(leafName)) {
        result.push(leafName);
      }
    }
    done(result);
  },
  function(error) { alert("getInstalledIDs DB error " + error ); });
};

builder.plugins.getInstalledInfo = function(id) {
  try {
    var f = builder.plugins.getDirForPlugin(id);
    f.append("header.json");
    if (f.isFile()) {
      return JSON.parse(sebuilder.readFile(f));
    }
  } catch (e) {
    return null;
  }
};

builder.plugins.setInstallState = function(id, installState, done) {
  builder.plugins.db.execute("SELECT * FROM state WHERE identifier = :identifier", [{"identifier": id}])
  .then(function(resultRows) {
    if (resultRows.length != 0) {
      builder.plugins.db.execute("UPDATE state SET installState = :installState WHERE identifier = :identifier", [{"identifier": id, "installState": installState}])
      .then(done,
      function(error) { alert("setInstallState update DB error " + error ); });
    } else {
      builder.plugins.db.execute("INSERT INTO state VALUES (:identifier, :installState, :enabledState)", [{"identifier": id, "installState": installState, "enabledState": builder.plugins.ENABLED}])
      .then(done,
      function(error) { alert("setInstallState insert DB error " + error ); });
    }
  },
  function(error) { alert("setInstallState get DB error " + error ); });
};

builder.plugins.setEnabledState = function(id, enabledState, done) {
  builder.plugins.db.execute("SELECT * FROM state WHERE identifier = :identifier", [{"identifier": id}])
  .then(function(resultRows) {
    if (resultRows.length != 0) {
      builder.plugins.db.execute("UPDATE state SET enabledState = :enabledState WHERE identifier = :identifier", [{"identifier": id, "enabledState": enabledState}])
      .then(done,
      function(error) { alert("setEnabledState update DB error " + error ); });
    } else {
      builder.plugins.db.execute("INSERT INTO state VALUES (:identifier, :installState, :enabledState)", [{"identifier": id, "installState": builder.plugins.INSTALLED, "enabledState": enabledState}])
      .then(done,
      function(error) { alert("setEnabledState insert DB error " + error ); });
    }
  },
  function(error) { alert("setEnabledState get DB error " + error ); });
};

/** @return The state of an installed plugin. */
builder.plugins.getState = function(id, done) {
  builder.plugins.db.execute("SELECT * FROM state WHERE identifier = :identifier", [{"identifier": id}])
  .then(function(resultRows) {
    if (resultRows.length == 0) {
      // We have no record of it, so keep it as default.
      done({"installState": builder.plugins.INSTALLED, "enabledState": builder.plugins.ENABLED});
    } else {
      var row = resultRows[0];
      done({"installState": row.getResultByName("installState"), "enabledState": row.getResultByName("enabledState")});
    }
  },
  function(error) { alert("getState get DB error " + error ); });
};

builder.plugins.pluginExists = function(id) {
  var d = builder.plugins.getDirForPlugin(id);
  return d.exists() && d.isDirectory();
};

builder.plugins.getDirForPlugin = function(id) {
  var f = builder.plugins.getPluginsDir();
  f.append(id);
  return f;
};

builder.plugins.getZipForPlugin = function(id) {
  var f = builder.plugins.getBuilderDir();
  f.append("pluginzips");
  builder.plugins.createDir(f);
  f.append(id + ".zip");
  return f;
};

builder.plugins.getExtractForPlugin = function(id) {
  var f = builder.plugins.getBuilderDir();
  f.append("extract");
  builder.plugins.createDir(f);
  f.append(id);
  return f;
};

/**
 * @return A list of info objects of all plugins in the plugin DB.
 */
builder.plugins.getRemoteListAsync = function(callback) {
  var loadTimedOut = false;
  var loadSucceeded = false;
  
  jQuery.ajax({
    type: "GET",
    cache: false,
    dataType: "json",
    url: sebuilder.pluginRepository() + "?" + Math.random(),
    success: function(data) {
      if (loadTimedOut) { return; }
      loadSucceeded = true;
      if (data.repositoryVersion > 1) {
        callback(null, _t('plugin_list_too_new'));
      } else {
        var result = [];
        for (var i = 0; i < data.plugins.length; i++) {
          if (data.plugins[i].browsers[sebuilder.browserType()]) {
            result.push(data.plugins[i]);
          }
        }
        callback(result);
      }
    },
    error: function(jqXHR, textStatus, errorThrown) {
      if (loadTimedOut) { return; }
      loadSucceeded = true;
      callback(null, _t('unable_to_fetch_plugins') + ": " + (textStatus ? textStatus : "") + " " + (errorThrown ? errorThrown : ""));
    }
  });
  
  setTimeout(function() {
    if (loadSucceeded) { return; }
    loadTimedOut = true;
    callback(null, _t('unable_to_fetch_plugins') + ": " + _t('plugin_load_timed_out'));
  }, 5000);
};

builder.plugins.performDownload = function(id, url, callback) {
  builder.plugins.downloadingCount++;
  jQuery('#plugins-downloading').show();
  
  var loadTimedOut = false;
  var loadSucceeded = false;
  
  var oReq = new XMLHttpRequest();
  oReq.open("GET", url + "?" + Math.random(), true);
  oReq.responseType = "arraybuffer";
  
  oReq.onload = function (oEvent) {
    if (loadTimedOut) { return; }
    loadSucceeded = true;
    var arrayBuffer = oReq.response; // Note: not oReq.responseText
    if (arrayBuffer) {
      var byteArray = new Uint8Array(arrayBuffer);
      var str = "";
      for (var i = 0; i < byteArray.length; i++) {
        str += String.fromCharCode(byteArray[i]);
      }
      var f = builder.plugins.getZipForPlugin(id);
      try { f.remove(true); } catch (e) {} // qqDPS
      f.create(Components.interfaces.nsIFile.NORMAL_FILE_TYPE, 0600);
      var stream = Components.classes["@mozilla.org/network/safe-file-output-stream;1"].
                   createInstance(Components.interfaces.nsIFileOutputStream);
      stream.init(f, 0x04 | 0x08 | 0x20, 0600, 0); // readwrite, create, truncate
      stream.write(str, byteArray.length);
      if (stream instanceof Components.interfaces.nsISafeOutputStream) {
        stream.finish();
      } else {
        stream.close();
      }
      if (f.exists()) {
        builder.plugins.downloadSucceeded(id);
        if (callback) { callback(); }
      } else {
        builder.plugins.downloadFailed(id, null);
      }
    } else {
      builder.plugins.downloadFailed(id, url + " " + _t('plugin_url_not_found'));
    }
  };

  oReq.send(null);
  setTimeout(function() {
    if (loadSucceeded) { return; }
    loadTimedOut = true;
    builder.plugins.downloadFailed(id, _t('plugin_load_timed_out'));
  }, 5000);
};

builder.plugins.downloadSucceeded = function(id) {
  builder.plugins.downloadingCount--;
  if (builder.plugins.downloadingCount == 0) {
    jQuery('#plugins-downloading').hide();
  }
  builder.views.plugins.refresh();
};

builder.plugins.downloadFailed = function(id, e) {
  alert(_t('plugin_download_failed') + (e ? ("\n" + e) : ""));
  builder.plugins.downloadingCount--;
  if (builder.plugins.downloadingCount == 0) {
    jQuery('#plugins-downloading').hide();
  }
  builder.plugins.setInstallState(id, builder.plugins.NOT_INSTALLED, function() {
    builder.views.plugins.refresh();
  });
};

builder.plugins.validatePlugin = function(id, f) {
  try {
    if (!f.exists()) { return _t('plugin_missing_dir', f.path); }
    if (!f.isDirectory()) { return _t('plugin_not_a_dir', f.path); }
    f.append("header.json");
    if (!f.exists()) {
      return _t('plugin_header_missing', f.path);
    }
    if (!f.isFile()) {
      return _t('plugin_header_not_file', f.path);
    }
    var fileData = sebuilder.readFile(f);
    var header = null;
    try {
      header = JSON.parse(fileData);
    } catch (e) {
      return _t('plugin_header_file_corrupted', f.path, e);
    }
    if (!header.headerVersion) {
      return _t('plugin_header_file_no_version', f.path); 
    }
    if (header.headerVersion > builder.plugins.MAX_HEADER_VERSION) {
      return _t('plugin_builder_too_old');
    }
    if (header.identifier != id) {
      return _t('plugin_id_mismatch', header.identifier, id);
    }
    if (!header.pluginVersion || !header.pluginVersion.match(/^[0-9]+([.][0-9]+)*$/)) {
      return _t('plugin_version_invalid');
    }
  } catch (e) {
    return _t('plugin_cant_verify', e);
  }
  return null;
};

builder.plugins.performInstall = function(id, customZipF, done) {
  try {
    var zipF = customZipF ? customZipF : builder.plugins.getZipForPlugin(id);
    if (!zipF.exists()) {
      builder.plugins.startupErrors.push(_t('plugin_unable_to_install', id, _t('plugin_download_failed')));
      builder.plugins.setInstallState(id, builder.plugins.NOT_INSTALLED, done);
      return;
    }
    var installD = builder.plugins.getDirForPlugin(id);
    try { builder.plugins.getExtractForPlugin(id).remove(true); } catch (e) {} // qqDPS
    builder.plugins.createDir(builder.plugins.getExtractForPlugin(id));
    var zipReader = Components.classes["@mozilla.org/libjar/zip-reader;1"]
                    .createInstance(Components.interfaces.nsIZipReader);
    zipReader.open(zipF);
    var entries = zipReader.findEntries("*");
    while (entries.hasMore()) {
      var path = entries.getNext();
      var e = zipReader.getEntry(path);
      var splitPath = path.split("/");
      var f = builder.plugins.getExtractForPlugin(id);
      if (splitPath[0] != id) { continue; }
      for (var i = 1; i < splitPath.length; i++) {
        f.append(splitPath[i]);
      }
      if (e.isDirectory) {
        builder.plugins.createDir(f);
      } else {
        builder.plugins.createDir(f.parent);
        zipReader.extract(path, f);
      }
    }
  
    var validationError = builder.plugins.validatePlugin(id, builder.plugins.getExtractForPlugin(id));
    if (validationError) {
      builder.plugins.startupErrors.push(_t('plugin_unable_to_install', id, "" + validationError));
      builder.plugins.setInstallState(id, builder.plugins.NOT_INSTALLED, done);
      return;
    }
  
    try { installD.remove(true); } catch (e) {} // qqDPS
    builder.plugins.getExtractForPlugin(id).moveTo(installD.parent, installD.leafName);
    builder.plugins.setInstallState(id, builder.plugins.INSTALLED, function() {
      builder.plugins.setEnabledState(id, builder.plugins.ENABLED, done);
    });
  } catch (e) {
    builder.plugins.startupErrors.push(_t('plugin_unable_to_install', id, "" + e));
    builder.plugins.setInstallState(id, builder.plugins.NOT_INSTALLED, done);
  }
};

builder.plugins.performUninstall = function(id, done) {
  try {
    var f = builder.plugins.getDirForPlugin(id);
    if (f.exists()) {
      f.remove(true);
    }
    builder.plugins.setInstallState(id, builder.plugins.NOT_INSTALLED, done);
  } catch (e) {
    builder.plugins.startupErrors.push(_t('plugin_unable_to_uninstall', id, "" + e));
    done();
  }
};

builder.plugins.start = function(callback) {
  sebuilder.getInternalFile("/chrome/content/html/js/builder/bundledPlugins/", function(bundledPluginsDir) {
    builder.plugins.start_2(callback, bundledPluginsDir);
  });
};

builder.plugins.promiseLoop = function(l, stepF) {
  return new Promise(function(resolve, reject) {
    function step(i, l, stepF) {
      if (i >= l.length) {
        resolve(l);
      } else {
        stepF(l[i], function() {
          step(i + 1, l, stepF);
        });
      }
    }
    step(0, l, stepF);
  });
};

builder.plugins.start_2 = function(callback, bundledPluginsDir) {
  builder.plugins.toLoad = [];
  // Start up database connection and ensure table exists.
  Components.utils.import("resource://gre/modules/Sqlite.jsm");
  var dbFile = builder.plugins.getBuilderDir();
  dbFile.append("plugins.sqlite");
  Sqlite.openConnection({ 'path': dbFile.path })
  .then(function(connection) {
    dump("SB: opened plugin DB connection\n");
    builder.plugins.db = connection;
    return builder.plugins.db.tableExists('state');
  }, function(error) { alert("start_2 tableExists DB error " + error ); })
  .then(function(exists) {
    dump("SB: check plugin table exists\n");
    if (exists) {
      return;
    } else {
      return builder.plugins.db.execute("CREATE TABLE state (identifier varchar(255), installState varchar(255), enabledState varchar(255))");
    }
  }, function(error) { alert("start_2 create table DB error " + error ); })
  .then(function() {
    dump("SB: installing bundled plugins\n");
    // Install bundled plugins.
    return builder.plugins.promiseLoop(builder.plugins.bundledPlugins, function(bundledPlugin, done) {
      var id = bundledPlugin.id;
      var version = bundledPlugin.version;
      var isUpdate = true;
      try {
        isUpdate = !builder.plugins.checkMaxVersion(builder.plugins.getInstalledInfo(id).pluginVersion, version);
      } catch (e) {
        // Ignore
      }
      if ((!builder.plugins.pluginExists(id) || isUpdate)) {
        var zipF = bundledPluginsDir.clone();
        zipF.append(id + ".zip");
        builder.plugins.performInstall(id, zipF, done);
      } else {
        done();
      }
    });
  }, function(error) { alert("start_2 install bundled plugins DB error " + error ); })
  .then(function() {
    dump("SB: finding new plugins to install\n");
    // Find new plugins to install.
    return builder.plugins.db.execute("SELECT identifier FROM state WHERE installState = '" + builder.plugins.TO_INSTALL + "'");
  }, function(error) { alert("start_2 find plugins to install DB error " + error ); })
  .then(function(toInstall) {
    dump("SB: installing new plugins\n");
    return builder.plugins.promiseLoop(toInstall, function(installRow, done) {
      builder.plugins.performInstall(installRow.getResultByIndex(0), null, done);
    });
  }, function(error) { alert("start_2 install DB error " + error ); })
  .then(function() {
    dump("SB: finding plugins to update\n");
    // Find plugins to update.
    return builder.plugins.db.execute("SELECT identifier FROM state WHERE installState = '" + builder.plugins.TO_UPDATE + "'");
  }, function(error) { alert("start_2 find plugins to update DB error " + error ); })
  .then(function(toUpdate) {
    dump("SB: updating plugins\n");
    return builder.plugins.promiseLoop(toUpdate, function(updateRow, done) {
      builder.plugins.performInstall(updateRow.getResultByIndex(0), null, done);
    });
  }, function(error) { alert("start_2 update plugins DB error " + error ); })
  .then(function() {
    dump("SB: finding plugins to uninstall\n");
    // Find plugins to uninstall.
    return builder.plugins.db.execute("SELECT identifier FROM state WHERE installState = '" + builder.plugins.TO_UNINSTALL + "'");
  }, function(error) { alert("start_2 find plugins to uninstall DB error " + error ); })
  .then(function(toUninstall) {
    dump("SB: uninstalling plugins\n");
    return builder.plugins.promiseLoop(toUninstall, function(uninstallRow, done) {
      builder.plugins.performUninstall(uninstallRow.getResultByIndex(0), done);
    });
  }, function(error) { alert("start_2 uninstall DB error " + error ); })
  .then(function() {
    // Disable plugins.
    dump("SB: disabling plugins\n");
    return builder.plugins.db.execute("UPDATE state SET enabledState = '" + builder.plugins.DISABLED + "' WHERE enabledState = '" + builder.plugins.TO_DISABLE + "'");
  }, function(error) { alert("start_2 disable DB error " + error ); })
  .then(function() {
    dump("SB: enabling plugins\n");
    // Enable plugins.
    return builder.plugins.db.execute("UPDATE state SET enabledState = '" + builder.plugins.ENABLED + "' WHERE enabledState = '" + builder.plugins.TO_ENABLE + "'");
  }, function(error) { alert("start_2 enable DB error " + error ); })
  .then(function() {
    dump("SB: loading plugins\n");
    // Load plugins
    return new Promise(function(resolve, reject) {
      builder.plugins.getInstalledIDs(resolve);
    });
  }, function(error) { alert("start_2 loadplugins DB error " + error ); }
  ).then(function(installeds) {
    dump("SB: checking plugin versions\n");
    return builder.plugins.promiseLoop(installeds, function(installedID, done) {
      builder.plugins.getState(installedID, function(state) {
        if (state.installState == builder.plugins.INSTALLED && state.enabledState == builder.plugins.ENABLED) {
          var info = builder.plugins.getInstalledInfo(installedID);
          if (info.builderMinVersion && !builder.plugins.checkMinVersion(info.builderMinVersion + "", builder.version)) {
            builder.plugins.setEnabledState(installedID, builder.plugins.DISABLED, function() {
              builder.plugins.startupErrors.push(_t('plugin_disabled_builder_too_old', info.name, info.builderMinVersion, builder.version));
              done();
            });
          } else if (info.builderMaxVersion && !builder.plugins.checkMaxVersion(info.builderMaxVersion + "", builder.version)) {
            builder.plugins.setEnabledState(installedID, builder.plugins.DISABLED, function() {
              builder.plugins.startupErrors.push(_t('plugin_disabled_builder_too_new', info.name, info.builderMaxVersion, builder.version));
              done();
            });
          } else {
            for (var j = 0; j < info.load.length; j++) {
              builder.plugins.toLoad.push(builder.plugins.getResourcePath(installedID, info.load[j]));
            }
            done();
          }
        } else {
          done();
        }
      });
    });
  }, function(error) { alert("start_2 install DB error " + error ); }
  ).then(function() {
    dump("SB: loading plugins\n");
    builder.loader.loadListOfScripts(builder.plugins.toLoad, callback);
  
    // Show any startup errors.
    for (var i = 0; i < builder.plugins.startupErrors.length; i++) {
      alert(builder.plugins.startupErrors[i]);
    }
  });
};

builder.plugins.shutdown = function() {
  for (var i = 0; i < builder.plugins.shutdownFunctions.length; i++) {
    builder.plugins.shutdownFunctions[i]();
  }
  builder.plugins.db.close();
};

builder.registerPreShutdownHook(builder.plugins.shutdown);

builder.plugins.getResourcePath = function(id, relativePath) {
  var els = relativePath.split("/");
  var f = builder.plugins.getDirForPlugin(id);
  for (var i = 0; i < els.length; i++) {
    f.append(els[i]);
  }
  return builder.plugins.ios.newFileURI(f).spec;
};

/**
 * Checks that actualVersion >= minVersion.
 */
builder.plugins.checkMinVersion = function(minVersion, actualVersion) {
  minVersion = (minVersion + "").split(".");
  actualVersion = (actualVersion + "").split(".");
  for (var i = 0; i < Math.max(minVersion.length, actualVersion.length); i++) {
    var min = i >= minVersion.length    ? 0 : minVersion[i];
    var act = i >= actualVersion.length ? 0 : actualVersion[i];
    if (min != "*" && parseInt(act) < parseInt(min)) {
      return false;
    }
    if (min == "*" || parseInt(act) > parseInt(min)) {
      return true;
    }
  }
  return true;
};

/**
 * Checks that actualVersion <= maxVersion.
 */
builder.plugins.checkMaxVersion = function(maxVersion, actualVersion) {
  maxVersion = (maxVersion + "").split(".");
  actualVersion = (actualVersion + "").split(".");
  for (var i = 0; i < Math.max(maxVersion.length, actualVersion.length); i++) {
    var max = i >= maxVersion.length    ? 0 : maxVersion[i];
    var act = i >= actualVersion.length ? 0 : actualVersion[i];
    if (max != "*" && parseInt(act) > parseInt(max)) {
      return false;
    }
    if (max == "*" || parseInt(act) < parseInt(max)) {
      return true;
    }
  }
  return true;
};

builder.plugins.hasUpdates = function(callback) {
  builder.plugins.getListAsync(function(result) {
    for (var i = 0; i < result.length; i++) {
      var info = result[i];
      if (builder.plugins.isUpdateable(info) && !builder.plugins.isPluginTooNew(info) && !builder.plugins.isPluginTooOld(info)) {
        callback(true);
        return;
      }
    }
    callback(false);
  });
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
