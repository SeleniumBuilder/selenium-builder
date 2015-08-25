builder.dialogs.inputs = {};

builder.dialogs.inputs.dialog = null;
builder.dialogs.inputs.types = ['string', 'int'];
builder.dialogs.inputs.entryIndex = 0;

builder.dialogs.inputs.refreshTable = function(input_table) {
  var inputs = builder.getScript().inputs;
  builder.dialogs.inputs.entryIndex = 0;
  jQuery(input_table).html('');
  for (var i = 0; i < inputs.length; i++) {
    jQuery(input_table).append(builder.dialogs.inputs.makeInputEntry(builder.dialogs.inputs.entryIndex, inputs[i][0], inputs[i][1]));
    builder.dialogs.inputs.wireInputEntry(builder.dialogs.inputs.entryIndex, inputs[i][1]);
    builder.dialogs.inputs.entryIndex++;
  }
};

builder.dialogs.inputs.wireInputEntry = function(i, selectedType) {
  for (var j = 0; j < builder.dialogs.inputs.types.length; j++) {
    var type = builder.dialogs.inputs.types[j];
    if (type == selectedType) {
      jQuery('#inpute_type_' + i).append(newNode('option', {'value': type, 'selected': 'true'}, _t(type)));
    } else {
      jQuery('#inpute_type_' + i).append(newNode('option', {'value': type}, _t(type)));
    }
  }
};

builder.dialogs.inputs.makeInputEntry = function(i, name, type) {
  var n = newNode('tr', { 'id': 'inpute_' + i },
    newNode('td', newNode('input', { 'id': 'inpute_name_' + i, 'type': 'text', 'value': name})),
    newNode('td', newNode('select', { 'id': 'inpute_type_' + i })),
    newNode('td', newNode('a', { 'class': 'button smallbutton', 'click': function() {
      jQuery('#inpute_' + i).remove();
    }}, "X"))
  );
  return n;
};

builder.dialogs.inputs.save = function() {
  var inputs = [];
  for (var i = 0; i < builder.dialogs.inputs.entryIndex; i++) {
    var name = jQuery('#inpute_name_' + i).val();
    var type = jQuery('#inpute_type_' + i).val();
    if (name && type) {
      inputs.push([name, type]);
    }
  }
  builder.getScript().inputs = inputs;
};

builder.dialogs.inputs.show = function() {
  builder.dialogs.inputs.dialog = newNode('div', {'class': 'dialog'});
  
  var input_table = newNode('table');
          
  var add_b = newNode('a', '+', {
    'class': 'button smallbutton',
    'click': function () {
      jQuery(input_table).append(builder.dialogs.inputs.makeInputEntry(builder.dialogs.inputs.entryIndex, "", 'string'));
      builder.dialogs.inputs.wireInputEntry(builder.dialogs.inputs.entryIndex, 'string');
      jQuery('#inpute_name_' + builder.dialogs.inputs.entryIndex).focus();
      builder.dialogs.inputs.entryIndex++;
    }
  });
  
  var cancel_b = newNode('a', _t('cancel'), {
    'class': 'button',
    'click': function () {
      builder.dialogs.inputs.hide();
    }
  });
  
  var ok_b = newNode('a', _t('ok'), {
    'class': 'button',
    'click': function () {
      builder.dialogs.inputs.save();
      builder.dialogs.inputs.hide();
    }
  });
  
  jQuery(builder.dialogs.inputs.dialog).
      append(newNode('h3', _t('inputs'))).
      append(input_table).
      append(newNode('p', add_b, cancel_b, ok_b));
  
  builder.dialogs.show(builder.dialogs.inputs.dialog);
  builder.dialogs.inputs.refreshTable(input_table);
};

builder.dialogs.inputs.hide = function() {
  jQuery(builder.dialogs.inputs.dialog).remove();
};

if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }