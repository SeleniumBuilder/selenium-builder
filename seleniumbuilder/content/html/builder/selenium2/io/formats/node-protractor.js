builder.selenium2.io.addLangFormatter({
	name: "Node.JS - Protractor",

	start: "describe('Selenium Test Case', function() {\n" +
		"  it('should execute test case without errors', function() {\n" +
		"    var text, value, bool, source, url, title;\n" +
		"    var TestVars = {};\n",

	end: "  });\n" +
		"});\n",

	lineForType: {
		"print": "    console.log({text});\n",
		"pause": "    // TODO: pause: {waitTime}. use browser.sleep({waitTime}).then(function() {});\n",
		"get": "    browser.get({url});\n",
		"goBack": "    browser.navigate().back();\n",
		"goForward": "    browser.navigate().forward();\n",
		"close": "    browser.navigate().close();\n",
		"refresh": "    navigate.refresh();\n",
		"store": "    TestVars.{{variable}} = '' + {text};\n",
		"clickElement": "    element(by.{locatorBy}({locator})).click();\n",
		"setElementText": "    element(by.{locatorBy}({locator})).sendKeys({text});\n",
		"doubleClickElement": "    element(by.{locatorBy}({locator})).click();\n" +
			"    element(by.{locatorBy}({locator})).click();\n",
		"mouseOverElement": "    // TODO: mouseOverElement: {locator}",
		"dragAndDropElement": "    var target = element(by.{targetLocatorBy}({targetLocator}).find();\n" +
			"    browser.actions().dragAndDrop(element(by.{locatorBy}({locator}).find(), {x: target.clientX, y: target.clientY}).perform();\n",
		"clickAndHoldElement": "    // TODO: clickAndHoldElement: {locator}\n",
		"releaseElement": "    // TODO: releaseElement: {locator}\n",
		"sendKeysToElement": "    element(by.{locatorBy}({locator}).sendKeys({keys});\n",
		"setElementSelected": "    // TODO: setElementSelected: {locator}",
		"setElementNotSelected": "    // TODO: setElementNotSelected: {locator}",
		"addCookie": "    browser.evaluate('document.cookie = \"{name} = {value};{options}\"');\n",
		"deleteCookie": "    browser.evaluate('document.cookie = \"{name}=\"');\n",
		"saveScreenshot": "    takeScreenshot();\n",
		"switchToFrame": "    browser.switchTo.frame({identifier});\n",
		"switchToFrameByIndex": "    browser.switchTo.frameByIndex({index});\n",
		"switchToWindow": "    browser.switchTo.window({name});\n",
		"switchToDefaultContent": "    browser.switchTo.defaultContent();\n",
		"answerAlert": "    browser.switchTo().alert().sendKeys({text});\n",
		"acceptAlert": "    browser.switchTo().alert().accept();\n",
		"dismissAlert": "    browser.switchTo().alert().dismiss();\n",
		"submitElement": "    element(by.{locatorBy}({locator}).submit();\n"
	},
	waitFor: "    // TODO: waitFor: {expression}\n",
	assert: function (step, escapeValue, doSubs, getter) {
		if (step.negated) {
			return doSubs(
				"{getter}" +
					"    expect({value}).not.toContain(\"\" + {cmp});\n" +
					"{getterFinish}", getter);
		} else {
			return doSubs(
				"{getter}" +
					"    expect({value}).toContain(\"\" + {cmp});\n" +
					"{getterFinish}", getter);
		}
	},
	verify: function (step, escapeValue, doSubs, getter) {
		if (step.negated) {
			return doSubs(
				"{getter}" +
					"    expect({value}).not.toContain(\"\" + {cmp});\n" +
					"{getterFinish}", getter);
		} else {
			return doSubs(
				"{getter}" +
					"    expect({value}).toContain(\"\" + {cmp});\n" +
					"{getterFinish}", getter);
		}
	},
	store: "{getter}" +
		"    TestVars.{{variable}} = {value};\n" +
		"{getterFinish}",
	boolean_assert: function (step, escapeValue, doSubs, getter) {
		if (step.negated) {
			return doSubs(
				"{getter}" +
					"    expect({value}).toBe(false);\n" +
					"{getterFinish}", getter);
		} else {
			return doSubs(
				"{getter}" +
					"    expect({value}).toBe(true);\n" +
					"{getterFinish}", getter);
		}
	},
	boolean_verify: function (step, escapeValue, doSubs, getter) {
		if (step.negated) {
			return doSubs(
				"{getter}" +
					"      expect({value}).toBe(false);\n" +
					"{getterFinish}", getter);
		} else {
			return doSubs(
				"{getter}" +
					"      expect({value}).toBe(true);\n" +
					"{getterFinish}", getter);
		}
	},
	boolean_waitFor: "",
	boolean_store: "{getter}" +
		"    TestVars.{{variable}} = {value};\n" +
		"{getterFinish}",
	boolean_getters: {
		"ElementPresent": {
			getter: "    bool = isElementPresent(by.{locatorBy}({locator}));\n",
			getterFinish: "",
			value: "bool"
		},
		"ElementSelected": {
			getter: "    bool = isElementSelected(by.{locatorBy}({locator}));\n",
			getterFinish: "",
			value: "bool"
		},
		"CookiePresent": {
			getter: "    browser.manage().getCookie({name}).then(function(cookie) {;\n" +
				"        var hasCookie = cookie && (cookie.name === {name});\n",
			getterFinish: "    });\n",
			value: "hasCookie"
		},
		"AlertPresent": {
			getter: "    browser.switchTo().alert().then(function(alertDialog) {\n" +
				"        var bool = !!alertDialog;\n",
			getterFinish: "    };\n",
			value: "bool"
		}
	},
	getters: {
		"TextPresent": {
			getter: "    text = element(by.tagName('html')).getText();\n",
			getterFinish: "",
			cmp: "{text}",
			value: "text"
		},
		"BodyText": {
			getter: "    text = element(by.tagName('html')).getText();\n",
			getterFinish: "",
			cmp: "{text}",
			value: "text"
		},
		"PageSource": {
			getter: "    source = getPageSource();\n",
			getterFinish: "",
			cmp: "{source}",
			value: "source"
		},
		"Text": {
			getter: "    text = element(by.{locatorBy}({locator})).getText();\n  ",
			getterFinish: "",
			cmp: "{text}",
			value: "text"
		},
		"CurrentUrl": {
			getter: "    url = getCurrentUrl();\n",
			getterFinish: "",
			cmp: "{url}",
			value: "url"
		},
		"Title": {
			getter: "    title = getTitle();\n",
			getterFinish: "",
			cmp: "{title}",
			value: "title"
		},
		"ElementValue": {
			getter: "    value = element(by.{locatorBy}({locator})).getAttribute('value');\n",
			getterFinish: "",
			cmp: "{value}",
			value: "value"
		},
		"ElementAttribute": {
			getter: "    value = element(by.{locatorBy}({locator})).getAttribute({attributeName});\n",
			getterFinish: "",
			cmp: "{value}",
			value: "value"
		},
		"CookieByName": {
			getter: "    browser.manage().getCookie({name}).then(function(cookie) {\n",
			getterFinish: "    });\n",
			cmp: "{value}",
			value: "cookie"
		},
		"AlertText": {
			getter: "    var text = browser.switchTo().alert().getText();\n",
			getterFinish: "    };\n",
			cmp: "{text}",
			value: "text"
		}
	},

	locatorByForType: function (stepType, locatorType) {
		switch (locatorType) {
			case "xpath":
				return "xpath";
			case "id":
				return "id";
			case "css selector":
				return "css";
			case "link text":
				return "linkText";
			case "class":
				return "className";
			case "name":
				return "name";
		}

		// unknown locator type
		return "unknownLocatorType";
	},

	/**
	 * Processes a parameter value into an appropriately escaped expression. Mentions of variables
	 * with the ${foo} syntax are transformed into expressions that concatenate the variables and
	 * literals.
	 * For example:
	 * a${b}c
	 * becomes:
	 * "a" + b + "c"
	 */
	escapeValue: function(stepType, value, pName) {
	  var keysMap = {
	    "NULL": "\\uE000",
	    "CANCEL": "\\uE001",
	    "HELP": "\\uE002",
	    "BACK_SPACE": "\\uE003",
	    "TAB": "\\uE004",
	    "CLEAR": "\\uE005",
	    "RETURN": "\\uE006",
	    "ENTER": "\\uE007",
	    "SHIFT": "\\uE008",
	    "LEFT_SHIFT": "\\uE008",
	    "CONTROL": "\\uE009",
	    "LEFT_CONTROL": "\\uE009",
	    "ALT": "\\uE00A",
	    "LEFT_ALT": "\\uE00A",
	    "PAUSE": "\\uE00B",
	    "ESCAPE": "\\uE00C",
	    "SPACE": "\\uE00D",
	    "PAGE_UP": "\\uE00E",
	    "PAGE_DOWN": "\\uE00F",
	    "END": "\\uE010",
	    "HOME": "\\uE011",
	    "LEFT": "\\uE012",
	    "ARROW_LEFT": "\\uE012",
	    "UP": "\\uE013",
	    "ARROW_UP": "\\uE013",
	    "RIGHT": "\\uE014",
	    "ARROW_RIGHT": "\\uE014",
	    "DOWN": "\\uE015",
	    "ARROW_DOWN": "\\uE015",
	    "INSERT": "\\uE016",
	    "DELETE": "\\uE017",
	    "SEMICOLON": "\\uE018",
	    "EQUALS": "\\uE019",
	    "NUMPAD0": "\\uE01A",
	    "NUMPAD1": "\\uE01B",
	    "NUMPAD2": "\\uE01C",
	    "NUMPAD3": "\\uE01D",
	    "NUMPAD4": "\\uE01E",
	    "NUMPAD5": "\\uE01F",
	    "NUMPAD6": "\\uE020",
	    "NUMPAD7": "\\uE021",
	    "NUMPAD8": "\\uE022",
	    "NUMPAD9": "\\uE023",
	    "MULTIPLY": "\\uE024",
	    "ADD": "\\uE025",
	    "SEPARATOR": "\\uE026",
	    "SUBTRACT": "\\uE027",
	    "DECIMAL": "\\uE028",
	    "DIVIDE": "\\uE029",
	    "F1": "\\uE031",
	    "F2": "\\uE032",
	    "F3": "\\uE033",
	    "F4": "\\uE034",
	    "F5": "\\uE035",
	    "F6": "\\uE036",
	    "F7": "\\uE037",
	    "F8": "\\uE038",
	    "F9": "\\uE039",
	    "F10": "\\uE03A",
	    "F11": "\\uE03B",
	    "F12": "\\uE03C",
	    "META": "\\uE03D",
	    "COMMAND": "\\uE03D",
	    "ZENKAKU_HANKAKU": "\\uE040"
	  };

	  if (stepType.name.startsWith("store") && pName == "variable") { return value; }
	  if (stepType.name == "switchToFrameByIndex" && pName == "index") { return value; }
	  // This function takes a string literal and escapes it and wraps it in quotes.
	  var esc = function(v) { return "\"" + v.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\""; };

	  // Don't escape numerical values.
	  if (stepType == builder.selenium2.stepTypes.pause) {
	    esc = function(v) { return v; };
	  }

	  // The following is a transducer that produces the escaped expression by going over each
	  // character of the input.
	  var output = "";       // Escaped expression.
	  var lastChunk = "";    // Accumulates letters of the current literal.
	  var hasDollar = false; // Whether we've just encountered a $ character.
	  var insideVar = false; // Whether we are reading in the name of a variable.
	  var varName = "";      // Accumulates letters of the current variable.
	  var hasBang = false;   // Whether we've just encountered a ! character.
	  var insideKey = false; // Whether we're reading a key escape sequence.
	  var keyName = "";      // Accumulates letters of the current key.
	
	  for (var i = 0; i < value.length; i++) {
	    var ch = value.substring(i, i + 1);
	    if (insideVar) {
	      if (ch == "}") {
	        // We've finished reading in the name of a variable.
	        // If this isn't the start of the expression, use + to concatenate it.
	        if (output.length > 0) { output += " + "; }
	        output += "VARS." + varName;
	        insideVar = false;
	        hasDollar = false;
	        varName = "";
	      } else {
	        // This letter is part of the name of the variable we're reading in.
	        varName += ch;
	      }
	    } else if (insideKey) {
	      if (ch == "}") {
	        // We've finished reading in the name of a key.
	        // If this isn't the start of the expression, use + to concatenate it.
	        if (output.length > 0) { output += " + "; }
	        output += "\"" + keysMap[keyName] + "\"";
	        insideKey = false;
	        hasBang = false;
	        keyName = "";
	      } else {
	        // This letter is part of the name of the key we're reading in.
	        keyName += ch;
	      }
	    } else {
	      // We're not currently reading in the name of a variable.
	      if (hasDollar) {
	        // But we *have* just encountered a $, so if this character is a {, we are about to
	        // do a variable.
	        if (ch == "{") {
	          insideVar = true;
	          if (lastChunk.length > 0) {
	            // Add the literal we've read in to the text.
	            if (output.length > 0) { output += " + "; }
	            output += esc(lastChunk);
	          }
	          lastChunk = "";
	        } else {
	          // No, it was just a lone $.
	          hasDollar = false;
	          lastChunk += "$" + ch;
	        }
	      } else if (hasBang) {
	        // But we *have* just encountered a !, so if this character is a {, we are about to
	        // do a key.
	        if (ch == "{") {
	          insideKey = true;
	          if (lastChunk.length > 0) {
	            // Add the literal we've read in to the text.
	            if (output.length > 0) { output += " + "; }
	            output += esc(lastChunk);
	          }
	          lastChunk = "";
	        } else {
	          // No, it was just a lone !.
	          hasBang = false;
	          lastChunk += "!" + ch;
	        }
	      } else {
	        // This is the "normal case" - accumulating the letters of a literal. Unless the letter
	        // is a $, in which case this may be the start of a variable. Or a !, in which case it
	        // may be part of a key.
	        if (ch == "$") {
	          hasDollar = true;
	        } else if (ch == "!") {
	          hasBang = true;
	        } else {
	          lastChunk += ch;
	        }
	      }
	    }
	  }
	  // Append the final literal, if any, to the output.
	  if (lastChunk.length > 0) {
	    if (output.length > 0) { output += " + "; }
	    output += esc(lastChunk);
	  }
	  return output;
    },
	usedVar: function (varName, varType) {
		return "VARS." + varName;
	},
	unusedVar: function (varName, varType) {
		return "VARS." + varName;
	}
});



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
