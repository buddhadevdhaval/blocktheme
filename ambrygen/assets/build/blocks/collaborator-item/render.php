<?php
/**
 * Render: Collaborator Item Block
 *
 * @param array    $attributes Block attributes.
 * @param string   $content    Block content.
 * @param WP_Block $block      Block instance.
 *
 * @package ambrygen
 */

defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_term_id = isset( $attributes['termId'] )
	? absint( $attributes['termId'] )
	: 0;

if ( ! $ambrygen_term_id ) {
	return;
}

$ambrygen_term = get_term( $ambrygen_term_id, 'collaborator' );
if ( ! $ambrygen_term || is_wp_error( $ambrygen_term ) ) {
	return;
}

$ambrygen_name        = wp_strip_all_tags( $ambrygen_term->name );
$ambrygen_description = term_description( $ambrygen_term, 'collaborator' );
$ambrygen_image_id    = absint( get_term_meta( $ambrygen_term->term_id, 'term_image', true ) );
$ambrygen_website_url = esc_url( (string) get_term_meta( $ambrygen_term->term_id, 'link', true ) );
$ambrygen_website_label = '';

if ( ! empty( $ambrygen_website_url ) ) {
	$ambrygen_website_host = wp_parse_url( $ambrygen_website_url, PHP_URL_HOST );
	$ambrygen_website_path = wp_parse_url( $ambrygen_website_url, PHP_URL_PATH );

	if ( is_string( $ambrygen_website_host ) ) {
		$ambrygen_website_label = $ambrygen_website_host;

		if ( is_string( $ambrygen_website_path ) && '' !== $ambrygen_website_path && '/' !== $ambrygen_website_path ) {
			$ambrygen_website_label .= $ambrygen_website_path;
		}
	}
}

$ambrygen_related_post_types = array(
	array(
		'post_type' => 'publication',
		'label'     => __( 'View our Peer-Reviewed Publications', 'ambrygen-web' ),
	),
	array(
		'post_type' => 'poster',
		'label'     => __( 'View our Scientific Posters', 'ambrygen-web' ),
	),
	array(
		'post_type' => 'presentation',
		'label'     => __( 'View our Scientific Presentations', 'ambrygen-web' ),
	),
	array(
		'post_type' => 'webinar',
		'label'     => __( 'Webinars', 'ambrygen-web' ),
	),
);

$ambrygen_related_links = array();

foreach ( $ambrygen_related_post_types as $ambrygen_related_post_type ) {
	$ambrygen_posts = get_posts(
		array(
			'post_type'              => $ambrygen_related_post_type['post_type'],
			'post_status'            => 'publish',
			'posts_per_page'         => -1,
			'orderby'                => 'title',
			'order'                  => 'ASC',
			'fields'                 => 'ids',
			'update_post_meta_cache' => false,
			'update_post_term_cache' => false,
			'tax_query'              => array(
				array(
					'taxonomy' => 'collaborator',
					'field'    => 'term_id',
					'terms'    => array( $ambrygen_term->term_id ),
				),
			),
		)
	);

	if ( empty( $ambrygen_posts ) ) {
		continue;
	}

	$ambrygen_archive_url = get_post_type_archive_link( $ambrygen_related_post_type['post_type'] );
	if ( ! $ambrygen_archive_url ) {
		continue;
	}

	$ambrygen_filtered_archive_url = add_query_arg(
		array(
			's'            => '',
			'collaborator' => $ambrygen_term->slug,
		),
		$ambrygen_archive_url
	);

	$ambrygen_link_label = ! empty( $ambrygen_related_post_type['label'] )
		? $ambrygen_related_post_type['label']
		: get_post_type_object( $ambrygen_related_post_type['post_type'] )->labels->name;

	$ambrygen_related_links[] = array(
		'url'   => $ambrygen_filtered_archive_url,
		'label' => $ambrygen_link_label,
	);
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes(
	array(
		'class' => 'timeline-block__item collaborator-card js-gsap-fade',
	)
);
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="timeline-block__badge-col collaborator-card__badge-col">
		<div class="timeline-block__badge"></div>
	</div>

	<div class="timeline-block__content-card collaborator-card__layout">
		<div class="timeline-block__image collaborator-card__media">
			<?php
			echo wp_kses_post(
				Helper::image_with_placeholder(
					$ambrygen_image_id,
					'medium',
					array(
						'class' => 'collaborator-card__image',
						'alt'   => $ambrygen_name,
					)
				)
			);
			?>
		</div>

		<div class="timeline-block__text-content collaborator-card__content">
			<h3 class="subtitle1-sbold mb-0 timeline-block__text-title collaborator-card__title">
				<?php echo esc_html( $ambrygen_name ); ?>
			</h3>

			<?php if ( ! empty( $ambrygen_description ) ) : ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
				<div class="text-md-regular collaborator-card__description">
					<?php echo wp_kses_post( $ambrygen_description ); ?>
				</div>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_related_links ) ) : ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
				<ul class="collaborator-card__links">
					<?php foreach ( $ambrygen_related_links as $ambrygen_related_link ) : ?>
						<li>
							<a href="<?php echo esc_url( $ambrygen_related_link['url'] ); ?>">
								<?php echo esc_html( $ambrygen_related_link['label'] ); ?>
							</a>
						</li>
					<?php endforeach; ?>
				</ul>
			<?php endif; ?>

			<?php if ( ! empty( $ambrygen_website_url ) ) : ?>
				<div class="is-style-gl-s12" aria-hidden="true"></div>
				<div class="collaborator-card__website">
					<a href="<?php echo esc_url( $ambrygen_website_url ); ?>" target="_blank" rel="noopener noreferrer" class="site-btn has-right-arrow btn-small">
						Learn more
					</a>
				</div>
			<?php endif; ?>
		</div>
	</div>
</div>
