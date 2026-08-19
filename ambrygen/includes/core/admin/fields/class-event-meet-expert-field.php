<?php

namespace Ambrygen\Theme\Core\Admin\Fields;

use Ambrygen\Theme\Core\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * Repeater field renderer for event meet-the-expert sessions.
 */
final class EventMeetExpertRepeaterField {

	use Singleton;

	/**
	 * Render the meet-the-expert repeater field.
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

		echo '<div class="ambrygen-meet-expert-repeater" data-key="' . esc_attr( $key ) . '">';
		echo '<div class="ambrygen-meet-expert-rows">';
		if ( ! empty( $rows ) ) {
			foreach ( $rows as $index => $row ) {
				echo $this->render_session_row_html( $key, (string) $index, $row );
			}
		}
		echo '</div>';
		echo '<div class="form-field form-field-button">';
		echo '<button type="button" class="theme-button is-secondary ambrygen-meet-expert-add-session">' . esc_html__( 'Add Session', 'ambrygen-web' ) . '</button>';
		echo '</div>';
		echo '<script type="text/template" class="ambrygen-meet-expert-template">';
		echo $this->render_session_row_html( $key, '__INDEX__', array() );
		echo '</script>';
		echo '<script type="text/template" class="ambrygen-meet-expert-member-template">';
		echo $this->render_member_row_html( $key, '__SESSION_INDEX__', '__MEMBER_INDEX__', array() );
		echo '</script>';
		echo '</div>';
	}

	/**
	 * Render one repeater session row.
	 *
	 * @param string $key   Meta field key.
	 * @param string $index Session row index.
	 * @param array  $row   Session row data.
	 * @return string
	 */
	public function render_session_row_html( string $key, string $index, array $row ): string {
		$session_date = isset( $row['session_date'] ) ? sanitize_text_field( (string) $row['session_date'] ) : '';
		$session_time = isset( $row['session_time'] ) ? sanitize_text_field( (string) $row['session_time'] ) : '';
		$members      = isset( $row['members'] ) && is_array( $row['members'] ) ? $row['members'] : array();
		if ( empty( $members ) && ( isset( $row['name'] ) || isset( $row['designation'] ) || isset( $row['bio'] ) || isset( $row['image_id'] ) ) ) {
			$members = array( $row );
		}

		ob_start();
		?>
		<div class="ambrygen-meet-expert-session-row" style="border:1px solid #dcdcde;padding:12px;margin:0 0 12px 0;background:#fff;">
			<div class="form-field" style="margin-top:10px;">
				<label><?php esc_html_e( 'Session Date', 'ambrygen-web' ); ?></label>
				<input type="date" class="widefat" name="<?php echo esc_attr( "{$key}[{$index}][session_date]" ); ?>" value="<?php echo esc_attr( $session_date ); ?>" />
			</div>

			<div class="form-field" style="margin-top:10px;">
				<label><?php esc_html_e( 'Session Time', 'ambrygen-web' ); ?></label>
				<input type="text" class="widefat" name="<?php echo esc_attr( "{$key}[{$index}][session_time]" ); ?>" value="<?php echo esc_attr( $session_time ); ?>" placeholder="<?php esc_attr_e( 'e.g. 12:00 PM - 1:00 PM', 'ambrygen-web' ); ?>" />
			</div>

			<div class="ambrygen-meet-expert-member-rows" style="margin-top:12px;">
				<?php
				if ( ! empty( $members ) ) {
					foreach ( $members as $member_index => $member_row ) {
						echo $this->render_member_row_html( $key, $index, (string) $member_index, $member_row );
					}
				}
				?>
			</div>


			<div class="form-field form-field-button">
				<button type="button" class="theme-button is-secondary ambrygen-meet-expert-add-member"><?php esc_html_e( 'Add Member', 'ambrygen-web' ); ?></button>
				<button type="button" class="theme-button is-destructive button-link-delete ambrygen-meet-expert-remove-session"><?php esc_html_e( 'Remove Session', 'ambrygen-web' ); ?></button>
			</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}

