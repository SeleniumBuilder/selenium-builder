builder.selenium2.io.addLangFormatter({
  name: "PHP - Webdriver",
  extension: ".php",
  not: "! ",
  start:
  "<?php\n"+
  "require_once 'php-webdriver';" +
	"\n" +
	"$wd = new WebDriver();\n" +
	"$session = $wd->session();\n"+
	"\n"+
	"function cookies_contain($cookies, $name) {\n"+ 
    "    foreach ($cookies as $arr) {\n"+
    "        if ($arr['name'] == $name) {\n"+
    "            return true;\n"+
    "        }\n"+ 
    "    }\n"+
    "    return false;\n"+
    "}\n"+
	"\n"+
	"function get_cookie($cookies, $name) {\n"+ 
    "    foreach ($cookies as $arr) {\n"+
    "        if ($arr['name'] == $name) {\n"+
    "            return $arr;\n"+
    "        }\n"+ 
    "    }\n"+
    "    return false;\n"+
    "}\n"+
	"\n"+
	"function alert_present($session) {\n" +
    "    try {\n" +
    "        $session->alert_text();\n" +
    "        return true;\n" +
    "    } catch (NoAlertOpenWebDriverError $e) {\n" +
    "       return false;\n" +
    "    }\n" +
    "}\n" +
    "\n" +
  	"function split_keys($toSend){\n"+
  	"    $payload = array(\"value\" => preg_split(\"//u\", $toSend, -1, PREG_SPLIT_NO_EMPTY));\n"+
  	"    return $payload;\n"+
  	"}\n\n",
  end:
    "\n$session->close();\n"+
	"?>",
  lineForType: {
    "get":
      "$session->open({url});\n",
    "goBack":
      "$session->back();\n",
    "goForward":
      "$session->forward();\n",
    "refresh":
      "$session->refresh();\n",
    "clickElement":
      "$session->element({locatorBy}, {locator})->click();\n",
    "mouseOverElement":
      "$session->moveto(array(\"element\" => $session->element({locatorBy}, {locator})->getID()));\n",
    "setElementText":
      "$session->element({locatorBy}, {locator})->click();\n" +
      "$session->element({locatorBy}, {locator})->clear();\n" +
      "$session->element({locatorBy}, {locator})->value(split_keys({text}));\n",
    "sendKeysToElement":
      "$session->element({locatorBy}, {locator})->click();\n" +
      "$session->element({locatorBy}, {locator})->value(split_keys({text}));\n",
    "setElementSelected":
      "if (!($session->element({locatorBy}, {locator})->selected())) {\n" +
	  "    $session->element({locatorBy}, {locator})->click();\n"+
	  "}\n",
    "setElementNotSelected":
      "if ($session->element({locatorBy}, {locator})->selected()) {\n" +
	  "    $session->element({locatorBy}, {locator})->click();\n"+
	  "}\n",
    "submitElement":
      "$session->element({locatorBy}, {locator})->submit();\n",
    "close":
      "",
    "switchToFrame":
      "$session->frame(array(\"id\" => {identifier}));\n",
    "switchToFrameByIndex":
      "$session->frame(array(\"id\" => {index}));\n",
    "switchToWindow":
      "$session->window(array(\"name\" => {name}));\n",
    "switchToDefaultContent":
      "$session->frame(array(\"id\" => NULL));\n",
    "answerAlert":
      "$session->postalert_text(array(\"text\" => {text}));\n" +
      "$session->accept_alert();\n",
    "acceptAlert":
      "$session->accept_alert();\n",
    "dismissAlert":
      "$session->dismiss_alert();\n",
    "print":
      "echo {text};\n",
    "store":
      "${variable} = {text};\n"
  },
  locatorByForType: function(stepType, locatorType, locatorIndex) {
    return {
        "class": "\"class\"",
        "id": "\"id\"",
        "link text": "\"link text\"",
        "xpath": "\"xpath\"",
        "css selector": "\"css\"",
        "name": "\"name\""}[locatorType];
  },
  assert: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "if ({getter} == {cmp}) {\n" +
        "    $session->close();\n" +
        "    throw new Exception(\"!{stepTypeName} failed\");\n" +
        "}\n", getter);
    } else {
      return doSubs(
        "if ({getter} != {cmp}) {\n" +
        "    $session->close();\n" +
        "    throw new Exception(\"!{stepTypeName} failed\");\n" +
        "}\n", getter);
    }
  },
  verify: function(step, escapeValue, doSubs, getter) {
    if (step.negated) {
      return doSubs(
        "if ({getter} == {cmp}) {\n" +
        "    echo \"!{stepTypeName} failed\";\n" +
        "}\n", getter);
    } else {
      return doSubs(
        "if ({getter} != {cmp}) {\n" +
        "    echo \"{stepTypeName} failed\";\n" +
        "}\n", getter);
    }
  },
  waitFor: "",
  store:
    "${{variable}} = {getter};\n",
  boolean_assert:
    "if ({posNot}{getter}) {\n" +
    "    $session->close();\n" +
    "    throw new Exception(\"{negNot}{stepTypeName} failed\");\n" +
    "}\n",
  boolean_verify:
    "if ({posNot}{getter}) {\n" +
    "    echo \"{negNot}{stepTypeName} failed\";\n" +
    "}\n",
  boolean_waitFor: "",
  boolean_store:
    "${{variable}} = {getter};\n",
  boolean_getters: {
    "TextPresent": {
      getter: "(strpos($session->element(\"tag name\", \"html\")->text(), {text}) !== false)",
      vartype: ""
    },
    "ElementPresent": {
      getter: "(strlen($session->element({locatorBy}, {locator})) != 0)",
      vartype: ""
    },
    "ElementSelected": {
      getter: "($session->element({locatorBy}, {locator})->selected())",
      vartype: ""
    },
    "CookiePresent": {
      getter: "($session->getAllCookie({name}))",
      vartype: ""
    },
    "AlertPresent": {
      getter: "alert_present($session)",
      vartype: ""
    }
  },
  getters: {
    "BodyText": {
      getter: "$session->element(\"tag name\", \"html\")->text()",
      cmp: "{text}",
      vartype: ""
    },
    "PageSource": {
      getter: "$session->source()",
      cmp: "{source}",
      vartype: ""
    },
    "Text": {
      getter: "$session->element({locatorBy}, {locator})->text",
      cmp: "{text}",
      vartype: ""
    },
    "CurrentUrl": {
      getter: "$session->url()",
      cmp: "{url}",
      vartype: ""
    },
    "Title": {
      getter: "$session->title()",
      cmp: "{title}",
      vartype: ""
    },
    "ElementValue": {
      getter: "$session->element({locatorBy}, {locator})->attribute(\"value\")",
      cmp: "{value}",
      vartype: ""
    },
    "ElementAttribute": {
      getter: "$session->element({locatorBy}, {locator})->attribute({attributeName})",
      cmp: "{value}",
      vartype: "String"
    },
    "CookieByName": {
      getter: "get_cookie($session->getAllCookies(), {name})",
      cmp: "{value}",
      vartype: ""
    },
    "AlertText": {
      getter: "$session->alert_text()",
      cmp: "{text}",
      vartype: ""
    },
    "Eval": {
      getter: "$session->execute({script})",
      cmp: "{value}",
      vartype: ""
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
