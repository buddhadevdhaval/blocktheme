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

defined( 'ABSPATH' ) || exit;

$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();

$ambrygen_block_id      = $ambrygen_attributes['blockId'] ?? '';
$ambrygen_title         = $ambrygen_attributes['title'] ?? 'Latest Articles';
$ambrygen_heading_level = $ambrygen_attributes['headingLevel'] ?? 'h2';
$ambrygen_posts_per_page = $ambrygen_attributes['postsPerPage'] ?? 9;

$ambrygen_wrapper_args = array(
	'class' => 'latest-blogs',
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );

// Get Tags with posts
$blog_tags = get_tags( array( 'hide_empty' => true ) );

// Get Categories dynamically
$blog_categories = get_terms( array(
	'taxonomy'   => 'category',
	'hide_empty' => true,
	'exclude'    => get_term_by( 'slug', 'uncategorized', 'category' )->term_id ?? 0,
) );

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

// Initial Query (Ambry News by default)
$paged = ( get_query_var( 'paged' ) ) ? get_query_var( 'paged' ) : 1;

$query_args = array(
	'post_type'      => 'post',
	'posts_per_page' => $ambrygen_posts_per_page,
	'post_status'    => 'publish',
	'paged'          => $paged,
	'cat'            => $initial_cat_id,
);

