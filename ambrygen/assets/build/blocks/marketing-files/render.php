<?php
/**
 * Render: Marketing Files Block
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_block_id   = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_attributes['blockId'] ) : '';
$ambrygen_title      = isset( $ambrygen_attributes['title'] ) ? (string) $ambrygen_attributes['title'] : '';
$ambrygen_heading    = isset( $ambrygen_attributes['headingLevel'] ) ? sanitize_key( $ambrygen_attributes['headingLevel'] ) : 'h2';
$ambrygen_category   = isset( $ambrygen_attributes['selectedCategory'] ) && is_array( $ambrygen_attributes['selectedCategory'] )
	? $ambrygen_attributes['selectedCategory']
	: array();
$ambrygen_term_id    = isset( $ambrygen_category['id'] ) ? absint( $ambrygen_category['id'] ) : 0;
$ambrygen_material_type = isset( $ambrygen_attributes['selectedMaterialType'] ) && is_array( $ambrygen_attributes['selectedMaterialType'] )
	? $ambrygen_attributes['selectedMaterialType']
	: array();
$ambrygen_material_type_id = isset( $ambrygen_material_type['id'] ) ? absint( $ambrygen_material_type['id'] ) : 0;
$ambrygen_sections = isset( $ambrygen_attributes['sections'] ) && is_array( $ambrygen_attributes['sections'] )
	? $ambrygen_attributes['sections']
	: array();

if ( ! in_array( $ambrygen_heading, array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ), true ) ) {
	$ambrygen_heading = 'h2';
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'id'    => $ambrygen_block_id,
		'class' => 'marketing-files',
	)
);

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

	$ambrygen_query = new WP_Query(
		array(
			'post_type'      => 'marketing_material',
			'post_status'    => 'publish',
			'posts_per_page' => -1,
			'orderby'        => 'title',
			'order'          => 'ASC',
			'tax_query'      => $ambrygen_tax_query,
		)
	);
}

?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="marketing-files__inner">
		<div class="test-catlouge">
			<div class="test-catlouge__header">
			<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_title ) ) ) : ?>
				<<?php echo esc_html( $ambrygen_heading ); ?> class="heading-4 block-title mb-0 test-catlouge__title"><?php echo wp_kses_post( $ambrygen_title ); ?></<?php echo esc_html( $ambrygen_heading ); ?>>
			<?php endif; ?>
		</div>

		<div class="is-style-gl-s32"></div>

		<?php if ( ! empty( $ambrygen_sections ) ) : ?>
			
				<?php foreach ( $ambrygen_sections as $ambrygen_section ) : ?>
					<div class="test-catlouge__items">
					<?php
					$ambrygen_section_title = isset( $ambrygen_section['title'] ) ? (string) $ambrygen_section['title'] : '';
					$ambrygen_categories    = isset( $ambrygen_section['categories'] ) && is_array( $ambrygen_section['categories'] )
						? $ambrygen_section['categories']
						: array();
					?>

					<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_section_title ) ) ) : ?>
						<div class="heading-6 mb-0 test-catlouge__section-title" id="<?php echo esc_attr( sanitize_title( $ambrygen_section_title ) ); ?>">
							<?php echo esc_html( $ambrygen_section_title ); ?>
						</div>
					<?php endif; ?>

					<?php foreach ( $ambrygen_categories as $ambrygen_category_item ) : ?>
						<?php
						$ambrygen_category_name       = isset( $ambrygen_category_item['name'] ) ? (string) $ambrygen_category_item['name'] : '';
						$ambrygen_category_term       = isset( $ambrygen_category_item['category'] ) && is_array( $ambrygen_category_item['category'] )
							? $ambrygen_category_item['category']
							: array();
						$ambrygen_category_id         = isset( $ambrygen_category_term['id'] ) ? absint( $ambrygen_category_term['id'] ) : ( isset( $ambrygen_category_item['id'] ) ? absint( $ambrygen_category_item['id'] ) : 0 );
						$ambrygen_category_name       = '' !== trim( $ambrygen_category_name ) ? $ambrygen_category_name : ( isset( $ambrygen_category_term['name'] ) ? (string) $ambrygen_category_term['name'] : '' );
						$ambrygen_row_material_type   = isset( $ambrygen_category_item['materialType'] ) && is_array( $ambrygen_category_item['materialType'] )
							? $ambrygen_category_item['materialType']
							: array();
						$ambrygen_row_material_type_id = isset( $ambrygen_row_material_type['id'] ) ? absint( $ambrygen_row_material_type['id'] ) : 0;
						$ambrygen_category_post_ids   = isset( $ambrygen_category_item['selectedPostIds'] ) && is_array( $ambrygen_category_item['selectedPostIds'] )
							? $ambrygen_category_item['selectedPostIds']
							: array();

						$ambrygen_category_posts = array();
						if (
							class_exists( Helper::class )
							&& is_callable( array( Helper::class, 'get_marketing_material_posts_for_category' ) )
						) {
							$ambrygen_category_posts = Helper::get_marketing_material_posts_for_category(
								$ambrygen_category_id,
								$ambrygen_category_post_ids,
								$ambrygen_row_material_type_id > 0 ? $ambrygen_row_material_type_id : $ambrygen_material_type_id
							);
						}
						?>

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
										<?php if ( ! empty( $ambrygen_category_posts ) ) : ?>
											<?php foreach ( $ambrygen_category_posts as $ambrygen_post ) : ?>
												<?php
												if (
													class_exists( Helper::class )
													&& is_callable( array( Helper::class, 'render_marketing_material_item' ) )
												) {
													echo Helper::render_marketing_material_item( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
														$ambrygen_post->ID,
														get_the_title( $ambrygen_post->ID )
													);
												}
												?>
											<?php endforeach; ?>
										<?php endif; ?>
									</div>
								</div>
							</div>

							<button class="test-catlouge__item-toggle" type="button" aria-expanded="false" aria-label="<?php echo esc_attr( $ambrygen_category_name ); ?>">
								<span class="test-catlouge__icon-cross"></span>
							</button>
						</div>
					<?php endforeach; ?>
						</div>
				<?php endforeach; ?>
		
		<?php elseif ( $ambrygen_term_id <= 0 ) : ?>
			<div class="test-catlouge__items no-results">
				<p><?php esc_html_e( 'Select a category in the block settings to show Marketing Files.', 'ambrygen-web' ); ?></p>
			</div>
		<?php elseif ( $ambrygen_query && $ambrygen_query->have_posts() ) : ?>
			<div class="test-catlouge__items">
				<div class="test-catlouge__item">
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
								<?php
								while ( $ambrygen_query->have_posts() ) :
									$ambrygen_query->the_post();
									if (
										class_exists( Helper::class )
										&& is_callable( array( Helper::class, 'render_marketing_material_item' ) )
									) {
										echo Helper::render_marketing_material_item( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
											get_the_ID(),
											get_the_title()
										);
									}
								endwhile;
								?>
								<?php wp_reset_postdata(); ?>
							</div>
						</div>
					</div>

					<button class="test-catlouge__item-toggle" type="button" aria-expanded="false" aria-label="<?php echo esc_attr( $ambrygen_global_category_name ); ?>">
						<span class="test-catlouge__icon-cross"></span>
					</button>
				</div>
			</div>
		<?php else : ?>
			<div class="test-catlouge__items no-results">
				<p><?php esc_html_e( 'No marketing materials found in this category.', 'ambrygen-web' ); ?></p>
			</div>
		<?php endif; ?>
	</div>
</div>
