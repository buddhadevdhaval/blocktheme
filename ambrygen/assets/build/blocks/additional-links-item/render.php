<?php
/**
 * Additional Links Item Block Template.
 *
 * @package Ambrygen
 */

use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'additional-link__card',
	)
);

$ambrygen_icon = $attributes['icon'] ?? array();
$ambrygen_cta  = $attributes['cta'] ?? array();

$ambrygen_title        = $ambrygen_cta['text'] ?? '';
$ambrygen_url          = $ambrygen_cta['url'] ?? '';
$ambrygen_target_blank = ! empty( $ambrygen_cta['target'] );
$ambrygen_rel          = $ambrygen_cta['rel'] ?? '';

$ambrygen_icon_id  = isset( $ambrygen_icon['id'] ) ? (int) $ambrygen_icon['id'] : 0;
$ambrygen_icon_alt = $ambrygen_icon['alt'] ?? '';
?>

<?php if ( $ambrygen_url ) : ?>
	<a
		href="<?php echo esc_url( $ambrygen_url ); ?>"
		class="additional-link__card wp-block-ambrygen-additional-links-item"
		<?php
		if ( $ambrygen_target_blank ) :
			?>
			target="_blank"
			rel="noopener noreferrer"
		<?php endif; ?>
		aria-label="<?php echo esc_attr( $ambrygen_title ); ?>"
	>
<?php endif; ?>

<div <?php echo wp_kses_post( $ambrygen_wrapper_attributes ); ?>>

		<div class="additional-link__card-image">
			<?php
			echo Helper::image_with_placeholder(
				$ambrygen_icon_id,
				'full',
				array(
					'class' => 'additional-link__logo',
					'alt'   => esc_attr( $ambrygen_icon_alt ),
				)
			);
			?>
		</div>


	<?php if ( $ambrygen_title && $ambrygen_url ) : ?>
		<div class="additional-link__card-content">
			<div class="additional-link__card-link">
				<?php echo esc_html( $ambrygen_title ); ?>
			</div>
		</div>
	<?php endif; ?>

</div>

<?php if ( $ambrygen_url ) : ?>
	</a>
<?php endif; ?>