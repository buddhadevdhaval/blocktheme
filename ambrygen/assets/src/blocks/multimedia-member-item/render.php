<?php
	/**
	 * Render: Multimedia Member Item Block
	 *
	 * @param array    $attributes The block attributes.
	 * @param string   $content    The block content.
	 * @param WP_Block $block      The block instance.
	 *
	 * @package ambrygen
	 */

	defined( 'ABSPATH' ) || exit;

	use Ambrygen\Theme\Core\Helper;

	$ambrygen_parse_member_media_items = static function ( $ambrygen_raw_meta ) {
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
				$ambrygen_image_url = esc_url_raw( $ambrygen_item );
			} elseif ( is_array( $ambrygen_item ) ) {
				if ( isset( $ambrygen_item['id'] ) ) {
					$ambrygen_image_id = (int) $ambrygen_item['id'];
				} elseif ( isset( $ambrygen_item['ID'] ) ) {
					$ambrygen_image_id = (int) $ambrygen_item['ID'];
				}

				if ( isset( $ambrygen_item['url'] ) ) {
					$ambrygen_image_url = esc_url_raw( (string) $ambrygen_item['url'] );
				} elseif ( isset( $ambrygen_item['source_url'] ) ) {
					$ambrygen_image_url = esc_url_raw( (string) $ambrygen_item['source_url'] );
				} elseif ( isset( $ambrygen_item['sizes']['full']['url'] ) ) {
					$ambrygen_image_url = esc_url_raw( (string) $ambrygen_item['sizes']['full']['url'] );
				}

				if ( isset( $ambrygen_item['alt'] ) ) {
					$ambrygen_image_alt = sanitize_text_field( (string) $ambrygen_item['alt'] );
				} elseif ( isset( $ambrygen_item['alt_text'] ) ) {
					$ambrygen_image_alt = sanitize_text_field( (string) $ambrygen_item['alt_text'] );
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
				$ambrygen_file_url = esc_url_raw( $ambrygen_trimmed_meta );
			}
		} elseif ( is_array( $ambrygen_raw_meta ) ) {
			if ( isset( $ambrygen_raw_meta['id'] ) ) {
				$ambrygen_file_id = (int) $ambrygen_raw_meta['id'];
			} elseif ( isset( $ambrygen_raw_meta['ID'] ) ) {
				$ambrygen_file_id = (int) $ambrygen_raw_meta['ID'];
			}

			if ( isset( $ambrygen_raw_meta['url'] ) ) {
				$ambrygen_file_url = esc_url_raw( (string) $ambrygen_raw_meta['url'] );
			} elseif ( isset( $ambrygen_raw_meta['source_url'] ) ) {
				$ambrygen_file_url = esc_url_raw( (string) $ambrygen_raw_meta['source_url'] );
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

	$ambrygen_member_attributes = is_array( $attributes ?? null ) ? $attributes : array();
	$ambrygen_member_post_id    = isset( $ambrygen_member_attributes['postId'] ) ? absint( $ambrygen_member_attributes['postId'] ) : 0;

	if ( 0 === $ambrygen_member_post_id ) {
		return;
	}

	$ambrygen_member_post = get_post( $ambrygen_member_post_id );
	if ( ! $ambrygen_member_post || 'publish' !== $ambrygen_member_post->post_status ) {
		return;
	}

	$ambrygen_member_title       = get_the_title( $ambrygen_member_post_id );
	$ambrygen_member_designation = sanitize_text_field( (string) get_post_meta( $ambrygen_member_post_id, 'designation', true ) );
	$ambrygen_member_featured_id = absint( get_post_thumbnail_id( $ambrygen_member_post_id ) );
	$ambrygen_member_small_file  = $ambrygen_parse_download_file( get_post_meta( $ambrygen_member_post_id, 'small_image', true ) );
	$ambrygen_member_large_file  = $ambrygen_parse_download_file( get_post_meta( $ambrygen_member_post_id, 'large_image', true ) );

	$ambrygen_member_media_meta = get_post_meta( $ambrygen_member_post_id, 'image_gallry', true );
	if ( empty( $ambrygen_member_media_meta ) ) {
		$ambrygen_member_media_meta = get_post_meta( $ambrygen_member_post_id, 'image_gallary', true );
	}
	$ambrygen_member_media_items = $ambrygen_parse_member_media_items( $ambrygen_member_media_meta );

	if ( empty( $ambrygen_member_media_items ) ) {
		$ambrygen_member_featured_alt = '';
		if ( $ambrygen_member_featured_id ) {
			$ambrygen_member_featured_alt_meta = get_post_meta( $ambrygen_member_featured_id, '_wp_attachment_image_alt', true );
			if ( is_string( $ambrygen_member_featured_alt_meta ) && '' !== trim( $ambrygen_member_featured_alt_meta ) ) {
				$ambrygen_member_featured_alt = $ambrygen_member_featured_alt_meta;
			} else {
				$ambrygen_member_featured_alt = get_the_title( $ambrygen_member_featured_id );
			}
			$ambrygen_member_media_items[] = array(
				'id'  => (int) $ambrygen_member_featured_id,
				'url' => '',
				'alt' => $ambrygen_member_featured_alt,
			);
		} else {
			return;
		}
	}

	$ambrygen_has_multiple_member_media = count( $ambrygen_member_media_items ) > 1;
	$ambrygen_slide_count               = count( $ambrygen_member_media_items );
	$ambrygen_should_show_nav           = $ambrygen_has_multiple_member_media;
	$ambrygen_member_download_files     = array();
	$ambrygen_member_gallery_label      = sprintf(
		/* translators: %s: member name */
		esc_attr__( 'Photo gallery for %s', 'ambrygen-web' ),
		$ambrygen_member_title
	);

	if ( ! empty( $ambrygen_member_large_file['url'] ) ) {
		$ambrygen_member_download_files[] = array(
			'label' => esc_html__( 'Download Large', 'ambrygen-web' ),
			'url'   => $ambrygen_member_large_file['url'],
		);
	}

	if ( ! empty( $ambrygen_member_small_file['url'] ) ) {
		$ambrygen_member_download_files[] = array(
			'label' => esc_html__( 'Download Small', 'ambrygen-web' ),
			'url'   => $ambrygen_member_small_file['url'],
		);
	}
	?>

<div class="multimedia-member__item js-gsap-fade">
	<div class="multimedia-member__card">
		<div
			class="multimedia-member-item__media-slider swiper"
			role="region"
			aria-roledescription="<?php echo esc_attr__( 'carousel', 'ambrygen-web' ); ?>"
			aria-label="<?php echo esc_attr( $ambrygen_member_gallery_label ); ?>"
		>
			<div class="swiper-wrapper" aria-live="polite">
				<?php
				$ambrygen_slide_index = 0;
				foreach ( $ambrygen_member_media_items as $ambrygen_member_media_item ) :
					++$ambrygen_slide_index;
					?>
					<div
						class="swiper-slide multimedia-member__image"
						role="group"
						aria-roledescription="<?php echo esc_attr__( 'slide', 'ambrygen-web' ); ?>"
						aria-label="<?php echo esc_attr( sprintf( esc_attr__( '%1$d of %2$d', 'ambrygen-web' ), $ambrygen_slide_index, $ambrygen_slide_count ) ); ?>"
					>
						<?php
							// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper returns escaped image markup from a sanitized attachment ID or URL.
							echo Helper::image_from_source(
								! empty( $ambrygen_member_media_item['id'] ) ? absint( $ambrygen_member_media_item['id'] ) : 0,
								$ambrygen_member_media_item['url'] ?? '',
								'large',
								array(
									'loading'  => 'lazy',
									'decoding' => 'async',
									'alt'      => sanitize_text_field( $ambrygen_member_media_item['alt'] ?? '' ),
								)
							);
						?>
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

		<div class="multimedia-member__overlay">
			<div class="multimedia-member__title heading-5 mb-0">
				<?php echo esc_html( $ambrygen_member_title ); ?>
			</div>
			<?php if ( ! empty( $ambrygen_member_designation ) || ! empty( $ambrygen_member_download_files ) ) : ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_member_designation ) ) : ?>
				<div class="multimedia-member__role text-small">
					<?php echo esc_html( $ambrygen_member_designation ); ?>
				</div>
			<?php endif; ?>
			<?php if ( ! empty( $ambrygen_member_download_files ) ) : ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
				<div class="download-link has-downloads">
					<div class="download-link__files-list">
						<?php foreach ( $ambrygen_member_download_files as $ambrygen_member_download_file ) : ?>
							<div class="download-link__files-item">
								<?php
								$ambrygen_download_label = sprintf(
									/* translators: 1: size label, 2: member name */
									esc_attr__( 'Download %1$s image of %2$s', 'ambrygen-web' ),
									$ambrygen_member_download_file['label'],
									$ambrygen_member_title
								);
								?>
								<a
									class="download-link__files-link"
									href="<?php echo esc_url( $ambrygen_member_download_file['url'] ); ?>"
									download
									aria-label="<?php echo esc_attr( $ambrygen_download_label ); ?>"
								>
									<?php echo esc_html( $ambrygen_member_download_file['label'] ); ?>
								</a>
							</div>
						<?php endforeach; ?>
					</div>
				</div>
			<?php endif; ?>
		</div>
	</div>
</div>
