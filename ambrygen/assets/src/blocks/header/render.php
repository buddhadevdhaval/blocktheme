<?php
	/**
	 * Render: Header Block
	 *
	 * @param array    $attributes The block attributes.
	 * @param string   $content    The block content.
	 * @param WP_Block $block      The block instance.
	 *
	 * @package ambrygen
	 */
	// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
	use Ambrygen\Theme\Core\Helper;
	use Ambrygen\Theme\Core\Theme_Options;
	/**
 * Normalize attributes.
 */
	$ambrygen_attributes = isset( $attributes ) && is_array( $attributes ) ? $attributes : array();
	$ambrygen_content    = isset( $content ) ? $content : '';

	$ambrygen_nav_items = isset( $ambrygen_attributes['navItems'] ) && is_array( $ambrygen_attributes['navItems'] )
	? $ambrygen_attributes['navItems']
	: array();

	$ambrygen_login_url  = isset( $ambrygen_attributes['loginUrl'] ) ? $ambrygen_attributes['loginUrl'] : '#';
	$ambrygen_login_text = isset( $ambrygen_attributes['loginText'] ) ? $ambrygen_attributes['loginText'] : __( 'Login', 'ambrygen-web' );

	$ambrygen_mobile_cta_text = isset( $ambrygen_attributes['mobileCtaText'] )
	? $ambrygen_attributes['mobileCtaText']
	: __( 'See a Demo', 'ambrygen-web' );

	$ambrygen_mobile_cta_url        = isset( $ambrygen_attributes['mobileCtaUrl'] ) ? $ambrygen_attributes['mobileCtaUrl'] : '#';
	$ambrygen_modal_position        = isset( $ambrygen_attributes['modalPosition'] ) ? $ambrygen_attributes['modalPosition'] : 'center';
	$ambrygen_header_popup_settings = Theme_Options::get_header_popup_settings();
	$ambrygen_header_popup_title    = $ambrygen_header_popup_settings['title'] ?? '';
	$ambrygen_header_popup_items    = isset( $ambrygen_header_popup_settings['items'] ) && is_array( $ambrygen_header_popup_settings['items'] )
		? $ambrygen_header_popup_settings['items']
		: array();
	$ambrygen_default_popup_icon    = get_theme_file_uri( 'assets/src/images/icn_user_profile.svg' );
	$ambrygen_valid_popup_items     = array();

foreach ( $ambrygen_header_popup_items as $ambrygen_popup_item ) {
	$ambrygen_popup_item_title = isset( $ambrygen_popup_item['title'] ) ? trim( (string) $ambrygen_popup_item['title'] ) : '';

	if ( '' === $ambrygen_popup_item_title ) {
		continue;
	}

	$ambrygen_valid_popup_items[] = $ambrygen_popup_item;
}

	/**
 * Parse InnerBlocks by menuId.
 */
	$ambrygen_inner_blocks_by_id = array();

if (
	isset( $block->inner_blocks )
	&& ! empty( $block->inner_blocks )
	) {
	foreach ( $block->inner_blocks as $ambrygen_inner_block ) {
		// Ensure attributes exist and menuId is set
		if ( isset( $ambrygen_inner_block->attributes['menuId'] ) && ! empty( $ambrygen_inner_block->attributes['menuId'] ) ) {
			$ambrygen_inner_blocks_by_id[ $ambrygen_inner_block->attributes['menuId'] ] = $ambrygen_inner_block->render();
		}
	}
}
	$ambrygen_top_bar_items = array();

	$ambrygen_top_bar_posts = get_posts(
		array(
			'post_type'      => 'top_bar_message',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'        => array(
				'menu_order' => 'ASC',
				'date'       => 'ASC',
			),
		)
	);

	foreach ( $ambrygen_top_bar_posts as $ambrygen_top_bar_post ) {
		$ambrygen_start_date_raw = (string) get_post_meta( $ambrygen_top_bar_post->ID, 'top_bar_message_start_date', true );
		$ambrygen_start_time_raw = (string) get_post_meta( $ambrygen_top_bar_post->ID, 'top_bar_message_start_time', true );
		$ambrygen_end_date_raw   = (string) get_post_meta( $ambrygen_top_bar_post->ID, 'top_bar_message_end_date', true );
		$ambrygen_end_time_raw   = (string) get_post_meta( $ambrygen_top_bar_post->ID, 'top_bar_message_end_time', true );
		$ambrygen_start_date     = '' !== $ambrygen_start_date_raw ? substr( $ambrygen_start_date_raw, 0, 10 ) : '';
		$ambrygen_end_date       = '' !== $ambrygen_end_date_raw ? substr( $ambrygen_end_date_raw, 0, 10 ) : '';
		$ambrygen_start_time     = '' !== $ambrygen_start_time_raw ? substr( $ambrygen_start_time_raw, 0, 5 ) : '';
		$ambrygen_end_time       = '' !== $ambrygen_end_time_raw ? substr( $ambrygen_end_time_raw, 0, 5 ) : '';
		$ambrygen_now_ts         = current_time( 'timestamp' );
		$ambrygen_start_ts       = null;
		$ambrygen_end_ts         = null;

		if ( '' === $ambrygen_start_date || '' === $ambrygen_end_date ) {
			continue;
		}

		if ( '' !== $ambrygen_start_date ) {
			$ambrygen_start_datetime = sprintf(
				'%s %s',
				$ambrygen_start_date,
				'' !== $ambrygen_start_time ? $ambrygen_start_time : '00:00'
			);
			$ambrygen_start_ts       = strtotime( $ambrygen_start_datetime );
		}

		if ( '' !== $ambrygen_end_date ) {
			$ambrygen_end_datetime = sprintf(
				'%s %s',
				$ambrygen_end_date,
				'' !== $ambrygen_end_time ? $ambrygen_end_time : '23:59'
			);
			$ambrygen_end_ts       = strtotime( $ambrygen_end_datetime );
		}

		if ( false === $ambrygen_start_ts || false === $ambrygen_end_ts ) {
			continue;
		}

		if ( $ambrygen_now_ts < $ambrygen_start_ts ) {
			continue;
		}

		if ( $ambrygen_now_ts > $ambrygen_end_ts ) {
			continue;
		}

		$ambrygen_top_bar_title = get_the_title( $ambrygen_top_bar_post );
		$ambrygen_message_text  = (string) get_post_meta( $ambrygen_top_bar_post->ID, 'top_bar_message_text', true );

		if (
			'' === trim( wp_strip_all_tags( $ambrygen_top_bar_title ) )
			&& '' === trim( wp_strip_all_tags( $ambrygen_message_text ) )
		) {
			continue;
		}

		$ambrygen_top_bar_cookie_name = 'ambrygen_top_bar_dismissed_post-' . (string) $ambrygen_top_bar_post->ID;
		if ( ! empty( $_COOKIE[ $ambrygen_top_bar_cookie_name ] ) ) {
			continue;
		}

		$ambrygen_top_bar_items[] = array(
			'key'         => 'post-' . (string) $ambrygen_top_bar_post->ID,
			'title'       => $ambrygen_top_bar_title,
			'text'        => $ambrygen_message_text,
			'link_text'   => (string) get_post_meta( $ambrygen_top_bar_post->ID, 'top_bar_message_link_text', true ),
			'link_url'    => (string) get_post_meta( $ambrygen_top_bar_post->ID, 'top_bar_message_link_url', true ),
			'color'       => (string) get_post_meta( $ambrygen_top_bar_post->ID, 'top_bar_message_color', true ),
			'dismissible' => '1' === (string) get_post_meta( $ambrygen_top_bar_post->ID, 'top_bar_message_dismissible', true ),
		);
	}
	?>

<header class="header-section">

	<?php if ( ! empty( $ambrygen_top_bar_items ) ) : ?>
		<div class="top-bar-stack" id="top-bar-ajax">
			<?php foreach ( $ambrygen_top_bar_items as $ambrygen_top_bar_item ) : ?>
				<?php $ambrygen_top_bar_color = ! empty( $ambrygen_top_bar_item['color'] ) ? sanitize_html_class( $ambrygen_top_bar_item['color'] ) : 'bg-primary_25'; ?>
				<?php $ambrygen_top_bar_title = ! empty( $ambrygen_top_bar_item['title'] ) ? $ambrygen_top_bar_item['title'] : $ambrygen_top_bar_item['text']; ?>
				<?php $ambrygen_top_bar_message = ! empty( $ambrygen_top_bar_item['text'] ) ? $ambrygen_top_bar_item['text'] : ''; ?>
				<?php $ambrygen_has_top_bar_details = '' !== trim( wp_strip_all_tags( $ambrygen_top_bar_message ) ) && trim( wp_strip_all_tags( $ambrygen_top_bar_message ) ) !== trim( wp_strip_all_tags( $ambrygen_top_bar_title ) ); ?>
				<div class="top-bar <?php echo esc_attr( $ambrygen_top_bar_color ); ?> center-align container-1340"
					data-top-bar-key="<?php echo esc_attr( $ambrygen_top_bar_item['key'] ?? 'manual' ); ?>">
					<div class="top-bar__wrapper wrapper">
						<div class="top-bar__row">
							<div class="top-bar__text">
								<span class="top-bar__text-content">
									<span class="top-bar__summary">
										<?php echo esc_html( $ambrygen_top_bar_title ); ?>
									</span>

									<?php if ( $ambrygen_has_top_bar_details ) : ?>
										<button type="button"
											class="top-bar__link top-bar__toggle"
											style="display: contents;"
											aria-expanded="false">
											<span class="top-bar__toggle-label site-btn is-style-site-text-btn has-right-arrow"><?php esc_html_e( 'Read More', 'ambrygen-web' ); ?></span>
										</button>
									<?php endif; ?>

									<?php if ( ! $ambrygen_has_top_bar_details && ! empty( $ambrygen_top_bar_item['link_text'] ) && ! empty( $ambrygen_top_bar_item['link_url'] ) ) : ?>
										<a href="<?php echo esc_url( $ambrygen_top_bar_item['link_url'] ); ?>"
											class="top-bar__link  site-btn is-style-site-text-btn has-right-arrow">
											<?php echo esc_html( $ambrygen_top_bar_item['link_text'] ); ?>
										</a>
									<?php endif; ?>

									<?php if ( $ambrygen_has_top_bar_details ) : ?>
										<span class="top-bar__details" hidden>
											<?php echo wp_kses_post( $ambrygen_top_bar_message ); ?>

											<?php if ( ! empty( $ambrygen_top_bar_item['link_text'] ) && ! empty( $ambrygen_top_bar_item['link_url'] ) ) : ?>
												<a href="<?php echo esc_url( $ambrygen_top_bar_item['link_url'] ); ?>"
													class="top-bar__link  site-btn is-style-site-text-btn has-right-arrow">
													<?php echo esc_html( $ambrygen_top_bar_item['link_text'] ); ?>
												</a>
											<?php endif; ?>
										</span>
									<?php endif; ?>
								</span>

									<div class="top-bar__close">
										<span class="top-bar__close-icon">
											<img src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/topbar-close-icon.svg' ) ); ?>"
												width="24" height="24" alt="<?php esc_attr_e( 'Close top bar', 'ambrygen-web' ); ?>" />
										</span>
									</div>
							</div>
						</div>
					</div>
				</div>
			<?php endforeach; ?>
		</div>
	<?php endif; ?>

	<div class="header container-1340">
		<div class="wrapper">
			<div class="header__inner d-flex justify-content-between">

				<!-- Logo -->
				<div class="header__logo logo">
					<?php
						$ambrygen_logo_url = isset( $ambrygen_attributes['logoUrl'] ) && ! empty( $ambrygen_attributes['logoUrl'] )
							? $ambrygen_attributes['logoUrl']
							: get_theme_file_uri( 'assets/src/images/site-logo.svg' );

						$ambrygen_logo_alt = isset( $ambrygen_attributes['logoAlt'] ) && ! empty( $ambrygen_attributes['logoAlt'] )
							? $ambrygen_attributes['logoAlt']
							: get_bloginfo( 'name' );
					?>
					<a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="header__logo-link" 	aria-label="<?php esc_attr_e( 'Ambry Genetics home', 'ambrygen' ); ?>"
