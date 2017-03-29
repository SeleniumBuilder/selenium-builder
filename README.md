# Selenium Builder

Create Selenium tests in-browser.

  * [Website](http://seleniumbuilder.com)
  * [Install on Firefox](https://addons.mozilla.org/en-GB/firefox/addon/selenium-builder/)
  * [Mailing List](https://groups.google.com/d/forum/se-builder)

## Maintainer

  * David Stark ([zarkonnen](https://github.com/Zarkonnen) - [email](mailto:zarkonnen@gmail.com))

## Contributors

  * David Stark ([zarkonnen](https://github.com/Zarkonnen))
  * Mathieu Sabourin ([OniOni](https://github.com/OniOni))
  * Adam Christian ([admc](https://github.com/admc))
  * Bernard Kobos ([bernii](https://github.com/bernii))
  * Felipe Knorr Kuhn ([knorrium](https://github.com/knorrium))
  * Stephen Mc Gowan ([mcclown](https://github.com/mcclown))
  * Jonathan Lipps ([jlipps](https://github.com/jlipps))
  * Jérôme Kowalczyk ([jkowalczyk](https://github.com/jkowalczyk))
  * Nick Schonning ([nschonni](https://github.com/nschonni))
  
Development supported by [Sauce Labs](https://saucelabs.com/).

## Legacy FAQ

**Wait, I thought [this](https://github.com/SeleniumBuilder/se-builder/) was Selenium Builder?**

Yes, it is, or was. The project's getting forked into a modern and a legacy version.

**Why would you do this thing?**

As of version 40, Firefox requires all extensions to be signed. Builder contains a lot of code from Selenium IDE and Webdriver that is causing it to be rejected for signing. (Using `eval`, binary components, etc.)

Getting Builder into an acceptable state for signing means removing this code, which will remove support for Selenium 1, and support for local playback of Selenium 2. The plan is to re-implement local playback in an approved fashion afterwards, but support for Selenium 1 will be dropped.

**I don't like this!**

It's kind of an adapt-or-die situation. In Firefox 40, [you can](https://blog.mozilla.org/addons/2015/06/18/compatibility-for-firefox-40/) still turn off the `xpinstall.signatures.required` preference to get Builder to install, but from version 41 onwards Builder will no longer work.

**What does this mean long-term?**

The legacy se-builder will still be around for older versions of Firefox. New Builder will use a different addon ID, so you can even install both alongside one another. Builder gets to continue working and improving, and with a cleaner, slimmer code base.

**I still have questions.**

[Drop me an email](mailto:zarkonnen@gmail.com) or discuss these upcoming changes on the [mailing list](https://groups.google.com/forum/#!forum/se-builder).
