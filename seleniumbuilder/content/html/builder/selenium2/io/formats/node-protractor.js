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
	escapeValue: function (stepType, value, pName) {
		if (stepType.name.startsWith("store") && pName == "variable") {
			return value;
		}
		if (stepType.name == "switchToFrameByIndex" && pName == "index") {
			return value;
		}
		// This function takes a string literal and escapes it and wraps it in quotes.
		var esc = function (v) {
			return "\"" + v.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\"";
		};

		// Don't escape numerical values.
		if (stepType == builder.selenium2.stepTypes.pause) {
			esc = function (v) {
				return v;
			};
		}

		// The following is a transducer that produces the escaped expression by going over each
		// character of the input.
		var output = "";       // Escaped expression.
		var lastChunk = "";    // Accumulates letters of the current literal.
		var hasDollar = false; // Whether we've just encountered a $ character.
		var insideVar = false; // Whether we are reading in the name of a variable.
		var varName = "";      // Accumulates letters of the current variable.
		for (var i = 0; i < value.length; i++) {
			var ch = value.substring(i, i + 1);
			if (insideVar) {
				if (ch == "}") {
					// We've finished reading in the name of a variable.
					// If this isn't the start of the expression, use + to concatenate it.
					if (output.length > 0) {
						output += " + ";
					}
					output += "VARS." + varName;
					insideVar = false;
					hasDollar = false;
					varName = "";
				} else {
					// This letter is part of the name of the variable we're reading in.
					varName += ch;
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
							if (output.length > 0) {
								output += " + ";
							}
							output += esc(lastChunk);
						}
						lastChunk = "";
					} else {
						// No, it was just a lone $.
						hasDollar = false;
						lastChunk += "$" + ch;
					}
				} else {
					// This is the "normal case" - accumulating the letters of a literal. Unless the letter
					// is a $, in which case this may be the start of a
					if (ch == "$") {
						hasDollar = true;
					} else {
						lastChunk += ch;
					}
				}
			}
		}
		// Append the final literal, if any, to the output.
		if (lastChunk.length > 0) {
			if (output.length > 0) {
				output += " + ";
			}
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
