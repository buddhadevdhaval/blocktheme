/**
 * Ambrygen Admin Media Handler.
 *
 * @param {Object} $ jQuery object.
 */
( function ( $ ) {
	'use strict';

	if ( window.__ambrygenAdminScriptsInitialized ) {
		return;
	}

	window.__ambrygenAdminScriptsInitialized = true;

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

	function renderThemeOptionLinkValue( input ) {
		const url = String( input?.value || '' ).trim();
		const field = input?.closest?.( '.ambrygen-link-picker' ) || null;
		const targetInput = field
			? field.querySelector( '.ambrygen-link-picker__target' )
			: null;
		const opensInNewTab = targetInput?.value === '_blank';

		if ( ! url ) {
			return '<span class="description">No link selected yet.</span>';
		}

		return (
			'<a href="' +
			escapeAttr( url ) +
			'"' +
			( opensInNewTab
				? ' target="_blank" rel="noopener noreferrer"'
				: '' ) +
			'>' +
			escapeHtml( url ) +
			'</a>'
		);
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
			let $linkedPostsSection = $container.find(
				'.ambrygen-linked-posts'
			);

			if ( ! $linkedPostsSection.length ) {
				$linkedPostsSection = $(
					'<div class="ambrygen-linked-posts"></div>'
				);
				$container
					.find( '.ambrygen-add-post-relationship' )
					.before( $linkedPostsSection );
			}

			$linkedPostsSection
				.show()
				.html(
					'<h6>Currently Linked Posts:</h6><ul style="margin:0;padding-left:20px;"></ul>'
				);
			$linkedPostsContainer = $container.find(
				'.ambrygen-linked-posts ul'
			);
		}

		return $linkedPostsContainer;
	}

	function syncRelationshipFieldInputs( $container ) {
		const $selectedContainer = $container.find(
			'.ambrygen-selected-posts'
		);
		const $linkedPostsContainer = $container.find(
			'.ambrygen-linked-posts ul'
		);
		let fieldName =
			$container.data( 'input-name' ) ||
			$selectedContainer.find( 'input' ).first().attr( 'name' ) ||
			'';

		fieldName = String( fieldName || '' ).replace( /\[\]$/, '' );

		if ( ! fieldName ) {
			return;
		}

		const isMultiple =
			String( $container.data( 'multiple' ) || '0' ) === '1';
		const inputName = isMultiple ? fieldName + '[]' : fieldName;

		$selectedContainer.empty();

		$linkedPostsContainer.find( 'li' ).each( function () {
			const postId = $( this )
				.find( '.ambrygen-remove-link' )
				.data( 'post-id' );

			if ( ! postId ) {
				return;
			}

			$selectedContainer.append(
				'<input type="hidden" name="' +
					inputName +
					'" value="' +
					postId +
					'">'
			);
		} );

		$selectedContainer.find( 'input' ).trigger( 'change' );
	}

	function initRelationshipSortable( $scope ) {
		$scope.find( '.ambrygen-linked-posts ul' ).each( function () {
			const $list = $( this );

			if ( $list.hasClass( 'ui-sortable' ) ) {
				return;
			}

			$list.sortable( {
				items: 'li',
				update() {
					syncRelationshipFieldInputs(
						$( this ).closest( '.ambrygen-post-relationship-field' )
					);
				},
			} );
		} );
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
		const files = Array.isArray( responseData.files )
			? responseData.files
			: [];
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
		initRelationshipSortable( $( document ) );

		const $themeOptionsTabs = $( '.ambrygen-theme-options-tabs' );
		const themeOptionsTabStorageKey = 'ambrygenThemeOptionsActiveTab';

		let activeLinkInput = null;

		if ( $themeOptionsTabs.length ) {
			$themeOptionsTabs.each( function () {
				const $container = $( this );
				const $tabButtons = $container.find( '[data-tab-target]' );
				const $tabPanels = $container.find( '[data-tab-panel]' );
				const $form = $container.closest( 'form' );
				const noticeClass = 'ambrygen-theme-options-notice';
				const noticeMarkup =
					'<div class="notice notice-error ' +
					noticeClass +
					'" hidden><p>Please paste the complete vendor snippet, including both <script> and </script> tags.</p></div>';
				let $validationNotice = $form.find( '.' + noticeClass );

				if ( ! $validationNotice.length ) {
					$form.find( '.nav-tab-wrapper' ).after( noticeMarkup );
					$validationNotice = $form.find( '.' + noticeClass );
				}

				// $tabButtons.on( 'click', function () {
				// 	const target = $( this ).data( 'tab-target' );
				const activateTab = function ( target ) {
					if ( ! target ) {
						return;
					}

					$tabButtons
						.removeClass( 'nav-tab-active' )
						.attr( 'aria-selected', 'false' );

					$tabPanels.each( function () {
						const isMatch =
							$( this ).data( 'tab-panel' ) === target;
						$( this ).prop( 'hidden', ! isMatch );
					} );

					$tabButtons
						.filter( '[data-tab-target="' + target + '"]' )
						.addClass( 'nav-tab-active' )
						.attr( 'aria-selected', 'true' );
				};
				const storedTab = window.localStorage.getItem(
					themeOptionsTabStorageKey
				);
				const hashTab = window.location.hash
					? window.location.hash.replace( '#', '' )
					: '';
				const initialTab = hashTab || storedTab || 'general';
				activateTab( initialTab );

				$tabButtons.on( 'click', function () {
					const target = $( this ).data( 'tab-target' );

					activateTab( target );
					window.localStorage.setItem(
						themeOptionsTabStorageKey,
						target
					);
					if ( window.history?.replaceState ) {
						window.history.replaceState( null, '', '#' + target );
					} else {
						window.location.hash = target;
					}
				} );
				$form.on( 'submit', function ( event ) {
					let hasInvalidField = false;

					$( this )
						.find( 'textarea[data-requires-script-tag="true"]' )
						.each( function () {
							const value = $( this ).val().trim();

							if ( ! value ) {
								return;
							}

							const isValidScriptSnippet =
								value.includes( '<script' ) &&
								value.includes( '</script>' );

							if ( isValidScriptSnippet ) {
								$( this ).removeClass( 'ambrygen-field-error' );
								return;
							}

							hasInvalidField = true;
							activateTab( 'scripts' );
							window.localStorage.setItem(
								themeOptionsTabStorageKey,
								'scripts'
							);
							$( this ).addClass( 'ambrygen-field-error' );
						} );

					if ( hasInvalidField ) {
						event.preventDefault();
						$validationNotice.prop( 'hidden', false );
						$validationNotice[ 0 ]?.scrollIntoView( {
							behavior: 'smooth',
							block: 'nearest',
						} );
					} else {
						$validationNotice.prop( 'hidden', true );
					}
				} );

				$form.on(
					'input',
					'textarea[data-requires-script-tag="true"]',
					function () {
						const value = $( this ).val().trim();
						const isValidScriptSnippet =
							! value ||
							( value.includes( '<script' ) &&
								value.includes( '</script>' ) );

						$( this ).toggleClass(
							'ambrygen-field-error',
							! isValidScriptSnippet
						);

						if (
							$form.find( '.ambrygen-field-error' ).length === 0
						) {
							$validationNotice.prop( 'hidden', true );
						}
					}
				);
			} );
		}

		// Handle generic theme option image fields
		$( document ).on(
			'click',
			'.ambrygen-theme-option-image-field .upload-button',
			function ( e ) {
				e.preventDefault();

				const $button = $( this );
				const $field = $button.closest(
					'.ambrygen-theme-option-image-field'
				);
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
						'<img src="' +
							imageUrl +
							'" style="max-width:150px;display:block;" />'
					);
				} );

				frame.open();
			}
		);

		$( document ).on(
			'click',
			'.ambrygen-theme-option-image-field .remove-button',
			function ( e ) {
				e.preventDefault();
				const $field = $( this ).closest(
					'.ambrygen-theme-option-image-field'
				);
				$field.find( '.image-id' ).val( '' );
				$field.find( '.image-preview' ).html( '' );
			}
		);

		// Legacy support for the single ID if still used elsewhere
		const $uploadBtn = $( '#ambrygen-upload-button' );
		if ( $uploadBtn.length ) {
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
		}

		$( document ).on(
			'click',
			'.ambrygen-link-picker__select',
			function ( event ) {
				event.preventDefault();

				if ( typeof window.wpLink === 'undefined' ) {
					return;
				}

				const field = this.closest( '.ambrygen-link-picker' );
				activeLinkInput = field
					? field.querySelector( '.ambrygen-link-picker__input' )
					: null;

				if ( ! activeLinkInput ) {
					return;
				}

				window.wpLink.textarea = $( activeLinkInput );
				window.wpLink.open();

				setTimeout( function () {
					const urlField = document.getElementById( 'wp-link-url' );
					const textField = document.getElementById( 'wp-link-text' );
					const targetField =
						document.getElementById( 'wp-link-target' );
					const textInput = field
						? field.querySelector( '.ambrygen-link-picker__text' )
						: null;
					const targetInput = field
						? field.querySelector( '.ambrygen-link-picker__target' )
						: null;

					if ( urlField ) {
						urlField.value = activeLinkInput.value || '';
					}

					if ( textField && textInput ) {
						textField.value = textInput.value || '';
					}

					if ( targetField && targetInput ) {
						targetField.checked = targetInput.value === '_blank';
					}
				}, 0 );
			}
		);

		$( document ).on(
			'click',
			'.ambrygen-link-picker__clear',
			function ( event ) {
				event.preventDefault();

				const field = this.closest( '.ambrygen-link-picker' );
				const input = field
					? field.querySelector( '.ambrygen-link-picker__input' )
					: null;

				if ( input ) {
					input.value = '';
					input.dispatchEvent(
						new Event( 'change', { bubbles: true } )
					);
					$( field )
						.find( '.ambrygen-link-picker__value' )
						.html( renderThemeOptionLinkValue( input ) );
				}
			}
		);

		$( document ).on(
			'change',
			'.ambrygen-link-picker__target',
			function () {
				const field = this.closest( '.ambrygen-link-picker' );
				const input = field
					? field.querySelector( '.ambrygen-link-picker__input' )
					: null;

				if ( ! input ) {
					return;
				}

				$( field )
					.find( '.ambrygen-link-picker__value' )
					.html( renderThemeOptionLinkValue( input ) );
			}
		);

		$( document ).on( 'click', '#wp-link-submit', function () {
			const selectedUrl = document.getElementById( 'wp-link-url' );

			if ( ! activeLinkInput || ! selectedUrl ) {
				return;
			}

			const selectedText = document.getElementById( 'wp-link-text' );
			const selectedTarget = document.getElementById( 'wp-link-target' );
			const activeField = activeLinkInput.closest(
				'.ambrygen-link-picker'
			);
			const textInput = activeField
				? activeField.querySelector( '.ambrygen-link-picker__text' )
				: null;
			const targetInput = activeField
				? activeField.querySelector( '.ambrygen-link-picker__target' )
				: null;

			activeLinkInput.value = selectedUrl.value || '';
			activeLinkInput.dispatchEvent(
				new Event( 'change', { bubbles: true } )
			);

			if ( textInput && selectedText ) {
				textInput.value = selectedText.value || '';
				textInput.dispatchEvent(
					new Event( 'change', { bubbles: true } )
				);
			}

			if ( targetInput && selectedTarget ) {
				targetInput.value = selectedTarget.checked ? '_blank' : '';
				targetInput.dispatchEvent(
					new Event( 'change', { bubbles: true } )
				);
			}

			$( activeLinkInput )
				.closest( '.ambrygen-link-picker' )
				.find( '.ambrygen-link-picker__value' )
				.html( renderThemeOptionLinkValue( activeLinkInput ) );
		} );

		$( document ).on( 'wplink-close', function () {
			const activeField = activeLinkInput
				? activeLinkInput.closest( '.ambrygen-link-picker' )
				: null;

			if ( ! activeLinkInput || ! activeField ) {
				return;
			}

			const selectedUrl = document.getElementById( 'wp-link-url' );
			const selectedText = document.getElementById( 'wp-link-text' );
			const selectedTarget = document.getElementById( 'wp-link-target' );
			const textInput = activeField.querySelector(
				'.ambrygen-link-picker__text'
			);
			const targetInput = activeField.querySelector(
				'.ambrygen-link-picker__target'
			);

			if ( selectedUrl ) {
				activeLinkInput.value = selectedUrl.value || '';
				activeLinkInput.dispatchEvent(
					new Event( 'change', { bubbles: true } )
				);
			}

			if ( textInput && selectedText ) {
				textInput.value = selectedText.value || '';
				textInput.dispatchEvent(
					new Event( 'change', { bubbles: true } )
				);
			}

			if ( targetInput && selectedTarget ) {
				targetInput.value = selectedTarget.checked ? '_blank' : '';
				targetInput.dispatchEvent(
					new Event( 'change', { bubbles: true } )
				);
			}

			$( activeField )
				.find( '.ambrygen-link-picker__value' )
				.html( renderThemeOptionLinkValue( activeLinkInput ) );
		} );
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

			$content.html(
				'<div class="ambrygen-tracking-modal__body"><p>Loading tracking info...</p></div>'
			);
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
		syncRelationshipFieldInputs( $container );

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
		const searchTerm = ( $searchInput.val() || '' ).trim();
		let postType = $postTypeFilter.val();
		const allowedPostTypes = $container.data( 'post-types' ) || [];

		if ( ! postType && allowedPostTypes.length === 1 ) {
			postType = allowedPostTypes[ 0 ];
		}

		if ( ! searchTerm ) {
			window.console.warn( 'Please enter a search term.' );
			return;
		}

		const $resultsContainer = $container.find( '.ambrygen-search-results' );

		if ( ! ajaxUrl || ! ajaxNonce ) {
			$resultsContainer
				.html( '<p>Error: search is not configured.</p>' )
				.show();
			return;
		}

		$resultsContainer.html( '<p>Searching...</p>' ).show();

		const $selectedContainer = $container.find(
			'.ambrygen-selected-posts'
		);
		const selectedIds = getSelectedIds( $selectedContainer );

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
					let html = '<ul>';

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
								' | ' +
								escapeHtml(
									post.post_status_label ||
										post.post_status ||
										''
								) +
								')</em>' +
								'<button type="button" class="button ' +
								buttonClass +
								' ambrygen-link-post btn-is-secondary" data-post-id="' +
								post.id +
								'" data-post-title="' +
								escapeAttr( post.title ) +
								'" data-post-type="' +
								escapeAttr( post.post_type || '' ) +
								'" data-post-type-label="' +
								escapeAttr( post.post_type_label || '' ) +
								'" data-post-status-label="' +
								escapeAttr(
									post.post_status_label ||
										post.post_status ||
										''
								) +
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

		const $linkedPostsSection = $container.find( '.ambrygen-linked-posts' );
		const $linkedPostsContainer = getLinkedPostsContainer( $container );
		const postId = $button.data( 'post-id' );
		const postTitle = $button.data( 'post-title' );
		const postTypeLabel = $button.data( 'post-type-label' );
		const postStatusLabel = $button.data( 'post-status-label' );
		const postViewUrl = $button.data( 'post-view-url' );
		const postEditUrl = $button.data( 'post-edit-url' );

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
				' | ' +
				escapeHtml( postStatusLabel || '' ) +
				')</em>' +
				links +
				' <a href="#" class="ambrygen-remove-link" data-post-id="' +
				postId +
				'" style="color:#dc3232;text-decoration:none;">[Remove]</a>' +
				'</li>'
		);
		initRelationshipSortable( $container );
		syncRelationshipFieldInputs( $container );

		$button
			.text( 'Already Linked' )
			.removeClass( 'button-primary' )
			.addClass( 'button-disabled' )
			.prop( 'disabled', true );
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

	function getMediaFilePreviewHtml( attachment ) {
		if ( ! attachment ) {
			return '<span class="ambrygen-media-file-empty">No file selected.</span>';
		}

		const id = attachment.get( 'id' ) || 0;
		const url = attachment.get( 'url' ) || '';
		const title = getAttachmentTitle( attachment );
		const linkLabel = title || url.split( '/' ).pop() || url;
		const type = attachment.get( 'type' ) || '';
		const previewUrl =
			'image' === type ? getAttachmentPreviewUrl( attachment ) : '';

		if ( ! url ) {
			return '<span class="ambrygen-media-file-empty">No file selected.</span>';
		}

		return (
			'<span class="ambrygen-media-file-preview-item" data-attachment-id="' +
			escapeAttr( id ) +
			'">' +
			( previewUrl
				? '<img src="' +
				  escapeAttr( previewUrl ) +
				  '" alt="" style="display:block;max-width:180px;height:auto;border:1px solid #ddd;border-radius:4px;margin-bottom:8px;" />'
				: '' ) +
			'<a class="ambrygen-media-file-link" href="' +
			escapeAttr( url ) +
			'" target="_blank" rel="noopener">' +
			escapeHtml( linkLabel ) +
			'</a>' +
			'</span>'
		);
	}

	function mediaFieldExpectsImage( $field ) {
		return 'image' === String( $field.data( 'library-type' ) || '' );
	}

	function getMediaGalleryPreviewItemHtml( attachment ) {
		const id = attachment.get( 'id' ) || 0;
		const url = getAttachmentPreviewUrl( attachment );
		const title = getAttachmentTitle( attachment ) || id;

		if ( ! id || ! url ) {
			return '';
		}

		return (
			'<div class="ambrygen-media-gallery-preview-item" data-attachment-id="' +
			escapeAttr( id ) +
			'" style="position:relative;display:inline-flex;">' +
			'<img src="' +
			escapeAttr( url ) +
			'" alt="" style="width:72px;height:72px;object-fit:cover;border:1px solid #ddd;border-radius:4px;display:block;" />' +
			'<button type="button" class="button-link-delete ambrygen-media-gallery-remove-item" aria-label="' +
			escapeAttr( `Remove image ${ title }` ) +
			'" title="' +
			escapeAttr( `Remove image ${ title }` ) +
			'" style="position:absolute;top:4px;right:4px;width:22px;height:22px;display:flex;align-items:center;justify-content:center;border-radius:999px;background:rgba(17,24,39,0.82);color:#fff;text-align:center;text-decoration:none;font-size:15px;font-weight:700;line-height:1;border:1px solid rgba(255,255,255,0.22);box-shadow:0 1px 3px rgba(0,0,0,0.22);">&times;</button>' +
			'</div>'
		);
	}

	function renderMediaFilePreview( $field, attachment ) {
		const $input = $field.find( '.ambrygen-media-file-input' );
		const $preview = $field.find( '.ambrygen-media-file-preview' );

		if ( ! $input.length || ! $preview.length ) {
			return;
		}

		if ( ! attachment ) {
			$input.val( '' ).trigger( 'change' );
			$preview.html( getMediaFilePreviewHtml( null ) );
			return;
		}

		const id = attachment.get( 'id' ) || 0;
		$input.val( id ).trigger( 'change' );
		$preview.html( getMediaFilePreviewHtml( attachment ) );
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
			( typeof attachment.get === 'function' &&
				attachment.get( 'id' ) ) ||
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

			$preview.append( getMediaGalleryPreviewItemHtml( attachment ) );
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

	$( document ).on(
		'click',
		'.ambrygen-media-gallery-upload',
		function ( e ) {
			e.preventDefault();

			if ( ! window.wp || ! window.wp.media ) {
				return;
			}

			const $button = $( this );
			const $field = $button.closest( '.ambrygen-media-gallery-field' );

			let frame = $field.data( 'ambrygenMediaGalleryFrame' );
			if ( frame ) {
				frame.open();
				return;
			}

			const $input = $field.find( '.ambrygen-media-gallery-input' );

			frame = wp.media( {
				title: 'Select Images',
				button: { text: 'Use selected images' },
				multiple: true,
				library: { type: 'image' },
			} );
			$field.data( 'ambrygenMediaGalleryFrame', frame );

			frame.on( 'open', function () {
				const selection = frame.state().get( 'selection' );
				const currentIds = parseIdList( $input.val() );

				selection.reset();

				currentIds.forEach( function ( id ) {
					const attachment = wp.media.attachment( id );
					attachment.fetch();
					selection.add( attachment );
				} );
			} );

			frame.on( 'select', function () {
				const selection = frame.state().get( 'selection' );
				const attachments = selection
					.toArray()
					.filter( function ( model ) {
						return model && model.get;
					} );
				const existingIds = parseIdList( $input.val() );

				const selectedIds = attachments.reduce( function (
					ids,
					model
				) {
					const id = model.get( 'id' ) || 0;

					if ( id > 0 ) {
						ids.push( id );
					}

					return ids;
				}, [] );

				const ids = Array.from(
					new Set( [ ...existingIds, ...selectedIds ] )
				);

				const attachmentMap = new Map();

				attachments.forEach( function ( attachment ) {
					const attachmentId = attachment.get( 'id' ) || 0;

					if ( attachmentId > 0 ) {
						attachmentMap.set( attachmentId, attachment );
					}
				} );

				const previewAttachments = ids.map( function ( id ) {
					if ( attachmentMap.has( id ) ) {
						return attachmentMap.get( id );
					}

					return wp.media.attachment( id );
				} );

				$input.val( ids.join( ',' ) ).trigger( 'change' );
				renderMediaGalleryPreview( $field, previewAttachments );
			} );

			frame.open();
		}
	);

	$( document ).on(
		'click',
		'.ambrygen-media-gallery-remove',
		function ( e ) {
			e.preventDefault();

			const $button = $( this );
			const $field = $button.closest( '.ambrygen-media-gallery-field' );
			const $input = $field.find( '.ambrygen-media-gallery-input' );

			$input.val( '' ).trigger( 'change' );
			$field.find( '.ambrygen-media-gallery-preview' ).empty();
		}
	);

	$( document ).on(
		'click',
		'.ambrygen-media-gallery-remove-item',
		function ( e ) {
			e.preventDefault();

			const $button = $( this );
			const $item = $button.closest(
				'.ambrygen-media-gallery-preview-item'
			);
			const removeId = parseInt( $item.data( 'attachment-id' ), 10 ) || 0;

			if ( ! removeId ) {
				return;
			}

			const $field = $button.closest( '.ambrygen-media-gallery-field' );
			const $input = $field.find( '.ambrygen-media-gallery-input' );

			const nextIds = parseIdList( $input.val() ).filter(
				function ( id ) {
					return id !== removeId;
				}
			);

			$input.val( nextIds.join( ',' ) ).trigger( 'change' );
			$item.remove();
		}
	);

	$( document ).on( 'click', '.ambrygen-media-file-upload', function ( e ) {
		e.preventDefault();

		if ( ! window.wp || ! window.wp.media ) {
			return;
		}

		const $button = $( this );
		const $field = $button.closest( '.ambrygen-media-file-field' );

		let frame = $field.data( 'ambrygenMediaFileFrame' );
		if ( frame ) {
			frame.open();
			return;
		}

		const $input = $field.find( '.ambrygen-media-file-input' );
		const currentId = parseInt( $input.val(), 10 ) || 0;
		const expectsImage = mediaFieldExpectsImage( $field );

		frame = wp.media( {
			title: 'Select File',
			button: { text: 'Use this file' },
			multiple: false,
			library: expectsImage ? { type: 'image' } : {},
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
		'.ambrygen-webinar-author-image-upload, .ambrygen-single-image-upload',
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
		'.ambrygen-webinar-author-image-remove, .ambrygen-single-image-remove',
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

	function syncPdfRepeaterAddButtons( $scope ) {
		const $root = $scope && $scope.length ? $scope : $( document );

		$root
			.find(
				'.ambrygen-mm-repeater[data-key="presentation_pdf_files"], .ambrygen-mm-repeater[data-key="poster_pdf_files"]'
			)
			.each( function () {
				const $repeater = $( this );
				const $rows = $repeater.find( '.ambrygen-mm-rows' ).first();
				const $allAddButtons = $rows.find( '.ambrygen-mm-add-row' );

				$allAddButtons.hide();
				$rows
					.children( '.ambrygen-mm-row' )
					.last()
					.find( '.ambrygen-mm-add-row' )
					.first()
					.css( 'display', 'inline-flex' );
			} );
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

			if (
				window.tinymce &&
				typeof window.tinymce.get === 'function' &&
				window.tinymce.get( editorId )
			) {
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

	function initializeMeetExpertEditors( $scope ) {
		if (
			! window.wp ||
			! wp.editor ||
			typeof wp.editor.initialize !== 'function'
		) {
			return;
		}

		$scope.find( 'textarea.ambrygen-meet-expert-bio' ).each( function () {
			const textarea = this;
			const editorId = textarea.getAttribute( 'id' );

			if ( ! editorId || textarea.dataset.editorReady === '1' ) {
				return;
			}

			if (
				window.tinymce &&
				typeof window.tinymce.get === 'function' &&
				window.tinymce.get( editorId )
			) {
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

	function maybeInitializeMeetExpertEditors( $scope ) {
		initializeMeetExpertEditors( $scope );

		window.setTimeout( function () {
			initializeMeetExpertEditors( $scope );
		}, 50 );
	}

	function removeMeetExpertEditors( $scope ) {
		if (
			! window.wp ||
			! wp.editor ||
			typeof wp.editor.remove !== 'function'
		) {
			return;
		}

		$scope.find( 'textarea.ambrygen-meet-expert-bio' ).each( function () {
			const editorId = this.getAttribute( 'id' );

			if ( editorId ) {
				wp.editor.remove( editorId );
			}
		} );
	}

	$( document )
		.off(
			'input.ambrygenWebinarAuthorSearch',
			'.ambrygen-webinar-author-search'
		)
		.on(
			'input.ambrygenWebinarAuthorSearch',
			'.ambrygen-webinar-author-search',
			function () {
				const $input = $( this );
				const $row = $input.closest( '.ambrygen-mm-row' );
				const $hiddenInput = $row.find( '.ambrygen-webinar-author-id' );
				let matchedId = '';

				$row.find( '.ambrygen-webinar-author-option' ).each(
					function () {
						if ( $( this ).val() === $input.val() ) {
							matchedId = $( this ).data( 'author-id' ) || '';
						}
					}
				);

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
			if (
				repeaterKey === 'webinar_authors' ||
				repeaterKey === 'webinar_additional_sections'
			) {
				const $newRow = $rows.children().last();
				maybeInitializeDynamicWysiwygEditors( $newRow );
			}

			syncPdfRepeaterAddButtons( $repeater );
		} );

	$( function () {
		maybeInitializeDynamicWysiwygEditors( $( document ) );
		maybeInitializeMeetExpertEditors( $( document ) );
		syncPdfRepeaterAddButtons( $( document ) );
	} );

	$( document ).on( 'click', '.ambrygen-mm-remove-row', function ( e ) {
		e.preventDefault();

		const $button = $( this );
		const $row = $button.closest( '.ambrygen-mm-row' );
		const $repeater = $button.closest( '.ambrygen-mm-repeater' );
		$row.remove();
		syncPdfRepeaterAddButtons( $repeater );
	} );

	$( document ).on(
		'click',
		'.ambrygen-meet-expert-add-session',
		function ( e ) {
			e.preventDefault();

			const $button = $( this );
			const $repeater = $button.closest(
				'.ambrygen-meet-expert-repeater'
			);
			const $rows = $repeater
				.find( '.ambrygen-meet-expert-rows' )
				.first();
			const $template = $repeater
				.find( '.ambrygen-meet-expert-template' )
				.first();

			if ( ! $rows.length || ! $template.length ) {
				return;
			}

			const index = String(
				Date.now() + Math.floor( Math.random() * 1000 )
			);
			const html = String( $template.html() || '' ).replace(
				/__INDEX__/g,
				index
			);

			$rows.append( html );
			maybeInitializeMeetExpertEditors( $rows.children().last() );
		}
	);

	$( document ).on(
		'click',
		'.ambrygen-meet-expert-add-member',
		function ( e ) {
			e.preventDefault();

			const $button = $( this );
			const $sessionRow = $button.closest(
				'.ambrygen-meet-expert-session-row'
			);
			const $repeater = $button.closest(
				'.ambrygen-meet-expert-repeater'
			);
			const $members = $sessionRow
				.find( '.ambrygen-meet-expert-member-rows' )
				.first();
			const $template = $repeater
				.find( '.ambrygen-meet-expert-member-template' )
				.first();

			if (
				! $sessionRow.length ||
				! $members.length ||
				! $template.length
			) {
				return;
			}

			const sessionIndex = $sessionRow.index();
			const memberIndex = String(
				Date.now() + Math.floor( Math.random() * 1000 )
			);
			const html = String( $template.html() || '' )
				.replace( /__SESSION_INDEX__/g, String( sessionIndex ) )
				.replace( /__MEMBER_INDEX__/g, memberIndex );

			$members.append( html );
			maybeInitializeMeetExpertEditors( $members.children().last() );
		}
	);

	$( document ).on(
		'click',
		'.ambrygen-meet-expert-remove-session',
		function ( e ) {
			e.preventDefault();

			const $row = $( this ).closest(
				'.ambrygen-meet-expert-session-row'
			);

			if ( ! $row.length ) {
				return;
			}

			removeMeetExpertEditors( $row );
			$row.remove();
		}
	);

	$( document ).on(
		'click',
		'.ambrygen-meet-expert-remove-member',
		function ( e ) {
			e.preventDefault();

			const $row = $( this ).closest(
				'.ambrygen-meet-expert-member-row'
			);

			if ( ! $row.length ) {
				return;
			}

			removeMeetExpertEditors( $row );
			$row.remove();
		}
	);

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

	function initGeneChecklistSearch() {
		$( '.taxonomy-gene .categorydiv, #taxonomy-gene.categorydiv' ).each(
			function () {
				const $box = $( this ).first();

				if ( $box.data( 'ambrygenGeneSearchReady' ) ) {
					return;
				}

				const $allList = $box.find( '#genechecklist' ).first();
				const $popularList = $box.find( '#genechecklist-pop' ).first();
				const $targetPanel = $allList.closest( '.tabs-panel' ).length
					? $allList.closest( '.tabs-panel' )
					: $box;

				if ( ! $allList.length && ! $popularList.length ) {
					return;
				}

				$box.data( 'ambrygenGeneSearchReady', true );
				$box.find( '.ambrygen-gene-search' ).remove();
				$box.find( '.ambrygen-gene-search-note' ).remove();

				const $search = $(
					'<input type="search" class="widefat ambrygen-gene-search" placeholder="Search genes..." style="margin:0 0 12px;" />'
				);
				const $note = $(
					'<p class="description ambrygen-gene-search-note" style="margin:0 0 12px;">Type at least 3 characters to search genes.</p>'
				);
				let debounceTimer = null;

				const filterList = function ( $list, query ) {
					if ( ! $list.length ) {
						return;
					}

					const $items = $list.children( 'li' );

					if ( ! query || query.length < 3 ) {
						$items.show();
						$list.find( 'li' ).show();
						return;
					}

					$items.each( function () {
						const $item = $( this );
						const ownText = String(
							$item.children( 'label' ).text() || ''
						).toLowerCase();
						const descendants = $item.find( 'li' );
						let hasVisibleChild = false;

						descendants.each( function () {
							const $child = $( this );
							const childText = String(
								$child.children( 'label' ).text() || ''
							).toLowerCase();
							const childMatch =
								childText.indexOf( query ) !== -1;

							$child.toggle( childMatch );
							if ( childMatch ) {
								hasVisibleChild = true;
							}
						} );

						$item.toggle(
							ownText.indexOf( query ) !== -1 || hasVisibleChild
						);
					} );
				};

				const runFilter = function () {
					const query = String( $search.val() || '' )
						.toLowerCase()
						.trim();
					filterList( $allList, query );
					filterList( $popularList, query );
				};

				$search.on( 'input', function () {
					if ( debounceTimer ) {
						window.clearTimeout( debounceTimer );
					}

					debounceTimer = window.setTimeout( function () {
						runFilter();
						debounceTimer = null;
					}, 120 );
				} );

				$targetPanel.first().prepend( $search );
				$search.after( $note );
			}
		);
	}

	$( document ).ready( function () {
		initPostTemplateEditorMarkupWatcher();
		initGeneChecklistSearch();
	} );
} )( window.jQuery );
