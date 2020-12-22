;(function(){
	'use strict';

	const scroll = new HandScroll();

	scroll.enable();

	document.addEventListener( 'visibilitychange', (e) => {
		if ( !document.hidden ) scroll.enable();
	});

	chrome.runtime.onMessage.addListener(( message, sender, send_response ) => {
		if ( sender.id === chrome.runtime.id ) {
			send_response({
				ok: (function(){
					if ( typeof message !== 'object' ) return false;
					if ( typeof message.action !== 'string' ) return false;

					switch ( message.action ) {
						case 'toggle-url':
							scroll.toggle_url();
							scroll.enable();
							return true;
							break;
						default:
							return false;
							break;
					}
				})(),
			});
		}
	});

})();