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

	$( document ).on( 'click', '.ambrygen-mm-add-row', function ( e ) {
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
