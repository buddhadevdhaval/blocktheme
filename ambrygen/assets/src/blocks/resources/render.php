<?php
/**
 * Render the Resources block.
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();

$ambrygen_block_id              = isset( $ambrygen_attributes['blockId'] ) ? sanitize_html_class( $ambrygen_attributes['blockId'] ) : '';
$ambrygen_title                 = $ambrygen_attributes['title'] ?? '';
$ambrygen_subtitle              = $ambrygen_attributes['subtitle'] ?? '';
$ambrygen_heading_level         = Helper::get_heading_tag( $ambrygen_attributes['headingLevel'] ?? 'h2', 'h2' );
$ambrygen_cards                 = isset( $ambrygen_attributes['resourceCards'] ) && is_array( $ambrygen_attributes['resourceCards'] ) ? $ambrygen_attributes['resourceCards'] : array();
$ambrygen_org_title             = $ambrygen_attributes['orgTitle'] ?? '';
$ambrygen_collaborator_ids      = isset( $ambrygen_attributes['collaboratorIds'] ) && is_array( $ambrygen_attributes['collaboratorIds'] )
	? array_filter( array_map( 'absint', $ambrygen_attributes['collaboratorIds'] ) )
	: array();
$ambrygen_resources_card_title  = $ambrygen_attributes['resourcesCardTitle'] ?? '';
$ambrygen_enable_custom         = isset( $ambrygen_attributes['enableCustomCollaborators'] ) ? (bool) $ambrygen_attributes['enableCustomCollaborators'] : false;
$ambrygen_custom_collaborators  = isset( $ambrygen_attributes['customCollaborators'] ) && is_array( $ambrygen_attributes['customCollaborators'] ) ? $ambrygen_attributes['customCollaborators'] : array();
$ambrygen_is_admin_render       = is_admin();
$ambrygen_has_heading           = '' !== trim( wp_strip_all_tags( $ambrygen_title ) );
$ambrygen_has_subtitle          = '' !== trim( wp_strip_all_tags( $ambrygen_subtitle ) );
$ambrygen_has_resources_title   = '' !== trim( wp_strip_all_tags( $ambrygen_resources_card_title ) );
$ambrygen_has_org_title         = '' !== trim( wp_strip_all_tags( $ambrygen_org_title ) );
$ambrygen_download_icon_src     = get_theme_file_uri( 'assets/src/images/download-icon.svg' );

$ambrygen_cards_with_content = array_values(
	array_filter(
		$ambrygen_cards,
		static function ( $ambrygen_card ) {
			$ambrygen_card_title = isset( $ambrygen_card['title'] ) ? trim( wp_strip_all_tags( $ambrygen_card['title'] ) ) : '';
			$ambrygen_pdf_links  = isset( $ambrygen_card['pdfLinks'] ) && is_array( $ambrygen_card['pdfLinks'] ) ? $ambrygen_card['pdfLinks'] : array();
			$ambrygen_has_links  = false;

			foreach ( $ambrygen_pdf_links as $ambrygen_link ) {
				$ambrygen_link_url = isset( $ambrygen_link['url'] ) ? trim( $ambrygen_link['url'] ) : '';

				if ( '' !== $ambrygen_link_url ) {
					$ambrygen_has_links = true;
					break;
				}
			}

			return '' !== $ambrygen_card_title || $ambrygen_has_links;
		}
	)
);

$ambrygen_collaborator_terms = array();

if ( ! empty( $ambrygen_collaborator_ids ) ) {
	$ambrygen_terms = get_terms(
		array(
			'taxonomy'   => 'collaborator',
			'include'    => $ambrygen_collaborator_ids,
			'hide_empty' => false,
		)
	);

	if ( ! is_wp_error( $ambrygen_terms ) ) {
		foreach ( $ambrygen_terms as $ambrygen_term ) {
			$ambrygen_collaborator_terms[ (int) $ambrygen_term->term_id ] = $ambrygen_term;
		}
	}
}

$ambrygen_valid_custom_collaborators = array();

if ( $ambrygen_enable_custom ) {
	foreach ( $ambrygen_custom_collaborators as $ambrygen_custom ) {
		if ( ! is_array( $ambrygen_custom ) ) {
			continue;
		}

		$ambrygen_custom_image_id  = isset( $ambrygen_custom['imageId'] ) ? absint( $ambrygen_custom['imageId'] ) : 0;
		$ambrygen_custom_image_url = isset( $ambrygen_custom['imageUrl'] ) ? (string) $ambrygen_custom['imageUrl'] : '';

		if ( ! $ambrygen_custom_image_id && '' === trim( $ambrygen_custom_image_url ) ) {
			continue;
		}

		$ambrygen_valid_custom_collaborators[] = array(
			'name'      => isset( $ambrygen_custom['name'] ) ? sanitize_text_field( $ambrygen_custom['name'] ) : '',
			'url'       => isset( $ambrygen_custom['url'] ) ? (string) $ambrygen_custom['url'] : '',
			'image_id'  => $ambrygen_custom_image_id,
			'image_url' => $ambrygen_custom_image_url,
			'image_alt' => isset( $ambrygen_custom['imageAlt'] ) ? sanitize_text_field( $ambrygen_custom['imageAlt'] ) : '',
		);
	}
}

$ambrygen_has_resource_section = $ambrygen_has_resources_title || ! empty( $ambrygen_cards_with_content );
$ambrygen_has_org_section      = $ambrygen_has_org_title || ! empty( $ambrygen_collaborator_terms ) || ! empty( $ambrygen_valid_custom_collaborators );
$ambrygen_has_header           = $ambrygen_has_heading || $ambrygen_has_subtitle;

if ( ! $ambrygen_has_header && ! $ambrygen_has_resource_section && ! $ambrygen_has_org_section ) {
	return;
}

$wrapper_attributes = get_block_wrapper_attributes(
	array_filter(
		array(
			'id'    => $ambrygen_block_id ?: null,
			'class' => 'resources',
		)
	)
);
?>

<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Generated by get_block_wrapper_attributes(). ?>>
	<?php if ( $ambrygen_has_header ) : ?>
		<div class="resources__header">
			<?php if ( $ambrygen_has_heading ) : ?>
				<<?php echo tag_escape( $ambrygen_heading_level ); ?> class="heading-4 block-title mb-0 resources__title">
					<?php echo wp_kses( $ambrygen_title, Helper::allowed_heading_html() ); ?>
				</<?php echo tag_escape( $ambrygen_heading_level ); ?>>
			<?php endif; ?>

			<?php if ( $ambrygen_has_heading && $ambrygen_has_subtitle ) : ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
			<?php endif; ?>

			<?php if ( $ambrygen_has_subtitle ) : ?>
				<div class="body1 resources__subtitle">
					<?php echo wp_kses_post( $ambrygen_subtitle ); ?>
				</div>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<?php if ( $ambrygen_has_header && ( $ambrygen_has_resource_section || $ambrygen_has_org_section ) ) : ?>
		<div class="is-style-gl-s50" aria-hidden="true"></div>
	<?php endif; ?>

	<div class="resources__layout">
		<?php if ( $ambrygen_has_resource_section ) : ?>
			<div class="test-lists-downloads">
				<div class="resources__card">
					<?php if ( $ambrygen_has_resources_title ) : ?>
						<div class="subtitle2-sbold resources__card-title text-center">
							<?php echo wp_kses_post( $ambrygen_resources_card_title ); ?>
						</div>
					<?php endif; ?>

					<?php if ( ! empty( $ambrygen_cards_with_content ) ) : ?>
						<div class="test-lists-downloads__list">
							<?php foreach ( $ambrygen_cards_with_content as $ambrygen_card ) : ?>
								<?php
								$ambrygen_card_title = $ambrygen_card['title'] ?? '';
								$ambrygen_pdf_links  = isset( $ambrygen_card['pdfLinks'] ) && is_array( $ambrygen_card['pdfLinks'] ) ? $ambrygen_card['pdfLinks'] : array();
								$ambrygen_valid_links = array_values(
									array_filter(
										$ambrygen_pdf_links,
										static function ( $ambrygen_link ) {
											$ambrygen_link_url = isset( $ambrygen_link['url'] ) ? trim( $ambrygen_link['url'] ) : '';
											return '' !== $ambrygen_link_url;
										}
									)
								);
								?>
								<div class="test-lists-downloads__item">
									<?php if ( '' !== $ambrygen_card_title ) : ?>
										<div class="body1-sbold test-lists-downloads__item-title">
											<?php echo wp_kses_post( $ambrygen_card_title ); ?>
										</div>
									<?php endif; ?>

									<?php if ( ! empty( $ambrygen_valid_links ) ) : ?>
										<div class="test-lists-downloads__links">
											<?php foreach ( $ambrygen_valid_links as $ambrygen_link ) : ?>
												<?php
												$ambrygen_link_url        = isset( $ambrygen_link['url'] ) ? (string) $ambrygen_link['url'] : '';
												$ambrygen_link_label      = isset( $ambrygen_link['label'] ) && '' !== trim( $ambrygen_link['label'] ) ? $ambrygen_link['label'] : 'PDF';
												$ambrygen_card_context    = trim( wp_strip_all_tags( $ambrygen_card_title ) );
												$ambrygen_link_context    = $ambrygen_card_context
													? sprintf(
														/* translators: 1: download label. 2: resource card title. */
														__( '%1$s - %2$s', 'ambrygen-web' ),
														wp_strip_all_tags( $ambrygen_link_label ),
														$ambrygen_card_context
													)
													: wp_strip_all_tags( $ambrygen_link_label );
												$ambrygen_link_aria_label = sprintf(
													/* translators: 1: download label. 2: accessibility notice. */
													__( 'Download %1$s (%2$s)', 'ambrygen-web' ),
													$ambrygen_link_context,
													__( 'opens in a new tab', 'ambrygen-web' )
												);
												?>
												<?php if ( $ambrygen_is_admin_render ) : ?>
													<div class="resources__link">
														<?php echo esc_html( $ambrygen_link_label ); ?>
														<img src="<?php echo esc_url( $ambrygen_download_icon_src ); ?>" alt="" aria-hidden="true">
													</div>
												<?php else : ?>
													<a href="<?php echo esc_url( $ambrygen_link_url ); ?>" class="resources__link" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( $ambrygen_link_aria_label ); ?>">
														<?php echo esc_html( $ambrygen_link_label ); ?>
														<img src="<?php echo esc_url( $ambrygen_download_icon_src ); ?>" alt="" aria-hidden="true">
													</a>
												<?php endif; ?>
											<?php endforeach; ?>
										</div>
									<?php endif; ?>
								</div>
							<?php endforeach; ?>
						</div>
					<?php endif; ?>
				</div>
			</div>
		<?php endif; ?>

		<?php if ( $ambrygen_has_org_section ) : ?>
			<div class="resources__orgs-group">
				<div class="resources__card">
					<?php if ( $ambrygen_has_org_title ) : ?>
						<h3 class="subtitle2-sbold resources__card-title text-center">
							<?php echo wp_kses_post( $ambrygen_org_title ); ?>
						</h3>
					<?php endif; ?>

					<?php if ( ! empty( $ambrygen_collaborator_terms ) || ! empty( $ambrygen_valid_custom_collaborators ) ) : ?>
						<div class="resources__card-logo-grid resources__card-logo-grid--3-col">
							<?php foreach ( $ambrygen_collaborator_ids as $ambrygen_term_id ) : ?>
							<?php
							$ambrygen_term = $ambrygen_collaborator_terms[ $ambrygen_term_id ] ?? null;

							if ( ! $ambrygen_term ) {
								continue;
							}

							$ambrygen_term_image_id = get_term_meta( $ambrygen_term->term_id, 'term_image', true );
							$ambrygen_term_link     = (string) get_term_meta( $ambrygen_term->term_id, 'link', true );
							$ambrygen_term_label    = sprintf(
								/* translators: 1: collaborator name. 2: accessibility notice. */
								__( '%1$s (%2$s)', 'ambrygen-web' ),
								$ambrygen_term->name,
								__( 'opens in a new tab', 'ambrygen-web' )
							);
							?>
							<?php if ( $ambrygen_is_admin_render || ! $ambrygen_term_link ) : ?>
								<div class="resources__card-logo-link" aria-label="<?php echo esc_attr( $ambrygen_term->name ); ?>">
									<?php
									echo wp_kses_post(
										Helper::image_with_placeholder(
											$ambrygen_term_image_id ? absint( $ambrygen_term_image_id ) : 0,
											'large'
										)
									);
									?>
								</div>
							<?php else : ?>
								<a href="<?php echo esc_url( $ambrygen_term_link ); ?>" class="resources__card-logo-link" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( $ambrygen_term_label ); ?>">
									<?php
									echo wp_kses_post(
										Helper::image_with_placeholder(
											$ambrygen_term_image_id ? absint( $ambrygen_term_image_id ) : 0,
											'large'
										)
									);
									?>
								</a>
							<?php endif; ?>
							<?php endforeach; ?>

							<?php if ( ! empty( $ambrygen_valid_custom_collaborators ) ) : ?>
								<?php foreach ( $ambrygen_valid_custom_collaborators as $ambrygen_custom ) : ?>
								<?php
								$ambrygen_custom_name       = $ambrygen_custom['name'];
								$ambrygen_custom_url        = $ambrygen_custom['url'];
								$ambrygen_custom_image_id   = $ambrygen_custom['image_id'];
								$ambrygen_custom_image_url  = $ambrygen_custom['image_url'];
								$ambrygen_custom_image_alt  = $ambrygen_custom['image_alt'];
								$ambrygen_custom_name_label = $ambrygen_custom_name ?: __( 'Collaborator', 'ambrygen-web' );
								$ambrygen_custom_label     = sprintf(
									/* translators: 1: collaborator name. 2: accessibility notice. */
									__( '%1$s (%2$s)', 'ambrygen-web' ),
									$ambrygen_custom_name_label,
									__( 'opens in a new tab', 'ambrygen-web' )
								);
								?>
								<?php if ( $ambrygen_is_admin_render || ! $ambrygen_custom_url ) : ?>
									<div class="resources__card-logo-link" aria-label="<?php echo esc_attr( $ambrygen_custom_name_label ); ?>">
										<?php
										// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
										echo Helper::image_from_source(
											$ambrygen_custom_image_id,
											$ambrygen_custom_image_url,
											'large',
											array(
												'alt' => $ambrygen_custom_image_alt,
											),
											true
										);
										// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
										?>
									</div>
								<?php else : ?>
									<a href="<?php echo esc_url( $ambrygen_custom_url ); ?>" class="resources__card-logo-link" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( $ambrygen_custom_label ); ?>">
										<?php
										// phpcs:disable WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
										echo Helper::image_from_source(
											$ambrygen_custom_image_id,
											$ambrygen_custom_image_url,
											'large',
											array(
												'alt' => $ambrygen_custom_image_alt,
											),
											true
										);
										// phpcs:enable WordPress.Security.EscapeOutput.OutputNotEscaped
										?>
									</a>
								<?php endif; ?>
								<?php endforeach; ?>
							<?php endif; ?>
						</div>
					<?php endif; ?>
				</div>
			</div>
		<?php endif; ?>
	</div>
</div>
