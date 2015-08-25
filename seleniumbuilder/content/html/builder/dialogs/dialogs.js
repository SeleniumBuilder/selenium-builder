// Set up dialogs namespace.
builder.dialogs = {};

builder.dialogs.show = function(dialogNode) {
  jQuery("#dialog-attachment-point").append(dialogNode);
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }