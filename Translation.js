var Translation = {};
Translation.locale = 'en_US';
Translation.table = null;
Translation.to_upload = [];

Translation.setLocale = function(locale) {
	if(locale == Translation.locale) return;

	$('fb\\:intl').data('translated', false);

	Translation.locale = locale;
	Translation.table = null;
	
	Translation.translate();
}

Translation.registerStrings = function(post_to_facebook) {
	if(Translation.locale == 'en_US') return;
	if(typeof Translation.table != 'object') return 'No translation table has been generated yet.';

	$('fb\\:intl').each(function() {
		if($(this).data('translated')) return true;
	
		var data = Translation.interpretTag($(this));
		
		if(Translation.table && Translation.table[data.text.hashCode()]) return true;
		
		for(var s in Translation.to_upload) {
			if(Translation.to_upload[s].text == data.text && Translation.to_upload[s].description == data.description) return true;
		}
		
		Translation.to_upload.push({
			text: data.text,
			description: data.description
		});
	});
	
	var t = Translation.to_upload;
	if(post_to_facebook) {
		if(Translation.to_upload.length) {
			FB.api({
				method: 'intl.uploadNativeStrings',
				native_strings: Translation.to_upload
			}, function(response) {});
			
			Translation.to_upload = [];
		}
	}
	
	return t;
}

Translation.translate = function(elem) {
	if(!Translation.table && Translation.locale != 'en_US') {
		// Populate the table
		Translation.table = true;
		
		FB.api({
			method: 'intl.getTranslations',
			locale: Translation.locale
		}, function(response) {
			if(!response || !response.length) return;
		
			response = response[0];
			
			// Build translation table
			if(!response || !response.strings || !response.strings.length || response.locale != Translation.locale) return;
			
			Translation.table = {};
			
			for(var s in response.strings) {
				if(!s || !response.strings[s].native_string || !response.strings[s].translations || !response.strings[s].translations.length || !response.strings[s].translations[0].translation) continue;
				
				Translation.table[response.strings[s].native_string.hashCode()] = response.strings[s].translations[0].translation;
			}
			
			// Translate!
			Translation.translate(elem);
		});
	} else {
		// Translate it
		if(!elem) elem = 'body';
		elem = $(elem);
		
		elem.find('fb\\:intl').each(function() {
			if($(this).data('translated')) return;
		
			var data = Translation.interpretTag($(this));
			var hashCode = data.text.hashCode();
			if(Translation.locale == 'en_US' || Translation.table[hashCode]) {
				// We have a translation for this string!
				if(Translation.locale == 'en_US') {
					var new_text = $(this).clone(true, true).html($(this).data('native_string').replace(/{([a-zA-Z\-]+)}/g, '<span id="f' + hashCode + '_$1"></span>'));
				} else {
					var new_text = $(this).clone(true, true).html(Translation.table[data.text.hashCode()].replace(/{([a-zA-Z\-]+)}/g, '<span id="f' + hashCode + '_$1"></span>'));
				}
				
				$(this).children('fb\\:intl-token').each(function() {
					var token = $(this).attr('name');
					var placeHolder = new_text.children('#f' + hashCode + '_' + token);
					$(this).insertBefore(placeHolder);
					placeHolder.remove();
				});
				
				new_text.data('translated', true);
				$(this).replaceWith(new_text);
			}
		});
		
		Translation.registerStrings();
	}
}

Translation.interpretTag = function(tag) {
	var data = {};
	
	var original_tag = tag;
		
	if(!tag.data('native_string')) {
		tag = tag.clone(true, true);
		tag.children('fb\\:intl-token').replaceWith(function() {
			return '{' + $(this).attr('name') + '}';
		});
		
		data.text = tag.text();
		
		original_tag.data('native_string', data.text);
	} else {
		data.text = tag.data('native_string');
	}
	
	data.description = '';
	if(tag.attr('desc')) data.description = data.description;
	
	return data;
}