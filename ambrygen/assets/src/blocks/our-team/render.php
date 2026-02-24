<?php
$attributes = $attributes ?? [];

$title         = $attributes['title'] ?? 'Our <span>Executive</span> Team';
$intro         = $attributes['intro'] ?? 'We are proud to be leading the industry that we love and working together.';
$heading_level = $attributes['headingLevel'] ?? 'h2';

$wrapper_attributes = get_block_wrapper_attributes([
	'class' => 'our-team'
]);

$heading_level = in_array($heading_level, [ 'h1','h2','h3','h4','h5','h6' ], true ) ? $heading_level : 'h2';
?>

<div <?php echo $wrapper_attributes; ?>>
	<div class="our-team__header block__rowflex">

		<<?php echo esc_html( $heading_level ); ?> class="our-team__title block__rowflex--heading-title heading-3 mb-0">
			<?php echo wp_kses_post( $title ); ?>
		</<?php echo esc_html( $heading_level ); ?>>

		<div class="our-team__intro block__rowflex--block-content subtitle1">
			<?php echo esc_html( $intro ); ?>
		</div>

	</div>

	<div class="is-style-gl-s50"></div>

	<div class="our-team__grid">
		<?php echo $content; ?>
	</div>
</div>
