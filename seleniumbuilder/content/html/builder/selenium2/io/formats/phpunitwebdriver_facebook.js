builder.selenium2.io.addLangFormatter({
  name: "PHPUnitWebDriver/Facebook",
  extension: ".php",
  not: "!",
  start:
    "<?php\n" +
    "\n" +
    "{namespace}\n" +
    "{use}\n" +
    "class {scriptName} extends {parentClass} {\n" +
    "\n" +
    "   /**\n" +
    "    * @var \RemoteWebDriver\n" +
    "    */\n" +
    "    protected $webDriver;\n" +
    "    public function setUp() {\n" +
    "        parent::setUp();\n" +
    "        $capabilities    = array(\WebDriverCapabilityType::BROWSER_NAME => 'firefox');\n" +
    "        $this->webDriver = RemoteWebDriver::create('http://127.0.0.1:4444/wd/hub', $capabilities);\n" +
    "        $this->webDriver->manage()->timeouts()->implicitlyWait(30);\n" +
    "    }\n" +
    "    public function test{scriptName}() {\n",   
  end:
    "    }\n" +
    "    public function tearDown() {\n" +
    "        $this->webDriver->close();\n" +
    "        parent::tearDown();\n" +
    "    }\n" +
    "}\n",
  namespace:
    "namespace MyProject\Tests;\n",
  use:
    "use {parentNamespace}\{parentClass};\n",
  parentNamespace:
    "\\",
  parentClass:
    "PHPUnit_Framework_TestCase",

  /**
   * Actions
   */
  lineForType: {
    "print":
      "        print({text});\n",
    "pause":
      "        sleep({waitTime} / 1000);\n",
    "store":
      "        $test->{variable} = {text};\n",
    "get":
      "        $this->webDriver->get({url});\n",
    "goBack":
      "        $this->webDriver->navigate()->back();\n",
    "goForward":
      "        $this->webDriver->navigate()->forward();\n",
    "clickElement":
      "        $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->click();\n",
    "setElementText":
      "        $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->click();\n" +
      "        $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->clear();\n" +
      "        $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->sendKeys({text});\n",
    "sendKeysToElement":
      "        $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->click();\n" +
      "        $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->sendKeys({text});\n",
    "setElementSelected":
      "        if (!$this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->isSelected()) {\n" +
      "            $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->click();\n" +
      "        }\n",
    "setElementNotSelected":
      "        if ($this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->isSelected()) {\n" +
      "            $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->click();\n" +
      "        }\n",
    "doubleClickElement":
      "        $this->webDriver->getMouse()->doubleClick($this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getCoordinates());\n",
    "mouseOverElement":
      "        $this->webDriver->getMouse()->mouseMove($this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getCoordinates());\n",
    "dragToAndDropElement":
      "        $this->webDriver->getMouse()->mouseDown($this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getCoordinates());\n" +
      "        $this->webDriver->getMouse()->mouseMove($this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getCoordinates());\n" +
      "        $this->webDriver->getMouse()->mouseUp($this->webDriver->findElement(WebDriverBy::{locator2By}({locator2}))->getCoordinates());\n",
    "clickAndHoldElement":
      "        $this->webDriver->getMouse()->mouseDown($this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getCoordinates());\n",
    "releaseElement":
      "        $this->webDriver->getMouse()->mouseUp($this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getCoordinates());\n",
    "clearSelections":
      "        new WebDriverSelect($this->webDriver->findElement(WebDriverBy::{locatorBy}({locator})))->deselectAll();\n",
    "submitElement":
      "        $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->submit();\n",
    "close":
      "        $this->webDriver->close();\n",
    "refresh":
      "        $this->webDriver->navigate()->refresh();\n",
    "addCookie":
      function(step, escapeValue) {
        var r = "        $c" + step.id + " = [" + " 'name' => " + escapeValue(step.type, step.name) + ",\n" + 
                "                'value' => " + escapeValue(step.type, step.value) + ",\n";
        var opts = step.options.split(",");
        for (var i = 0; i < opts.length; i++) {
          var kv = opts[i].trim().split("=");
          if (kv.length == 1) { continue; }
          if (kv[0] == "path") {
            r += "                'path' => " + escapeValue(step.type, kv[1]) + ",\n";
          }
          if (kv[0] == "max_age") {
            r += "                'expiry' => time() + " + parseInt(kv[1]) * 1000 + ",\n";
          }
        }
        r += "              ];\n";
        r += "        $this->webDriver->manage()->addCookie($c" + step.id + ");\n";
        return r;
      },
    "deleteCookie":
      function(step, escapeValue) {
        return(
        "        $c" + step.id + " = $this->webDriver->manage()->getCookieNamed(" + escapeValue(step.type, step.name) + ");\n" +
        "        if ($c" + step.id + " != null) { $this->webDriver->manage()->deleteCookie($c" + step.id + "); }\n");
      },
    "assertTextPresent":
      "        $this->assertContains({text},$this->webDriver->findElement(WebDriverBy::tagName(\"html\"))->getText())\n",
    "verifyTextPresent":
      "        if ({posNot}strstr($this->webDriver->findElement(WebDriverBy::tagName(\"html\"))->getText(),{text})) {\n" +
      "            file_put_contents('php://stderr',\"{negNot}verifyTextPresent failed\");\n" +
      "        }\n",
    "waitForTextPresent":
      "",
    "storeTextPresent":
      "        ${{variable}} = strstr($this->webDriver->findElement(WebDriverBy::tagName(\"html\"))->getText(),{text});\n",
    "assertBodyText":
      "        $this->assertEquals({text},$this->webDriver->findElement(WebDriverBy::tagName(\"html\"))->getText());\n",
    "verifyBodyText":
      "        if ({posNot}$this->webDriver->findElement(WebDriverBy::tagName(\"html\"))->getText() == {text}) {\n" +
      "            file_put_contents('php://stderr',\"{negNot}verifyBodyText failed\");\n" +
      "        }\n",
    "waitForBodyText":
      "",
    "storeBodyText":
      "        ${{variable}} = $this->webDriver->findElement(WebDriverBy::tagName(\"html\"))->getText();\n",
    "assertElementPresent":
      "        $this->assertGreaterThan(0,$this->webDriver->findElements(WebDriverBy::{locatorBy}({locator}))->size());\n",
    "verifyElementPresent":
      "        if ({negNot}($this->webDriver->findElements(WebDriverBy::{locatorBy}({locator}))->size() == 0)) {\n" +
      "            file_put_contents('php://stderr',\"{negNot}verifyElementPresent failed\");\n" +
      "        }\n",
    "waitForElementPresent":
      "",
    "storeElementPresent":
      "        ${{variable}} = $this->webDriver->findElements(WebDriverBy::{locatorBy}({locator}))->size() == 0;\n",
    "assertPageSource":
      "        $this->assertEquals({source},$this->webDriver->getPageSource())\n",
    "verifyPageSource":
      "        if ({posNot}$this->webDriver->getPageSource() == {source}) {\n" +
      "            file_put_contents('php://stderr',\"{negNot}verifyPageSource failed\");\n" +
      "        }\n",
    "waitForPageSource":
      "",
    "storePageSource":
      "        ${{variable}} = $this->webDriver->getPageSource();\n",
    "assertText":
      "        $this->assertEquals({text},$this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getText())",
    "verifyText":
      "        if ({posNot}$this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getText() == {text}) {\n" +
      "            file_put_contents('php://stderr',\"{negNot}verifyText failed\");\n" +
      "        }\n",
    "waitForText":
      "",
    "storeText":
      "        ${{variable}} = $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getText();\n",
    "assertCurrentUrl":
      "        $this->assertEquals({url},$this->webDriver->getCurrentUrl());\n",
    "verifyCurrentUrl":
      "        if ({posNot}$this->webDriver->getCurrentUrl() == {url}) {\n" +
      "            file_put_contents('php://stderr',\"{negNot}verifyCurrentUrl failed\");\n" +
      "        }\n",
    "storeCurrentUrl":
      "        ${{variable}} = $this->webDriver->getCurrentUrl();\n",
    "waitForCurrentUrl":
      "",
    "assertTitle":
      "        $this->assertEquals({title},$this->webDriver->getTitle());\n",
    "verifyTitle":
      "        if ({posNot}$this->webDriver->getTitle() == {title}) {\n" +
      "            file_put_contents('php://stderr',\"{negNot}verifyTitle failed\");\n" +
      "        }\n",
    "storeTitle":
      "        ${{variable}:String} = $this->webDriver->getTitle();\n",
    "waitForTitle":
      "",
    "assertElementSelected":
      "        $this->assertTrue($this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->isSelected());\n",
    "verifyElementSelected":
      "        if ({posNot}$this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->isSelected()) {\n" +
      "            file_put_contents('php://stderr',\"{negNot}verifyElementSelected failed\");\n" +
      "        }\n",
    "waitForElementSelected":
      "",
    "storeElementSelected":
      "        ${{variable}:boolean} = $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->isSelected();\n",
    "assertElementValue":
      "        $this->assertEquals({value},$this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getAttribute(\"value\"));\n",
    "verifyElementValue":
      "        if ({posNot}$this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getAttribute(\"value\") == {value}) {\n" +
      "            file_put_contents('php://stderr',\"{negNot}verifyElementValue failed\");\n" +
      "        }\n",
    "waitForElementValue":
      "",
    "storeElementValue":
      "        ${{variable}:String} = $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getAttribute(\"value\");\n",
    "assertElementAttribute":
      "        $this->assertEquals({value},$this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getAttribute({attributeName}));\n",
    "verifyElementAttribute":
    "        if ({posNot}({value}) == $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getAttribute({attributeName})) {\n" +
      "            file_put_contents('php://stderr',\"{negNot}verifyElementAttribute failed\");\n" +
      "        }\n",
    "waitForElementAttribute":
      "",
    "storeElementAttribute":
      "        ${{variable}} = $this->webDriver->findElement(WebDriverBy::{locatorBy}({locator}))->getAttribute({attributeName});\n",
    "assertCookieByName":
      "       $this->assertEquals({value},$this->webDriver->manage()->getCookieNamed({name})->getValue());\n",
    "verifyCookieByName":
      "        if ({posNot}({value}) == $this->webDriver->manage()->getCookieNamed({name})->getValue()) {\n" +
      "            file_put_contents('php://stderr',\"{negNot}verifyCookieByName failed\");\n" +
      "        }\n",
    "waitForCookieByName":
      "",
    "storeCookieByName":
      "        ${{variable}} = $this->webDriver->manage()->getCookieNamed({name})->getValue();\n",
    "assertCookiePresent":
      "        $this->assertNotNull($this->webDriver->manage()->getCookieNamed({name}));\n",
    "verifyCookiePresent":
      "        if ({negNot}($this->webDriver->manage()->getCookieNamed({name}) == null)) {\n" +
      "            file_put_contents('php://stderr',\"{negNot}verifyCookiePresent failed\");\n" +
      "        }\n",
    "waitForCookiePresent":
      "",
    "storeCookiePresent":
      "        ${{variable}} = $this->webDriver->manage()->getCookieNamed({name}) != null;\n",
    "saveScreenshot":
      "        $this->webDriver->takeScreenshot({file});\n",
    "switchToFrame":
      "        $this->webDriver->switchTo()->frame({identifier});\n",
    "switchToFrameByIndex":
      "        $this->webDriver->switchTo()->frame({index});\n",
    "switchToWindow":
      "        $this->webDriver->switchTo()->window({name});\n",
    "switchToDefaultContent":
      "        $this->webDriver->switchTo()->defaultContent();\n",
    "clickAndWait":
      "        $this->webDriver->switchTo()->defaultContent();\n",
  },
  locatorByForType: function(stepType, locatorType, locatorIndex) {
    if ({"select.select":1, "select.deselect":1}[stepType.name] && locatorIndex == 2) {
      return {
        "index": "ByIndex",
        "value": "ByValue",
        "label": "ByVisibleText",
        "id":    "[NOT IMPLEMENTED]"
      };
    }
    return {
      "class name": "className",
      "id": "id",
      "link text": "linkText",
      "xpath": "xpath",
      "css selector": "cssSelector",
      "name": "name",
      "tag name": "tagName",
      "partial link text": "partialLinkText"}[locatorType];
  }, 
  /**
   * Tests
   */
   assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return "        assertNotEquals(" + doSubs(getter.cmp) + ", " + doSubs(getter.getter) + ");\n";
    } else {
      return "        assertEquals(" + doSubs(getter.cmp) + ", " + doSubs(getter.getter) + ");\n";
    }
  },
  boolean_assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return "        assertFalse(" + doSubs(getter.getter) + ");\n";
    } else {
      return "        assertTrue(" + doSubs(getter.getter) + ");\n";
    }
  },

  /**
   * Processes a parameter value into an appropriately escaped expression. Mentions of variables
   * with the ${foo} syntax are transformed into expressions that concatenate the variables and
   * literals.  
   * For example:
   * a${b}c
   * becomes:
   * "a" . b . "c"
   * 
   */
  escapeValue: function(stepType, value, pName) {
    var keysMap = {
      "NULL": "\\u{E000}",
      "CANCEL": "\\u{E001}",
      "HELP": "\\u{E002}",
      "BACK_SPACE": "\\u{E003}",
      "TAB": "\\u{E004}",
      "CLEAR": "\\u{E005}",
      "RETURN": "\\u{E006}",
      "ENTER": "\\u{E007}",
      "SHIFT": "\\u{E008}",
      "LEFT_SHIFT": "\\u{E008}",
      "CONTROL": "\\u{E009}",
      "LEFT_CONTROL": "\\u{E009}",
      "ALT": "\\u{E00A}",
      "LEFT_ALT": "\\u{E00A}",
      "PAUSE": "\\u{E00B}",
      "ESCAPE": "\\u{E00C}",
      "SPACE": "\\u{E00D}",
      "PAGE_UP": "\\u{E00E}",
      "PAGE_DOWN": "\\u{E00F}",
      "END": "\\u{E010}",
      "HOME": "\\u{E011}",
      "LEFT": "\\u{E012}",
      "ARROW_LEFT": "\\u{E012}",
      "UP": "\\u{E013}",
      "ARROW_UP": "\\u{E013}",
      "RIGHT": "\\u{E014}",
      "ARROW_RIGHT": "\\u{E014}",
      "DOWN": "\\u{E015}",
      "ARROW_DOWN": "\\u{E015}",
      "INSERT": "\\u{E016}",
      "DELETE": "\\u{E017}",
      "SEMICOLON": "\\u{E018}",
      "EQUALS": "\\u{E019}",
      "NUMPAD0": "\\u{E01A}",
      "NUMPAD1": "\\u{E01B}",
      "NUMPAD2": "\\u{E01C}",
      "NUMPAD3": "\\u{E01D}",
      "NUMPAD4": "\\u{E01E}",
      "NUMPAD5": "\\u{E01F}",
      "NUMPAD6": "\\u{E020}",
      "NUMPAD7": "\\u{E021}",
      "NUMPAD8": "\\u{E022}",
      "NUMPAD9": "\\u{E023}",
      "MULTIPLY": "\\u{E024}",
      "ADD": "\\u{E025}",
      "SEPARATOR": "\\u{E026}",
      "SUBTRACT": "\\u{E027}",
      "DECIMAL": "\\u{E028}",
      "DIVIDE": "\\u{E029}",
      "F1": "\\u{E031}",
      "F2": "\\u{E032}",
      "F3": "\\u{E033}",
      "F4": "\\u{E034}",
      "F5": "\\u{E035}",
      "F6": "\\u{E036}",
      "F7": "\\u{E037}",
      "F8": "\\u{E038}",
      "F9": "\\u{E039}",
      "F10": "\\u{E03A}",
      "F11": "\\u{E03B}",
      "F12": "\\u{E03C}",
      "META": "\\u{E03D}",
      "COMMAND": "\\u{E03D}",
      "ZENKAKU_HANKAKU": "\\u{E040}"
    };
  
    if (stepType.name.startsWith("store") && pName == "variable") { return value; }
    if (stepType.name == "switchToFrameByIndex" && pName == "index") { return value; }
    // This function takes a string literal and escapes it and wraps it in quotes.
    function esc(v) { return "\"" + v.replace(/\\/g, "\\\\").replace(/"/g, "\\\"") + "\""; }

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
          if (output.length > 0) { output += " . "; }
          output += "$" + varName;
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
	        // If this isn't the start of the expression, use . to concatenate it.
	        if (output.length > 0) { output += " . "; }
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
              if (output.length > 0) { output += " . "; }
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
	            if (output.length > 0) { output += " . "; }
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
      if (output.length > 0) { output += " . "; }
      output += esc(lastChunk);
    }
    return output;
  },
  usedVar: function(varName) { return "$" + varName; },
  unusedVar: function(varName) { return "$" + varName; }
});



if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }
