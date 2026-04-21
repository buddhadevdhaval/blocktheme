<?php
	/**
	 * Render: Genes Table Block
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

/*
 * Block attributes.
 */
$ambrygen_block_id    = $attributes['blockId'] ?? '';
$ambrygen_card_title  = $attributes['cardTitle'] ?? '';
$ambrygen_taxonomy    = sanitize_key( $attributes['taxonomy'] ?? 'gene' );
$ambrygen_placeholder = $attributes['placeholder'] ?? __( 'Search genes...', 'ambrygen-web' );
$ambrygen_default_symbols = $attributes['defaultSymbols'] ?? '';
$ambrygen_instruction_text = $attributes['instructionText'] ?? __( 'Please enter a comma-separated the list of genes to search for.', 'ambrygen-web' );
$ambrygen_no_results_text = $attributes['noResultsText'] ?? __( 'No genes found', 'ambrygen-web' );
$ambrygen_footnote_text = $attributes['footnoteText'] ?? __( '1 Total number of CDS with > 90% covered with at least 10x', 'ambrygen-web' );

if ( ! taxonomy_exists( $ambrygen_taxonomy ) ) {
	return;
}

$ambrygen_symbols_raw = isset( $_GET['symbols'] ) ? sanitize_text_field( wp_unslash( $_GET['symbols'] ) ) : '';
$ambrygen_symbols     = trim( $ambrygen_symbols_raw );

$ambrygen_effective_symbols = '' !== $ambrygen_symbols ? $ambrygen_symbols : (string) $ambrygen_default_symbols;
$ambrygen_tokens            = Helper::parse_comma_separated_tokens( (string) $ambrygen_effective_symbols );
$ambrygen_has_query          = ! empty( $ambrygen_tokens );
$ambrygen_terms             = $ambrygen_has_query ? Helper::get_terms_by_name_or_meta_like( $ambrygen_taxonomy, $ambrygen_tokens, 'isoform', 50 ) : array();

$ambrygen_get_term_field = static function ( int $term_id, string $taxonomy, string $key ): string {
	$value = get_term_meta( $term_id, $key, true );

	if ( ( null === $value || '' === $value ) && function_exists( 'get_field' ) ) {
		$acf_value = get_field( $key, $taxonomy . '_' . $term_id );
		if ( is_string( $acf_value ) || is_numeric( $acf_value ) ) {
			$value = $acf_value;
		}
	}

	if ( is_array( $value ) || is_object( $value ) ) {
		return '';
	}

	return is_string( $value ) ? $value : (string) $value;
};

$ambrygen_block_id    = $ambrygen_block_id ? sanitize_html_class( $ambrygen_block_id ) : '';
$ambrygen_card_title  = $ambrygen_card_title ? (string) $ambrygen_card_title : '';

/*
 * Wrapper attributes.
 */
$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	$ambrygen_block_id
	? array(
		'class' => 'gl-data-table genes-table',
		'id'    => $ambrygen_block_id,
	)
	: array(
		'class' => 'gl-data-table genes-table',
	)
);
?>

