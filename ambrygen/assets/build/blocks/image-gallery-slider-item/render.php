<?php
/**
 * Render: Image Gallery Slider Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_parse_gallery_meta_images = static function( $ambrygen_raw_meta ) {
	$ambrygen_value = $ambrygen_raw_meta;
	$ambrygen_items = array();

	if ( is_string( $ambrygen_value ) ) {
		$ambrygen_trimmed = trim( $ambrygen_value );

		if ( preg_match( '/^\d+(\s*,\s*\d+)+$/', $ambrygen_trimmed ) ) {
			$ambrygen_value = array_map( 'trim', explode( ',', $ambrygen_trimmed ) );
		} elseif ( preg_match( '/^\d+$/', $ambrygen_trimmed ) ) {
			$ambrygen_value = array( $ambrygen_trimmed );
		} elseif ( false !== strpos( $ambrygen_trimmed, ',' ) ) {
			$ambrygen_value = array_filter(
				array_map( 'trim', explode( ',', $ambrygen_trimmed ) ),
				static function( $value ) {
					return preg_match( '/^\d+$/', (string) $value );
				}
			);
		} elseif (
			( 0 === strpos( $ambrygen_trimmed, '[' ) && ']' === substr( $ambrygen_trimmed, -1 ) ) ||
			( 0 === strpos( $ambrygen_trimmed, '{' ) && '}' === substr( $ambrygen_trimmed, -1 ) )
		) {
			$ambrygen_decoded = json_decode( $ambrygen_trimmed, true );
			if ( JSON_ERROR_NONE === json_last_error() ) {
				$ambrygen_value = $ambrygen_decoded;
			}
		}
	}

	$ambrygen_value = is_array( $ambrygen_value ) ? $ambrygen_value : array( $ambrygen_value );

	foreach ( $ambrygen_value as $ambrygen_item ) {
		$ambrygen_image_id  = 0;
		$ambrygen_image_url = '';

		if ( is_numeric( $ambrygen_item ) ) {
			$ambrygen_image_id = (int) $ambrygen_item;
		} elseif ( is_string( $ambrygen_item ) && filter_var( $ambrygen_item, FILTER_VALIDATE_URL ) ) {
			$ambrygen_image_url = $ambrygen_item;
		} elseif ( is_array( $ambrygen_item ) ) {
			if ( isset( $ambrygen_item['id'] ) ) {
				$ambrygen_image_id = (int) $ambrygen_item['id'];
			} elseif ( isset( $ambrygen_item['ID'] ) ) {
				$ambrygen_image_id = (int) $ambrygen_item['ID'];
			}

			if ( isset( $ambrygen_item['url'] ) ) {
				$ambrygen_image_url = (string) $ambrygen_item['url'];
			} elseif ( isset( $ambrygen_item['source_url'] ) ) {
				$ambrygen_image_url = (string) $ambrygen_item['source_url'];
			} elseif ( isset( $ambrygen_item['sizes']['full']['url'] ) ) {
				$ambrygen_image_url = (string) $ambrygen_item['sizes']['full']['url'];
			}
		}

		if ( $ambrygen_image_id || $ambrygen_image_url ) {
			$ambrygen_items[] = array(
				'id'  => max( 0, $ambrygen_image_id ),
				'url' => $ambrygen_image_url,
			);
		}
	}

	return $ambrygen_items;
};

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();
$ambrygen_post_id    = isset( $ambrygen_attributes['postId'] ) ? (int) $ambrygen_attributes['postId'] : 0;

if ( 0 === $ambrygen_post_id ) {
	return;
}

$ambrygen_post = get_post( $ambrygen_post_id );
if ( ! $ambrygen_post || 'publish' !== $ambrygen_post->post_status ) {
	return;
}

$ambrygen_title       = get_the_title( $ambrygen_post_id );
$ambrygen_designation = get_post_meta( $ambrygen_post_id, 'designation', true );
$ambrygen_featured_id = get_post_thumbnail_id( $ambrygen_post_id );

$ambrygen_gallery_meta = get_post_meta( $ambrygen_post_id, 'image_gallry', true );
if ( empty( $ambrygen_gallery_meta ) ) {
	$ambrygen_gallery_meta = get_post_meta( $ambrygen_post_id, 'image_gallary', true );
}
$ambrygen_gallery_images = $ambrygen_parse_gallery_meta_images( $ambrygen_gallery_meta );

if ( empty( $ambrygen_gallery_images ) ) {
	$ambrygen_gallery_images[] = array(
		'id'  => $ambrygen_featured_id ? (int) $ambrygen_featured_id : 0,
		'url' => '',
	);
}

$ambrygen_show_nav        = isset( $block->context['ambrygen/imageGalleryNav'] ) ? (bool) $block->context['ambrygen/imageGalleryNav'] : true;
$ambrygen_show_pagination = isset( $block->context['ambrygen/imageGalleryPagination'] ) ? (bool) $block->context['ambrygen/imageGalleryPagination'] : false;
$ambrygen_autoplay        = isset( $block->context['ambrygen/imageGalleryAutoplay'] ) ? (bool) $block->context['ambrygen/imageGalleryAutoplay'] : false;
?>

<div class="image-gallery-slider__item">
	<div class="image-gallery-slider__card">
		<div
			class="image-gallery-slider-item__media-slider swiper"
			data-swiper-config="<?php echo esc_attr( wp_json_encode(
				array(
					'autoplay'        => $ambrygen_autoplay,
					'navigation_show' => $ambrygen_show_nav,
					'pagination_show' => $ambrygen_show_pagination,
				)
			) ); ?>"
		>
			<div class="swiper-wrapper">
				<?php foreach ( $ambrygen_gallery_images as $ambrygen_gallery_item ) : 

					
					?>
					<div class="swiper-slide image-gallery-slider__image">
						<?php if ( ! empty( $ambrygen_gallery_item['id'] ) ) : ?>
							<?php
							echo Helper::image_with_placeholder( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
								(int) $ambrygen_gallery_item['id'],
								'large',
								array(
									'loading' => 'lazy',
									'alt'     => esc_attr( $ambrygen_title ),
								)
							);
							?>
						<?php elseif ( ! empty( $ambrygen_gallery_item['url'] ) ) : ?>
							<img src="<?php echo esc_url( $ambrygen_gallery_item['url'] ); ?>" alt="<?php echo esc_attr( $ambrygen_title ); ?>" loading="lazy" />
						<?php else : ?>
							<?php
							echo Helper::image_with_placeholder( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
								$ambrygen_featured_id,
								'large',
								array(
									'loading' => 'lazy',
									'alt'     => esc_attr( $ambrygen_title ),
								)
							);
							?>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			</div>

			<?php if ( $ambrygen_show_nav ) : ?>
				<div class="swiper-buttons">
					<button type="button" class="custom-prev" aria-label="<?php esc_attr_e( 'Previous Slide', 'ambrygen-web' ); ?>"></button>
					<button type="button" class="custom-next" aria-label="<?php esc_attr_e( 'Next Slide', 'ambrygen-web' ); ?>"></button>
				</div>
			<?php endif; ?>

			<?php if ( $ambrygen_show_pagination ) : ?>
				<div class="swiper-pagination"></div>
			<?php endif; ?>
		</div>

		<div class="image-gallery-slider__overlay">
			<div class="image-gallery-slider__name heading-4 mb-0">
				<?php echo esc_html( $ambrygen_title ); ?>
			</div>
			<div class="is-style-gl-s10" aria-hidden="true"></div>

			<?php if ( ! empty( $ambrygen_designation ) ) : ?>
				<span class="image-gallery-slider__role subtitle2">
					<?php echo esc_html( $ambrygen_designation ); ?>
				</span>
			<?php endif; ?>
		</div>
	</div>
</div>
