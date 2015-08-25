var fc = new bridge.FormatCollection(bridge.SeleniumIDE.Prefs.DEFAULT_OPTIONS);
var format = fc.findFormat('default');
var tc = new bridge.TestCase();
format.saveAs(tc);
