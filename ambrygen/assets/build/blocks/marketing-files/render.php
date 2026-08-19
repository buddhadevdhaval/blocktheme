<?php
/**
 * Render: Marketing Files Block
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes       = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_block_id         = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_attributes['blockId'] ) : '';
$ambrygen_title            = isset( $ambrygen_attributes['title'] ) ? (string) $ambrygen_attributes['title'] : '';
$ambrygen_heading          = isset( $ambrygen_attributes['headingLevel'] ) ? sanitize_key( $ambrygen_attributes['headingLevel'] ) : 'h2';
$ambrygen_category         = isset( $ambrygen_attributes['selectedCategory'] ) && is_array( $ambrygen_attributes['selectedCategory'] )
	? $ambrygen_attributes['selectedCategory']
	: array();
$ambrygen_term_id          = isset( $ambrygen_category['id'] ) ? absint( $ambrygen_category['id'] ) : 0;
$ambrygen_material_type    = isset( $ambrygen_attributes['selectedMaterialType'] ) && is_array( $ambrygen_attributes['selectedMaterialType'] )
	? $ambrygen_attributes['selectedMaterialType']
	: array();
$ambrygen_material_type_id = isset( $ambrygen_material_type['id'] ) ? absint( $ambrygen_material_type['id'] ) : 0;
$ambrygen_sections         = isset( $ambrygen_attributes['sections'] ) && is_array( $ambrygen_attributes['sections'] )
	? $ambrygen_attributes['sections']
	: array();
$ambrygen_has_title        = '' !== trim( wp_strip_all_tags( $ambrygen_title ) );

$ambrygen_heading = Helper::get_heading_tag( $ambrygen_heading, 'h2' );

$ambrygen_wrapper_args = array(
	'class' => 'marketing-files block-layout',
);

if ( ! empty( $ambrygen_block_id ) ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
$ambrygen_cache_version      = class_exists( Helper::class ) && is_callable( array( Helper::class, 'get_marketing_material_cache_version' ) )
	? Helper::get_marketing_material_cache_version()
	: '1';

$ambrygen_query = null;

if ( $ambrygen_term_id > 0 ) {
	$ambrygen_tax_query = array(
		array(
			'taxonomy' => 'poster_category',
			'field'    => 'term_id',
			'terms'    => $ambrygen_term_id,
		),
	);

	if ( $ambrygen_material_type_id > 0 ) {
		$ambrygen_tax_query[] = array(
			'taxonomy' => 'marketing_material_type',
			'field'    => 'term_id',
			'terms'    => $ambrygen_material_type_id,
		);
	}

	$ambrygen_query_args = array(
		'post_type'      => 'marketing_material',
		'post_status'    => 'publish',
		'posts_per_page' => 500,
		'no_found_rows'  => true,
		'orderby'        => 'title',
		'order'          => 'ASC',
		'tax_query'      => $ambrygen_tax_query,
	);

	$ambrygen_fallback_cache_key = 'marketing_material_query_' . $ambrygen_cache_version . '_' . $ambrygen_term_id . '_' . $ambrygen_material_type_id;
	$ambrygen_fallback_post_ids  = wp_cache_get( $ambrygen_fallback_cache_key, 'ambrygen_marketing' );

	if ( false === $ambrygen_fallback_post_ids ) {
		$ambrygen_query             = new WP_Query( $ambrygen_query_args );
		$ambrygen_fallback_post_ids = wp_list_pluck( $ambrygen_query->posts ?? array(), 'ID' );
		wp_cache_set( $ambrygen_fallback_cache_key, $ambrygen_fallback_post_ids, 'ambrygen_marketing', 12 * HOUR_IN_SECONDS );
	} else {
		$ambrygen_query = new WP_Query(
			array(
				'post_type'      => 'marketing_material',
				'post__in'       => $ambrygen_fallback_post_ids,
				'orderby'        => 'title',
				'order'          => 'ASC',
				'posts_per_page' => count( $ambrygen_fallback_post_ids ),
				'no_found_rows'  => true,
			)
		);
	}
}

?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="marketing-files__inner">
		<div class="test-catlouge">
			<?php if ( $ambrygen_has_title ) : ?>
				<div class="test-catlouge__header js-gsap-fade">
					<<?php echo tag_escape( $ambrygen_heading ); ?> class="heading-4 block-title mb-0 test-catlouge__title"><?php echo wp_kses_post( $ambrygen_title ); ?></<?php echo tag_escape( $ambrygen_heading ); ?>>
				</div>
			<?php endif; ?>

		<?php if ( $ambrygen_has_title ) : ?>
			<div class="is-style-gl-s32"></div>
		<?php endif; ?>

		<?php if ( ! empty( $ambrygen_sections ) ) : ?>

				<?php foreach ( $ambrygen_sections as $ambrygen_section_index => $ambrygen_section ) : ?>
					<div class="test-catlouge__items js-gsap-fade">
					<?php
					$ambrygen_section_title = isset( $ambrygen_section['title'] ) ? (string) $ambrygen_section['title'] : '';
					$ambrygen_categories    = isset( $ambrygen_section['categories'] ) && is_array( $ambrygen_section['categories'] )
						? $ambrygen_section['categories']
						: array();
					?>

					<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_section_title ) ) ) : ?>
						<div class="heading-6 mb-0 test-catlouge__section-title" id="<?php echo esc_attr( sanitize_title( $ambrygen_section_title ) . '-' . $ambrygen_section_index ); ?>">
							<?php echo esc_html( $ambrygen_section_title ); ?>
						</div>
					<?php endif; ?>

					<?php foreach ( $ambrygen_categories as $ambrygen_category_item ) : ?>
						<?php
						$ambrygen_category_name        = isset( $ambrygen_category_item['name'] ) ? (string) $ambrygen_category_item['name'] : '';
						$ambrygen_category_term        = isset( $ambrygen_category_item['category'] ) && is_array( $ambrygen_category_item['category'] )
							? $ambrygen_category_item['category']
							: array();
						$ambrygen_category_id          = isset( $ambrygen_category_term['id'] ) ? absint( $ambrygen_category_term['id'] ) : ( isset( $ambrygen_category_item['id'] ) ? absint( $ambrygen_category_item['id'] ) : 0 );
						$ambrygen_category_name        = '' !== trim( $ambrygen_category_name ) ? $ambrygen_category_name : ( isset( $ambrygen_category_term['name'] ) ? (string) $ambrygen_category_term['name'] : '' );
						$ambrygen_row_material_type    = isset( $ambrygen_category_item['materialType'] ) && is_array( $ambrygen_category_item['materialType'] )
							? $ambrygen_category_item['materialType']
							: array();
						$ambrygen_row_material_type_id = isset( $ambrygen_row_material_type['id'] ) ? absint( $ambrygen_row_material_type['id'] ) : 0;
						$ambrygen_category_post_ids    = isset( $ambrygen_category_item['selectedPostIds'] ) && is_array( $ambrygen_category_item['selectedPostIds'] )
							? $ambrygen_category_item['selectedPostIds']
							: array();

						$ambrygen_category_posts = array();
						if (
							class_exists( Helper::class )
							&& is_callable( array( Helper::class, 'get_marketing_material_posts_for_category' ) )
						) {
							$ambrygen_cache_key      = 'marketing_material_posts_' . $ambrygen_cache_version . '_' . $ambrygen_category_id . '_' . $ambrygen_row_material_type_id . '_' . $ambrygen_material_type_id . '_' . md5( wp_json_encode( $ambrygen_category_post_ids ) );
							$ambrygen_category_posts = wp_cache_get( $ambrygen_cache_key, 'ambrygen_marketing' );

							if ( false === $ambrygen_category_posts ) {
								$ambrygen_category_posts = Helper::get_marketing_material_posts_for_category(
									$ambrygen_category_id,
									$ambrygen_category_post_ids,
									$ambrygen_row_material_type_id > 0 ? $ambrygen_row_material_type_id : $ambrygen_material_type_id
								);

								if ( ! is_array( $ambrygen_category_posts ) ) {
									$ambrygen_category_posts = array();
								}

								wp_cache_set( $ambrygen_cache_key, $ambrygen_category_posts, 'ambrygen_marketing', 12 * HOUR_IN_SECONDS );
							}
						}

						$ambrygen_grid_html = '';
						if ( ! empty( $ambrygen_category_posts ) ) {
							ob_start();
							foreach ( $ambrygen_category_posts as $ambrygen_post ) {
								if (
									class_exists( Helper::class )
									&& is_callable( array( Helper::class, 'render_marketing_material_item' ) )
								) {
									$ambrygen_item_cache_key = 'marketing_material_html_' . $ambrygen_cache_version . '_' . $ambrygen_post->ID;
									$ambrygen_item_html      = wp_cache_get( $ambrygen_item_cache_key, 'ambrygen_marketing' );

									if ( false === $ambrygen_item_html ) {
										$ambrygen_item_html = Helper::render_marketing_material_item(
											$ambrygen_post->ID,
											get_the_title( $ambrygen_post->ID )
										);

										if ( ! is_string( $ambrygen_item_html ) ) {
											$ambrygen_item_html = '';
										}

										wp_cache_set( $ambrygen_item_cache_key, $ambrygen_item_html, 'ambrygen_marketing', 12 * HOUR_IN_SECONDS );
									}

									echo $ambrygen_item_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
								}
							}
							$ambrygen_grid_html = trim( (string) ob_get_clean() );
						}
						?>

						<?php if ( '' !== $ambrygen_grid_html ) : ?>
						<div class="test-catlouge__item">
							<div class="test-catlouge__item-main">
								<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_category_name ) ) ) : ?>
									<div class="test-catlouge__item-top">
										<div class="subtitle1-sbold mb-0 test-catlouge__item-title">
											<?php echo esc_html( $ambrygen_category_name ); ?>
										</div>
									</div>
								<?php endif; ?>

								<div class="test-catlouge__item-content">
									<div class="test-catlouge__divider"></div>
									<div class="test-catlouge__grid">
										<?php echo $ambrygen_grid_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
									</div>
								</div>
							</div>

							<button class="test-catlouge__item-toggle" type="button" aria-expanded="false" aria-label="<?php echo esc_attr( sprintf( __( 'Toggle %s files', 'ambrygen-web' ), $ambrygen_category_name ) ); ?>">
								<span class="test-catlouge__icon-cross"></span>
							</button>
						</div>
						<?php endif; ?>
					<?php endforeach; ?>
						</div>
				<?php endforeach; ?>

		<?php elseif ( $ambrygen_term_id <= 0 ) : ?>
			<div class="test-catlouge__items no-results js-gsap-fade">
				<p><?php esc_html_e( 'Select a category in the block settings to show Marketing Files.', 'ambrygen-web' ); ?></p>
			</div>
		<?php elseif ( $ambrygen_query && $ambrygen_query->have_posts() ) : ?>
			<div class="test-catlouge__items js-gsap-fade">
				<?php
				$ambrygen_global_grid_html = '';
				ob_start();
				while ( $ambrygen_query->have_posts() ) :
					$ambrygen_query->the_post();
					if (
						class_exists( Helper::class )
						&& is_callable( array( Helper::class, 'render_marketing_material_item' ) )
					) {
						$ambrygen_post_id        = get_the_ID();
						$ambrygen_item_cache_key = 'marketing_material_html_' . $ambrygen_cache_version . '_' . $ambrygen_post_id;
						$ambrygen_item_html      = wp_cache_get( $ambrygen_item_cache_key, 'ambrygen_marketing' );

						if ( false === $ambrygen_item_html ) {
							$ambrygen_item_html = Helper::render_marketing_material_item(
								$ambrygen_post_id,
								get_the_title()
							);

							if ( ! is_string( $ambrygen_item_html ) ) {
								$ambrygen_item_html = '';
							}

							wp_cache_set( $ambrygen_item_cache_key, $ambrygen_item_html, 'ambrygen_marketing', 12 * HOUR_IN_SECONDS );
						}

						echo $ambrygen_item_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
					}
				endwhile;
				wp_reset_postdata();
				$ambrygen_global_grid_html = trim( (string) ob_get_clean() );
				?>
				<?php if ( '' !== $ambrygen_global_grid_html ) : ?>
				<div class="test-catlouge__item js-gsap-fade">
					<?php
					$ambrygen_global_category_name = isset( $ambrygen_category['name'] ) ? (string) $ambrygen_category['name'] : '';
					?>
					<div class="test-catlouge__item-main">
						<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_global_category_name ) ) ) : ?>
							<div class="test-catlouge__item-top">
								<div class="subtitle1-sbold mb-0 test-catlouge__item-title">
									<?php echo esc_html( $ambrygen_global_category_name ); ?>
								</div>
							</div>
						<?php endif; ?>

						<div class="test-catlouge__item-content">
							<div class="test-catlouge__divider"></div>
							<div class="test-catlouge__grid">
								<?php echo $ambrygen_global_grid_html; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
							</div>
						</div>
					</div>

					<button class="test-catlouge__item-toggle" type="button" aria-expanded="false" aria-label="<?php echo esc_attr( sprintf( __( 'Toggle %s files', 'ambrygen-web' ), $ambrygen_global_category_name ) ); ?>">
						<span class="test-catlouge__icon-cross"></span>
					</button>
				</div>
				<?php else : ?>
				<div class="test-catlouge__items no-results js-gsap-fade">
					<p><?php esc_html_e( 'No marketing materials found in this category.', 'ambrygen-web' ); ?></p>
				</div>
				<?php endif; ?>
			</div>
		<?php else : ?>
			<div class="test-catlouge__items no-results js-gsap-fade">
				<p><?php esc_html_e( 'No marketing materials found in this category.', 'ambrygen-web' ); ?></p>
			</div>
		<?php endif; ?>
	</div>
</div>