$blogs_query = new WP_Query( $query_args );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<div class="is-style-gl-s50" aria-hidden="true"></div>
	<div class="wp-block-group wrapper">
		<div class="event-carousel">
			<<?php echo esc_html( $ambrygen_heading_level ); ?> class="heading-3 block-title mb-0">
				<?php echo wp_kses_post( $ambrygen_title ); ?>
			</<?php echo esc_html( $ambrygen_heading_level ); ?>>

			<div class="is-style-gl-s50" aria-hidden="true"></div>

			<div class="category-filter-search category-filter-search--blog">
				<!-- Left: Tags Dropdown -->
				<div class="category-filter-search__dropdown">
					<div class="filter-label text-small-semibold mb-2"><?php esc_html_e( 'FILTER BY TAG', 'ambrygen-web' ); ?></div>
					<div class="tab-dropdown">
						<button class="dropdown-toggle" id="blog-tag-dropdown-btn" type="button" aria-expanded="false" aria-controls="blog-tag-dropdown-menu">
							<?php esc_html_e( 'All Tags', 'ambrygen-web' ); ?>
						</button>
						<ul id="blog-tag-dropdown-menu" class="dropdown-menu">
							<li><a href="#" data-tag-id="0" aria-current="page"><?php esc_html_e( 'All Tags', 'ambrygen-web' ); ?></a></li>
							<?php foreach ( $blog_tags as $tag ) : ?>
								<li><a href="#" data-tag-id="<?php echo esc_attr( $tag->term_id ); ?>"><?php echo esc_html( $tag->name ); ?></a></li>
							<?php endforeach; ?>
						</ul>
					</div>
				</div>

				<!-- Middle: Categories Tabs -->
				<div class="category-filter-search__tabs">
					<div class="horizontal-tabs tabs__nav" role="tablist" id="latest-blog-tabs">
						<?php foreach ( $blog_categories as $index => $cat ) : ?>
							<button type="button" 
								class="tab-button <?php echo ( $cat->term_id === $initial_cat_id ) ? 'active is-active' : ''; ?> tabs__tab text-md-Semibold" 
								data-category-id="<?php echo esc_attr( $cat->term_id ); ?>" 
								role="tab" 
								aria-selected="<?php echo ( $cat->term_id === $initial_cat_id ) ? 'true' : 'false'; ?>" 
								aria-controls="latest-blog-results">
								<?php echo esc_html( $cat->name ); ?>
							</button>
						<?php endforeach; ?>
					</div>
				</div>

				<!-- Right: Search Dropdown -->
				<div class="category-filter-search__search">
					<form id="blog-search-form" class="category-search-form-past" role="search" method="get" action="<?php echo esc_url( home_url( '/' ) ); ?>">
						<input type="text" name="s" aria-label="<?php esc_attr_e( 'Search blog posts', 'ambrygen-web' ); ?>" placeholder="<?php esc_attr_e( 'Search', 'ambrygen-web' ); ?>">
						<button class="button" type="submit"><?php esc_html_e( 'Search', 'ambrygen-web' ); ?></button>
					</form>
				</div>
			</div>

			<div class="is-style-gl-s50" aria-hidden="true"></div>

			<div id="latest-blog-results" class="ambrygen-ajax-pagination" 
				data-ambrygen-scope="latest-blog" 
				data-ambrygen-post-type="post" 
				data-ambrygen-per-page="<?php echo esc_attr( $ambrygen_posts_per_page ); ?>" 
				data-ambrygen-current="1" 
				data-ambrygen-total-pages="<?php echo esc_attr( $blogs_query->max_num_pages ); ?>"
				data-ambrygen-category="<?php echo esc_attr( $initial_cat_id ); ?>"
				data-ambrygen-order="DESC">
				
				<div class="ambrygen-ajax-pagination__content">
					<?php if ( $blogs_query->have_posts() ) : ?>
						<div class="event-carousel__grid">
							<?php while ( $blogs_query->have_posts() ) : $blogs_query->the_post(); ?>
								<?php 
								$post_id = get_the_ID();
								$thumbnail_id = get_post_thumbnail_id( $post_id );
								$publish_date = get_the_date( 'F j, Y', $post_id );
								?>
								<div class="event-carousel__card">
									<div class="event-carousel__image-wrap">
										<a href="<?php the_permalink(); ?>">
											<?php 
											echo Helper::image_with_placeholder(
												$thumbnail_id,
												'large',
												array( 'class' => 'event-carousel__image' )
											);
											?>
										</a>
										<div class="event-carousel__month-info">
											<span class="event-carousel__month"><?php echo get_the_date( 'F j, Y', $post_id ); ?></span>
										</div>
									</div>
									<div class="event-carousel__body">
										<div class="is-style-gl-s16" aria-hidden="true"></div>
										<div class="event-carousel__static-content">
											<h3 class="event-carousel__card-title text-lg-semibold mb-0">
												<a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
											</h3>
											<div class="is-style-gl-s8" aria-hidden="true"></div>
											<?php 
											$linked_author_ids = get_post_meta( $post_id, 'linked_author', true );
											if ( empty( $linked_author_ids ) ) {
												$linked_author_ids = [];
											} elseif ( ! is_array( $linked_author_ids ) ) {
												$linked_author_ids = [ $linked_author_ids ];
											}

											$authors_data = [];
											foreach ( $linked_author_ids as $author_id ) {
												if ( 'author' === get_post_type( $author_id ) ) {
													$authors_data[] = [
														'name'        => get_the_title( $author_id ),
														'avatar_id'   => get_post_thumbnail_id( $author_id ),
														'designation' => get_post_meta( $author_id, 'designation', true ),
													];
												}
											}
											?>
											<?php if ( ! empty( $authors_data ) ) : ?>
												<div class="event-carousel__author-block">
													<div class="event-carousel__author-avatars">
														<?php foreach ( $authors_data as $author ) : ?>
															<?php if ( $author['avatar_id'] ) : ?>
																<div class="event-carousel__author-avatar">
																	<?php echo Helper::image( $author['avatar_id'], 'thumbnail' ); ?>
																</div>
															<?php endif; ?>
														<?php endforeach; ?>
													</div>
													<div class="event-carousel__author-name text-small-semibold">
														<?php 
														$author_names = array_map( function( $author ) {
															$out = esc_html( $author['name'] );
															if ( ! empty( $author['designation'] ) ) {
																$out .= ', ' . esc_html( $author['designation'] );
															}
															return $out;
														}, $authors_data );
														echo implode( ' | ', $author_names ); 
														?>
													</div>
												</div>
											<?php endif; ?>
										</div>

										<div class="is-style-gl-s16" aria-hidden="true"></div>

										<div class="event-carousel__content-wrap">
											<div class="event-carousel__details">
												<div class="body-s">
													<?php echo wp_kses_post( wp_trim_words( get_the_excerpt(), 15 ) ); ?>
												</div>
											</div>

											<div class="event-carousel__description">
												<?php 
												$tags = get_the_terms( $post_id, 'post_tag' );
												if ( ! empty( $tags ) && ! is_wp_error( $tags ) ) : ?>
													<div class="event-carousel__tags" aria-hidden="true">
														<div class="event-carousel__tags lists-item-category">
															<?php foreach ( $tags as $tag ) : ?>
																<div class="category-item">
																	<a href="<?php echo esc_url( get_term_link( $tag ) ); ?>" class="event-carousel__tag event-carousel__tag--success">
																		<div class="event-carousel__tag-dot"></div> <?php echo esc_html( $tag->name ); ?>
																	</a>
																</div>
															<?php endforeach; ?>
														</div>
													</div>
												<?php endif; ?>
											</div>
										</div>
									</div>
								</div>
							<?php endwhile; wp_reset_postdata(); ?>
						</div>
						
						<div class="load-more-wrap text-center <?php echo ( $blogs_query->max_num_pages <= 1 ) ? 'is-hidden' : ''; ?>">
							<button type="button" class="load-more-btn text-small-semibold" 
								data-total-pages="<?php echo esc_attr( $blogs_query->max_num_pages ); ?>">
								<?php esc_html_e( 'LOAD MORE', 'ambrygen-web' ); ?>
								<span class="load-more-icon"></span>
							</button>
						</div>
					<?php else : ?>
						<p class="no-results-message text-center text-lg-reg"><?php esc_html_e( 'No blog posts found.', 'ambrygen-web' ); ?></p>
					<?php endif; ?>
				</div>
			</div>
		</div>
	</div>
	<div class="is-style-gl-s50" aria-hidden="true"></div>
</div>
