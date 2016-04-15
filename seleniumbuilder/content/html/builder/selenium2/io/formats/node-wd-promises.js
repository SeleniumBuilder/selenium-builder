builder.selenium2.io.addLangFormatter({
  name: "Node.JS - WD with Promises",
  extension: ".js",
  not: "!",
  start:
    "var wd = require('wd')\n" +
    "  , chai = require('chai')\n" +
    "  , chaiAsPromised = require('chai-as-promised');\n" +
    "chai.use(chaiAsPromised);\n" +
    "chai.should();\n" +
    "chaiAsPromised.transferPromiseness = wd.transferPromiseness;\n" +
    "var VARS = {};\n" +
    "var b = wd.promiseChainRemote();\n" +
    "b.init({browserName:'firefox'})\n",
  end:
    ".fin(function() { return b.quit() })\n" +
    ".done();",
  lineForType: {
    "print":
      ".then(function () { console.log({text}); })\n",
    "pause":
      ".delay({waitTime})\n",
    "get":
      ".get({url})\n",
    "goBack":
      ".back()\n",
    "goForward":
      ".forward()\n",
    "store":
      ".then(function () { ${{variable}} = '' + {text}; })\n",
    "clickElement":
      ".elementBy{locatorBy}({locator}).click()\n",
    "setElementText":
      ".elementBy{locatorBy}({locator}).clear().type({text})\n",
    "doubleClickElement":
      ".elementBy{locatorBy}({locator}).moveTo(0, 0).doubleClick()\n",
    "mouseOverElement":
      ".elementBy{locatorBy}({locator}).moveTo(0, 0)\n",
    "clickAndHoldElement":
      ".elementBy{locatorBy}({locator}).moveTo(0, 0).buttonDown()\n",
    "releaseElement":
      ".elementBy{locatorBy}({locator}).moveTo(0, 0).buttonUp()\n",
    "sendKeysToElement":
      ".elementBy{locatorBy}({locator}).type({text})\n",
    "setElementSelected":
      ".elementBy{locatorBy}({locator})\n" +
      ".then(function (el) { b.isSelected(el)\n" +
      "  .then(function (isSelected) {\n" +
      "    if (!isSelected) {\n" +
      "      b.clickElement(el);\n" +
      "    }\n" +
      "  });\n" +
      "})\n",
    "setElementNotSelected":
      ".elementBy{locatorBy}({locator})\n" +
      ".then(function (el) { b.isSelected(el)\n" +
      "  .then(function (isSelected) {\n" +
      "    if (isSelected) {\n" +
      "      b.clickElement(el);\n" +
      "    }\n" +
      "  });\n" +
      "})\n",
    "close":
      "",
    "refresh":
      ".refresh()\n",
    "addCookie":
      function(step, escapeValue) {
        var data = {value: step.value, name: step.name};
        step.options.split("/").forEach(function(entry) {
          var entryArr = entry.split("=");
          data[entryArr[0]] = entryArr[1];
        });
        return ".setCookie(" + JSON.stringify(data) + ")\n";
      },
    "deleteCookie":
      ".deleteCookie({name})\n",
    "saveScreenshot":
      ".takeScreenshot()\n" +
      ".then(function (base64Image) {\n" +
      "  var decodedImage = new Buffer(base64Image, 'base64');\n" +
      "  fs.writeFile(path.resolve(__dirname, 'screenShot' + uuid.create() + '.png'), decodedImage, function write(err) { if (err) throw err; });\n" +
      "})\n",
    "switchToFrame":
      ".frame({identifier})\n",
    "switchToFrameByIndex":
      ".frame({index})\n",
    "switchToWindow":
      ".window({name})\n",
    "answerAlert":
      ".alertKeys({text}).acceptAlert()\n",
    "acceptAlert":
      ".acceptAlert()\n",
    "dismissAlert":
      ".dismissAlert()\n",
    "submitElement":
      ".elementBy{locatorBy}({locator}).submit(el)\n",
    "assertTextPresent":
      ".elementByTagName('html').text().should.eventually.include({text})\n",
    "verifyTextPresent":
      ".elementByTagName('html').text().should.eventually.include({text})\n",
    "waitForTextPresent":
      "",
    "storeTextPresent":
      ".elementByTagName('html').text().then(function(text) { ${{variable}} = text.indexOf({text}) != -1; })\n"
  },

  locatorByForType: function(stepType, locatorType, locatorIndex) {
    if(locatorType === "xpath"){ return "XPath"; }
    return locatorType.split(" ").map(function(el) {
      return el.charAt(0).toUpperCase() + el.slice(1);
    }).join("");
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
