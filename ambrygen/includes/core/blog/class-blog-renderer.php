<?php

namespace Ambrygen\Theme\Core\Blog;

use Ambrygen\Theme\Core\Singleton;
use Ambrygen\Theme\Core\Blocks\BlockVisibilityService;

defined( 'ABSPATH' ) || exit;

/**
 * Blog rendering service.
 */
final class BlogRenderer {

	use Singleton;

	/**
	 * Render blog query block output from a template part for AJAX response.
	 *
	 * @param int    $paged       Current page number.
	 * @param int    $per_page    Posts per page.
	 * @param string $s           Search term.
	 * @param int    $tag         Selected tag ID.
	 * @param int    $category    Selected category ID.
	 * @param int    $total_pages Total number of pages.
	 * @param int    $total_posts Total number of matching posts.
	 * @return string
	 */
	public function render_ajax_content( int $paged, int $per_page = 8, string $s = '', int $tag = 0, int $category = 0, int $total_pages = 1, int $total_posts = 0 ): string {
		$template_path = locate_template( 'parts/blog-posts-grid.html' );
		if ( ! $template_path || ! file_exists( $template_path ) ) {
			return '';
		}

		$contents = file_get_contents( $template_path );
		if ( false === $contents || '' === $contents ) {
			return '';
		}

		$blocks      = parse_blocks( $contents );
		$query_block = $this->find_first_query_block( $blocks );
		if ( ! $query_block ) {
			return '';
		}

		if ( ! isset( $query_block['attrs']['query'] ) ) {
			$query_block['attrs']['query'] = array();
		}

		$query_block['attrs']['query']['perPage'] = $per_page;
		$query_block['attrs']['query']['offset']  = 0;

		if ( ! empty( $s ) ) {
			$query_block['attrs']['query']['search'] = $s;
		}

		if ( $tag > 0 ) {
			$query_block['attrs']['query']['taxQuery'] = array(
				'post_tag' => array( $tag ),
			);
		}

		if ( $category > 0 ) {
			// If category is set, it might need to merge with taxQuery or use categoryIds
			$query_block['attrs']['query']['categoryIds'] = array( $category );
		}

		$query_id = isset( $query_block['attrs']['queryId'] ) ? absint( $query_block['attrs']['queryId'] ) : 0;
		if ( $query_id > 0 ) {
			$_GET[ 'query-' . $query_id . '-page' ] = (string) $paged;
		}

		if ( $total_posts === 0 ) {
			return '<div class="no-results-message text-center no-result-alert">No blog posts found.</div>';
		}

		$html = render_block( $query_block );

		if ( $query_id > 0 ) {
			$_GET[ 'query-' . $query_id . '-page' ] = null; // Clean up
		}

		return (string) BlockVisibilityService::instance()->replace_blog_pagination_with_dynamic( $html, $paged, $total_pages, $per_page );
	}

	/**
	 * Render the specific card HTML for Latest Blogs block.
	 * This ensures AJAX response matches initial render.
	 *
	 * @param \WP_Query $query Query instance to render.
	 * @return string
	 */
	public function render_latest_blog_content( \WP_Query $query ): string {
		if ( ! $query->have_posts() ) {
			return '<div class="no-results-message text-center no-result-alert">No blog posts found.</div>';
		}

		ob_start();
		?>
		<div class="blog-listing">
			<?php
			while ( $query->have_posts() ) :
				$query->the_post();
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

						echo \Ambrygen\Theme\Core\Helper::image_with_placeholder(
							$img_id,
							'large',
							array( 'class' => 'blog-listing__image' )
						);
						?>
						<div class="blog-listing__date flag-details">
							<span><?php echo esc_html( $publish_date ); ?></span>
						</div>
					</div>
					<div class="blog-listing__content">
						<div class="is-style-gl-s16" aria-hidden="true"></div>
						<div class="is-style-gl-s8" aria-hidden="true"></div>
						<h3 class="text-lg-semibold blog-listing__title mb-0">
							<?php the_title(); ?>
						</h3>
						<div class="is-style-gl-s20" aria-hidden="true"></div>
						<?php
						$authors_data = $this->get_post_authors_data( $post_id );
						if ( ! empty( $authors_data ) ) :
							?>
							<div class="blog-listing__author-block">
								<?php if ( ! empty( $authors_data[0]['avatar_id'] ) ) : ?>
									<?php
									echo \Ambrygen\Theme\Core\Helper::image(
										$authors_data[0]['avatar_id'],
										'thumbnail',
										array(
											'class'  => 'blog-listing__author-avatar',
											'width'  => 36,
											'height' => 36,
										)
									);
									?>
								<?php else : ?>
									<img class="blog-listing__author-avatar" src="https://i.pravatar.cc/40?img=47" alt="" width="36" height="36" />
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

						<div class="is-style-gl-s8" aria-hidden="true"></div>
						<div class="blog-listing__body">
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
			<?php endwhile; ?>
		</div>

		<div class="is-style-gl-s50" aria-hidden="true"></div>
		<div class="load-more-btn <?php echo ( $query->found_posts <= 6 || $query->max_num_pages <= 1 ) ? 'is-hidden' : ''; ?>"
			 style="<?php echo ( $query->found_posts <= 6 || $query->max_num_pages <= 1 ) ? 'display: none;' : ''; ?>">
			<button type="button" class="site-btn is-style-site-text-btn has-right-arrow"
				data-total-pages="<?php echo esc_attr( $query->max_num_pages ); ?>">
				<?php esc_html_e( 'Load More', 'ambrygen-web' ); ?>
			</button>
		</div>
		<?php
		wp_reset_postdata();
		return ob_get_clean();
	}

	/**
	 * Get author data for a post.
	 *
	 * @param int $post_id Post ID.
	 * @return array
	 */
	public function get_post_authors_data( int $post_id ): array {
		$authors_data     = array();
		$repeater_authors = get_post_meta( $post_id, 'webinar_authors', true );

		if ( is_array( $repeater_authors ) && ! empty( $repeater_authors ) ) {
			foreach ( $repeater_authors as $row ) {
				$author_id   = isset( $row['linked_author'] ) ? (int) $row['linked_author'] : 0;
				$author_post = $author_id > 0 ? get_post( $author_id ) : null;
				if ( $author_post && 'author' === $author_post->post_type ) {
					$avatar_id   = ! empty( $row['image_id'] ) ? (int) $row['image_id'] : get_post_thumbnail_id( $author_id );
					$designation = ! empty( $row['designation'] ) ? $row['designation'] : get_post_meta( $author_id, 'user_designation', true );
					$bio         = isset( $row['bio'] ) ? wp_kses_post( (string) $row['bio'] ) : '';

					$authors_data[] = array(
						'author_id'   => $author_id,
						'name'        => get_the_title( $author_id ),
						'avatar_id'   => $avatar_id,
						'designation' => $designation,
						'bio'         => '' !== trim( wp_strip_all_tags( $bio ) ) ? $bio : apply_filters( 'the_content', $author_post->post_content ),
					);
				}
			}
		}

		// Fallback to legacy linked_author if repeater is empty
		if ( empty( $authors_data ) ) {
			$linked_author_ids = get_post_meta( $post_id, 'linked_author', true );
			if ( ! empty( $linked_author_ids ) ) {
				if ( ! is_array( $linked_author_ids ) ) {
					$linked_author_ids = array( $linked_author_ids );
				}

				foreach ( $linked_author_ids as $author_id ) {
					$author_id   = (int) $author_id;
					$author_post = $author_id > 0 ? get_post( $author_id ) : null;
					if ( $author_post && 'author' === $author_post->post_type ) {
						$authors_data[] = array(
							'author_id'   => $author_id,
							'name'        => get_the_title( $author_id ),
							'avatar_id'   => get_post_thumbnail_id( $author_id ),
							'designation' => get_post_meta( $author_id, 'user_designation', true ),
							'bio'         => apply_filters( 'the_content', $author_post->post_content ),
						);
					}
				}
			}
		}

		return $authors_data;
	}

	/**
	 * Recursively find the first core/query block in a list of blocks.
	 *
	 * @param array $blocks Parsed block list.
	 * @return array|null
	 */
	private function find_first_query_block( array $blocks ): ?array {
		foreach ( $blocks as $block ) {
			if ( ! is_array( $block ) ) {
				continue;
			}

			if ( 'core/query' === ( $block['blockName'] ?? '' ) ) {
				return $block;
			}

			if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
				$found = $this->find_first_query_block( $block['innerBlocks'] );
				if ( $found ) {
					return $found;
				}
			}
		}

		return null;
	}
}
