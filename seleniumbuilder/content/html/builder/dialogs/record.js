/**
 * Dialog that can be inserted to allow the user to choose an URL to record an additional script
 * from.
 */
builder.dialogs.record = {};

/** The DOM node into which to insert the dialog. */
builder.dialogs.record.node = null;
builder.dialogs.record.dialog = null;
  
/**
 * Insert a record dialog.
 * @param node The DOM node into which to insert the dialog.
 */
builder.dialogs.record.show = function (node) {
  builder.dialogs.record.node = node;
  builder.dialogs.record.dialog = newNode('div', {'class': 'dialog'});
  jQuery(builder.dialogs.record.dialog).append(newNode('form', {method:'get', action:'#record'},
      newNode('p',
          newNode('h3', _t('start_recording_new_script_at')),
          newNode('input', {id:'startup-url-2', type:'text', 'class':'texta', size:'24'}),
          newNode('p', {},
            newNode('input', {type:'submit', value:_t('menu_record'), 'class':'button',
              click: function(e) {
                var deleteCookies = jQuery("#dialog-delete-cookies").prop("checked");
                sebuilder.prefManager.setBoolPref("extensions.seleniumbuilder3.clearCookies", deleteCookies);
                builder.record.startRecording(jQuery("#startup-url-2").val(), builder.selenium2, deleteCookies);
                node.html('');
              }}),
            newNode('a', _t('cancel'), {
                'class': 'button',
                'click': function () {
                  node.html('');
                },
                'href': '#cancel'
            })
          ),
          newNode('p',
            newNode('input',
                sebuilder.prefManager.getBoolPref("extensions.seleniumbuilder3.clearCookies")
                ? {'type': 'checkbox', 'id': 'dialog-delete-cookies', 'checked': 'checked'}
                : {'type': 'checkbox', 'id': 'dialog-delete-cookies'}
            ),
            newNode('label', {'class':'cookie-warning', 'for': 'dialog-delete-cookies'}, _t('cookie_warning'))
          )
      )
  ));
  builder.dialogs.record.node.append(builder.dialogs.record.dialog);
  jQuery('#startup-url-2').val(builder.pageState.currentUrl);
};

builder.dialogs.record.hide = function () {
  jQuery(builder.dialogs.record.dialog).remove();
};



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
