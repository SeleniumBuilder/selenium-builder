builder.views.booting = {};

builder.views.booting.show = function () {
  jQuery('#booting').show();
};

builder.views.booting.hide = function () {
  jQuery('#booting').hide();
};

// We start out in the booting view.
builder.gui.switchView(builder.views.booting);


if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }