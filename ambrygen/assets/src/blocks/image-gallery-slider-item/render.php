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

	$ambrygen_parse_gallery_meta_images = static function ( $ambrygen_raw_meta ) {
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
					static function ( $value ) {
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
			$ambrygen_image_alt = '';

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

				if ( isset( $ambrygen_item['alt'] ) ) {
					$ambrygen_image_alt = (string) $ambrygen_item['alt'];
				} elseif ( isset( $ambrygen_item['alt_text'] ) ) {
					$ambrygen_image_alt = (string) $ambrygen_item['alt_text'];
				}
			}

			if ( $ambrygen_image_id || $ambrygen_image_url ) {
				if ( $ambrygen_image_id > 0 ) {
					$ambrygen_image_alt_meta = get_post_meta( $ambrygen_image_id, '_wp_attachment_image_alt', true );
					if ( is_string( $ambrygen_image_alt_meta ) && '' !== trim( $ambrygen_image_alt_meta ) ) {
						$ambrygen_image_alt = $ambrygen_image_alt_meta;
					} elseif ( '' === trim( $ambrygen_image_alt ) ) {
						$ambrygen_image_alt = get_the_title( $ambrygen_image_id );
					}
				}

				$ambrygen_items[] = array(
					'id'  => max( 0, $ambrygen_image_id ),
					'url' => $ambrygen_image_url,
					'alt' => $ambrygen_image_alt,
				);
			}
		}

		return $ambrygen_items;
	};
	$ambrygen_parse_download_file       = static function ( $ambrygen_raw_meta ): array {
		$ambrygen_file_id  = 0;
		$ambrygen_file_url = '';

		if ( is_numeric( $ambrygen_raw_meta ) ) {
			$ambrygen_file_id = (int) $ambrygen_raw_meta;
		} elseif ( is_string( $ambrygen_raw_meta ) ) {
			$ambrygen_trimmed_meta = trim( $ambrygen_raw_meta );

			if ( preg_match( '/^\d+$/', $ambrygen_trimmed_meta ) ) {
				$ambrygen_file_id = (int) $ambrygen_trimmed_meta;
			} elseif ( filter_var( $ambrygen_trimmed_meta, FILTER_VALIDATE_URL ) ) {
				$ambrygen_file_url = $ambrygen_trimmed_meta;
			}
		} elseif ( is_array( $ambrygen_raw_meta ) ) {
			if ( isset( $ambrygen_raw_meta['id'] ) ) {
				$ambrygen_file_id = (int) $ambrygen_raw_meta['id'];
			} elseif ( isset( $ambrygen_raw_meta['ID'] ) ) {
				$ambrygen_file_id = (int) $ambrygen_raw_meta['ID'];
			}

			if ( isset( $ambrygen_raw_meta['url'] ) ) {
				$ambrygen_file_url = (string) $ambrygen_raw_meta['url'];
			} elseif ( isset( $ambrygen_raw_meta['source_url'] ) ) {
				$ambrygen_file_url = (string) $ambrygen_raw_meta['source_url'];
			}
		}

		if ( $ambrygen_file_id > 0 ) {
			$ambrygen_attachment_url = wp_get_attachment_url( $ambrygen_file_id );

			if ( $ambrygen_attachment_url ) {
				$ambrygen_file_url = $ambrygen_attachment_url;
			}
		}

		return array(
			'id'  => max( 0, $ambrygen_file_id ),
			'url' => $ambrygen_file_url,
		);
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
	$ambrygen_small_file  = $ambrygen_parse_download_file( get_post_meta( $ambrygen_post_id, 'small_image', true ) );
	$ambrygen_large_file  = $ambrygen_parse_download_file( get_post_meta( $ambrygen_post_id, 'large_image', true ) );

	$ambrygen_gallery_meta = get_post_meta( $ambrygen_post_id, 'image_gallry', true );
	if ( empty( $ambrygen_gallery_meta ) ) {
		$ambrygen_gallery_meta = get_post_meta( $ambrygen_post_id, 'image_gallary', true );
	}
	$ambrygen_gallery_images = $ambrygen_parse_gallery_meta_images( $ambrygen_gallery_meta );

	if ( empty( $ambrygen_gallery_images ) ) {
		$ambrygen_featured_alt = '';
		if ( $ambrygen_featured_id ) {
			$ambrygen_featured_alt_meta = get_post_meta( $ambrygen_featured_id, '_wp_attachment_image_alt', true );
			if ( is_string( $ambrygen_featured_alt_meta ) && '' !== trim( $ambrygen_featured_alt_meta ) ) {
				$ambrygen_featured_alt = $ambrygen_featured_alt_meta;
			} else {
				$ambrygen_featured_alt = get_the_title( $ambrygen_featured_id );
			}
		}

		$ambrygen_gallery_images[] = array(
			'id'  => $ambrygen_featured_id ? (int) $ambrygen_featured_id : 0,
			'url' => '',
			'alt' => $ambrygen_featured_alt,
		);
	}

	$ambrygen_has_multiple_gallery_images = count( $ambrygen_gallery_images ) > 1;
	$ambrygen_should_show_nav             = $ambrygen_has_multiple_gallery_images;
	$ambrygen_download_files              = array();

	if ( ! empty( $ambrygen_large_file['url'] ) ) {
		$ambrygen_download_files[] = array(
			'label' => 'large',
			'url'   => $ambrygen_large_file['url'],
		);
	}

	if ( ! empty( $ambrygen_small_file['url'] ) ) {
		$ambrygen_download_files[] = array(
			'label' => 'small',
			'url'   => $ambrygen_small_file['url'],
		);
	}
	?>

<div class="image-gallery-slider__item js-gsap-fade">
	<div class="image-gallery-slider__card">
		<div class="image-gallery-slider-item__media-slider swiper">
			<div class="swiper-wrapper">
				<?php
				foreach ( $ambrygen_gallery_images as $ambrygen_gallery_item ) :

					?>
					<div class="swiper-slide image-gallery-slider__image">
						<?php if ( ! empty( $ambrygen_gallery_item['id'] ) ) : ?>
							<?php
								echo Helper::image_with_placeholder( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									(int) $ambrygen_gallery_item['id'],
									'large',
									array(
										'loading' => 'lazy',
										'alt'     => esc_attr( $ambrygen_gallery_item['alt'] ?? '' ),
									)
								);
							?>
						<?php elseif ( ! empty( $ambrygen_gallery_item['url'] ) ) : ?>
							<img src="<?php echo esc_url( $ambrygen_gallery_item['url'] ); ?>" alt="<?php echo esc_attr( $ambrygen_gallery_item['alt'] ?? '' ); ?>" loading="lazy" />
						<?php else : ?>
							<?php
								echo Helper::image_with_placeholder( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									$ambrygen_featured_id,
									'large',
									array(
										'loading' => 'lazy',
										'alt'     => esc_attr( $ambrygen_gallery_item['alt'] ?? '' ),
									)
								);
							?>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			</div>

			<?php if ( $ambrygen_should_show_nav ) : ?>
				<div class="swiper-buttons">
					<button type="button" class="custom-prev" aria-label="<?php esc_attr_e( 'Previous Slide', 'ambrygen-web' ); ?>"></button>
					<button type="button" class="custom-next" aria-label="<?php esc_attr_e( 'Next Slide', 'ambrygen-web' ); ?>"></button>
				</div>
			<?php endif; ?>

		</div>

		<div class="image-gallery-slider__overlay">
			<div class="image-gallery-slider__title heading-5 mb-0">
				<?php echo esc_html( $ambrygen_title ); ?>
			</div>
			<div class="is-style-gl-s12" aria-hidden="true"></div>

			<?php if ( ! empty( $ambrygen_designation ) ) : ?>
				<div class="image-gallery-slider__role text-small">
					<?php echo esc_html( $ambrygen_designation ); ?>
				</div>
			<?php endif; ?>
			<?php if ( ! empty( $ambrygen_download_files ) ) : ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
				<div class="download-link has-downloads">
					<div class="download-link__files-list">
						<?php foreach ( $ambrygen_download_files as $ambrygen_download_file ) : ?>
							<div class="download-link__files-item">
								<a
									class="download-link__files-link"
									href="<?php echo esc_url( $ambrygen_download_file['url'] ); ?>"
									download
								>
									<?php echo esc_html( $ambrygen_download_file['label'] ); ?>
								</a>
							</div>
						<?php endforeach; ?>
					</div>
				</div>
			<?php endif; ?>
		</div>
	</div>
</div>
