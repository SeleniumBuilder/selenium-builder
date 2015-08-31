/**
 * Dialog that can be inserted to allow the user to export the current script using a variety of formats.
 */
builder.dialogs.exportscript = {};

/** The DOM node into which to insert the dialog, replacing its contents. */
builder.dialogs.exportscript.node = null;
builder.dialogs.exportscript.dialog = null;

builder.dialogs.exportscript.show = function(node) {
  // Don't show dialog if it is open
  if (builder.dialogs.exportscript.dialog) {
    return;
  }
  builder.dialogs.exportscript.node = node;
  builder.dialogs.exportscript.dialog = newNode('div', {'class': 'dialog'});
  jQuery(node).append(builder.dialogs.exportscript.dialog);
  
  var format_list = newNode('ul');
  
  var cancel_b = newNode('a', _t('cancel'), {
    'class': 'button',
    'click': function () {
      builder.dialogs.exportscript.hide();
    },
    'href': '#cancel'
  });
  
  jQuery(builder.dialogs.exportscript.dialog).
      append(newNode('h3', _t('choose_export_format'))).
      append(format_list).
      append(newNode('p', cancel_b));
  
  // Option to overwrite the already-saved file.
  if (builder.getScript().exportpath &&
      builder.getScript().exportpath.where === "local")
  {
    jQuery(format_list).append(create_overwrite_li());
  }
  
  for (var i = 0; i < builder.selenium2.io.formats.length; i++) {
    jQuery(format_list).append(create_sel2_format_li(builder.selenium2.io.formats[i]));
  }
};

builder.dialogs.exportscript.hide = function () {
  jQuery(builder.dialogs.exportscript.dialog).remove();
  builder.dialogs.exportscript.dialog = null;
};

function create_sel2_format_li(myFormat) {
  var script = builder.getScript();
  var nonExportables = myFormat.nonExportables(script);
  if (nonExportables.length > 0) {
    var l = "";
    var max = nonExportables.length > 3 ? 3 : nonExportables.length;
    for (var i = 0; i < max; i++) {
      if (i !== 0) { l += ", "; }
      l += nonExportables[i];
    }
    if (nonExportables.length > 3) {
      l += "...";
    }
    return newNode('li', newNode('strike', myFormat.name), " " + _t('unsupported_steps') + ": " + l);
  }
  var liName = builder.selenium2.io.isSaveFormat(myFormat) ? _t('save_as_X', myFormat.name) : myFormat.name;
  var li_node = newNode('li',
    newNode('a', liName, {
      click: function(event) {
        builder.selenium2.io.saveScript(script, myFormat, null, function(success) {
          if (success) {
            if (builder.selenium2.io.isSaveFormat(myFormat)) {
              builder.suite.setCurrentScriptSaveRequired(false);
            } else {
              builder.suite.broadcastScriptChange();
            }
            builder.gui.suite.update();
          }
        });
        builder.dialogs.exportscript.hide();
      },
      href: '#export-sel2'
    })
  );
  return li_node;
}

/** Creates a li node for overwriting the existing file. */
function create_overwrite_li() {
  var script = builder.getScript();
  var path = script.exportpath;
  return newNode('li', newNode('a', _t('export_as_X_to_Y', path.format.name, path.path), {
    click: function(event) {
      builder.selenium2.io.saveScript(script, path.format, path.path, function(success) {
        if (success) {
          builder.suite.setCurrentScriptSaveRequired(false);
          builder.gui.suite.update();
        }
      });
      builder.dialogs.exportscript.hide();
    },
    href: '#export-overwrite'
  }));
}

builder.dialogs.exportscript.save = function() {
  var script = builder.getScript();
  if (!script.path) {
    builder.dialogs.exportscript.saveAs();
    return;
  }
  builder.selenium2.io.saveScript(script, script.path.format, script.path.path, function(success) {
    if (success) {
      builder.suite.setCurrentScriptSaveRequired(false);
      builder.gui.suite.update();
    }
  });
};

builder.dialogs.exportscript.saveAs = function() {
  var script = builder.getScript();
  builder.selenium2.io.saveScript(script, builder.selenium2.io.formats[0], null, function(success) {
    if (success) {
      builder.suite.setCurrentScriptSaveRequired(false);
      builder.gui.suite.update();
    }
  });
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
