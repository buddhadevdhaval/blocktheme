/**
 * Ambrygen Admin Media Handler.
 *
 * @param {Object} $ jQuery object.
 */
( function ( $ ) {
	'use strict';

	const ajaxConfig = window.ambrygenAdminAjax || {};
	const ajaxUrl = ajaxConfig.ajaxUrl || window.ajaxurl || '';
	const ajaxNonce = ajaxConfig.nonce || '';
	const trackingNonce = ajaxConfig.trackingNonce || '';

	function escapeHtml( value ) {
		return String( value || '' )
			.replace( /&/g, '&amp;' )
			.replace( /</g, '&lt;' )
			.replace( />/g, '&gt;' )
			.replace( /"/g, '&quot;' )
			.replace( /'/g, '&#39;' );
	}

	function escapeAttr( value ) {
		return escapeHtml( value );
	}

	function getSelectedIds( $selectedContainer ) {
		return $selectedContainer
			.find( 'input' )
			.map( function () {
				return parseInt( $( this ).val(), 10 ) || 0;
			} )
			.get()
			.filter( function ( id ) {
				return id > 0;
			} );
	}

	function getLinkedPostsContainer( $container ) {
		let $linkedPostsContainer = $container.find(
			'.ambrygen-linked-posts ul'
		);

		if ( ! $linkedPostsContainer.length ) {
			$container
				.find( '.ambrygen-linked-posts' )
				.show()
				.html(
					'<h4>Currently Linked Posts:</h4><ul style="margin:0;padding-left:20px;"></ul>'
				);
			$linkedPostsContainer = $container.find(
				'.ambrygen-linked-posts ul'
			);
		}

		return $linkedPostsContainer;
	}

	function renderTrackingPages( pages ) {
		if ( ! Array.isArray( pages ) || ! pages.length ) {
			return '<p class="ambrygen-tracking-pages-empty">No page usage recorded yet.</p>';
		}

		let html = '<div class="ambrygen-tracking-pages">';

		pages.forEach( function ( page ) {
			const pageLabel =
				page.page_title || page.page_path || 'Unknown page';
			let linksHtml = '';

			if ( page.edit_url ) {
				linksHtml +=
					'<a href="' +
					escapeAttr( page.edit_url ) +
					'" target="_blank" rel="noopener">Edit page</a>';
			}

			if ( page.view_url ) {
				linksHtml +=
					( linksHtml ? ' | ' : '' ) +
					'<a href="' +
					escapeAttr( page.view_url ) +
					'" target="_blank" rel="noopener">View page</a>';
			}

			html +=
				'<div class="ambrygen-tracking-page-row">' +
				'<div>' +
				'<strong>' +
				escapeHtml( pageLabel ) +
				'</strong>' +
				( linksHtml
					? '<div class="ambrygen-tracking-page-links">' +
					  linksHtml +
					  '</div>'
					: '' ) +
				'</div>' +
				'<div>' +
				escapeHtml(
					'Used in ' + String( page.usage_count || 0 ) + ' block(s)'
				) +
				' | ' +
				escapeHtml(
					String( page.impressions || 0 ) +
						' views, ' +
						String( page.clicks || 0 ) +
						' clicks'
				) +
				'</div>' +
				'</div>';
		} );

		html += '</div>';

		return html;
	}

	function renderTrackingModalContent( responseData ) {
		const files = Array.isArray( responseData.files ) ? responseData.files : [];
		let html =
			'<div class="ambrygen-tracking-modal__header">' +
			'<h2>' +
			escapeHtml( responseData.post_title || 'Tracking Info' ) +
			'</h2>' +
			'<button type="button" class="button-link ambrygen-tracking-modal__close" aria-label="Close">×</button>' +
			'</div>';

		if ( ! files.length ) {
			return (
				html +
				'<div class="ambrygen-tracking-modal__body"><p>No marketing material files found.</p></div>'
			);
		}

		html += '<div class="ambrygen-tracking-modal__body">';

		files.forEach( function ( file, index ) {
			const fileTitle = file.file_title || 'Untitled file';
			const mediaLabId = file.media_lab_id || 'No Media Lab ID';
			const pagesHtml = renderTrackingPages( file.pages );
			const panelId = 'ambrygen-tracking-panel-' + index;

			html +=
				'<div class="ambrygen-tracking-card">' +
				'<button type="button" class="ambrygen-tracking-card__toggle" data-target="#' +
				escapeAttr( panelId ) +
				'">' +
				'<span><strong>' +
				escapeHtml( mediaLabId ) +
				'</strong> - ' +
				escapeHtml( fileTitle ) +
				'</span>' +
				'<span>' +
				escapeHtml(
					String( file.impressions || 0 ) +
						' views, ' +
						String( file.clicks || 0 ) +
						' clicks'
				) +
				'</span>' +
				'</button>' +
				'<div class="ambrygen-tracking-card__panel" id="' +
				escapeAttr( panelId ) +
				'" hidden>' +
				'<p><strong>Tracking:</strong> ' +
				escapeHtml(
					String( file.impressions || 0 ) +
						' views, ' +
						String( file.clicks || 0 ) +
						' clicks'
				) +
				'</p>' +
				'<p><strong>Last click:</strong> ' +
				escapeHtml( file.last_click || 'No clicks yet' ) +
				'</p>' +
				'<p><strong>Total page list:</strong> ' +
				escapeHtml( String( file.pages.length || 0 ) ) +
				'</p>' +
				'<button type="button" class="button button-link ambrygen-tracking-pages-toggle" data-target="#' +
				escapeAttr( panelId ) +
				'-pages">Where is used check</button>' +
				'<div class="ambrygen-tracking-card__pages" id="' +
				escapeAttr( panelId ) +
				'-pages" hidden>' +
				pagesHtml +
				'</div>' +
				'</div>' +
				'</div>';
		} );

		html += '</div>';

		return html;
	}

	function ensureTrackingModal() {
		let $modal = $( '#ambrygen-tracking-modal' );

		if ( $modal.length ) {
			return $modal;
		}

		$modal = $(
			'<div id="ambrygen-tracking-modal" class="ambrygen-tracking-modal" style="display:none;">' +
				'<div class="ambrygen-tracking-modal__backdrop"></div>' +
				'<div class="ambrygen-tracking-modal__dialog">' +
					'<div class="ambrygen-tracking-modal__content"></div>' +
				'</div>' +
			'</div>'
		);

		$( 'body' ).append( $modal );

		return $modal;
	}

	$( document ).ready( function () {
		// Handle generic theme option image fields
		$( document ).on( 'click', '.ambrygen-theme-option-image-field .upload-button', function ( e ) {
			e.preventDefault();

			const $button = $( this );
			const $field = $button.closest( '.ambrygen-theme-option-image-field' );
			const $imageId = $field.find( '.image-id' );
			const $wrapper = $field.find( '.image-preview' );

			const frame = wp.media( {
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
					attachment?.sizes?.medium?.url || attachment.url || '';

				$wrapper.html(
					'<img src="' + imageUrl + '" style="max-width:150px;display:block;" />'
				);
			} );

			frame.open();
		} );

		$( document ).on( 'click', '.ambrygen-theme-option-image-field .remove-button', function ( e ) {
			e.preventDefault();
			const $field = $( this ).closest( '.ambrygen-theme-option-image-field' );
			$field.find( '.image-id' ).val( '' );
			$field.find( '.image-preview' ).html( '' );
		} );

		// Legacy support for the single ID if still used elsewhere
		const $uploadBtn = $( '#ambrygen-upload-button' );
		if ( $uploadBtn.length ) {
			let frame;
			const $removeBtn = $( '#ambrygen-remove-button' );
			const $imageId = $( '#ambrygen-placeholder-image-id' );
			const $wrapper = $( '#ambrygen-placeholder-wrapper' );

			$uploadBtn.on( 'click', function ( e ) {
				e.preventDefault();
				if ( frame ) { frame.open(); return; }
				frame = wp.media( {
					title: 'Select Image',
					button: { text: 'Use this image' },
					multiple: false,
				} );
				frame.on( 'select', function () {
					const attachment = frame.state().get( 'selection' ).first().toJSON();
					$imageId.val( attachment.id );
					const imageUrl = attachment?.sizes?.medium?.url || attachment.url;
					$wrapper.html( `<img src="${ imageUrl }" style="max-width:150px;margin-bottom:10px;" />` );
				} );
				frame.open();
			} );

			$removeBtn.on( 'click', function () {
				$imageId.val( '' );
				$wrapper.html( '' );
			} );
		}
	} );

	$( document ).on(
		'click',
		'.ambrygen-tracking-info-button',
		function ( event ) {
			event.preventDefault();

			const postId = parseInt( $( this ).data( 'post-id' ), 10 ) || 0;

			if ( ! postId || ! ajaxUrl || ! trackingNonce ) {
				return;
			}

			const $modal = ensureTrackingModal();
			const $content = $modal.find( '.ambrygen-tracking-modal__content' );

			$content.html( '<div class="ambrygen-tracking-modal__body"><p>Loading tracking info...</p></div>' );
			$modal.show();

			$.ajax( {
				url: ajaxUrl,
				type: 'POST',
				dataType: 'json',
				data: {
					action: 'ambrygen_marketing_material_tracking_details',
					post_id: postId,
					nonce: trackingNonce,
				},
				success( response ) {
					if ( response && response.success && response.data ) {
						$content.html(
							renderTrackingModalContent( response.data )
						);
						return;
					}

					$content.html(
						'<div class="ambrygen-tracking-modal__body"><p>Unable to load tracking info.</p></div>'
					);
				},
				error() {
					$content.html(
						'<div class="ambrygen-tracking-modal__body"><p>Unable to load tracking info.</p></div>'
					);
				},
			} );
		}
	);

	$( document ).on(
		'click',
		'.ambrygen-tracking-modal__backdrop, .ambrygen-tracking-modal__close',
		function () {
			$( '#ambrygen-tracking-modal' ).hide();
		}
	);

	$( document ).on( 'click', '.ambrygen-tracking-card__toggle', function () {
		const target = $( this ).data( 'target' );
		const $panel = $( target );
		const isHidden = $panel.attr( 'hidden' ) !== undefined;

		if ( isHidden ) {
			$panel.removeAttr( 'hidden' );
			return;
		}

		$panel.attr( 'hidden', 'hidden' );
	} );

	$( document ).on( 'click', '.ambrygen-tracking-pages-toggle', function () {
		const target = $( this ).data( 'target' );
		const $panel = $( target );
		const isHidden = $panel.attr( 'hidden' ) !== undefined;

		if ( isHidden ) {
			$panel.removeAttr( 'hidden' );
			return;
		}

		$panel.attr( 'hidden', 'hidden' );
	} );

	$( document ).on( 'click', '.ambrygen-remove-link', function ( e ) {
		e.preventDefault();

		const $link = $( this );
		const postId = $link.data( 'post-id' );
		const $container = $link.closest( '.ambrygen-post-relationship-field' );
		const $selectedContainer = $container.find(
			'.ambrygen-selected-posts'
		);
		const $linkedPostsContainer = $container.find(
			'.ambrygen-linked-posts ul'
		);

		$selectedContainer.find( 'input[value="' + postId + '"]' ).remove();
		$link.closest( 'li' ).remove();

		if ( ! $linkedPostsContainer.find( 'li' ).length ) {
			$container.find( '.ambrygen-linked-posts' ).hide();
		}
	} );

	$( document ).on( 'click', '.ambrygen-search-posts', function ( e ) {
		e.preventDefault();

		const $button = $( this );
		const $container = $button.closest(
			'.ambrygen-post-relationship-field'
		);
		const $searchInput = $container.find( '.ambrygen-post-search' );
		const $postTypeFilter = $container.find( '.ambrygen-post-type-filter' );
		const $resultsContainer = $container.find( '.ambrygen-search-results' );
		const $selectedContainer = $container.find(
			'.ambrygen-selected-posts'
		);
		const searchTerm = ( $searchInput.val() || '' ).trim();
		let postType = $postTypeFilter.val();
		const selectedIds = getSelectedIds( $selectedContainer );
		const allowedPostTypes = $container.data('post-types') || [];
		
		if ( ! postType && allowedPostTypes.length === 1 ) {
			postType = allowedPostTypes[0];
		}

		if ( ! searchTerm ) {
			window.alert( 'Please enter a search term.' );
			return;
		}

		if ( ! ajaxUrl || ! ajaxNonce ) {
			$resultsContainer
				.html( '<p>Error: search is not configured.</p>' )
				.show();
			return;
		}

		$resultsContainer.html( '<p>Searching...</p>' ).show();

		$.ajax( {
			url: ajaxUrl,
			type: 'POST',
			data: {
				action: 'ambrygen_search_posts',
				search: searchTerm,
				post_type: postType,
				exclude_ids: selectedIds,
				nonce: ajaxNonce,
			},
			success( response ) {
				if (
					response &&
					response.success &&
					response.data &&
					response.data.posts
				) {
					let html = '<ul style="margin:0;padding-left:20px;">';

					if ( ! response.data.posts.length ) {
						html += '<li>No posts found.</li>';
					} else {
						response.data.posts.forEach( function ( post ) {
							const isSelected =
								$selectedContainer.find(
									'input[value="' + post.id + '"]'
								).length > 0;
							const buttonText = isSelected
								? 'Already Linked'
								: 'Link';
							const buttonClass = isSelected
								? 'button-disabled'
								: 'button-primary';
							const buttonDisabled = isSelected
								? ' disabled'
								: '';

							html +=
								'<li>' +
								'<strong>' +
								escapeHtml( post.title ) +
								'</strong> <em>(' +
								escapeHtml( post.post_type_label ) +
								')</em><br>' +
								'<button type="button" class="button ' +
								buttonClass +
								' ambrygen-link-post" data-post-id="' +
								post.id +
								'" data-post-title="' +
								escapeAttr( post.title ) +
								'" data-post-type="' +
								escapeAttr( post.post_type || '' ) +
								'" data-post-type-label="' +
								escapeAttr( post.post_type_label || '' ) +
								'" data-post-view-url="' +
								escapeAttr( post.view_url || '' ) +
								'" data-post-edit-url="' +
								escapeAttr( post.edit_url || '' ) +
								'"' +
								buttonDisabled +
								'>' +
								buttonText +
								'</button>' +
								'</li>';
						} );
					}

					html += '</ul>';
					$resultsContainer.html( html );
					return;
				}

				$resultsContainer.html(
					'<p>Error: ' +
						escapeHtml(
							response && response.data
								? response.data
								: 'Unknown error'
						) +
						'</p>'
				);
			},
			error() {
				$resultsContainer.html(
					'<p>Error occurred during search.</p>'
				);
			},
		} );
	} );

	$( document ).on( 'click', '.ambrygen-link-post', function ( e ) {
		e.preventDefault();

		const $button = $( this );

		if ( $button.hasClass( 'button-disabled' ) ) {
			return;
		}

		const $container = $button.closest(
			'.ambrygen-post-relationship-field'
		);
		const $selectedContainer = $container.find(
			'.ambrygen-selected-posts'
		);
		const $linkedPostsSection = $container.find( '.ambrygen-linked-posts' );
		const $linkedPostsContainer = getLinkedPostsContainer( $container );
		const postId = $button.data( 'post-id' );
		const postTitle = $button.data( 'post-title' );
		const postTypeLabel = $button.data( 'post-type-label' );
		const postViewUrl = $button.data( 'post-view-url' );
		const postEditUrl = $button.data( 'post-edit-url' );
		const fieldName =
			$container.data( 'input-name' ) ||
			$selectedContainer.find( 'input' ).first().attr( 'name' ) ||
			'';
		const isMultiple =
			String( $container.data( 'multiple' ) || '0' ) === '1';
		const inputName = isMultiple ? fieldName + '[]' : fieldName;

		if ( ! fieldName ) {
			return;
		}

		$selectedContainer.append(
			'<input type="hidden" name="' +
				inputName +
				'" value="' +
				postId +
				'">'
		);

		let links = '';
		if ( postViewUrl ) {
			links +=
				' <a href="' +
				escapeAttr( postViewUrl ) +
				'" target="_blank" rel="noopener">[View]</a>';
		}
		if ( postEditUrl ) {
			links +=
				' <a href="' +
				escapeAttr( postEditUrl ) +
				'" target="_blank" rel="noopener">[Edit]</a>';
		}

		$linkedPostsSection.show();
		$linkedPostsContainer.append(
			'<li>' +
				escapeHtml( postTitle ) +
				' <em>(' +
				escapeHtml( postTypeLabel ) +
				')</em>' +
				links +
				' <a href="#" class="ambrygen-remove-link" data-post-id="' +
				postId +
				'" style="color:#dc3232;text-decoration:none;">[Remove]</a>' +
				'</li>'
		);

		$button
			.text( 'Already Linked' )
			.removeClass( 'button-primary' )
			.addClass( 'button-disabled' )
			.prop( 'disabled', true );
	} );

	$( document ).on( 'mouseenter', '.ambrygen-linked-posts ul', function () {
		if ( ! $( this ).hasClass( 'ui-sortable' ) ) {
			$( this ).sortable( {
				items: 'li',
				update() {
					const $container = $( this ).closest(
						'.ambrygen-post-relationship-field'
					);
					const $selectedContainer = $container.find(
						'.ambrygen-selected-posts'
					);
					let fieldName =
						$container.data( 'input-name' ) ||
						$selectedContainer
							.find( 'input' )
							.first()
							.attr( 'name' ) ||
						'';
					fieldName = String( fieldName || '' ).replace(
						/\[\]$/,
						''
					);
					const isMultiple =
						String( $container.data( 'multiple' ) || '0' ) === '1';
					const inputName = isMultiple ? fieldName + '[]' : fieldName;

					if ( ! fieldName ) {
						return;
					}

					$selectedContainer.empty();
					$( this )
						.find( 'li' )
						.each( function () {
							const postId = $( this )
								.find( '.ambrygen-remove-link' )
								.data( 'post-id' );
							$selectedContainer.append(
								'<input type="hidden" name="' +
									inputName +
									'" value="' +
									postId +
									'">'
							);
						} );
				},
			} );
		}
	} );

	function getAttachmentPreviewUrl( attachment ) {
		if ( ! attachment || ! attachment.get ) {
			return '';
		}

		const sizes = attachment.get( 'sizes' ) || null;
		if ( sizes && sizes.thumbnail && sizes.thumbnail.url ) {
			return sizes.thumbnail.url;
		}

		return attachment.get( 'url' ) || '';
	}

	function getAttachmentTitle( attachment ) {
		if ( ! attachment || ! attachment.get ) {
			return '';
		}

		return attachment.get( 'title' ) || attachment.get( 'filename' ) || '';
	}

	function renderMediaFilePreview( $field, attachment ) {
		const $input = $field.find( '.ambrygen-media-file-input' );
		const $preview = $field.find( '.ambrygen-media-file-preview' );

		if ( ! $input.length || ! $preview.length ) {
			return;
		}

		if ( ! attachment ) {
			$input.val( '' ).trigger( 'change' );
			$preview.html(
				'<span class="ambrygen-media-file-empty">No file selected.</span>'
			);
			return;
		}

		const id = attachment.get( 'id' ) || 0;
		const url = attachment.get( 'url' ) || '';
		const title = getAttachmentTitle( attachment );

		$input.val( id ).trigger( 'change' );

		if ( url ) {
			$preview.html(
				'<a class="ambrygen-media-file-link" href="' +
					escapeAttr( url ) +
					'" target="_blank" rel="noopener">' +
					escapeHtml( title || url.split( '/' ).pop() || url ) +
					'</a>'
			);
		} else {
			$preview.html(
				'<span class="ambrygen-media-file-empty">No file selected.</span>'
			);
		}
	}

	function renderSingleImagePreview( $field, attachment ) {
		const $input = $field.find( '.ambrygen-single-image-input' );
		const $preview = $field.find( '.ambrygen-single-image-preview' );

		if ( ! $input.length || ! $preview.length ) {
			return;
		}

		if ( ! attachment ) {
			$input.val( '' ).trigger( 'change' );
			$preview.html(
				'<span class="ambrygen-single-image-empty">No image selected.</span>'
			);
			return;
		}

		const id = attachment.get( 'id' ) || 0;
		const url = getAttachmentPreviewUrl( attachment );

		$input.val( id ).trigger( 'change' );

		if ( url ) {
			$preview.html(
				'<img src="' +
					escapeAttr( url ) +
					'" alt="" style="width:96px;height:96px;object-fit:cover;border:1px solid #ddd;border-radius:4px;" />'
			);
		} else {
			$preview.html(
				'<span class="ambrygen-single-image-empty">No image selected.</span>'
			);
		}
	}

	function renderTermImagePreview( $field, attachment ) {
		const $input = $field.find( '.term-image-field' );
		const $preview = $field.find( '.term_image_prev' );

		if ( ! $input.length || ! $preview.length ) {
			return;
		}

		if ( ! attachment ) {
			$input.val( '' ).trigger( 'change' );
			$preview.attr( 'src', '' ).hide();
			return;
		}

		const id =
			( typeof attachment.get === 'function' && attachment.get( 'id' ) ) ||
			attachment.id ||
			0;
		const url =
			( typeof attachment.get === 'function' &&
				getAttachmentPreviewUrl( attachment ) ) ||
			attachment.url ||
			'';

		$input.val( id ).trigger( 'change' );

		if ( url ) {
			$preview.attr( 'src', url ).show();
			return;
		}

		$preview.attr( 'src', '' ).hide();
	}

	function renderMediaGalleryPreview( $field, attachments ) {
		const $preview = $field.find( '.ambrygen-media-gallery-preview' );
		if ( ! $preview.length ) {
			return;
		}

		$preview.empty();
		attachments.forEach( function ( attachment ) {
			const url = getAttachmentPreviewUrl( attachment );

			if ( ! url ) {
				return;
			}

			$preview.append(
				`<img src="${ escapeAttr( url ) }" alt="" style="width:72px;height:72px;object-fit:cover;border:1px solid #ddd;border-radius:4px;" />`
			);
		} );
	}

	function parseIdList( value ) {
		return String( value || '' )
			.split( ',' )
			.map( function ( v ) {
				return parseInt( String( v ).trim(), 10 ) || 0;
			} )
			.filter( function ( id ) {
				return id > 0;
			} );
	}

	$( document ).on( 'click', '.ambrygen-media-gallery-upload', function ( e ) {
		e.preventDefault();

		if ( ! window.wp || ! window.wp.media ) {
			return;
		}

		const $button = $( this );
		const $field = $button.closest( '.ambrygen-media-gallery-field' );
		const $input = $field.find( '.ambrygen-media-gallery-input' );
		const currentIds = parseIdList( $input.val() );

		let frame = $field.data( 'ambrygenMediaGalleryFrame' );
		if ( frame ) {
			frame.open();
			return;
		}

		frame = wp.media( {
			title: 'Select Images',
			button: { text: 'Use selected images' },
			multiple: true,
			library: { type: 'image' },
		} );
		$field.data( 'ambrygenMediaGalleryFrame', frame );

		frame.on( 'open', function () {
			const selection = frame.state().get( 'selection' );
			currentIds.forEach( function ( id ) {
				const attachment = wp.media.attachment( id );
				attachment.fetch();
				selection.add( attachment );
			} );
		} );

		frame.on( 'select', function () {
			const selection = frame.state().get( 'selection' );
			const attachments = selection.toArray().filter( function ( model ) {
				return model && model.get;
			} );

			const ids = attachments
				.map( function ( model ) {
					return model.get( 'id' ) || 0;
				} )
				.filter( function ( id ) {
					return id > 0;
				} );

			$input.val( ids.join( ',' ) ).trigger( 'change' );
			renderMediaGalleryPreview( $field, attachments );
		} );

		frame.open();
	} );

	$( document ).on( 'click', '.ambrygen-media-gallery-remove', function ( e ) {
		e.preventDefault();

		const $button = $( this );
		const $field = $button.closest( '.ambrygen-media-gallery-field' );
		const $input = $field.find( '.ambrygen-media-gallery-input' );

		$input.val( '' ).trigger( 'change' );
		$field.find( '.ambrygen-media-gallery-preview' ).empty();
	} );

	$( document ).on( 'click', '.ambrygen-media-file-upload', function ( e ) {
		e.preventDefault();

		if ( ! window.wp || ! window.wp.media ) {
			return;
		}

		const $button = $( this );
		const $field = $button.closest( '.ambrygen-media-file-field' );
		const $input = $field.find( '.ambrygen-media-file-input' );
		const currentId = parseInt( $input.val(), 10 ) || 0;

		let frame = $field.data( 'ambrygenMediaFileFrame' );
		if ( frame ) {
			frame.open();
			return;
		}

		frame = wp.media( {
			title: 'Select File',
			button: { text: 'Use this file' },
			multiple: false,
		} );
		$field.data( 'ambrygenMediaFileFrame', frame );

		frame.on( 'open', function () {
			if ( ! currentId ) {
				return;
			}

			const selection = frame.state().get( 'selection' );
			const attachment = wp.media.attachment( currentId );
			attachment.fetch();
			selection.add( attachment );
		} );

		frame.on( 'select', function () {
			const selection = frame.state().get( 'selection' );
			const attachment = selection && selection.first();
			if ( ! attachment ) {
				return;
			}
			renderMediaFilePreview( $field, attachment );
		} );

		frame.open();
	} );

	$( document ).on( 'click', '.ambrygen-media-file-remove', function ( e ) {
		e.preventDefault();

		const $button = $( this );
		const $field = $button.closest( '.ambrygen-media-file-field' );
		renderMediaFilePreview( $field, null );
	} );

	$( document ).on(
		'click',
		'.ambrygen-webinar-author-image-upload',
		function ( e ) {
			e.preventDefault();

			if ( ! window.wp || ! window.wp.media ) {
				return;
			}

			const $button = $( this );
			const $field = $button.closest( '.ambrygen-single-image-field' );
			const $input = $field.find( '.ambrygen-single-image-input' );
			const currentId = parseInt( $input.val(), 10 ) || 0;

			let frame = $field.data( 'ambrygenSingleImageFrame' );
			if ( frame ) {
				frame.open();
				return;
			}

			frame = wp.media( {
				title: 'Select Image',
				button: { text: 'Use this image' },
				multiple: false,
				library: { type: 'image' },
			} );
			$field.data( 'ambrygenSingleImageFrame', frame );

			frame.on( 'open', function () {
				if ( ! currentId ) {
					return;
				}

				const selection = frame.state().get( 'selection' );
				const attachment = wp.media.attachment( currentId );
				attachment.fetch();
				selection.add( attachment );
			} );

			frame.on( 'select', function () {
				const selection = frame.state().get( 'selection' );
				const attachment = selection && selection.first();
				if ( ! attachment ) {
					return;
				}

				renderSingleImagePreview( $field, attachment );
			} );

			frame.open();
		}
	);

	$( document ).on(
		'click',
		'.ambrygen-webinar-author-image-remove',
		function ( e ) {
			e.preventDefault();

			const $button = $( this );
			const $field = $button.closest( '.ambrygen-single-image-field' );
			renderSingleImagePreview( $field, null );
		}
	);

	$( document ).on( 'click', '.upload-term-image', function ( e ) {
		e.preventDefault();

		if ( ! window.wp || ! window.wp.media ) {
			return;
		}

		const $button = $( this );
		const $field = $button.closest( '.term-image-wrap' );
		const $input = $field.find( '.term-image-field' );
		const currentId = parseInt( $input.val(), 10 ) || 0;

		let frame = $field.data( 'ambrygenTermImageFrame' );
		if ( frame ) {
			frame.open();
			return;
		}

		frame = wp.media( {
			title: 'Select Image',
			button: { text: 'Use this image' },
			multiple: false,
			library: { type: 'image' },
		} );
		$field.data( 'ambrygenTermImageFrame', frame );

		frame.on( 'open', function () {
			if ( ! currentId ) {
				return;
			}

			const selection = frame.state().get( 'selection' );
			const attachment = wp.media.attachment( currentId );
			attachment.fetch();
			selection.add( attachment );
		} );

		frame.on( 'select', function () {
			const selection = frame.state().get( 'selection' );
			const attachment = selection && selection.first();

			if ( ! attachment ) {
				return;
			}

			renderTermImagePreview( $field, attachment );
		} );

		frame.open();
	} );

	$( document ).on( 'click', '.remove-term-image', function ( e ) {
		e.preventDefault();

		const $button = $( this );
		const $field = $button.closest( '.term-image-wrap' );
		renderTermImagePreview( $field, null );
	} );

	function getNextRepeaterIndex( $rowsContainer ) {
		let maxIndex = -1;

		$rowsContainer.find( 'input, select, textarea' ).each( function () {
			const name = String( $( this ).attr( 'name' ) || '' );
			const match = name.match( /\[(\d+)\]\[/ );
			if ( match && match[ 1 ] ) {
				const index = parseInt( match[ 1 ], 10 );
				if ( Number.isFinite( index ) ) {
					maxIndex = Math.max( maxIndex, index );
				}
			}
		} );

		return maxIndex + 1;
	}

	function initializeDynamicWysiwygEditors( $scope ) {
		if (
			! window.wp ||
			! wp.editor ||
			typeof wp.editor.initialize !== 'function'
		) {
			return;
		}

		$scope.find( 'textarea.ambrygen-wysiwyg-textarea' ).each( function () {
			const textarea = this;
			const editorId = textarea.getAttribute( 'id' );

			if ( ! editorId || textarea.dataset.editorReady === '1' ) {
				return;
			}

			if ( window.tinymce && tinymce.get( editorId ) ) {
				textarea.dataset.editorReady = '1';
				return;
			}

			wp.editor.initialize( editorId, {
				tinymce: {
					wpautop: true,
					toolbar1:
						'bold,italic,bullist,numlist,link,unlink,undo,redo',
				},
				quicktags: true,
				mediaButtons: false,
			} );

			textarea.dataset.editorReady = '1';
		} );
	}

	function maybeInitializeDynamicWysiwygEditors( $scope ) {
		initializeDynamicWysiwygEditors( $scope );

		window.setTimeout( function () {
			initializeDynamicWysiwygEditors( $scope );
		}, 50 );
	}

	$( document )
		.off( 'input.ambrygenWebinarAuthorSearch', '.ambrygen-webinar-author-search' )
		.on(
			'input.ambrygenWebinarAuthorSearch',
			'.ambrygen-webinar-author-search',
			function () {
				const $input = $( this );
				const $row = $input.closest( '.ambrygen-mm-row' );
				const $hiddenInput = $row.find( '.ambrygen-webinar-author-id' );
				let matchedId = '';

				$row.find( '.ambrygen-webinar-author-option' ).each( function () {
					if ( $( this ).val() === $input.val() ) {
						matchedId = $( this ).data( 'author-id' ) || '';
					}
				} );

				$hiddenInput.val( matchedId );
			}
		);

	$( document )
		.off( 'click.ambrygenMmAddRow', '.ambrygen-mm-add-row' )
		.on( 'click.ambrygenMmAddRow', '.ambrygen-mm-add-row', function ( e ) {
		e.preventDefault();

		const $button = $( this );
		const $repeater = $button.closest( '.ambrygen-mm-repeater' );
		const $rows = $repeater.find( '.ambrygen-mm-rows' ).first();
		const $template = $repeater.find( '.ambrygen-mm-template' ).first();

		if ( ! $rows.length || ! $template.length ) {
			return;
		}

		const nextIndex = getNextRepeaterIndex( $rows );
		const html = String( $template.html() || '' ).replace(
			/__INDEX__/g,
			String( nextIndex )
		);

		$rows.append( html );

		const repeaterKey = $repeater.data( 'key' );
		if ( repeaterKey === 'webinar_authors' || repeaterKey === 'webinar_additional_sections' ) {
			const $newRow = $rows.children().last();
			maybeInitializeDynamicWysiwygEditors( $newRow );
		}
	} );

	$( function () {
		maybeInitializeDynamicWysiwygEditors( $( document ) );
	} );

	$( document ).on( 'click', '.ambrygen-mm-remove-row', function ( e ) {
		e.preventDefault();

		const $button = $( this );
		const $row = $button.closest( '.ambrygen-mm-row' );
		$row.remove();
	} );

	function convertElementTag( element, newTagName ) {
		if ( ! element || ! element.ownerDocument ) {
			return null;
		}

		const replacement = element.ownerDocument.createElement( newTagName );

		Array.from( element.attributes ).forEach( function ( attr ) {
			replacement.setAttribute( attr.name, attr.value );
		} );

		while ( element.firstChild ) {
			replacement.appendChild( element.firstChild );
		}

		element.parentNode.replaceChild( replacement, element );

		return replacement;
	}

	function normalizePostTemplateMarkup( rootDocument ) {
		if ( ! rootDocument || ! rootDocument.querySelectorAll ) {
			return;
		}

		rootDocument
			.querySelectorAll( '.event-carousel__grid, .custom-event-slider' )
			.forEach( function ( container ) {
				if ( container.tagName === 'UL' ) {
					container =
						convertElementTag( container, 'div' ) || container;
				}

				container.querySelectorAll( 'li' ).forEach( function ( item ) {
					convertElementTag( item, 'div' );
				} );
			} );
	}

	function watchEditorDocument( rootDocument ) {
		if ( ! rootDocument || rootDocument.__ambrygenPostTemplateObserver ) {
			return;
		}

		normalizePostTemplateMarkup( rootDocument );

		const observer = new MutationObserver( function () {
			normalizePostTemplateMarkup( rootDocument );
		} );

		const target = rootDocument.body || rootDocument.documentElement;

		if ( ! target ) {
			return;
		}

		observer.observe( target, {
			childList: true,
			subtree: true,
		} );

		rootDocument.__ambrygenPostTemplateObserver = observer;
	}

	function initPostTemplateEditorMarkupWatcher() {
		watchEditorDocument( document );

		document.querySelectorAll( 'iframe' ).forEach( function ( iframe ) {
			const attachWatcher = function () {
				try {
					if ( iframe.contentDocument ) {
						watchEditorDocument( iframe.contentDocument );
					}
				} catch ( error ) {
					// Ignore cross-origin or unavailable iframe documents.
				}
			};

			attachWatcher();
			iframe.addEventListener( 'load', attachWatcher );
		} );

		const iframeObserver = new MutationObserver( function () {
			document.querySelectorAll( 'iframe' ).forEach( function ( iframe ) {
				if ( iframe.__ambrygenPostTemplateIframeBound ) {
					return;
				}

				iframe.__ambrygenPostTemplateIframeBound = true;

				const attachWatcher = function () {
					try {
						if ( iframe.contentDocument ) {
							watchEditorDocument( iframe.contentDocument );
						}
					} catch ( error ) {
						// Ignore cross-origin or unavailable iframe documents.
					}
				};

				attachWatcher();
				iframe.addEventListener( 'load', attachWatcher );
			} );
		} );

		iframeObserver.observe( document.body || document.documentElement, {
			childList: true,
			subtree: true,
		} );
	}

	$( document ).ready( function () {
		initPostTemplateEditorMarkupWatcher();
	} );
} )( window.jQuery );
