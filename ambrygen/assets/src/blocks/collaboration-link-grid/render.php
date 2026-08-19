<?php
/**
 * Render: Link List Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$ambrygen_anchor           = isset( $attributes['anchor'] ) ? sanitize_html_class( $attributes['anchor'] ) : '';
$ambrygen_block_id         = isset( $attributes['blockId'] ) ? sanitize_html_class( $attributes['blockId'] ) : '';
$ambrygen_select_all       = isset( $attributes['selectAllCollaborators'] ) ? (bool) $attributes['selectAllCollaborators'] : true;
$ambrygen_collaborator_ids = isset( $attributes['collaboratorIds'] ) && is_array( $attributes['collaboratorIds'] ) ? array_map( 'absint', $attributes['collaboratorIds'] ) : array();
$ambrygen_title            = $attributes['title'] ?? '';
$ambrygen_heading_tag      = Helper::get_heading_tag( $attributes['headingTag'] ?? 'h2', 'h2' );
$ambrygen_section_id       = sanitize_html_class( ( $ambrygen_block_id ?: wp_unique_id( 'collaboration-link-grid-' ) ) . '-items' );

$wrapper_attributes = get_block_wrapper_attributes(
	( $ambrygen_anchor || $ambrygen_block_id )
	? array(
		'class' => 'download-list block-layout variation-grid-view variation-with-accordion',
		'id'    => $ambrygen_anchor ?: $ambrygen_block_id,
	)
	: array(
		'class' => 'download-list block-layout variation-grid-view variation-with-accordion',
	)
);

$ambrygen_collaborator_terms = array();

if ( $ambrygen_select_all || ! empty( $ambrygen_collaborator_ids ) ) {
		$ambrygen_term_query = array(
			'taxonomy'   => 'collaborator',
			'hide_empty' => false,
			'orderby'    => 'name',
			'order'      => 'ASC',
		);

		if ( $ambrygen_select_all ) {
			if ( ! empty( $ambrygen_collaborator_ids ) ) {
				$ambrygen_term_query['exclude'] = $ambrygen_collaborator_ids;
			}
		} else {
			$ambrygen_term_query['include'] = $ambrygen_collaborator_ids;
		}

		$ambrygen_terms = get_terms( $ambrygen_term_query );

		if ( ! is_wp_error( $ambrygen_terms ) ) {
			$ambrygen_collaborator_terms = $ambrygen_terms;
		}
}
?>

<section <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="download-list__inner">
		<div class="download-list__header-area mb-24 js-gsap-fade">
			<div class="download-list__content">
				<?php if ( $ambrygen_title ) : ?>
					<div class="download-list__title-wrap">
						<<?php echo tag_escape( $ambrygen_heading_tag ); ?> class="download-list__title heading-3 block-title mb-0">
							<?php echo wp_kses_post( $ambrygen_title ); ?>
						</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
						<button
							class="download-list__toggle"
							type="button"
							aria-expanded="false"
							aria-controls="<?php echo esc_attr( $ambrygen_section_id ); ?>"
							aria-label="<?php esc_attr_e( 'Expand links section', 'ambrygen-web' ); ?>"
						>
							<span class="download-list__toggle-icon" aria-hidden="true"></span>
						</button>
					</div>
				<?php endif; ?>
			</div>
		</div>
		<div class="download-list__items is-collapsed" id="<?php echo esc_attr( $ambrygen_section_id ); ?>">
			<?php
			if ( ! empty( $ambrygen_collaborator_terms ) ) {
				foreach ( $ambrygen_collaborator_terms as $ambrygen_term ) {
					$ambrygen_term_link = (string) get_term_meta( $ambrygen_term->term_id, 'link', true );

					if ( empty( $ambrygen_term_link ) ) {
						continue;
					}
					?>
					<div class="download-list__grid-item js-gsap-fade">
						<a href="<?php echo esc_url( $ambrygen_term_link ); ?>" class="download-list__grid-link" target="_blank" rel="noopener noreferrer" aria-label="<?php echo esc_attr( sprintf( __( '%s (opens in a new tab)', 'ambrygen-web' ), $ambrygen_term->name ) ); ?>">
							<span class="download-list__item-text">
								<?php echo esc_html( $ambrygen_term->name ); ?>
							</span>
						</a>
					</div>
					<?php
				}
			}
			?>
		</div>
	</div>
</section>
