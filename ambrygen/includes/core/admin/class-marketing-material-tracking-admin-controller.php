<?php

namespace Ambrygen\Theme\Core\Admin;

use Ambrygen\Theme\Core\Helper;
use Ambrygen\Theme\Core\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Admin controller for marketing material tracking details.
 */
final class MarketingMaterialTrackingAdminController {
	use Singleton;

	/**
	 * Constructor.
	 */
	protected function __construct() {
		add_filter( 'manage_marketing_material_posts_columns', array( $this, 'add_tracking_column' ) );
		add_action( 'manage_marketing_material_posts_custom_column', array( $this, 'render_tracking_column' ), 10, 2 );
		add_action( 'post_submitbox_misc_actions', array( $this, 'render_edit_screen_button' ) );
		add_action( 'wp_ajax_ambrygen_marketing_material_tracking_details', array( $this, 'handle_tracking_details' ) );
		add_action( 'admin_head', array( $this, 'render_modal_styles' ) );
		add_action( 'admin_footer', array( $this, 'render_modal_script' ) );
		add_action( 'save_post_marketing_material', array( $this, 'clear_tracking_cache' ) );
	}

	/**
	 * Add the tracking info column to the marketing material list table.
	 *
	 * @param array $columns Existing admin columns.
	 * @return array
	 */
	public function add_tracking_column( array $columns ): array {
		$columns['ambrygen_tracking_info'] = __( 'Tracking Info', 'ambrygen-web' );
		return $columns;
	}

	/**
	 * Render the tracking column content.
	 *
	 * @param string $column Column key.
	 * @param int    $post_id Marketing material post ID.
	 * @return void
	 */
	public function render_tracking_column( string $column, int $post_id ): void {
		if ( 'ambrygen_tracking_info' !== $column ) {
			return;
		}

		echo $this->get_tracking_button_html( $post_id );
	}

	/**
	 * Render the tracking info button on the edit screen.
	 *
	 * @return void
	 */
	public function render_edit_screen_button(): void {
		$screen = get_current_screen();
		if ( ! $screen || 'marketing_material' !== $screen->post_type ) {
			return;
		}

		$post_id = get_the_ID();
		if ( ! $post_id ) {
			return;
		}

		echo '<div class="misc-pub-section">';
		echo $this->get_tracking_button_html( (int) $post_id );
		echo '</div>';
	}

	/**
	 * Handle the tracking details AJAX request.
	 *
	 * @return void
	 */
	public function handle_tracking_details(): void {
		check_ajax_referer( 'ambrygen_marketing_material_tracking', 'nonce' );

		if ( ! current_user_can( 'edit_posts' ) ) {
			wp_send_json_error( array( 'message' => __( 'Permission denied.', 'ambrygen-web' ) ), 403 );
		}

		$post_id = isset( $_POST['post_id'] ) ? absint( wp_unslash( $_POST['post_id'] ) ) : 0;
		if ( $post_id <= 0 || 'marketing_material' !== get_post_type( $post_id ) ) {
			wp_send_json_error( array( 'message' => __( 'Invalid marketing material.', 'ambrygen-web' ) ), 400 );
		}

		$cache_key = 'ambrygen_mm_tracking_report_' . $post_id;
		$report    = get_transient( $cache_key );

		if ( ! is_array( $report ) ) {
			$report = Helper::get_marketing_material_tracking_report( $post_id );
			set_transient( $cache_key, $report, 5 * MINUTE_IN_SECONDS );
		}

		wp_send_json_success(
			array(
				'post_id'    => $post_id,
				'post_title' => get_the_title( $post_id ),
				'files'      => $report,
			)
		);
	}

	/**
	 * Clear the cached tracking report for a marketing material.
	 *
	 * @param int $post_id Marketing material post ID.
	 * @return void
	 */
	public function clear_tracking_cache( int $post_id ): void {
		delete_transient( 'ambrygen_mm_tracking_report_' . absint( $post_id ) );
	}

	/**
	 * Build the tracking info button markup.
	 *
	 * @param int $post_id Marketing material post ID.
	 * @return string
	 */
	private function get_tracking_button_html( int $post_id ): string {
		return sprintf(
			'<button type="button" class="button button-secondary ambrygen-tracking-info-button" data-post-id="%1$d">%2$s</button>',
			absint( $post_id ),
			esc_html__( 'Tracking Info', 'ambrygen-web' )
		);
	}

