builder.selenium2.io.addLangFormatter({
  name: "Node.JS - Selenium-WebDriver",
  extension: ".js",
  not: "!",
  start:
    "var webdriver = require('selenium-webdriver'),\n" +
    "    By = webdriver.By,\n" +
    "    until = webdriver.until;\n"+
    "var _ = require('underscore');\n"+
    "var VARS = {};\n" +
    "\n" +
    "var globalTimeout = {timeoutSeconds}*1000;\n"+
    "\n" +
    "var driver = new webdriver.Builder()\n" +
    "    .forBrowser('firefox')\n" +
    "    .build();\n" +
    "\n" +
    "driver.controlFlow().on('uncaughtException', function(err) {\n" +
    "    console.log('There was an uncaught exception: ' + err);\n" +
    "});\n" +
    "\n",
  end:
    "\n" +
    "driver.quit();\n",
  lineForType: {
    //--- navigation
    "get" : 
        "driver.get({url}); \n",
    "refresh" : 
        "driver.navigate().refresh(); \n",
    "goBack" : 
        "driver.navigate().back(); \n",
    "goForward" : 
        "driver.navigate().forward(); \n",
    "close" : 
        "driver.quit(); \n",
    //--- input
    "clickElement" : 
        "driver.findElement(By.{locatorBy}({locator})).click(); \n",
    "doubleClickElement" : 
        "driver.actions().doubleClick(driver.findElement(By.{locatorBy}({locator}))).perform(); \n",
    "mouseOverElement" : 
        "driver.actions().mouseMove(driver.findElement(By.{locatorBy}({locator}))).perform(); \n",
    "setElementText" : 
        "driver.findElement(By.{locatorBy}({locator})).clear(); \n" +
        "driver.findElement(By.{locatorBy}({locator})).sendKeys({text}); \n",
    "sendKeysToElement" : 
        "driver.findElement(By.{locatorBy}({locator})).sendKeys({text}); \n",
    "setElementSelected" : 
        "driver.findElement(By.{locatorBy}({locator})).isSelected().then(function(isSelected){  \n" +
        "    if(!isSelected){  \n" +
        "        driver.findElement(By.{locatorBy}({locator})).click(); \n" +
        "    } \n" +
        "}); \n",
    "setElementNotSelected" : 
        "driver.findElement(By.{locatorBy}({locator})).isSelected().then(function(isSelected){ \n" +
        "    if(isSelected){ \n" +
        "        driver.findElement(By.{locatorBy}({locator})).click(); \n" +
        "    } \n" +
        "}); \n",
    "clearSelections" : 
        "",   //clear multi select element
    "submitElement" : 
        "driver.findElement(By.{locatorBy}({locator})).submit(); \n",
    "dragToAndDropElement" : 
        "",   //{locator}-{targetLocator}
    "clickAndHoldElement" : 
        "driver.actions().mouseDown(driver.findElement(By.{locatorBy}({locator}))).perform(); \n",
    "releaseElement" : 
        "driver.actions().mouseUp(driver.findElement(By.{locatorBy}({locator}))).perform(); \n",
    //--- misc
    "addCookie" : 
        "driver.manage().addCookie({name}, {value}); \n", //path & max_age?
    "deleteCookie" : 
        "driver.manage().deleteCookie({name}); \n",
    "saveScreenshot" : 
        "driver.takeScreenshot().then(function (image, err) { \n" +
        "    require('fs').writeFile({file}, image, 'base64'); \n" +
        "}); \n",
    "print" : 
        "driver.controlFlow().execute(function () { console.log({text}); }); \n",
    "pause" : 
        "driver.sleep({waitTime}); \n",
    "switchToFrame" : 
        "driver.switchTo().frame({identifier}); \n",
    "switchToFrameByIndex" : 
        "driver.switchTo().frame({index}); \n",
    "switchToWindow" : 
        "driver.switchTo().window({name}); \n",
    "switchToWindowByIndex" : 
        "driver.getAllWindowHandles().then(function(handlesArray){ \n" +
        "    driver.switchTo().window(handlesArray[{index}]); \n" +
        "}); \n",
    "switchToDefaultContent" : 
        "driver.switchTo().defaultContent(); \n",
    "answerAlert": 
        "driver.switchTo().alert().sendKeys({text}); \n",
    "acceptAlert" : 
        "driver.switchTo().alert().accept(); \n",
    "dismissAlert" : 
        "driver.switchTo().alert().dismiss(); \n",
    "setWindowSize" : 
        "driver.manage().window().setSize({width}, {height}); \n",
	//--- store
	"store":
        "driver.controlFlow().execute(function () {  ${{variable}} = '' + {text}; }); \n",
  },
  assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "{getter}\n" +
        "    if (_.isEqual({value},{cmp})) {\n" +
        "        driver.quit();\n" +
        "        throw new Error('!{stepTypeName} failed');\n" +
        "    }\n" +
        "{getterFinish}\n", getter);
    } else {
      return doSubs(
        "{getter}\n" +
        "    if (!_.isEqual({value}, {cmp})) {\n" +
        "        driver.quit();\n" +
        "        throw new Error('{stepTypeName} failed');\n" +
        "    }\n" +
        "{getterFinish}\n", getter);
    }
  },
  verify: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "{getter}\n" +
        "    if (_.isEqual({value}, {cmp})) {\n" +
        "        console.log('!{stepTypeName} failed');\n" +
        "    }\n" +
        "{getterFinish}\n", getter);
    } else {
      return doSubs(
        "{getter}\n" +
        "    if (!_.isEqual({value}, {cmp})) {\n" +
        "        console.log('{stepTypeName} failed');\n" +
        "    }\n" +
        "{getterFinish}\n", getter);
    }
  },
  waitFor: function(step, escapeValue, doSubs, getter) {
    return doSubs(
        "driver.wait(function(){ \n" +
        "    return {getter} \n" +
        "        return ({negNot}_.isEqual({value}, {cmp})); \n" +
        "    {getterFinish} \n" +
        "}, globalTimeout); \n", getter);
  },
  store:
    "{getter}\n" +
    "    ${{variable}} = {value};\n" +
    "{getterFinish}\n",
  boolean_assert:
    "{getter}\n" +
    "    if ({posNot}{value}) {\n" +
    "        driver.quit();\n" +
    "        throw new Error('{negNot}{stepTypeName} failed');\n" +
    "    }\n" +
    "{getterFinish}\n",
  boolean_verify:
    "{getter}\n" +
    "    if ({posNot}{value}) {\n" +
    "        driver.quit();\n" +
    "        console.log('{negNot}{stepTypeName} failed');\n" +
    "    }\n" +
    "{getterFinish}\n",
  boolean_waitFor: "",
  boolean_store:
    "{getter}\n" +
    "    ${{variable}} = {value};" +
    "{getterFinish}\n",
  boolean_getters: {
    "TextPresent": {
      getter: "driver.findElement(By.tagName('html')).getText().then(function (text) {\n" +
      "    var hasText = text.indexOf({text}) !== -1;",
      getterFinish: "});",
      value: "hasText"
    },
    "ElementPresent": {
      getter: "driver.isElementPresent(driver.findElement(By.{locatorBy}({locator}))).then(function (isPresent) {",
      getterFinish: "});",
      value: "isPresent"
    },
    "ElementSelected": {
      getter: "driver.findElement(By.{locatorBy}({locator})).isSelected().then(function (isSelected) {",
      getterFinish: "});",
      value: "isSelected"
    },
    "CookiePresent": {
      getter: "driver.manage().getCookie({name}).then(function (cookie) {\n" +
      "    var hasCookie = (cookie !== null);",
      getterFinish: "});",
      value: "hasCookie"
    },
    "AlertPresent": { 
      getter: "driver.switchTo().alert().thenCatch(function (e) {\n" +
      "    var hasAlert = (e.code !== 27);",
      getterFinish: "});",
      value: "hasAlert"
    }
  },
  getters: {
    "BodyText": {
      getter: "driver.findElement(By.tagName('html')).getText().then(function (text) {",
      getterFinish: "});",
      cmp: "{text}",
      value: "text"
    },
    "PageSource": {
      getter: "driver.getPageSource().then(function (source) {",
      getterFinish: "});",
      cmp: "{source}",
      value: "source"
    },
    "CurrentUrl": {
      getter: "driver.getCurrentUrl().then(function (url) {",
      getterFinish: "});",
      cmp: "{url}",
      value: "url"
    },
    "Title": {
      getter: "driver.getTitle().then(function (title) {",
      getterFinish: "});",
      cmp: "{title}",
      value: "title"
    },
    "Text": {
      getter: "driver.findElement(By.{locatorBy}({locator})).getText().then(function (text) {",
      getterFinish: "});",
      cmp: "{text}",
      value: "text"
    },
    "ElementValue": {
      getter: "driver.findElement(By.{locatorBy}({locator})).getAttribute('value').then(function (value) {",
      getterFinish: "});",
      cmp: "{value}",
      value: "value"
    },
    "ElementAttribute": {
      getter: "driver.findElement(By.{locatorBy}({locator})).getAttribute({attributeName}).then(function (value) {",
      getterFinish: "});",
      cmp: "{value}",
      value: "value"
    },
    "ElementStyle": {
      getter: "driver.findElement(By.{locatorBy}({locator})).getCssValue({propertyName}).then(function (value) {",
      getterFinish: "});",
      cmp: "{value}",
      value: "value"
    },
    "CookieByName": {
      getter: "driver.manage().getCookie({name}).then(function (cookie) {",
      getterFinish: "});",
      cmp: "{value}",
      value: "cookie"
    },
    "AlertText": {
      getter: "driver.switchTo().alert().getText().then(function (text) {",
      getterFinish: "});",
      cmp: "{text}",
      value: "text"
    },
    "Eval": {
      getter: "driver.executeScript({script}).then(function (value) {",
      getterFinish: "});",
      cmp: "{value}",
      value: "value"
    }
  },

  locatorByForType: function(stepType, locatorType, locatorIndex) {
    if(locatorType === "id"){ return "id"; }
    if(locatorType === "name"){ return "name"; }
    if(locatorType === "link text"){ return "linkText"; }
    if(locatorType === "css selector"){ return "css"; }
    if(locatorType === "xpath"){ return "xpath"; }
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
  usedVar: function(varName, varType) { return "VARS." + varName; },
  unusedVar: function(varName, varType) { return "VARS." + varName; }
});


if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
