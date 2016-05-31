builder.selenium2.io.addLangFormatter({
  name: "PHPUnit - Selenium 2",
  extension: ".php",
  not: "!",
  start:
    "<?php\n" +
    "\n" +
    "{namespace}\n" +
    "{use}\n" +
    "class {scriptName} extends {parentClass} {\n" +
    "\n" +
    "  /**\n" +
    "   * Recorded steps.\n" +
    "   */\n" +
    "  public function testSteps() {\n" +
    "    $test = $this; // Workaround for anonymous function scopes in PHP < v5.4.\n" +
    "    $session = $this->prepareSession(); // Make the session available.\n",
  end:
    "  }\n" +
    "}\n",
  namespace:
    "namespace MyProject\\Tests;\n",
  use:
    "use {parentNamespace}\\{parentClass};\n",
  parentNamespace:
    "Sauce\\Sausage",
  parentClass:
    "WebDriverTestCase",

  /**
   * Actions
   */
  lineForType: {
    get:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->url({url});\n",
    goBack:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->back();\n",
    goForward:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->forward();\n",
    refresh:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->refresh();\n",
    pause:
      "    // {negNot}{stepTypeName}\n" +
      "    sleep({waitTime} / 1000);\n",
    clickElement:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->{locatorBy}({locator})->click();\n",
    setElementText:
      "    // {negNot}{stepTypeName}\n" +
      "    $element = $this->{locatorBy}({locator});\n" +
      "    $element->click();\n" +
      "    $element->clear();\n" +
      "    $element->value({text});\n",
    sendKeysToElement:
      "    // {negNot}{stepTypeName}\n" +
      "    $element = $this->{locatorBy}({locator});\n" +
      "    $element->click();\n" +
      "    $element->value({text});\n",
    setElementSelected:
      "    // {negNot}{stepTypeName}\n" +
      "    $element = $this->{locatorBy}({locator});\n" +
      "    if (!$element->selected()) {\n" +
      "      $element->click();\n" +
      "    }\n",
    setElementNotSelected:
      "    // {negNot}{stepTypeName}\n" +
      "    $element = $this->{locatorBy}({locator});\n" +
      "    if ($element->selected()) {\n" +
      "      $element->click();\n" +
      "    }\n",
    submitElement:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->{locatorBy}({locator})->submit();\n",
    close:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->close();\n",
    switchToFrame:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->frame({identifier});\n",
    switchToFrameByIndex:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->frame({index});\n",
    switchToWindow:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->window({name});\n",
    switchToDefaultContent:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->frame();\n",
    answerAlert:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->altertText({text});\n" +
      "    $this->acceptAlert();\n",
    acceptAlert:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->acceptAlert();\n",
    dismissAlert:
      "    // {negNot}{stepTypeName}\n" +
      "    $this->dismissAlert();\n",
    print:
      "    // {negNot}{stepTypeName}\n" +
      "    print {text};\n",
    store:
      "    // {negNot}{stepTypeName}\n" +
      "    $test->{variable} = {text};\n"
  },
  locatorByForType: function(stepType, locatorType, locatorIndex) {
    return {
      id: "byId",
      name: "byName",
      class: "byClassName",
      xpath: "byXPath",
      "css selector": "byCssSelector",
      "link text": "byLinkText",
      "tag name": "byTag"}[locatorType];
  },

  /**
   * Tests
   */
  assert: function(step, escapeValue, doSubs, getter) {
    var method = step.negated ? "{negMethod}" : "{posMethod}";
    return doSubs(
      "    // {negNot}{stepTypeName}\n" +
      "    $test->" + method + "({expected}, {getter});\n", getter);
  },
  waitFor: function(step, escapeValue, doSubs, getter) {
    var method = step.negated ? "{negMethod}" : "{posMethod}";
    return doSubs(
      "    // {negNot}{stepTypeName}\n" +
      "    $this->waitUntil(function() use ($test) {\n" +
      "      try {\n" +
      "        $test->" + method + "({expected}, {getter});\n" +
      "      } catch(\\Exception $e) {\n" +
      "        return null;\n" +
      "      }\n" +
      "      return true;\n" +
      "    });\n", getter);
  },
  store:
    "    // {negNot}{stepTypeName}\n" +
    "    $test->{variable} = {getter};\n",

  /**
   * Getters
   */
  getters: {
    CurrentUrl: {
      getter: "$test->url()",
      expected: "{url}",
      posMethod: "assertEquals",
      negMethod: "assertNotEquals"
    },
    Title: {
      getter: "$test->title()",
      expected: "{title}",
      posMethod: "assertEquals",
      negMethod: "assertNotEquals"
    },
    Text: {
      getter: "$test->{locatorBy}({locator})->text()",
      expected: "{text}",
      posMethod: "assertEquals",
      negMethod: "assertNotEquals"
    },
    BodyText: {
      getter: "$test->byTag('body')->text()",
      expected: "{text}",
      posMethod: "assertEquals",
      negMethod: "assertNotEquals"
    },
    PageSource: {
      getter: "$test->source()",
      expected: "{source}",
      posMethod: "assertEquals",
      negMethod: "assertNotEquals"
    },
    ElementAttribute: {
      getter: "$test->{locatorBy}({locator})->attribute({attributeName})",
      expected: "{value}",
      posMethod: "assertEquals",
      negMethod: "assertNotEquals"
    },
    ElementValue: {
      getter: "$test->{locatorBy}({locator})->value()",
      expected: "{value}",
      posMethod: "assertEquals",
      negMethod: "assertNotEquals"
    },
    CookieByName: {
      getter: "$session->cookie()->get({name})",
      expected: "{value}",
      posMethod: "assertEquals",
      negMethod: "assertNotEquals"
    },
    AlertText: {
      getter: "$test->alertText()",
      expected: "{text}",
      posMethod: "assertEquals",
      negMethod: "assertNotEquals"
    },
    Eval: {
      getter: "$test->execute({script})",
      expected: "{value}",
      posMethod: "assertEquals",
      negMethod: "assertNotEquals"
    }
  },

  /**
   * Boolean tests.
   */
  boolean_assert: function(step, escapeValue, doSubs, getter) {
    var method = step.negated ? "assertFalse" : "assertTrue";
    return doSubs(
      "    // {negNot}{stepTypeName}\n" +
      "    try {\n" +
      "      $boolean = {condition};\n" +
      "    } catch (\\Exception $e) {\n" +
      "      $boolean = false;\n" +
      "    }\n" +
      "    $test->" + method + "($boolean);\n", getter);
  },
  boolean_waitFor: function(step, escapeValue, doSubs, getter) {
    return doSubs(
      "    // {negNot}{stepTypeName}\n" +
      "    $this->waitUntil(function() use ($test) {\n" +
      "      try {\n" +
      "        $boolean = {condition};\n" +
      "      } catch (\\Exception $e) {\n" +
      "        $boolean = false;\n" +
      "      }\n" +
      "      return {negNot}$boolean === true ?: null;\n" +
      "    });\n", getter);
  },
  boolean_store:
    "    // {negNot}{stepTypeName}\n" +
    "    try {\n" +
    "      $boolean = {condition};\n" +
    "    } catch (\\Exception $e) {\n" +
    "      $boolean = false;\n" +
    "    }\n" +
    "    $test->{variable} = $boolean;\n",

  /**
   * Boolean getters
   */
  boolean_getters: {
    TextPresent: {
      condition: "(strpos($test->byTag('html')->text(), {text}) !== false)"
    },
    ElementPresent: {
      condition: "($test->{locatorBy}({locator}) instanceof \\PHPUnit_Extensions_Selenium2TestCase_Element)"
    },
    CookiePresent: {
      condition: "is_string($session->cookie()->get({name}))"
    },
    AlertPresent: {
      condition: "is_string($test->alertText())"
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
