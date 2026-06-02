<?php

namespace Ambrygen\Theme\Core;

defined('ABSPATH') || exit;

final class GlobalVideoModalService
{
	use Singleton;

	protected function __construct()
	{
		add_action('wp_footer', array($this, 'render_modal'));
	}

	public function render_modal(): void
	{
		?>
		<div class="modal-popup modal-popup--video global-video-modal" id="global-video-modal" data-video-modal
			style="display: none;">
			<div class="modal-popup__overlay"></div>
			<div class="modal-popup__panel" role="dialog" aria-modal="true" aria-labelledby="global-video-modal-title">
				<button type="button" class="modal-popup__close"
					aria-label="<?php esc_attr_e('Close modal', 'ambrygen-web'); ?>">
					<img decoding="async"
						src="<?php echo esc_url(get_theme_file_uri('assets/src/images/close-icon.svg')); ?>"
						alt="<?php esc_attr_e('Close', 'ambrygen-web'); ?>" />
				</button>
				<div class="modal-content">
					<div id="global-video-modal-container" class="modal-content__video-wrapper" data-video-modal-container>
						<!-- Video iframe will be inserted here -->
					</div>
					<div class="is-style-gl-s24"></div>
					<div id="global-video-modal-title" class="modal-content__title heading-6 mb-0" data-video-modal-title></div>
					<div class="is-style-gl-s16"></div>
					<div id="global-video-modal-description" class="modal-content__description" data-video-modal-description>
					</div>
				</div>
			</div>
		</div>
		<?php
	}
}