<div <?php echo wp_kses_data( $ambrygen_wrapper_attributes ); ?>>
	<?php if ( '' !== (string) $ambrygen_card_title ) : ?>
		<div class="gl-data-table__card-header">
			<h3 class="gl-data-table__card-title"><?php echo esc_html( (string) $ambrygen_card_title ); ?></h3>
		</div>
	<?php endif; ?>
	
	<div class="genes-table__search">
		<form method="get" class="genes-table__search-form">
			<label class="screen-reader-text" for="<?php echo esc_attr( $ambrygen_block_id ?: 'genes-table' ); ?>-search">
				<?php esc_html_e( 'Search genes', 'ambrygen-web' ); ?>
			</label>
			<input
				id="<?php echo esc_attr( $ambrygen_block_id ?: 'genes-table' ); ?>-search"
				type="search"
				class="genes-table__search-input"
				name="symbols"
				value="<?php echo esc_attr( $ambrygen_symbols ); ?>"
				placeholder="<?php echo esc_attr( (string) $ambrygen_placeholder ); ?>"
				autocomplete="off"
			/>
			<input type="submit" class="genes-table__search-button" value="<?php esc_attr_e( 'Search', 'ambrygen-web' ); ?>" />
		</form>
	</div>

	<?php if ( '' === $ambrygen_symbols && '' !== trim( (string) $ambrygen_instruction_text ) ) : ?>
		<p class="genes-table__instruction"><?php echo esc_html( (string) $ambrygen_instruction_text ); ?></p>
	<?php endif; ?>

	<?php if ( $ambrygen_symbols_raw ) : ?>
		<div class="gl-data-table__grid">
			<div class="gl-data-table__row gl-data-table__row--header">
				<div class="gl-data-table__cell"><?php esc_html_e( 'Gene', 'ambrygen-web' ); ?></div>
				<div class="gl-data-table__cell"><?php esc_html_e( 'Isoform', 'ambrygen-web' ); ?></div>
				<div class="gl-data-table__cell"><?php esc_html_e( 'Covered CDS Count', 'ambrygen-web' ); ?></div>
				<div class="gl-data-table__cell"><?php esc_html_e( 'Total CDS', 'ambrygen-web' ); ?></div>
				<div class="gl-data-table__cell"><?php esc_html_e( '% of CDS Covered', 'ambrygen-web' ); ?></div>
			</div>

			<?php if ( empty( $ambrygen_terms ) ) : ?>
				<div class="gl-data-table__row">
					<div class="gl-data-table__cell gl-data-table__cell--name" data-label="Gene"><?php echo esc_html( (string) $ambrygen_no_results_text ); ?></div>
					<div class="gl-data-table__cell" data-label="Isoform"></div>
					<div class="gl-data-table__cell" data-label="Covered CDS Count"></div>
					<div class="gl-data-table__cell" data-label="Total CDS"></div>
					<div class="gl-data-table__cell" data-label="% of CDS Covered"></div>
				</div>
			<?php else : ?>
				<?php foreach ( $ambrygen_terms as $ambrygen_term ) : ?>
					<?php
					$ambrygen_isoform     = $ambrygen_get_term_field( (int) $ambrygen_term->term_id, $ambrygen_taxonomy, 'isoform' );
					$ambrygen_cds_covered = $ambrygen_get_term_field( (int) $ambrygen_term->term_id, $ambrygen_taxonomy, 'covered_cds_count' );
					$ambrygen_cds_count   = $ambrygen_get_term_field( (int) $ambrygen_term->term_id, $ambrygen_taxonomy, 'cds_count' );

					$ambrygen_cds_covered_int = absint( $ambrygen_cds_covered );
					$ambrygen_cds_count_int   = absint( $ambrygen_cds_count );
					$ambrygen_percentage      = $ambrygen_cds_count_int > 0 ? ( $ambrygen_cds_covered_int / $ambrygen_cds_count_int ) * 100 : 0;
					?>
					<div class="gl-data-table__row">
						<div class="gl-data-table__cell gl-data-table__cell--name" data-label="Gene"><?php echo esc_html( $ambrygen_term->name ); ?></div>
						<div class="gl-data-table__cell" data-label="Isoform"><?php echo esc_html( $ambrygen_isoform ); ?></div>
						<div class="gl-data-table__cell" data-label="Covered CDS Count"><?php echo esc_html( $ambrygen_cds_covered ); ?></div>
						<div class="gl-data-table__cell" data-label="Total CDS"><?php echo esc_html( $ambrygen_cds_count ); ?></div>
						<div class="gl-data-table__cell" data-label="% of CDS Covered"><?php echo esc_html( $ambrygen_percentage ); ?></div>
					</div>
				<?php endforeach; ?>
			<?php endif; ?>
		</div>
	<?php endif; ?>

	<?php if ( '' !== $ambrygen_symbols && ! empty( $ambrygen_terms ) && '' !== trim( (string) $ambrygen_footnote_text ) ) : ?>
		<p class="genes-table__footnote"><?php echo wp_kses_post( (string) $ambrygen_footnote_text ); ?></p>
	<?php endif; ?>
</div>
