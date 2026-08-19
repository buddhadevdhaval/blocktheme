<?php
/**
 * Render: Latest Blogs Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

use Ambrygen\Theme\Core\Helper;
use Ambrygen\Theme\Core\Blog\BlogRenderer;

defined( 'ABSPATH' ) || exit;

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();

$ambrygen_block_id       = $ambrygen_attributes['blockId'] ?? '';
$ambrygen_title          = $ambrygen_attributes['title'] ?? 'Latest Articles';
$ambrygen_heading_level  = $ambrygen_attributes['headingLevel'] ?? 'h2';
$ambrygen_posts_per_page = $ambrygen_attributes['postsPerPage'] ?? 6;

$ambrygen_wrapper_args = array(
	'class' => 'latest-blogs',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

// Detect archive context
$ambrygen_is_tag_archive                      = is_tag();
$ambrygen_wrapper_args['data-is-tag-archive'] = $ambrygen_is_tag_archive ? 'true' : 'false';

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );

// Get Tags with posts
$blog_tags = get_tags( array( 'hide_empty' => true ) );

// Get Categories dynamically
$blog_categories = get_terms(
	array(
		'taxonomy'   => 'category',
		'hide_empty' => true,
		'exclude'    => get_term_by( 'slug', 'uncategorized', 'category' )->term_id ?? 0,
	)
);

$initial_cat_id = ! empty( $blog_categories ) ? $blog_categories[0]->term_id : 0;
// Prioritize 'Ambry' or 'Ambry News' if they exist as the default
foreach ( $blog_categories as $cat ) {
	if ( 'Ambry' === $cat->name ) {
		$initial_cat_id = $cat->term_id;
		break;
	}
}
if ( $initial_cat_id === ( ! empty( $blog_categories ) ? $blog_categories[0]->term_id : 0 ) ) {
	foreach ( $blog_categories as $cat ) {
		if ( 'Ambry News' === $cat->name ) {
			$initial_cat_id = $cat->term_id;
			break;
		}
	}
}

$ambrygen_current_tag_id = 0;

if ( $ambrygen_is_tag_archive ) {
	$ambrygen_current_tag_id = get_queried_object_id();
	$tag_name                = get_queried_object()->name;
	$ambrygen_title          = sprintf( __( 'Articles Tagged: %s', 'ambrygen-web' ), $tag_name );
}

// Initial Query (Ambry News by default, or current tag if archive)
$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;

$query_args = array(
	'post_type'      => 'post',
	'posts_per_page' => $ambrygen_posts_per_page,
	'post_status'    => 'publish',
	'paged'          => $paged,
	'cat'            => $initial_cat_id,
);

if ( $ambrygen_is_tag_archive ) {
	$query_args['tag_id'] = $ambrygen_current_tag_id;
}

$blogs_query = new WP_Query( $query_args );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<!-- SECTION 2 — Filter Bar (Tags Dropdown + Tabs) -->


			<div class="blog-listing-header">
				<<?php echo esc_html( $ambrygen_heading_level ); ?> class="heading-4 block-title mb-0">
					<?php echo wp_kses_post( $ambrygen_title ); ?>
				</<?php echo esc_html( $ambrygen_heading_level ); ?>>

				<div class="is-style-gl-s32" aria-hidden="true"></div>

				<div class="blog-filters">
					<!-- Left: Tags Dropdown -->
					<div class="blog-filters__dropdown">
						<label class="blog-filters__label text-small-semibold" for="blog-tags-select"><?php esc_html_e( 'Filter by Tag', 'ambrygen-web' ); ?></label>
						<div class="is-style-gl-s8" aria-hidden="true"></div>
						<select id="blog-tags-select" class="blog-filters__select text-md-medium" aria-label="<?php esc_attr_e( 'Filter blog posts by tag', 'ambrygen-web' ); ?>">
							<option value="0" data-url="<?php echo esc_url( get_post_type_archive_link( 'post' ) ); ?>"><?php esc_html_e( 'All Tags', 'ambrygen-web' ); ?></option>
							<?php
							foreach ( $blog_tags as $tag ) :
								$is_selected = ( (int) $tag->term_id === (int) $ambrygen_current_tag_id );
								$tag_link    = get_term_link( $tag );
								?>
								<option value="<?php echo esc_attr( $tag->term_id ); ?>" data-url="<?php echo esc_url( $tag_link ); ?>" <?php selected( $is_selected ); ?>><?php echo esc_html( $tag->name ); ?></option>
							<?php endforeach; ?>
						</select>
					</div>

					<!-- Right: Tabs -->
					<div class="blog-filters__tabs-wrap">
						<div class="horizontal-tabs tabs__nav" role="tablist">
							<?php
							$current_active_cat = $initial_cat_id;
							foreach ( $blog_categories as $cat ) :
								$is_active = ( (int) $cat->term_id === (int) $current_active_cat );
								?>
								<button type="button"
									class="tabs__tab text-md-Semibold tab-button <?php echo $is_active ? 'is-active active' : ''; ?>"
									data-category-id="<?php echo esc_attr( $cat->term_id ); ?>"
									role="tab"
									aria-selected="<?php echo $is_active ? 'true' : 'false'; ?>">
									<?php echo esc_html( $cat->name ); ?>
								</button>
							<?php endforeach; ?>
						</div>
					</div>

					<!-- Right: Search -->
					<div class="blog-filters__search search-bar-block">
						<form id="blog-search-form" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
							<input type="text" name="s" aria-label="<?php esc_attr_e( 'Search blog posts', 'ambrygen-web' ); ?>" placeholder="<?php esc_attr_e( 'Search', 'ambrygen-web' ); ?>">
							<button class="button" type="submit"><?php esc_html_e( 'Search', 'ambrygen-web' ); ?></button>
						</form>
					</div>
				</div>
			</div>



	<div class="is-style-gl-s40" aria-hidden="true"></div>

	<!-- SECTION 3 — Blog Listing Grid -->


			<div id="latest-blog-results" class="ambrygen-ajax-pagination"
				data-ambrygen-scope="latest-blog"
				data-ambrygen-post-type="post"
				data-ambrygen-per-page="<?php echo esc_attr( $ambrygen_posts_per_page ); ?>"
				data-ambrygen-current="1"
				data-ambrygen-total-pages="<?php echo esc_attr( $blogs_query->max_num_pages ); ?>"
				data-ambrygen-category="<?php echo esc_attr( $initial_cat_id ); ?>"
				data-ambrygen-tag="<?php echo esc_attr( $ambrygen_current_tag_id ); ?>"
				data-ambrygen-order="DESC">

				<div class="ambrygen-ajax-pagination__content">
					<?php if ( $blogs_query->have_posts() ) : ?>
						<div class="blog-listing">
							<?php
							while ( $blogs_query->have_posts() ) :
								$blogs_query->the_post();
								?>
								<?php
								$post_id      = get_the_ID();
								$thumbnail_id = get_post_thumbnail_id( $post_id );
								$publish_date = get_the_date( 'F j, Y', $post_id );
								?>
								<a href="<?php the_permalink(); ?>" class="blog-listing__card">
									<div class="blog-listing__image-wrap">
										<?php
										$img_id = $thumbnail_id;
										if ( ! $img_id ) {
											$img_id = \Ambrygen\Theme\Core\Theme_Options::get_blog_default_image_id();
										}

										echo Helper::image_with_placeholder(
											(int) $img_id,
											'large',
											array( 'class' => 'blog-listing__image' )
										);
										?>
										<div class="blog-listing__date flag-details">
											<span><?php echo esc_html( $publish_date ); ?></span>
										</div>
									</div>
									<div class="blog-listing__content">
										<h3 class="text-lg-semibold blog-listing__title mb-0">
											<?php the_title(); ?>
										</h3>
										<div class="is-style-gl-s12" aria-hidden="true"></div>

										<?php
										$authors_data = BlogRenderer::instance()->get_post_authors_data( $post_id );
										if ( ! empty( $authors_data ) ) :
											?>
											<div class="blog-listing__author-block">
												<?php if ( ! empty( $authors_data[0]['avatar_id'] ) ) : ?>
													<?php
													echo Helper::image(
														$authors_data[0]['avatar_id'],
														'thumbnail',
														array(
															'class'  => 'blog-listing__author-avatar',
															'width'  => 36,
															'height' => 36,
														)
													);
													?>
												<?php endif; ?>
												<div class="blog-listing__author-info">
													<span class="blog-listing__author-name text-small-semibold">
														<?php
														$author_names = array_map(
															function( $author ) {
																$out = esc_html( $author['name'] );
																if ( ! empty( $author['designation'] ) ) {
																	  $out .= ', ' . esc_html( $author['designation'] );
																}
																return $out;
															},
															$authors_data
														);
														echo implode( ' | ', $author_names );
														?>
													</span>
												</div>
											</div>
										<?php endif; ?>

										<div class="is-style-gl-s12" aria-hidden="true"></div>
										<div class="blog-listing__body" data-sync-height="category">
											<div class="body-s blog-listing__description">
												<?php echo wp_kses_post( wp_trim_words( get_the_excerpt(), 25 ) ); ?>
											</div>
											<?php
											$terms = get_the_terms( $post_id, 'post_tag' );
											if ( ! empty( $terms ) && ! is_wp_error( $terms ) ) :
												?>
												<div class="body-s blog-listing__category">
													<?php foreach ( $terms as $term ) : ?>
														<div class="blog-listing__category__item"><?php echo esc_html( $term->name ); ?></div>
													<?php endforeach; ?>
												</div>
											<?php endif; ?>
										</div>
									</div>
								</a>
								<?php
							endwhile;
							wp_reset_postdata();
							?>
						</div>

						<div class="is-style-gl-s50" aria-hidden="true"></div>

						<div class="load-more-btn <?php echo ( $blogs_query->found_posts <= 6 || $blogs_query->max_num_pages <= 1 ) ? 'is-hidden' : ''; ?>"
							style="<?php echo ( $blogs_query->found_posts <= 6 || $blogs_query->max_num_pages <= 1 ) ? 'display: none;' : ''; ?>"
							data-found-posts="<?php echo esc_attr( $blogs_query->found_posts ); ?>">
							<button type="button" class="site-btn is-style-site-text-btn has-right-arrow"
								data-total-pages="<?php echo esc_attr( $blogs_query->max_num_pages ); ?>">
								<?php esc_html_e( 'Load More', 'ambrygen-web' ); ?>
							</button>
						</div>
					<?php else : ?>
						<div class="no-results-message text-center no-result-alert"><?php esc_html_e( 'No blog posts found.', 'ambrygen-web' ); ?></div>
					<?php endif; ?>
				</div>
			</div>


	<div class="is-style-gl-s50" aria-hidden="true"></div>
</div>
