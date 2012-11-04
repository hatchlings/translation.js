translation.js
==============

Adds &lt;fb:intl> tag support to XFBML (requires jQuery)

Facebook's fb:intl tags have long been broken. Luckily, the backend methods still work. This library provides the
required glue to make your fb:intl tags work again.

To use just include Translation.js, initialize the Facebook API, and include fb:intl (and optionally, fb:intl-token)
tags on your page.

In order to register strings for translation call Translation.registerStrings() to test.
This will log the parsed (tokenized) strings to the console. If they look
good, call Translation.registerStrings(true) to save your strings to Facebook.

Translate the strings into other locales using Facebook's translation app:
https://www.facebook.com/translations/admin/dashboard.php?app=YOUR_APP_ID

Then, to translate your page just call Translation.setLocale(locale).

If you have dynamic content, just call Translation.translate([elem]) to translate content added to the page after
the translation has already been performed. Calling without passing an element will retranslate the whole page. Calling
with an element will parse all children of that element.

Example Locales
===============
Spanish: Translation.setLocale('es_LA');

Dutch: Translation.setLocale('nl_NL');

French: Translation.setLocale('fr_FR');