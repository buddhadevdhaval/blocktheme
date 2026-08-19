<?php

namespace Ambrygen\Theme\Core\Admin\Fields;

use Ambrygen\Theme\Core\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Render the webinar author repeater admin field UI.
 */
final class WebinarAuthorRepeaterField {

	use Singleton;

	/**
	 * Render the webinar author repeater field.
	 *
	 * @param int    $post_id Post ID.
	 * @param string $key     Meta key.
	 * @param array  $field   Field configuration.
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

		echo '<div class="cs-wpblock-form-layout">';
		echo '<div class="ambrygen-mm-repeater full-width-layout " data-key="' . esc_attr( $key ) . '">';
		echo '<div class="ambrygen-mm-rows">';
		if ( ! empty( $rows ) ) {
			foreach ( $rows as $index => $row ) {
				echo $this->render_row_html( $key, (string) $index, $row );
			}
		}
		echo '</div>';
		echo '<div class="form-field-button"><button type="button" class="theme-button is-secondary ambrygen-mm-add-row">' . esc_html__( 'Add Author', 'ambrygen-web' ) . '</button></div>';
		echo '<script type="text/template" class="ambrygen-mm-template">';
		echo $this->render_row_html( $key, '__INDEX__', array() );
		echo '</script>';
		echo '</div>';
		echo '</div>';
	}

	/**
	 * Render a single webinar author repeater row.
	 *
	 * @param string $key   Meta key.
	 * @param string $index Row index.
	 * @param array  $row   Row data.
	 * @return string
	 */
	public function render_row_html( string $key, string $index, array $row ): string {
		$linked_author   = isset( $row['linked_author'] ) ? absint( $row['linked_author'] ) : 0;
		$designation     = isset( $row['designation'] ) ? sanitize_text_field( (string) $row['designation'] ) : '';
		$bio             = isset( $row['bio'] ) ? wp_kses_post( (string) $row['bio'] ) : '';
		$image_id        = isset( $row['image_id'] ) ? absint( $row['image_id'] ) : 0;
		$image_url       = $image_id > 0 ? wp_get_attachment_image_url( $image_id, 'thumbnail' ) : '';
		$editor_id       = sanitize_key( "{$key}_{$index}_bio" );
		$datalist_id     = sanitize_key( "{$key}_{$index}_linked_author_list" );
		$author_title    = $linked_author > 0 ? get_the_title( $linked_author ) : '';
		$is_template_row = '__INDEX__' === $index;

		$authors = get_posts(
			array(
				'post_type'      => 'author',
				'post_status'    => 'publish',
				'posts_per_page' => -1,
				'orderby'        => 'title',
				'order'          => 'ASC',
			)
		);

		ob_start();
		?>
		<div class="ambrygen-mm-row" style="border:1px solid #dcdcde;padding:12px;margin:0 0 12px 0;background:#fff;">
			<div>
				<label><?php esc_html_e( 'Linked Author', 'ambrygen-web' ); ?></label>
				<input
					type="text"
					class="widefat ambrygen-webinar-author-search"
					list="<?php echo esc_attr( $datalist_id ); ?>"
					value="<?php echo esc_attr( $author_title ); ?>"
					placeholder="<?php esc_attr_e( 'Search Author', 'ambrygen-web' ); ?>"
				/>
				<input
					type="hidden"
					class="ambrygen-webinar-author-id"
					name="<?php echo esc_attr( "{$key}[{$index}][linked_author]" ); ?>"
					value="<?php echo esc_attr( $linked_author ); ?>"
				/>
				<datalist id="<?php echo esc_attr( $datalist_id ); ?>">
					<?php foreach ( $authors as $author ) : ?>
						<option
							class="ambrygen-webinar-author-option"
							value="<?php echo esc_attr( $author->post_title ); ?>"
							data-author-id="<?php echo esc_attr( (string) $author->ID ); ?>"
						></option>
					<?php endforeach; ?>
				</datalist>
			</div>

			<div class="ambrygen-media-file-field" style="margin-top:10px;">
				<label><?php esc_html_e( 'Image Override', 'ambrygen-web' ); ?></label>
				<input type="hidden" class="widefat ambrygen-media-file-input" name="<?php echo esc_attr( "{$key}[{$index}][image_id]" ); ?>" value="<?php echo esc_attr( $image_id ); ?>" />
				<div class="ambrygen-media-file-preview" style="margin:8px 0;">
					<?php if ( $image_url ) : ?>
						<img src="<?php echo esc_url( $image_url ); ?>" alt="" style="width:96px;height:96px;object-fit:cover;border:1px solid #ddd;border-radius:4px;" />
					<?php else : ?>
						<span class="ambrygen-media-file-empty"><?php esc_html_e( 'No image selected.', 'ambrygen-web' ); ?></span>
					<?php endif; ?>
				</div>
				<div class="form-field-button">
					<button type="button" class="theme-button is-secondary ambrygen-media-file-upload"><?php esc_html_e( 'Select Image', 'ambrygen-web' ); ?></button>
					<button type="button" class="theme-button is-destructive ambrygen-media-file-remove"><?php esc_html_e( 'Clear', 'ambrygen-web' ); ?></button>
				</div>
			</div>

			<div style="margin-top:10px;">
				<label><?php esc_html_e( 'Designation Override', 'ambrygen-web' ); ?></label>
				<input type="text" class="widefat" name="<?php echo esc_attr( "{$key}[{$index}][designation]" ); ?>" value="<?php echo esc_attr( $designation ); ?>" />
			</div>

			<div style="margin-top:10px;">
				<label for="<?php echo esc_attr( $editor_id ); ?>"><?php esc_html_e( 'Bio Override', 'ambrygen-web' ); ?></label>
				<?php if ( $is_template_row ) : ?>
					<textarea
						class="widefat ambrygen-webinar-author-bio"
						id="<?php echo esc_attr( $editor_id ); ?>"
						name="<?php echo esc_attr( "{$key}[{$index}][bio]" ); ?>"
						rows="6"
					><?php echo esc_textarea( $bio ); ?></textarea>
				<?php else : ?>
					<?php
					wp_editor(
						$bio,
						$editor_id,
						array(
							'textarea_name'  => "{$key}[{$index}][bio]",
							'textarea_rows'  => 6,
							'media_buttons'  => false,
							'teeny'          => true,
							'quicktags'      => true,
							'textarea_class' => 'ambrygen-webinar-author-bio',
						)
					);
					?>
				<?php endif; ?>
			</div>

			<div class="theme-field-actions form-field-button">
				<button type="button" class="button-link-delete ambrygen-mm-remove-row theme-button is-destructive"><?php esc_html_e( 'Remove Row', 'ambrygen-web' ); ?></button>
				</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}
}