	/**
	 * Render inline modal styles for the tracking dialog.
	 *
	 * @return void
	 */
	public function render_modal_styles(): void {
		$screen = get_current_screen();
		if ( ! $screen || 'marketing_material' !== $screen->post_type ) {
			return;
		}
		?>
		<style>
			.ambrygen-tracking-modal {
				position: fixed;
				inset: 0;
				z-index: 100000;
			}

			.ambrygen-tracking-modal__backdrop {
				position: absolute;
				inset: 0;
				background: rgba(0, 0, 0, 0.45);
			}

			.ambrygen-tracking-modal__dialog {
				position: relative;
				z-index: 1;
				width: min(960px, calc(100vw - 40px));
				max-height: calc(100vh - 60px);
				margin: 30px auto;
				background: #fff;
				border-radius: 10px;
				box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
				overflow: hidden;
			}

			.ambrygen-tracking-modal__header {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 16px 20px;
				border-bottom: 1px solid #dcdcde;
			}

			.ambrygen-tracking-modal__header h2 {
				margin: 0;
				font-size: 20px;
			}

			.ambrygen-tracking-modal__close {
				font-size: 28px;
				line-height: 1;
				text-decoration: none;
			}

			.ambrygen-tracking-modal__body {
				padding: 20px;
				max-height: calc(100vh - 150px);
				overflow: auto;
			}

			.ambrygen-tracking-card {
				border: 1px solid #dcdcde;
				border-radius: 8px;
				margin-bottom: 14px;
				overflow: hidden;
			}

			.ambrygen-tracking-card__toggle {
				width: 100%;
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 16px;
				padding: 14px 16px;
				border: 0;
				background: #f6f7f7;
				text-align: left;
				cursor: pointer;
			}

			.ambrygen-tracking-card__panel {
				padding: 16px;
				background: #fff;
			}

			.ambrygen-tracking-card__pages {
				margin-top: 12px;
				padding-top: 12px;
				border-top: 1px solid #dcdcde;
			}

			.ambrygen-tracking-page-row {
				display: flex;
				align-items: center;
				justify-content: space-between;
				gap: 16px;
				padding: 10px 0;
				border-bottom: 1px solid #f0f0f1;
			}

			.ambrygen-tracking-page-row:last-child {
				border-bottom: 0;
			}

			.ambrygen-tracking-pages-toggle {
				padding-left: 0 !important;
			}
		</style>
		<?php
	}

