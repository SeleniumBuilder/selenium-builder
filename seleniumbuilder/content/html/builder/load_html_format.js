var fc = new sebuilder.FormatCollection(sebuilder.SeleniumIDE.Prefs.DEFAULT_OPTIONS);
var format = fc.findFormat('default');
var tc = new sebuilder.TestCase();
format.saveAs(tc);