>
						<img class="header__logo-img header__logo-img--default"
							src="<?php echo esc_url( $ambrygen_logo_url ); ?>"
							alt="<?php echo esc_attr( $ambrygen_logo_alt ); ?>" />
					</a>
				</div>

				<!-- Right Section -->
				<div class="header__navigation">

					<!-- Navigation -->
					<nav class="nav" aria-label="<?php esc_attr_e( 'Primary navigation', 'ambrygen-web' ); ?>">
						<div class="nav__overlay">
							<div class="nav__menu-btn-close">
								<span class="nav__menu-btn-line"></span>
								<span class="nav__menu-btn-line"></span>
							</div>
							<div class="nav__container">
								<div class="nav__menu" aria-label="Primary navigation">
									<ul class="nav__list">
										<?php
										foreach ( $ambrygen_nav_items as $ambrygen_item ) :
											?>
											<?php
												$ambrygen_has_mega_menu = ! empty( $ambrygen_item['hasMegaMenu'] );
												$ambrygen_is_second_lvl = ! empty( $ambrygen_item['isSecondLevel'] );
												$ambrygen_item_classes  = 'nav__item';

											if ( $ambrygen_has_mega_menu ) {
												$ambrygen_item_classes .= ' nav__item--has-children nav__item--menu-has-children';
											}
												$ambrygen_is_active = Helper::ambrygen_is_nav_item_active( $ambrygen_item );

											if ( $ambrygen_is_active ) {
												$ambrygen_item_classes .= ' active current-menu-item';
											}

											?>
											<li class="<?php echo esc_attr( $ambrygen_item_classes ); ?>">

												<div class="nav__item--angle">
													<div class="nav__item--tringle-touch">
														<a href="<?php echo esc_url( $ambrygen_item['url'] ); ?>" class="nav__link">
															<?php echo esc_html( $ambrygen_item['label'] ); ?>
														</a>
													</div>
												</div>
												<span class="nav__expand"></span>


												<?php if ( $ambrygen_has_mega_menu ) : ?>
													<div class="nav__item--mega-menu mega-menu--platform menu-two-column ">
															<div class="menu-drawer-close-button main-drawer-close-button">
															<div class="icon">
																<img src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/dropdown-arrow.svg' ) ); ?>" alt="Back" />
															</div>
															<span class="label-splus-bold-italic close-title"><?php echo esc_html( $ambrygen_item['label'] ); ?></span>
														</div>

														<div
															class="nav__item--mega-menu__wrapper<?php echo $ambrygen_is_second_lvl ? ' nav__item--mega-menu__second-level' : ''; ?>">
															<?php
																$ambrygen_menu_id = isset( $ambrygen_item['megaMenuId'] )
																	? $ambrygen_item['megaMenuId']
																	: '';

															if (
																	$ambrygen_menu_id
																	&& isset( $ambrygen_inner_blocks_by_id[ $ambrygen_menu_id ] )
																) {
																echo $ambrygen_inner_blocks_by_id[ $ambrygen_menu_id ]; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
															}
															?>
														</div>



													</div>
												<?php endif; ?>
											</li>
										<?php endforeach; ?>
									</ul>
								</div>

								<div class="header__search">
									<form class="morphing-btn-form" id="header-search-form-mobile" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
										<div class="morphing-btn-wrapper">
											<input class="morphing-btn-input" id="header-search-mobile" type="search" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" aria-label="<?php esc_attr_e( 'Search for:', 'ambrygen-web' ); ?>" placeholder="<?php esc_attr_e( 'Search', 'ambrygen-web' ); ?>">
											<label class="morphing-btn-label" for="header-search-mobile">
												<img alt="Search the Site" class="morphing-btn-icon-bell" src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/search-icon.svg' ) ); ?>"/> Search
											</label>
											<button type="submit" class="morphing-btn-submit" aria-label="Submit">
												Search
											</button>
										</div>
									</form>
								</div>

							</div>
						</div>
					</nav>

				</div>

				<!-- Desktop CTA -->
				<div class="header__right--col header__btns--desktop">
					<div class="header__search">
						<form class="morphing-btn-form" id="header-search-form-desktop" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
							<div class="morphing-btn-wrapper">
								<input class="morphing-btn-input" id="header-search" type="search" name="s" value="<?php echo esc_attr( get_search_query() ); ?>" aria-label="<?php esc_attr_e( 'Search for:', 'ambrygen-web' ); ?>" placeholder="<?php esc_attr_e( 'Search', 'ambrygen-web' ); ?>">
								<label class="morphing-btn-label" for="header-search">
									<img alt="Search the Site" class="morphing-btn-icon-bell" src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/search-icon.svg' ) ); ?>"/> Search
								</label>
								<button type="submit" class="morphing-btn-submit" aria-label="Submit">
									Search
								</button>
							</div>
						</form>
						</div>
					</div>

					<div class="header__login">
						<div class="user-icon">
							<button class="user-icon-click user-icon-click site-btn has-right-arrow site-btn" aria-expanded="false" aria-controls="modal-popup" aria-haspopup="dialog">
								Login
							</button>
						</div>

						<!-- User Modal -->
						<?php
							$ambrygen_modal_classes = 'modal-popup user-modal';
						if ( 'top-center' === $ambrygen_modal_position ) {
							$ambrygen_modal_classes .= ' user-modal--top-center';
						}
						?>
						<div class="<?php echo esc_attr( $ambrygen_modal_classes ); ?>" id="modal-popup" aria-hidden="true">
							<div class="modal-popup__overlay"></div>
							<div class="modal-popup__panel user-modal__panel" role="dialog" aria-modal="true" aria-labelledby="modal-popup-title">
								<button type="button" class="modal-popup__close" aria-label="Close modal">
									<img src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/close-icon.svg' ) ); ?>" alt="Close" />
								</button>
								<?php if ( '' !== trim( (string) $ambrygen_header_popup_title ) ) : ?>
									<div class="modal-popup__title heading-5" id="modal-popup-title"><?php echo esc_html( $ambrygen_header_popup_title ); ?></div>
								<?php endif; ?>
								<?php if ( ! empty( $ambrygen_valid_popup_items ) ) : ?>
								<div class="user-modal__grid">
									<?php foreach ( $ambrygen_valid_popup_items as $ambrygen_popup_item ) : ?>
										<?php
											$ambrygen_popup_item_title  = isset( $ambrygen_popup_item['title'] ) ? $ambrygen_popup_item['title'] : '';
											$ambrygen_popup_item_link   = isset( $ambrygen_popup_item['link'] ) && '' !== $ambrygen_popup_item['link'] ? $ambrygen_popup_item['link'] : '';
											$ambrygen_popup_item_target = isset( $ambrygen_popup_item['target'] ) && '_blank' === $ambrygen_popup_item['target'] ? '_blank' : '';
											$ambrygen_popup_item_rel    = '_blank' === $ambrygen_popup_item_target ? 'noopener noreferrer' : '';
											$ambrygen_popup_item_icon   = ! empty( $ambrygen_popup_item['image_id'] )
												? wp_get_attachment_image_url( (int) $ambrygen_popup_item['image_id'], 'thumbnail' )
												: $ambrygen_default_popup_icon;
										?>
										<a
											href="<?php echo esc_url( '' !== $ambrygen_popup_item_link ? $ambrygen_popup_item_link : '#' ); ?>"
											class="user-modal__box"
											<?php echo $ambrygen_popup_item_target ? ' target="' . esc_attr( $ambrygen_popup_item_target ) . '"' : ''; ?>
											<?php echo $ambrygen_popup_item_rel ? ' rel="' . esc_attr( $ambrygen_popup_item_rel ) . '"' : ''; ?>
										>
											<div class="user-modal__box-icon" >
												<img src="<?php echo esc_url( $ambrygen_popup_item_icon ?: $ambrygen_default_popup_icon ); ?>" alt="" />
											</div>
											<div class="user-modal__box-title subtitle2-sbold"><?php echo esc_html( $ambrygen_popup_item_title ); ?></div>
										</a>
									<?php endforeach; ?>
								</div>
								<?php endif; ?>
							</div>
						</div>
					</div>

					<div class="nav__menu-btn">
						<span class="nav__menu-btn-line"></span>
						<span class="nav__menu-btn-line nav__menu-btn-line--middle"></span>
						<span class="nav__menu-btn-line"></span>
					</div>

				</div>


			</div>
		</div>
	</div>

</header>