	/**
	 * Render inline modal scripts for the tracking dialog.
	 *
	 * @return void
	 */
	public function render_modal_script(): void {
		$screen = get_current_screen();
		if ( ! $screen || 'marketing_material' !== $screen->post_type ) {
			return;
		}
		?>
		<script>
			(function ($) {
				function esc(value) {
					return String(value || '')
						.replace(/&/g, '&amp;')
						.replace(/</g, '&lt;')
						.replace(/>/g, '&gt;')
						.replace(/"/g, '&quot;')
						.replace(/'/g, '&#39;');
				}

				function renderPages(pages) {
					if (!Array.isArray(pages) || !pages.length) {
						return '<p class="ambrygen-tracking-pages-empty">No page usage recorded yet.</p>';
					}

					let html = '<div class="ambrygen-tracking-pages">';

					pages.forEach(function (page) {
						const pageLabel = page.page_title || page.page_path || 'Unknown page';
						let linksHtml = '';

						if (page.edit_url) {
							linksHtml += '<a href="' + esc(page.edit_url) + '" target="_blank" rel="noopener">Edit page</a>';
						}

						if (page.view_url) {
							linksHtml += (linksHtml ? ' | ' : '') + '<a href="' + esc(page.view_url) + '" target="_blank" rel="noopener">View page</a>';
						}

						html += '<div class="ambrygen-tracking-page-row">';
						html += '<div><strong>' + esc(pageLabel) + '</strong>';
						if (linksHtml) {
							html += '<div class="ambrygen-tracking-page-links">' + linksHtml + '</div>';
						}
						html += '</div>';
						html += '<div>' + esc('Used in ' + String(page.usage_count || 0) + ' block(s)') + ' | ' + esc(String(page.impressions || 0) + ' views, ' + String(page.clicks || 0) + ' clicks') + '</div>';
						html += '</div>';
					});

					html += '</div>';
					return html;
				}

				function renderContent(data) {
					const files = Array.isArray(data.files) ? data.files : [];
					let html = '<div class="ambrygen-tracking-modal__header"><h2>' + esc(data.post_title || 'Tracking Info') + '</h2><button type="button" class="button-link ambrygen-tracking-modal__close" aria-label="Close">×</button></div>';

					if (!files.length) {
						return html + '<div class="ambrygen-tracking-modal__body"><p>No marketing material files found.</p></div>';
					}

					html += '<div class="ambrygen-tracking-modal__body">';

					files.forEach(function (file, index) {
						const panelId = 'ambrygen-inline-tracking-panel-' + index;
						html += '<div class="ambrygen-tracking-card">';
						html += '<button type="button" class="ambrygen-tracking-card__toggle" data-target="#' + esc(panelId) + '" aria-expanded="false">';
						html += '<span><strong>' + esc(file.media_lab_id || 'No Media Lab ID') + '</strong> - ' + esc(file.file_title || 'Untitled file') + '</span>';
						html += '<span>' + esc(String(file.impressions || 0) + ' views, ' + String(file.clicks || 0) + ' clicks') + '</span>';
						html += '</button>';
						html += '<div class="ambrygen-tracking-card__panel" id="' + esc(panelId) + '" hidden>';
						html += '<p><strong>Tracking:</strong> ' + esc(String(file.impressions || 0) + ' views, ' + String(file.clicks || 0) + ' clicks') + '</p>';
						html += '<p><strong>Last click:</strong> ' + esc(file.last_click || 'No clicks yet') + '</p>';
						html += '<p><strong>Total page list:</strong> ' + esc(String((file.pages || []).length || 0)) + '</p>';
						html += '<button type="button" class="button button-link ambrygen-tracking-pages-toggle" data-target="#' + esc(panelId) + '-pages" aria-expanded="false">Where is used check</button>';
						html += '<div class="ambrygen-tracking-card__pages" id="' + esc(panelId) + '-pages" hidden>' + renderPages(file.pages || []) + '</div>';
						html += '</div></div>';
					});

					html += '</div>';
					return html;
				}

				function ensureModal() {
					let $modal = $('#ambrygen-tracking-modal');
					if ($modal.length) {
						return $modal;
					}

					$modal = $('<div id="ambrygen-tracking-modal" class="ambrygen-tracking-modal" style="display:none;"><div class="ambrygen-tracking-modal__backdrop"></div><div class="ambrygen-tracking-modal__dialog"><div class="ambrygen-tracking-modal__content"></div></div></div>');
					$('body').append($modal);
					return $modal;
				}

				$(document).off('click', '.ambrygen-tracking-info-button');
				$(document).off('click', '.ambrygen-tracking-modal__backdrop, .ambrygen-tracking-modal__close');
				$(document).off('click', '.ambrygen-tracking-card__toggle, .ambrygen-tracking-pages-toggle');

				$(document).on('click', '.ambrygen-tracking-info-button', function (event) {
					event.preventDefault();
					event.stopImmediatePropagation();

					const postId = parseInt($(this).data('post-id'), 10) || 0;
					if (!postId || !window.ambrygenAdminAjax || !window.ambrygenAdminAjax.ajaxUrl) {
						return;
					}

					const $modal = ensureModal();
					const $content = $modal.find('.ambrygen-tracking-modal__content');

					$content.html('<div class="ambrygen-tracking-modal__body"><p>Loading tracking info...</p></div>');
					$modal.show();

					$.ajax({
						url: window.ambrygenAdminAjax.ajaxUrl,
						type: 'POST',
						dataType: 'json',
						data: {
							action: 'ambrygen_marketing_material_tracking_details',
							post_id: postId,
							nonce: window.ambrygenAdminAjax.trackingNonce || ''
						},
						success: function (response) {
							if (response && response.success && response.data) {
								$content.html(renderContent(response.data));
								return;
							}

							$content.html('<div class="ambrygen-tracking-modal__body"><p>Unable to load tracking info.</p></div>');
						},
						error: function () {
							$content.html('<div class="ambrygen-tracking-modal__body"><p>Unable to load tracking info.</p></div>');
						}
					});
				});

				$(document).on('click', '.ambrygen-tracking-modal__backdrop, .ambrygen-tracking-modal__close', function (event) {
					event.preventDefault();
					event.stopImmediatePropagation();
					$('#ambrygen-tracking-modal').hide();
				});

				$(document).on('click', '.ambrygen-tracking-card__toggle, .ambrygen-tracking-pages-toggle', function (event) {
					event.preventDefault();
					event.stopImmediatePropagation();

					const target = $(this).data('target');
					const $panel = $(target);
					const isHidden = !$panel.is(':visible');

					if (!$panel.length) {
						return;
					}

					if (isHidden) {
						$panel.removeAttr('hidden').stop(true, true).slideDown(150);
						$(this).attr('aria-expanded', 'true');
						return;
					}

					$panel.stop(true, true).slideUp(150, function () {
						$panel.attr('hidden', 'hidden');
					});
					$(this).attr('aria-expanded', 'false');
				});
			})(jQuery);
		</script>
		<?php
	}
}
