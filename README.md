translation.js
==============

Adds `<fb:intl>` tag support to XFBML (requires jQuery)

Facebook's `fb:intl` tags have long been broken. Luckily, the backend methods still work. This library provides the
required glue to make your fb:intl tags work again.

To use just include Translation.js, initialize the Facebook API, and include fb:intl (and optionally, fb:intl-token)
tags on your page.

To initialize the library, select a locale using `Translation.setLocale(locale)`. This will automatically translate
any `fb:intl` tags on the page using any translations that you have registered and translated through the Facebook
Translations tool.

In order to register strings for translation just call `Translation.registerStrings(false)` after choosing any locale
other than `en_US`. This will log the parsed (tokenized) strings to the console for review. If they look
good, call `Translation.registerStrings(true)` to save your strings to Facebook for translation.

Translate the strings into other locales using Facebook's translation app:
https://www.facebook.com/translations/admin/dashboard.php?app=YOUR_APP_ID

On subsequent pageloads, your call to `Translation.setLocale(locale)` will now show translated strings.

If you have dynamic content, just call `Translation.translate([elem])` to translate content added to the page after
the translation has already been performed. Calling without passing an element will retranslate the whole page. Calling
with an element will parse all children of that element.

Please note: translated strings are cached once loaded from Facebook until you switch languages using
`Translation.setLocale(locale)`. If you translate more strings and want to see them update without reloading the
page you can do `Translation.setLocale('en_US'); Translation.setLocale(locale);` as a hack to clear the local
translation table.

Example Locales
===============
Spanish: `Translation.setLocale('es_LA');`

Dutch: `Translation.setLocale('nl_NL');`

French: `Translation.setLocale('fr_FR');`

Example `fb:intl` Tags
======================
`<fb:intl>A simple string.</fb:intl>`

`<fb:intl>A <fb:intl-token name="adjective">complex</fb:intl-token> string.</fb:intl>`

`<fb:intl>A <fb:intl-token name="link"><a href="#"><fb:intl>translated link</fb:intl></a></fb:intl-token> in a string.</fb:intl>`