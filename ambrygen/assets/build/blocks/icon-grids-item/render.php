<?php
/**
 * Server-side rendering for icon-grids-item child block
 *
 * @package ambrygen
 */

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(  
		'class' => 'info-list__col',
	)
);

$ambrygen_attributes = $attributes ?? array();

$ambrygen_icon      = $ambrygen_attributes['icon'] ?? array();
$ambrygen_title     = $ambrygen_attributes['title'] ?? '';
$ambrygen_links     = $ambrygen_attributes['links'] ?? array();
$ambrygen_icon_alt  = $ambrygen_icon['alt'] ?? 'Icon';
$ambrygen_icon_url  = $ambrygen_icon['url'] ?? '';
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="info-list__card">

		<?php if ( $ambrygen_icon_url ) : ?>
			<div class="info-list__image">
				<img 
					src="<?php echo esc_url( $ambrygen_icon_url ); ?>"
					alt="<?php echo esc_attr( $ambrygen_icon_alt ); ?>"
					loading="lazy"
				/>
			</div>
		<?php endif; ?>

		<div class="info-list__content">

			<?php if ( $ambrygen_title ) : ?>
				<div class="subtitle1-sbold info-list__title">
					<?php echo esc_html( $ambrygen_title ); ?>
				</div>
			<?php endif; ?>

			<div class="is-style-gl-s8"></div>

			<?php if ( ! empty( $ambrygen_links ) ) : ?>
				<div class="info-list__links">
					<?php foreach ( $ambrygen_links as $ambrygen_link ) : ?>
						<?php if ( ! empty( $ambrygen_link['label'] ) && ! empty( $ambrygen_link['url'] ) ) : ?>
							<div class="info-list__link-col text-md-Semibold">
								<a href="<?php echo esc_url( $ambrygen_link['url'] ); ?>" class="info-list__link">
									<?php echo esc_html( $ambrygen_link['label'] ); ?>
								</a>
							</div>
						<?php endif; ?>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>

		</div>
	</div>
</div>
