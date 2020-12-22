;(function(){
	'use strict';

	class ContextMenuBuilder {
		/**
			const builder = new ContextMenuBuilder();
			
			builder.build({
				title: 'Context Menu Example',
				contexts: [ 'all' ],
				children: [
					{
						title: 'Child example',
						contexts: [ 'all' ],
						children: [],
						data: {},
						onclick: function( item, info, tab ){
							let message = { data: item.data, info: info, tab: tab };

							chrome.tabs.query({ active: true, currentWindow: true }, ( tabs ) => {
								chrome.tabs.sendMessage( tabs[0].id, message, ( response ) => {
									//
								});
							});
						},
					},
					// ...
				],
			});
		 */
		build( item, parent_id ) {
			let menu = {
				title: item.title,
				contexts: item.contexts,
			};

			if ( !isNaN( parent_id ) ) menu.parentId = parent_id;

			if ( typeof item.onclick === 'function' ) {
				menu.onclick = ( info, tab ) => {
					return item.onclick( item, info, tab );
				};
			}

			let id = chrome.contextMenus.create( menu );

			if ( item.children && item.children instanceof Array ) {
				item.children.forEach(( child ) => {
					this.build( child, id );
				});
			}

			return id;
		}
	}

	window.ContextMenuBuilder = ContextMenuBuilder;
})();