	/**
	 * Render one repeater member row.
	 *
	 * @param string $key         Meta field key.
	 * @param string $session_idx Session row index.
	 * @param string $member_idx  Member row index.
	 * @param array  $row         Member row data.
	 * @return string
	 */
	public function render_member_row_html( string $key, string $session_idx, string $member_idx, array $row ): string {
		$name        = isset( $row['name'] ) ? sanitize_text_field( (string) $row['name'] ) : '';
		$designation = isset( $row['designation'] ) ? sanitize_text_field( (string) $row['designation'] ) : '';
		$bio         = isset( $row['bio'] ) ? wp_kses_post( (string) $row['bio'] ) : '';
		$image_id    = isset( $row['image_id'] ) ? absint( $row['image_id'] ) : 0;
		$image_url   = $image_id > 0 ? wp_get_attachment_image_url( $image_id, 'thumbnail' ) : '';
		$editor_id   = sanitize_key( "{$key}_{$session_idx}_{$member_idx}_bio" );

		ob_start();
		?>
		<div class="ambrygen-meet-expert-member-row" style="border:1px dashed #dcdcde;padding:12px;margin:0 0 12px 0;background:#fdfdfd;">
			<div class="ambrygen-single-image-field">
				<label><?php esc_html_e( 'Image', 'ambrygen-web' ); ?></label>
				<input type="hidden" class="widefat ambrygen-single-image-input" name="<?php echo esc_attr( "{$key}[{$session_idx}][members][{$member_idx}][image_id]" ); ?>" value="<?php echo esc_attr( $image_id ); ?>" />
				<div class="ambrygen-single-image-preview" style="margin:8px 0;">
					<?php if ( $image_url ) : ?>
						<img src="<?php echo esc_url( $image_url ); ?>" alt="" style="width:96px;height:96px;object-fit:cover;border:1px solid #ddd;border-radius:4px;" />
					<?php else : ?>
						<span class="ambrygen-single-image-empty"><?php esc_html_e( 'No image selected.', 'ambrygen-web' ); ?></span>
					<?php endif; ?>
				</div>
				<div class="form-field form-field-button">
					<button type="button" class="theme-button is-secondary ambrygen-single-image-upload"><?php esc_html_e( 'Select Image', 'ambrygen-web' ); ?></button>
					<button type="button" class="theme-button is-destructive ambrygen-single-image-remove"><?php esc_html_e( 'Clear', 'ambrygen-web' ); ?></button>
				</div>
			</div>

			<div class="form-field" style="margin-top:10px;">
				<label><?php esc_html_e( 'Name', 'ambrygen-web' ); ?></label>
				<input type="text" class="widefat" name="<?php echo esc_attr( "{$key}[{$session_idx}][members][{$member_idx}][name]" ); ?>" value="<?php echo esc_attr( $name ); ?>" />
			</div>

			<div class="form-field" style="margin-top:10px;">
				<label><?php esc_html_e( 'Designation', 'ambrygen-web' ); ?></label>
				<input type="text" class="widefat" name="<?php echo esc_attr( "{$key}[{$session_idx}][members][{$member_idx}][designation]" ); ?>" value="<?php echo esc_attr( $designation ); ?>" />
			</div>

			<div class="form-field" style="margin-top:10px;">
				<label for="<?php echo esc_attr( $editor_id ); ?>"><?php esc_html_e( 'Bio', 'ambrygen-web' ); ?></label>
				<textarea class="widefat wp-editor-area ambrygen-meet-expert-bio" id="<?php echo esc_attr( $editor_id ); ?>" name="<?php echo esc_attr( "{$key}[{$session_idx}][members][{$member_idx}][bio]" ); ?>" rows="6"><?php echo esc_textarea( $bio ); ?></textarea>
			</div>

			<div class="form-field form-field-button">
				<button type="button" class="theme-button is-destructive button-link-delete ambrygen-meet-expert-remove-member"><?php esc_html_e( 'Remove Member', 'ambrygen-web' ); ?></button>
			</div>
		</div>
		<?php
		return (string) ob_get_clean();
	}
}
