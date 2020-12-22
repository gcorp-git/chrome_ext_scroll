;(function(){
	'use strict';

	const builder = new ContextMenuBuilder();

	builder.build({
		title: 'Hand Scroll: toggle URL',
		contexts: [ 'all' ],
		onclick: function( item, info, tab ){
			let message = { action: 'toggle-url' };

			chrome.tabs.query({ active: true, currentWindow: true }, ( tabs ) => {
				chrome.tabs.sendMessage( tabs[0].id, message, ( response ) => {
					//
				});
			});
		},
	});

})();