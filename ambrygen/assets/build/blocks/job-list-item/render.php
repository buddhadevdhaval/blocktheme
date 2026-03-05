<?php
/**
 * Render: Job List Item Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = $attributes ?? [];
$ambrygen_post_id    = ! empty( $ambrygen_attributes['postId'] ) ? absint( $ambrygen_attributes['postId'] ) : 0;

if ( ! $ambrygen_post_id ) {
	return;
}

$ambrygen_post = get_post( $ambrygen_post_id );

if ( ! $ambrygen_post || 'publish' !== $ambrygen_post->post_status ) {
	return;
}

$ambrygen_title = get_the_title( $ambrygen_post_id );
$ambrygen_permalink = get_permalink( $ambrygen_post_id );

// Get taxonomy terms safely.
$ambrygen_job_type_terms     = wp_get_post_terms( $ambrygen_post_id, 'job_type' );
$ambrygen_job_location_terms = wp_get_post_terms( $ambrygen_post_id, 'job_location' );

// Fallback names.
$ambrygen_type_name     = ! empty( $ambrygen_job_type_terms ) && ! is_wp_error( $ambrygen_job_type_terms )
	? $ambrygen_job_type_terms[0]->name
	: __( 'Full Time', 'ambrygen' );

$ambrygen_location_name = ! empty( $ambrygen_job_location_terms ) && ! is_wp_error( $ambrygen_job_location_terms )
	? $ambrygen_job_location_terms[0]->name
	: __( 'Headquarters', 'ambrygen' );

// Icons.
$ambrygen_type_image_url = ! empty( $ambrygen_attributes['jobtypeicon']['url'] )
	? esc_url( $ambrygen_attributes['jobtypeicon']['url'] )
	: esc_url( get_theme_file_uri( 'assets/src/images/clock-icon.svg' ) );

$ambrygen_location_image_url = ! empty( $ambrygen_attributes['joblocationicon']['url'] )
	? esc_url( $ambrygen_attributes['joblocationicon']['url'] )
	: esc_url( get_theme_file_uri( 'assets/src/images/marker-pin-icon.svg' ) );
?>

<div class="careers-highlight__job">
	<div class="careers-highlight__job--row">
		<div class="careers-highlight__job-title subtitle2-sbold">
			<a href="<?php echo esc_url( $ambrygen_permalink ); ?>">
				<?php echo esc_html( $ambrygen_title ); ?>
			</a>
		</div>
		<div class="careers-highlight__job-tag text-small-medium">
			<?php echo esc_html( $ambrygen_type_name ); ?>
		</div>
	</div>

	<div class="careers-highlight__job-meta">
		<div class="careers-highlight__job-location text-md-medium">
			<?php if ( $ambrygen_location_image_url ) : ?>
				<div class="careers-highlight__icon">
					<img 
						src="<?php echo esc_url( $ambrygen_location_image_url ); ?>" 
						alt="<?php echo esc_attr( $ambrygen_location_name ); ?>"
						loading="lazy"
						width="16"
						height="16"
					>
				</div>
			<?php endif; ?>
			<span><?php echo esc_html( $ambrygen_location_name ); ?></span>
		</div>

		<div class="careers-highlight__job-type text-md-medium">
			<?php if ( $ambrygen_type_image_url ) : ?>
				<div class="careers-highlight__icon">
					<img 
						src="<?php echo esc_url( $ambrygen_type_image_url ); ?>" 
						alt="<?php echo esc_attr( $ambrygen_type_name ); ?>"
						loading="lazy"
						width="16"
						height="16"
					>
				</div>
			<?php endif; ?>
			<span><?php echo esc_html( $ambrygen_type_name ); ?></span>
		</div>
	</div>
</div>
