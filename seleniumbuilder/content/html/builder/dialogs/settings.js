/** Script settings dialog. */

builder.dialogs.settings = {};
builder.dialogs.settings.dialog = null;

builder.dialogs.settings.show = function() {
  if (builder.dialogs.settings.dialog) { return; }
  builder.dialogs.settings.dialog = newNode('div', {'class': 'dialog'});
  
  jQuery(builder.dialogs.settings.dialog)
    .append(newNode('h4', _t('script_settings')))
    .append(newNode('div', _t('timeout_seconds'), " ", newNode('input', {'type': 'text', 'id': 'timeout-seconds', 'value': builder.getScript().timeoutSeconds})));
  
  var okB = newNode('a', _t('ok'), {
      'class': 'button',
      'click': function() {
        builder.getScript().timeoutSeconds = parseInt(jQuery('#timeout-seconds').val()) || builder.getScript().timeoutSeconds;
        builder.dialogs.settings.hide();
      }
  });
  
  var cB = newNode('a', _t('cancel'), {
      'class': 'button',
      'click': function() {
        builder.dialogs.settings.hide();
      }
  });
  
  jQuery(builder.dialogs.settings.dialog).append(newNode('p', okB, cB));
  
  builder.dialogs.show(builder.dialogs.settings.dialog);
};

builder.dialogs.settings.hide = function() {
  jQuery(builder.dialogs.settings.dialog).remove();
  builder.dialogs.settings.dialog = null;
};

if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }