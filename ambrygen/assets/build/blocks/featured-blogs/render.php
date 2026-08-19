<?php
/**
 * Render: Featured Blogs Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;

defined( 'ABSPATH' ) || exit;

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();

$ambrygen_block_id       = $ambrygen_attributes['blockId'] ?? '';
$ambrygen_title          = $ambrygen_attributes['title'] ?? 'Featured Articles';
$ambrygen_heading_level  = $ambrygen_attributes['headingLevel'] ?? 'h2';
$ambrygen_selected_posts = is_array( $ambrygen_attributes['selectedPosts'] ?? null ) ? $ambrygen_attributes['selectedPosts'] : array();

$ambrygen_wrapper_args = array(
	'class' => 'featured-blogs-block',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );

$ambrygen_heading_level = in_array( $ambrygen_heading_level, array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ), true ) ? $ambrygen_heading_level : 'h2';
?>

<?php if ( ! empty( $ambrygen_selected_posts ) ) : ?>
<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="is-style-gl-s50" aria-hidden="true"></div>

	<section class="container-1280">
		<div class="is-style-gl-s50" aria-hidden="true"></div>
		<div class="wrapper">
			<div class="blog-listing-header">
				<<?php echo esc_html( $ambrygen_heading_level ); ?> class="heading-4 block-title mb-0 text-center">
					<?php echo wp_kses_post( $ambrygen_title ); ?>
				</<?php echo esc_html( $ambrygen_heading_level ); ?>>
			</div>

			<div class="is-style-gl-s32" aria-hidden="true"></div>

			<div class="blog-featured-swiper-wrap">
				<div class="swiper blog-featured-swiper" aria-label="<?php echo esc_attr( $ambrygen_title ); ?>">
					<div class="swiper-wrapper">
						<?php
						$ambrygen_posts_query = new WP_Query(
							array(
								'post_type'      => 'post',
								'post_status'    => 'publish',
								'post__in'       => $ambrygen_selected_posts,
								'orderby'        => 'post__in',
								'posts_per_page' => -1,
							)
						);

						if ( $ambrygen_posts_query->have_posts() ) :
							while ( $ambrygen_posts_query->have_posts() ) :
								$ambrygen_posts_query->the_post();
								$ambrygen_post_id           = get_the_ID();
								$ambrygen_permalink         = get_permalink( $ambrygen_post_id );
								$ambrygen_post_thumbnail_id = get_post_thumbnail_id( $ambrygen_post_id );
								$ambrygen_publish_date      = get_the_date( 'F j, Y', $ambrygen_post_id );
								$ambrygen_excerpt           = get_the_excerpt( $ambrygen_post_id );

								$ambrygen_authors_repeater = get_post_meta( $ambrygen_post_id, 'webinar_authors', true );
								$ambrygen_authors_data     = array();

								if ( is_array( $ambrygen_authors_repeater ) && ! empty( $ambrygen_authors_repeater ) ) {
									foreach ( $ambrygen_authors_repeater as $row ) {
										$author_id            = isset( $row['linked_author'] ) ? absint( $row['linked_author'] ) : 0;
										$override_image_id    = isset( $row['image_id'] ) ? absint( $row['image_id'] ) : 0;
										$override_designation = isset( $row['designation'] ) ? $row['designation'] : '';

										$author_name         = '';
										$default_image_id    = 0;
										$default_designation = '';

										if ( $author_id > 0 ) {
											$author_post = get_post( $author_id );
											if ( $author_post && 'author' === $author_post->post_type && 'publish' === $author_post->post_status ) {
												$author_name         = get_the_title( $author_id );
												$default_image_id    = get_post_thumbnail_id( $author_id );
												$default_designation = get_post_meta( $author_id, 'user_designation', true );
											}
										}

										// Only add if we have a name (either from linked author or potentially future manual name)
										if ( $author_name ) {
											$ambrygen_authors_data[] = array(
												'name' => $author_name,
												'featured_image_id' => $override_image_id > 0 ? $override_image_id : $default_image_id,
												'designation' => ! empty( $override_designation ) ? $override_designation : $default_designation,
											);
										}
									}
								} else {
									// Fallback to old flat linked_author meta if repeater is empty
									$ambrygen_linked_author_ids = get_post_meta( $ambrygen_post_id, 'linked_author', true );
									if ( ! empty( $ambrygen_linked_author_ids ) ) {
										if ( ! is_array( $ambrygen_linked_author_ids ) ) {
											$ambrygen_linked_author_ids = array( $ambrygen_linked_author_ids );
										}
										foreach ( $ambrygen_linked_author_ids as $author_id ) {
											if ( 'author' === get_post_type( $author_id ) && 'publish' === get_post_status( $author_id ) ) {
												$ambrygen_authors_data[] = array(
													'name' => get_the_title( $author_id ),
													'featured_image_id' => get_post_thumbnail_id( $author_id ),
													'designation' => get_post_meta( $author_id, 'user_designation', true ),
												);
											}
										}
									}
								}

								$ambrygen_terms = get_the_terms( $ambrygen_post_id, 'post_tag' );
								?>
							<div class="swiper-slide">
								<a href="<?php echo esc_url( $ambrygen_permalink ); ?>" class="blog-featured">

									<!-- Left: Featured Image -->
									<div class="blog-featured__image-col">
										<div class="blog-featured__image-link" aria-label="<?php echo esc_attr( sprintf( __( 'Read: %s', 'ambrygen-web' ), get_the_title() ) ); ?>">
											<?php
											echo Helper::image_with_placeholder(
												$ambrygen_post_thumbnail_id,
												'large',
												array(
													'class' => 'blog-featured__image',
													'loading' => 'eager',
												)
											);
											?>
										</div>
									</div>

									<!-- Right: Content -->
									<div class="blog-featured__content-col">
										<?php if ( ! is_wp_error( $ambrygen_terms ) && ! empty( $ambrygen_terms ) ) : ?>
											<div class="blog-featured__category">
												<?php foreach ( $ambrygen_terms as $term ) : ?>
													<div class="blog-featured__category__item"><?php echo esc_html( $term->name ); ?></div>
												<?php endforeach; ?>
											</div>
										<?php endif; ?>

										<div class="is-style-gl-s16" aria-hidden="true"></div>

										<<?php echo esc_html( $ambrygen_heading_level ); ?> class="heading-4 block-title mb-0">
											<?php echo esc_html( get_the_title() ); ?>
										</<?php echo esc_html( $ambrygen_heading_level ); ?>>

										<div class="is-style-gl-s16" aria-hidden="true"></div>

										<div class="post-info">
											<?php if ( ! empty( $ambrygen_authors_data ) ) : ?>
												<div class="blog-featured__author-block">
													<?php if ( ! empty( $ambrygen_authors_data[0]['featured_image_id'] ) ) : ?>
														<?php
														echo Helper::image(
															absint( $ambrygen_authors_data[0]['featured_image_id'] ),
															'thumbnail',
															array(
																'class' => 'blog-featured__author-avatar',
																'width' => 40,
																'height' => 40,
															)
														);
														?>
													<?php else : ?>
														 <img class="blog-featured__author-avatar" src="https://i.pravatar.cc/48?img=47" alt="" width="40" height="40" />
													<?php endif; ?>
													<div class="blog-featured__author-info">
														<span class="blog-featured__author-name">
															<?php
															$author_names = array_map(
																function( $author ) {
																	$name = esc_html( $author['name'] );
																	if ( ! empty( $author['designation'] ) ) {
																		  $name .= ', ' . esc_html( $author['designation'] );
																	}
																	return $name;
																},
																$ambrygen_authors_data
															);
															echo implode( ' | ', $author_names );
															?>
														</span>
													</div>
												</div>
											<?php endif; ?>
											
											<div class="blog-featured__meta flag-details">
												<div class="blog-featured__date flag-info flag-date-info">
													<span class="blog-featured__meta-list-icon flag-icon"></span>
													<span><?php echo esc_html( $ambrygen_publish_date ); ?></span>
												</div>
											</div>
										</div>

										<div class="is-style-gl-s16" aria-hidden="true"></div>

										<?php if ( $ambrygen_excerpt ) : ?>
											<div class="blog-featured__description body1">
												<?php echo wp_kses_post( $ambrygen_excerpt ); ?>
											</div>
										<?php endif; ?>

										<div class="post-btn">
											<div class="site-btn has-right-arrow"><?php esc_html_e( 'Read More', 'ambrygen-web' ); ?></div>
										</div>
									</div>
								</a>
							</div>
								<?php
							endwhile;
							wp_reset_postdata();
						endif;
						?>
					</div>
				</div>

				<!-- Navigation -->
				<div class="swiper-buttons blog-featured__nav" aria-hidden="true">
					<button type="button" class="custom-prev" aria-label="<?php esc_attr_e( 'Previous article', 'ambrygen-web' ); ?>"></button>
					<button type="button" class="custom-next" aria-label="<?php esc_attr_e( 'Next article', 'ambrygen-web' ); ?>"></button>
				</div>
			</div>
		</div>
		<div class="is-style-gl-s50" aria-hidden="true"></div>
	</section>

	<div class="is-style-gl-s50" aria-hidden="true"></div>
</div>
<?php endif; ?>
