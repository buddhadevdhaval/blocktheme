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

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();

$ambrygen_block_id          = isset( $ambrygen_attributes['blockId'] ) ? $ambrygen_attributes['blockId'] : '';
$ambrygen_title            = isset( $ambrygen_attributes['title'] ) ? $ambrygen_attributes['title'] : '';
$ambrygen_subtitle         = isset( $ambrygen_attributes['subtitle'] ) ? $ambrygen_attributes['subtitle'] : '';
$ambrygen_heading_level    = isset( $ambrygen_attributes['headingLevel'] ) ? $ambrygen_attributes['headingLevel'] : 'h2';
$ambrygen_cards = isset( $ambrygen_attributes['resourceCards'] ) && is_array( $ambrygen_attributes['resourceCards'] ) ? $ambrygen_attributes['resourceCards'] : array();
$ambrygen_org_title        = isset( $ambrygen_attributes['orgTitle'] ) ? $ambrygen_attributes['orgTitle'] : '';
$ambrygen_collaborator_ids = isset( $ambrygen_attributes['collaboratorIds'] ) && is_array( $ambrygen_attributes['collaboratorIds'] ) ? $ambrygen_attributes['collaboratorIds'] : array();
$ambrygen_resources_card_title = isset( $ambrygen_attributes['resourcesCardTitle'] ) ? $ambrygen_attributes['resourcesCardTitle'] : '';

// Validate heading level
if ( ! in_array( $ambrygen_heading_level, array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ), true ) ) {
	$ambrygen_heading_level = 'h2';
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	$ambrygen_block_id
		? array(
			'class' => 'resources',
			'id'    => $ambrygen_block_id,
		)
		: array(
			'class' => 'resources',
		)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="resources__header">
		<?php if ( '' !== $ambrygen_title ) : ?>
			<<?php echo esc_html( $ambrygen_heading_level ); ?> class="heading-4 block-title mb-0 resources__title">
				<?php echo wp_kses( $ambrygen_title, Helper::allowed_heading_html() ); ?>
			</<?php echo esc_html( $ambrygen_heading_level ); ?>>
		<?php endif; ?>
		<div class="is-style-gl-s12" aria-hidden="true"></div>
		<?php if ( '' !== $ambrygen_subtitle ) : ?>
			<div class="body1 resources__subtitle">
				<?php echo wp_kses_post( $ambrygen_subtitle ); ?>
			</div>
		<?php endif; ?>
	</div>

	<div class="is-style-gl-s50" aria-hidden="true"></div>

	<div class="resources__layout">
		<div class="test-lists-downloads">
			<div class="resources__card">
				<?php if ( '' !== $ambrygen_resources_card_title ) : ?>
					<div class="subtitle2-sbold resources__card-title text-center">
						<?php echo wp_kses_post( $ambrygen_resources_card_title ); ?>
					</div>
				<?php endif; ?>
		<?php if ( ! empty( $ambrygen_cards ) ) : ?>
			<div class="test-lists-downloads__list">
				<?php foreach ( $ambrygen_cards as $ambrygen_card ) : ?>
					<div class="test-lists-downloads__item">
						<?php
						$ambrygen_card_title = isset( $ambrygen_card['title'] ) ? $ambrygen_card['title'] : '';
						?>
						<?php if ( '' !== $ambrygen_card_title ) : ?>
							<div class="body1-sbold test-lists-downloads__item-title">
								<?php echo wp_kses_post( $ambrygen_card_title ); ?>
							</div>
						<?php endif; ?>
						<div class="test-lists-downloads__links">
							<?php
							$ambrygen_pdf_links = isset( $ambrygen_card['pdfLinks'] ) && is_array( $ambrygen_card['pdfLinks'] ) ? $ambrygen_card['pdfLinks'] : array();
							foreach ( $ambrygen_pdf_links as $ambrygen_link ) :
								$ambrygen_link_url   = isset( $ambrygen_link['url'] ) ? $ambrygen_link['url'] : '';
								$ambrygen_link_label = isset( $ambrygen_link['label'] ) ? $ambrygen_link['label'] : 'PDF';
								if ( '' === $ambrygen_link_url ) {
									continue;
								}
								?>
								<a download href="<?php echo esc_url( $ambrygen_link_url ); ?>" class="resources__link">
									<?php echo esc_html( $ambrygen_link_label ); ?>
									<img src="<?php echo esc_url( get_template_directory_uri() . '/assets/src/images/download-icon.svg' ); ?>" alt="<?php echo esc_attr( sprintf( __( 'Download %s', 'ambrygen-web' ), $ambrygen_link_label ) ); ?>">
								</a>
							<?php endforeach; ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		<?php endif; ?>
		</div>
		</div>
		<div class="resources__orgs-group">
			<div class="resources__card">
				<?php if ( '' !== $ambrygen_org_title ) : ?>
					<h3 class="subtitle2-sbold resources__card-title text-center">
						<?php echo wp_kses_post( $ambrygen_org_title ); ?>
					</h3>
				<?php endif; ?>
				<?php 
				$ambrygen_enable_custom      = isset( $ambrygen_attributes['enableCustomCollaborators'] ) ? (bool) $ambrygen_attributes['enableCustomCollaborators'] : false;
				$ambrygen_custom_collaborators = isset( $ambrygen_attributes['customCollaborators'] ) && is_array( $ambrygen_attributes['customCollaborators'] ) ? $ambrygen_attributes['customCollaborators'] : array();
				
				if ( ! empty( $ambrygen_collaborator_ids ) || ( $ambrygen_enable_custom && ! empty( $ambrygen_custom_collaborators ) ) ) : ?>
					<div class="resources__card-logo-grid resources__card-logo-grid--3-col">
						<?php
						foreach ( $ambrygen_collaborator_ids as $ambrygen_term_id ) :
							$ambrygen_term = get_term( $ambrygen_term_id, 'collaborator' );
							if ( ! $ambrygen_term || is_wp_error( $ambrygen_term ) ) {
								continue;
							}
							$ambrygen_term_image_id = get_term_meta( $ambrygen_term->term_id, 'term_image', true );
							$ambrygen_term_link     = get_term_meta( $ambrygen_term->term_id, 'link', true );
							?>
								<a href="<?php echo esc_url( $ambrygen_term_link ?: '#' ); ?>" class="resources__card-logo-link" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( $ambrygen_term->name ); ?>">
									<?php
									echo wp_kses_post(
										Helper::image_with_placeholder(
											isset( $ambrygen_term_image_id ) ? absint( $ambrygen_term_image_id ) : 0,
											'large',
										)
									); ?>
								</a>
						<?php endforeach; ?>

						<?php
						if ( $ambrygen_enable_custom ) {
							foreach ( $ambrygen_custom_collaborators as $ambrygen_custom ) :
								$ambrygen_custom_name     = isset( $ambrygen_custom['name'] ) ? $ambrygen_custom['name'] : '';
								$ambrygen_custom_url      = isset( $ambrygen_custom['url'] ) ? $ambrygen_custom['url'] : '#';
								$ambrygen_custom_image_id = isset( $ambrygen_custom['imageId'] ) ? absint( $ambrygen_custom['imageId'] ) : 0;
								?>
								<a href="<?php echo esc_url( $ambrygen_custom_url ); ?>" class="resources__card-logo-link" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( $ambrygen_custom_name ); ?>">
									<?php
									echo wp_kses_post(
										Helper::image_with_placeholder(
											$ambrygen_custom_image_id,
											'large',
										)
									); ?>
								</a>
							<?php endforeach;
						} ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</div>
</div>
