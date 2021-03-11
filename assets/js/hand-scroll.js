;(function(){
	'use strict';

	class HandScroll {
		$html = null;
		sx = 0;
		sy = 0;
		dx = 0;
		dy = 0;
		is_enabled = false;
		is_mouse_down = false;
		is_ctrl_down = false;
		is_select_blocked = false;
		cursor = 'default';
		exclude_tags = [ 'IMG', 'INPUT', 'TEXTAREA' ];
		attached = [];
		enable() {
			if ( this.is_enabled ) this.disable();

			if ( !this.$html ) this.$html = document.querySelector( 'html' );
			if ( !this.$html ) return;

			let urls = this._get_urls();

			if ( ~urls.indexOf( location.hostname ) ) {
				this.is_enabled = true;

				this._set_cursor( 'grab' );

				this._attach( document, 'keydown', (e) => {
					this.is_ctrl_down = e.ctrlKey || e.shiftKey;
					this._set_cursor( ( this.is_ctrl_down ) ? 'default' : 'grab' );
				});

				this._attach( document, 'keyup', (e) => {
					this.is_ctrl_down = e.ctrlKey || e.shiftKey;
					this._set_cursor( ( this.is_ctrl_down ) ? 'default' : 'grab' );
				});

				this._attach( document, 'mousedown', (e) => {
					if ( e.button ) return;
					if ( ~this.exclude_tags.indexOf( e.target.tagName ) ) return;

					this.is_mouse_down = true;
					this.sx = e.screenX;
					this.sy = e.screenY;
				});

				this._attach( document, 'mousemove', (e) => {
					if ( this.is_mouse_down ) {
						this.dx = e.screenX - this.sx;
						this.dy = e.screenY - this.sy;
					}

					if ( !this.is_select_blocked ) {
						this.is_select_blocked = true;

						document.onselectstart = () => {
							return !( this.is_mouse_down && !this.is_ctrl_down );
						};
					}
				});

				this._attach( document, 'mouseup', (e) => {
					this.is_mouse_down = false;

					if ( this.is_select_blocked ) {
						this.is_select_blocked = false;

						document.onselectstart = () => {
							return true;
						};
					}
				});

				window.requestAnimationFrame( this._frame.bind( this ) );
			}
		}
		disable() {
			if ( !this.is_enabled ) return;

			for ( let attached of this.attached ) {
				attached[0].removeEventListener( attached[1], attached[2], attached[3] );
			}

			this._set_cursor( 'default' );

			this.sx = 0;
			this.sy = 0;
			this.dx = 0;
			this.dy = 0;
			this.is_enabled = false;
			this.is_mouse_down = false;
			this.is_ctrl_down = false;
			this.is_select_blocked = false;
			this.cursor = 'default';
			this.attached = [];
		}
		toggle_url() {
			let host = location.hostname;

			if ( !host ) return;

			let urls = this._get_urls();
			let index = urls.indexOf( host );

			if ( ~index ) {
				urls.splice( index, 1 );
			} else {
				urls.push( host );
			}

			this._set_urls( urls );
		}
		_get_urls() {
			let json = window.localStorage.getItem( 'urls' );

			if ( !json ) return [];

			return JSON.parse( json );
		}
		_set_urls( urls ) {
			window.localStorage.setItem( 'urls', JSON.stringify( urls ) );
		}
		_set_cursor( value='default' ) {
			if ( this.cursor === value ) return;

			this.cursor = value;
			this.$html.style.cursor = value;
		}
		_attach( $tag, event, listener, options ) {
			$tag.addEventListener( event, listener, options );
			this.attached.push([ $tag, event, listener, options ]);
		}
		_frame() {
			if ( !this.is_enabled ) return;

			if ( this.$html && !this.is_ctrl_down ) {
				if ( this.dx !== 0 || this.dy !== 0 ) {
					this.$html.scrollLeft -= this.dx;
					this.$html.scrollTop -= this.dy;
					this.sx += this.dx;
					this.sy += this.dy;
				}
			}

			this.dx = 0;
			this.dy = 0;

			window.requestAnimationFrame( this._frame.bind( this ) );
		}
	}

	window.HandScroll = HandScroll;
})();