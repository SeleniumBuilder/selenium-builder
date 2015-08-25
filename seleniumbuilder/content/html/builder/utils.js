/**
 * Sets up selenium versions list. Whenever possible, the UI should not use builder.seleniumX, but
 * loop over builder.seleniumVersions;
 */
builder.seleniumVersions = [];

/**
 * Converts runs of whitespace into single spaces and trims string to match behaviour of
 * XPath's normalize-space.
 */
builder.normalizeWhitespace = function(text) {
  return text.replace(/\s+/g, " ").replace(/^ /, "").replace(/ $/, "");
};

/**
 * Extracts domain name from URL.
 * Example: Takes the { 'http', '', 'www.foo.org' } parts from http://www.foo.org/puppies/ and 
 * glues it back together with slashes.
 */
builder.getDomainName = function (url) {
  return url.split("/", 3).join("/");
};

/** Deletes all browser cookies for the domain of the given URL. */
builder.deleteURLCookies = function(url) {
  var domain = "." + builder.getDomainName(url).split("//")[1];
  var man = Components.classes["@mozilla.org/cookiemanager;1"].getService(Components.interfaces.nsICookieManager);
  var en = man.enumerator;
  var cookies = [];
  while (en.hasMoreElements()) {
    cookies.push(en.getNext());
  }
  for (var i = 0; i < cookies.length; i++) {
    var c = cookies[i];
    // Explain to the cookie that it's a cookie...
    c.QueryInterface(Components.interfaces.nsICookie);
    if (endsWith(domain, c.host)) {
      man.remove(c.host, c.name, c.path, false);
    }
  }
};

/**
 * Create a new DOM node for the current document.
 * @param tagname The name of the node
 * 
 * Further parameters are treated as follows:
 *   strings: put inside verbatim
 *   DOM nodes: put inside node
 *   objects (maps): used to set attributes: strings are attributes, functions are evt handlers
 *
 * @return A DOM node
 *
 * Basic usage: var mySpan = newNode('span', "Hello World!");
 *
 * Supports attributes and event handlers:
 * var mySpan = newNode('span', {style:"color: red", focus: function(){alert(this)}, id:"hello"},
 *              "World, Hello!");
 * Also allows nesting to create trees:
 * var myPar = newNode('p', newNode('b',{style:"color: blue"},"Hello"), mySpan)
 */
function newNode(tagname) {
  var node = document.createElement(tagname);
  for (var i = 1; i < arguments.length; i++) {
    var arg = arguments[i];
    if (typeof arg == 'string') {
      // Text node
      node.appendChild(document.createTextNode(arg));
    } else if (typeof arg == 'object') {
      if (arg.nodeName) {
        // It' a DOM Node
        node.appendChild(arg);
      } else {
        // It's a map specifying class, style, event handlers or attributes
        for (var key in arg) {
          var value = arg[key];
          if (key == 'class') {
            // Class is treated differently from normal attributes...
            node.className = value;
          } else if (key == 'style') {
            // ...as is style
            node.style.cssText = value;
          } else if (typeof value == 'function') {
            // It's an event handler
            try {
              node.addEventListener(key, value, false); //W3C
            } catch (e) {
              try {
                node.attachEvent('on' + key, value, "Language"); //MSIE
              } catch (e2) {
                node['on' + key] = value;
              }
            }
          } else { // It's a normal attribute!
            node.setAttribute(key, value);
          }
        } // End loop over arg
      } // End else clause of checking for DOM node.
    } // End check for typeof object
  } // End loop over extra arguments
  return node;
}
/**
 * A complement to newNode above that allows you to create a set of nodes with no explicit parent
 * element.
 *
 * Accepts text and DOM node objects as arguments.
 *
 * @return A document fragment, i.e a list of DOM nodes
 */
function newFragment() {
  var frag = document.createDocumentFragment();
  for (var i = 0; i < arguments.length; i++) {
    if (typeof arguments[i] == 'string') { //Text
      frag.appendChild(document.createTextNode(arguments[i]));
    } else { //DOM Node (hopefully)
      frag.appendChild(arguments[i]);
    }
  }
  return frag;
}


if (builder && builder.loader && builder.loader.loadNextMainScript) { builder.loader.loadNextMainScript(); }