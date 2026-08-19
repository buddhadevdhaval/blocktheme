<?php

namespace Ambrygen\Theme\Core\Admin\Fields;

use Ambrygen\Theme\Core\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Repeater field renderer for poster and presentation PDF rows.
 */
final class PosterPdfRepeaterField {

	use Singleton;

	/**
	 * Render the PDF repeater field.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $key     Meta field key.
	 * @param array  $field   Field definition.
	 * @return void
	 */
	public function render( int $post_id, string $key, array $field ): void {
		$rows = get_post_meta( $post_id, $key, true );
		if ( ! is_array( $rows ) ) {
			$rows = array();
		}

		$rows = array_values(
			array_filter(
				$rows,
				static function ( $row ): bool {
					return is_array( $row );
				}
			)
		);

		echo '<div class="ambrygen-mm-repeater" data-key="' . esc_attr( $key ) . '">';
		echo '<div class="ambrygen-mm-rows">';
		if ( ! empty( $rows ) ) {
			foreach ( $rows as $index => $row ) {
				echo $this->render_row_html( $key, (string) $index, $row );
			}
		} else {
			echo $this->render_row_html( $key, '0', array() );
		}
		echo '</div>';
		echo '<script type="text/template" class="ambrygen-mm-template">';
		echo $this->render_row_html( $key, '__INDEX__', array() );
		echo '</script>';
		echo '</div>';
	}

	/**
	 * Render one PDF repeater row.
	 *
	 * @param string $key   Meta field key.
	 * @param string $index Row index.
	 * @param array  $row   Row data.
	 * @return string
	 */
	public function render_row_html( string $key, string $index, array $row ): string {
		$file_id  = isset( $row['file_id'] ) ? absint( $row['file_id'] ) : 0;
		$pdf_type = isset( $row['pdf_type'] ) ? sanitize_text_field( (string) $row['pdf_type'] ) : '';

		$file_title = '';
		$file_url   = '';
		if ( $file_id > 0 ) {
			$file_post = get_post( $file_id );
			$file_url  = wp_get_attachment_url( $file_id );
			if ( $file_post ) {
				$file_title = $file_post->post_title;
			}
		}

		ob_start();
		?>
		<div class="ambrygen-mm-row">
			<p>
				<label><?php esc_html_e( 'PDF Type', 'ambrygen-web' ); ?></label>
				<input type="text" class="widefat" name="<?php echo esc_attr( "{$key}[{$index}][pdf_type]" ); ?>" value="<?php echo esc_attr( $pdf_type ); ?>" placeholder="<?php echo esc_attr__( 'e.g. Scientific Poster', 'ambrygen-web' ); ?>" />
			</p>

			<div class="ambrygen-media-file-field">
				<label><?php esc_html_e( 'PDF File', 'ambrygen-web' ); ?></label>
				<input type="hidden" class="widefat ambrygen-media-file-input" name="<?php echo esc_attr( "{$key}[{$index}][file_id]" ); ?>" value="<?php echo esc_attr( $file_id ); ?>" />
				<div class="ambrygen-media-file-preview">
					<?php if ( $file_id > 0 && $file_url ) : ?>
						<a class="ambrygen-media-file-link" href="<?php echo esc_url( $file_url ); ?>" target="_blank" rel="noopener"><?php echo esc_html( $file_title ?: basename( (string) $file_url ) ); ?></a>
					<?php else : ?>
						<span class="ambrygen-media-file-empty"><?php esc_html_e( 'No file selected.', 'ambrygen-web' ); ?></span>
					<?php endif; ?>
				</div>
				<div class="form-field-button">
					<button type="button" class="theme-button is-secondary ambrygen-media-file-upload"><?php esc_html_e( 'Select File', 'ambrygen-web' ); ?></button>
					<button type="button" class="theme-button is-destructive ambrygen-media-file-remove"><?php esc_html_e( 'Clear', 'ambrygen-web' ); ?></button>
				</div>
			</div>

			<div class="form-field-button">
				<button type="button" class="theme-button is-secondary ambrygen-mm-add-row"><?php esc_html_e( 'Add PDF Row', 'ambrygen-web' ); ?></button>
				<button type="button" class="button-link-delete ambrygen-mm-remove-row theme-button is-destructive"><?php esc_html_e( 'Remove Row', 'ambrygen-web' ); ?></button>
			</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}
}
