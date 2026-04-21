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

$ambrygen_block_id      = $ambrygen_attributes['blockId'] ?? '';
$ambrygen_title         = $ambrygen_attributes['title'] ?? 'Featured Articles';
$ambrygen_heading_level = $ambrygen_attributes['headingLevel'] ?? 'h2';
$ambrygen_selected_posts = is_array( $ambrygen_attributes['selectedPosts'] ?? null ) ? $ambrygen_attributes['selectedPosts'] : array();

$ambrygen_wrapper_args = array(
	'class' => 'featured-blogs',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );

$ambrygen_heading_level = in_array( $ambrygen_heading_level, array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ), true ) ? $ambrygen_heading_level : 'h2';
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<!-- wp:group {"tagName":"section","className":"container-1340 conference-in-progress-wrapper","layout":{"type":"default"}} -->
	<section class="wp-block-group container-1340 conference-in-progress-wrapper">
		<!-- wp:group {"className":"wrapper","layout":{"type":"default"}} -->
		<div class="wp-block-group wrapper">
			<!-- wp:group {"className":"conferences-in-progress","layout":{"type":"default"}} -->
			<div class="wp-block-group conferences-in-progress">
				<!-- wp:spacer {"height":"50px","className":"is-style-gl-s50"} -->
				<div aria-hidden="true" class="wp-block-spacer is-style-gl-s50"></div>
				<!-- /wp:spacer -->
				
				<?php if ( '' !== trim( wp_strip_all_tags( $ambrygen_title ) ) ) : ?>
					<!-- wp:heading {"level":2,"className":"conferences-in-progress__heading heading-3 mb-0"} -->
					<<?php echo esc_html( $ambrygen_heading_level ); ?> class="wp-block-heading conferences-in-progress__heading heading-3 mb-0">
						<?php echo wp_kses_post( $ambrygen_title ); ?>
					</<?php echo esc_html( $ambrygen_heading_level ); ?>>
					<!-- /wp:heading -->
				<?php endif; ?>

				<!-- wp:spacer {"height":"50px","className":"is-style-gl-s50"} -->
				<div aria-hidden="true" class="wp-block-spacer is-style-gl-s50"></div>
				<!-- /wp:spacer -->

				<?php if ( ! empty( $ambrygen_selected_posts ) ) : ?>
					<!-- wp:group {"className":"conferences-in-progress__slider-wrap","layout":{"type":"default"}} -->
					<div class="wp-block-group conferences-in-progress__slider-wrap">
						<!-- wp:query {"className":"swiper cip-swiper"} -->
						<div class="wp-block-query swiper cip-swiper">
							<!-- wp:post-template {"className":"wp-block-post-template"} -->
							<div class="wp-block-post-template">
								<?php 
								$ambrygen_posts_query = new WP_Query( array(
									'post_type'      => 'post',
									'post_status'    => 'publish',
									'post__in'       => $ambrygen_selected_posts,
									'orderby'        => 'post__in',
									'posts_per_page' => -1,
								) );

								if ( $ambrygen_posts_query->have_posts() ) :
									while ( $ambrygen_posts_query->have_posts() ) :
										$ambrygen_posts_query->the_post();
										$ambrygen_post_id = get_the_ID();
										$ambrygen_permalink = get_permalink( $ambrygen_post_id );
										$ambrygen_post_thumbnail_id = get_post_thumbnail_id( $ambrygen_post_id );
										$ambrygen_publish_date = get_the_date( 'F j, Y', $ambrygen_post_id );
										$ambrygen_excerpt = get_the_excerpt( $ambrygen_post_id );
										
										$ambrygen_linked_author_ids = get_post_meta( $ambrygen_post_id, 'linked_author', true );
										if ( empty( $ambrygen_linked_author_ids ) ) {
											$ambrygen_linked_author_ids = [];
										} elseif ( ! is_array( $ambrygen_linked_author_ids ) ) {
											$ambrygen_linked_author_ids = [ $ambrygen_linked_author_ids ];
										}

										$ambrygen_authors_data = [];
										foreach ( $ambrygen_linked_author_ids as $author_id ) {
											if ( 'author' === get_post_type( $author_id ) && 'publish' === get_post_status( $author_id ) ) {
												$ambrygen_authors_data[] = [
													'name' => get_the_title( $author_id ),
													'featured_image_id' => get_post_thumbnail_id( $author_id ),
													'designation' => get_post_meta( $author_id, 'designation', true ),
												];
											}
										}
								?>
									<!-- wp:post -->
									<div class="wp-block-post">
										<!-- wp:group {"className":"cip-card","layout":{"type":"default"}} -->
										<div class="wp-block-group cip-card">
											<!-- wp:group {"className":"cip-card__image-wrap","layout":{"type":"default"}} -->
											<div class="wp-block-group cip-card__image-wrap" aria-hidden="true">
												<?php if ( $ambrygen_permalink ) : ?>
													<a href="<?php echo esc_url( $ambrygen_permalink ); ?>" class="cip-card__image-link">
												<?php endif; ?>
													<?php echo Helper::image_with_placeholder( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
														$ambrygen_post_thumbnail_id,
														'cip-card-thumb',
														array(
															'class' => 'cip-card__image',
														)
													); ?>
												<?php if ( $ambrygen_permalink ) : ?>
													</a>
												<?php endif; ?>
											</div>
											<!-- /wp:group -->

											<!-- wp:group {"className":"cip-card__info","layout":{"type":"default"}} -->
											<div class="wp-block-group cip-card__info">
												<?php 
												$tags_html = '';
												$ambrygen_terms = get_the_terms( $ambrygen_post_id, 'post_tag' );
												if ( ! is_wp_error( $ambrygen_terms ) && ! empty( $ambrygen_terms ) ) {
													foreach ( $ambrygen_terms as $term ) {
														$tags_html .= sprintf(
															'<a %1$s class="cip-card__tag cip-card__tag--success"><div class="cip-card__tag-dot"></div> %2$s</a>',
															'href="' . esc_url( get_term_link( $term ) ) . '"',
															esc_html( $term->name )
														);
													}
												}
												?>
												<?php if ( '' !== $tags_html ) : ?>
													<div class="cip-card__tags" aria-hidden="true">
														<?php echo wp_kses_post( $tags_html ); ?>
													</div>
												<?php endif; ?>

												<!-- wp:group {"className":"cip-card__title-block","layout":{"type":"default"}} -->
												<div class="wp-block-group cip-card__title-block">
													<?php if ( get_the_title() ) : ?>
														<!-- wp:post-title {"isLink":true,"className":"cip-card__title heading-4 mb-0"} /-->
														<h3 class="cip-card__title heading-4 mb-0">
															<?php if ( $ambrygen_permalink ) : ?>
																<a href="<?php echo esc_url( $ambrygen_permalink ); ?>">
															<?php endif; ?>
																<?php echo esc_html( get_the_title() ); ?>
															<?php if ( $ambrygen_permalink ) : ?>
																</a>
															<?php endif; ?>
														</h3>
													<?php endif; ?>
												</div>
												<!-- /wp:group -->

												<!-- Author Info -->
												<?php if ( ! empty( $ambrygen_authors_data ) ) : ?>
													<div class="featured-blogs__card-meta">
														<div class="featured-blogs__card-author">
															<div class="featured-blogs__card-author-avatars">
																<?php foreach ( $ambrygen_authors_data as $author ) : ?>
																	<?php if ( ! empty( $author['featured_image_id'] ) ) : ?>
																		<div class="featured-blogs__card-author-avatar">
																			<?php echo Helper::image( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
																				absint( $author['featured_image_id'] ),
																				'thumbnail',
																				array(
																					'class' => 'author-avatar',
																				)
																			); ?>
																		</div>
																	<?php endif; ?>
																<?php endforeach; ?>
															</div>
															<div class="featured-blogs__card-author-info">
																<span class="featured-blogs__card-author-name">
																	<?php 
																	$author_names = array_map( function( $author ) {
																		$name = esc_html( $author['name'] );
																		if ( ! empty( $author['designation'] ) ) {
																			$name .= ', ' . esc_html( $author['designation'] );
																		}
																		return $name;
																	}, $ambrygen_authors_data );
																	echo implode( ' | ', $author_names );
																	?>
																</span>
															</div>
														</div>
													</div>
												<?php endif; ?>

												<div class="cip-card__meta" aria-label="Post details">
													<div class="cip-card__meta-item calendar-check">
														<div class="cip-card__meta-icon"></div>
														<span class="cip-card__meta-text text-lg-reg">
															<?php echo esc_html( $ambrygen_publish_date ); ?>
														</span>
													</div>
												</div>

												<?php if ( $ambrygen_excerpt ) : ?>
													<div class="cip-card__description body1 mb-0">
														<?php echo wp_kses_post( $ambrygen_excerpt ); ?>
													</div>
												<?php endif; ?>

												<?php if ( $ambrygen_permalink ) : ?>
													<div class="cip-card__cta-wrap">
														<a href="<?php echo esc_url( $ambrygen_permalink ); ?>" class="cip-card__cta site-btn is-style-site-trailing-icon">
															<?php esc_html_e( 'Read Article', 'ambrygen-web' ); ?>
														</a>
													</div>
												<?php endif; ?>
											</div>
											<!-- /wp:group -->
										</div>
										<!-- /wp:group -->
									</div>
									<!-- /wp:post -->
								<?php 
									endwhile;
									wp_reset_postdata();
								endif;
								?>
							</div>
							<!-- /wp:post-template -->
							
							<!-- wp:html -->
							<div class="conferences-in-progress__arrows">
								<button type="button" class="cip-arrow cip-arrow--prev" aria-label="<?php esc_attr_e( 'Previous blog', 'ambrygen-web' ); ?>"></button>
								<button type="button" class="cip-arrow cip-arrow--next" aria-label="<?php esc_attr_e( 'Next blog', 'ambrygen-web' ); ?>"></button>
							</div>
							<!-- /wp:html -->
						</div>
						<!-- /wp:query -->
					</div>
					<!-- /wp:group -->
				<?php endif; ?>

				<!-- wp:spacer {"height":"50px","className":"is-style-gl-s50"} -->
				<div aria-hidden="true" class="wp-block-spacer is-style-gl-s50"></div>
				<!-- /wp:spacer -->
			</div>
			<!-- /wp:group -->
		</div>
		<!-- /wp:group -->
	</section>
	<!-- /wp:group -->
</div>
