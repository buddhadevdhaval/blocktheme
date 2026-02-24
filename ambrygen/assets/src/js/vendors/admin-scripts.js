/**
 * Ambrygen Admin Media Handler.
 *
 * @param {jQuery} $ jQuery object.
 */
( function ( $ ) {
	'use strict';

	$( document ).ready( function () {
		const $uploadBtn = $( '#ambrygen-upload-button' );

		// Prevent unused variable error before early return.
		if ( ! $uploadBtn.length ) {
			return;
		}

		let frame;

		const $removeBtn = $( '#ambrygen-remove-button' );
		const $imageId = $( '#ambrygen-placeholder-image-id' );
		const $wrapper = $( '#ambrygen-placeholder-wrapper' );

		$uploadBtn.on( 'click', function ( e ) {
			e.preventDefault();

			if ( frame ) {
				frame.open();
				return;
			}

			frame = wp.media( {
				title: 'Select Image',
				button: { text: 'Use this image' },
				multiple: false,
			} );

			frame.on( 'select', function () {
				const attachment = frame
					.state()
					.get( 'selection' )
					.first()
					.toJSON();

				$imageId.val( attachment.id );

				const imageUrl =
					attachment?.sizes?.medium?.url || attachment.url;

				$wrapper.html(
					`<img src="${ imageUrl }" style="max-width:150px;margin-bottom:10px;" />`
				);
			} );

			frame.open();
		} );

		$removeBtn.on( 'click', function () {
			$imageId.val( '' );
			$wrapper.html( '' );
		} );
	} );
} )( window.jQuery );
