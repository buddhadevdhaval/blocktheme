<?php
/**
 * Genetic Testing Renderer class.
 *
 * @package Ambrygen\Theme\Core\GeneticTesting
 */

namespace Ambrygen\Theme\Core\GeneticTesting;

use Ambrygen\Theme\Core\Helper;
use Ambrygen\Theme\Core\Singleton;

defined( 'ABSPATH' ) || exit;

/**
 * GeneticTestingRenderer class.
 */
final class GeneticTestingRenderer {

	use Singleton;

	/**
	 * Resolve a usable genetic-testing post ID for frontend and editor renders.
	 *
	 * In the Site Editor, block context often points at the `wp_template` post
	 * instead of an actual genetic-testing entry. Falling back to a real sample
	 * post prevents recursive template rendering and editor recovery screens.
	 *
	 * @param int $post_id Candidate post ID from block context.
	 * @return int
	 */
	private function resolve_genetic_testing_post_id( int $post_id ): int {
		if ( $post_id > 0 && 'genetic-testing' === get_post_type( $post_id ) ) {
			return $post_id;
		}

		$queried_post_id = get_queried_object_id();
		if ( $queried_post_id > 0 && 'genetic-testing' === get_post_type( $queried_post_id ) ) {
			return (int) $queried_post_id;
		}

		$is_editor = wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST );
		if ( ! $is_editor ) {
			return 0;
		}

		$sample_posts = get_posts(
			array(
				'post_type'      => 'genetic-testing',
				'posts_per_page' => 1,
				'post_status'    => 'publish',
				'fields'         => 'ids',
			)
		);

		if ( empty( $sample_posts ) ) {
			return 0;
		}

		return (int) $sample_posts[0];
	}

	/**
	 * Check whether the current render is happening in editor preview context.
	 *
	 * @return bool
	 */
	private function is_editor_preview(): bool {
		return wp_is_json_request() || ( defined( 'REST_REQUEST' ) && REST_REQUEST );
	}

	/**
	 * Normalize rich text for duplicate-content comparisons.
	 *
	 * @param string $content Content to normalize.
	 * @return string
	 */
	private function normalize_comparison_text( string $content ): string {
		$content = html_entity_decode( wp_strip_all_tags( $content ), ENT_QUOTES | ENT_HTML5, get_bloginfo( 'charset' ) );
		$content = preg_replace( '/\s+/', ' ', $content );

		return strtolower( trim( (string) $content ) );
	}

	/**
	 * Resolve linked product_version posts for a genetic-testing post.
	 *
	 * @param int $post_id Genetic-testing post ID.
	 * @return int[]
	 */
	private function get_linked_product_version_ids( int $post_id ): array {
		$linked_posts = get_post_meta( $post_id, 'linked_posts_genetic', true );
		if ( empty( $linked_posts ) ) {
			return array();
		}

		if ( ! is_array( $linked_posts ) ) {
			$linked_posts = array( $linked_posts );
		}

		$product_ids = array();

		foreach ( $linked_posts as $id ) {
			$linked_id = absint( $id );

			if ( $linked_id > 0 && get_post_type( $linked_id ) === 'product_version' ) {
				$product_ids[] = $linked_id;
			}
		}

		return array_values( array_unique( $product_ids ) );
	}

	/**
	 * Format a numeric turnaround value without trailing decimals when whole.
	 *
	 * @param float $value Numeric value.
	 * @return string
	 */
	private function format_turnaround_value( float $value ): string {
		if ( floor( $value ) === $value ) {
			return (string) (int) $value;
		}

		return rtrim( rtrim( sprintf( '%.2f', $value ), '0' ), '.' );
	}

	/**
	 * Build normalized table data for a product_version quick reference row.
	 *
	 * @param int $product_id Product version post ID.
	 * @param int $footnote_index Footnote number for turnaround note, or 0.
	 * @return array<string,string>
	 */
	private function get_quick_reference_row_data( int $product_id, int $footnote_index = 0 ): array {
		$test_codes = get_the_terms( $product_id, 'product_code' );
		$test_code  = ( ! is_wp_error( $test_codes ) && ! empty( $test_codes ) ) ? (string) $test_codes[0]->name : '-';

		$gene_terms = get_the_terms( $product_id, 'gene' );
		$gene_ids   = ( is_array( $gene_terms ) && ! is_wp_error( $gene_terms ) )
			? array_values(
				array_filter(
					array_map(
						static function ( $term ) {
							return isset( $term->term_id ) ? absint( $term->term_id ) : 0;
						},
						$gene_terms
					)
				)
			)
			: array();
		$gene_badge       = (string) count( $gene_ids );
		$gene_badge_label = sprintf(
			/* translators: %d is the number of genes. */
			_n( '%d Gene', '%d Genes', count( $gene_ids ), 'ambrygen-web' ),
			count( $gene_ids )
		);
		$gene_details = '';

		if ( 1 === count( $gene_ids ) ) {
			$static_count_content = Helper::get_product_version_gene_static_count_table_content( (int) $gene_ids[0] );
			if ( '' !== (string) ( $static_count_content['badge'] ?? '' ) ) {
				$gene_badge = (string) $static_count_content['badge'];
			}
			if ( '' !== (string) ( $static_count_content['badge_label'] ?? '' ) ) {
				$gene_badge_label = (string) $static_count_content['badge_label'];
			}
			$gene_details = (string) ( $static_count_content['details_html'] ?? '' );
		}

		$tat_low    = trim( (string) get_post_meta( $product_id, 'turn_around_time_low', true ) );
		$tat_high   = trim( (string) get_post_meta( $product_id, 'turn_around_time_high', true ) );
		$turnaround = '-';

		$tat_low_num  = is_numeric( $tat_low ) ? (float) $tat_low : null;
		$tat_high_num = is_numeric( $tat_high ) ? (float) $tat_high : null;

		if ( null !== $tat_low_num && null !== $tat_high_num ) {
			if ( $tat_high_num <= 21 ) {
				$turnaround = $this->format_turnaround_value( $tat_low_num ) . '-' . $this->format_turnaround_value( $tat_high_num ) . ' days';
			} else {
				$turnaround = $this->format_turnaround_value( $tat_low_num / 7 ) . '-' . $this->format_turnaround_value( $tat_high_num / 7 ) . ' weeks';
			}
		} elseif ( null !== $tat_low_num ) {
			if ( $tat_low_num <= 21 ) {
				$turnaround = $this->format_turnaround_value( $tat_low_num ) . ' days';
			} else {
				$turnaround = $this->format_turnaround_value( $tat_low_num / 7 ) . ' weeks';
			}
		}

		if ( $footnote_index > 0 && '-' !== $turnaround ) {
			$turnaround .= ' [' . $footnote_index . ']';
		}

		return array(
			'product_id'    => (string) $product_id,
			'test_code'     => $test_code,
			'title'         => (string) get_the_title( $product_id ),
			'turnaround'    => $turnaround,
			'gene_badge'    => $gene_badge,
			'gene_badge_label' => $gene_badge_label,
			'gene_details'     => $gene_details,
		);
	}

	/**
	 * Render spacer markup that matches Gutenberg Spacer block output.
	 *
	 * @param string $height Spacer height, e.g. `24px`.
	 * @param string $class_name Optional spacer utility class.
	 * @return string
	 */
	private function render_spacer( string $height, string $class_name = '' ): string {
		$attributes = array(
			'height' => $height,
		);

		if ( '' !== $class_name ) {
			$attributes['className'] = $class_name;
		}

		$comment = sprintf(
			'<!-- wp:spacer %s -->',
			wp_json_encode( $attributes )
		);

		$classes = trim( 'wp-block-spacer ' . $class_name );

		return $comment
			. sprintf(
				'<div style="height:%1$s" aria-hidden="true" class="%2$s"></div>',
				esc_attr( $height ),
				esc_attr( $classes )
			)
			. '<!-- /wp:spacer -->';
	}

	/**
	 * Render the Hero section for genetic testing.
	 *
	 * @param int $post_id The post ID.
	 * @return string The rendered HTML.
	 */
	public function render_hero( int $post_id ): string {
		$post_id = $this->resolve_genetic_testing_post_id( $post_id );

		if ( ! $post_id ) {
			return '';
		}

		$title              = get_the_title( $post_id );
		$banner_description = get_post_meta( $post_id, 'banner_description', true );
		$intro              = get_post_meta( $post_id, 'intro', true );
		$hero_description   = $banner_description ? $banner_description : $intro;

		$categories    = get_the_terms( $post_id, 'poster_category' );
		$category_name = ( is_array( $categories ) && ! is_wp_error( $categories ) && ! empty( $categories ) ) ? $categories[0]->name : '';
		$category_slug = ( is_array( $categories ) && ! is_wp_error( $categories ) && ! empty( $categories ) ) ? $categories[0]->slug : '';
		$back_link     = $category_slug ? home_url( '/providers/' . $category_slug ) : home_url( '/' );

		ob_start();
		?>
		<div class="container-1280 cardiology-hero-single">
			<div class="wrapper">
				<div class="cardio-detail__shape cardio-detail__shape--1 cardio-detail__shape--top">
					<img decoding="async" src="<?php echo esc_url( get_template_directory_uri() . '/assets/src/images/shape-element-one.svg' ); ?>" loading="lazy" alt="shape-element-one" width="1024" height="1024">
				</div>
				<div class="cardio-detail__shape cardio-detail__shape--bottom">
					<img decoding="async" src="<?php echo esc_url( get_template_directory_uri() . '/assets/src/images/shape-element-two.svg' ); ?>" loading="lazy" alt="shape-element-two" width="1024" height="1024">
				</div>
				<section class="cardio-detail">
					<div class="cardio-detail__inner">
						<div class="cardio-detail__top">
							<div class="eyebrow cardio-detail__category"><?php echo esc_html( $category_name ); ?></div>
							<a href="<?php echo esc_url( $back_link ); ?>" class="cardio-detail__back text-small-semibold">
								<?php esc_html_e( 'Back To Full Menu', 'ambrygen-web' ); ?>
							</a>
						</div>
						<?php echo $this->render_spacer( '16px', 'is-style-gl-s16' ); ?>
						<h2 class="heading-2 block-title mb-0 cardio-detail__title"><?php echo esc_html( $title ); ?></h2>
						<?php echo $this->render_spacer( '16px', 'is-style-gl-s16' ); ?>
						<?php if ( $hero_description ) : ?>
							<div class="cardio-detail__description text-md-regular">
								<?php echo wp_kses_post( $hero_description ); ?>
							</div>
						<?php endif; ?>
					</div>
				</section>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render the main details of a genetic testing post.
	 * Includes Intro, When to Consider, and Why Important sections.
	 *
	 * @param int $post_id The post ID.
	 * @return string The rendered HTML.
	 */
	public function render_details( int $post_id ): string {
		$post_id = $this->resolve_genetic_testing_post_id( $post_id );

		if ( ! $post_id ) {
			return '';
		}

		// Retrieve meta fields.
		$short_description  = get_post_meta( $post_id, 'short_description', true );
		$intro_title        = get_post_meta( $post_id, 'meta_title', true );
		$intro_content      = get_post_meta( $post_id, 'intro', true );
		$banner_description = get_post_meta( $post_id, 'banner_description', true );
		$hero_description   = $banner_description ? $banner_description : $intro_content;
		$show_intro_content = $intro_content
			&& $this->normalize_comparison_text( (string) $intro_content ) !== $this->normalize_comparison_text( (string) $hero_description );
		$post_description   = $this->render_post_description( $post_id );
		$genes_analyzed     = $this->render_genes_analyzed( $post_id );
		$important_title    = get_post_meta( $post_id, 'why_is_this_important_title', true );
		$important_content  = get_post_meta( $post_id, 'why_is_this_important', true );
		$consider_title     = get_post_meta( $post_id, 'when_to_consider_title', true );
		$consider_content   = get_post_meta( $post_id, 'when_to_consider_content', true );

		ob_start();
		?>
		<?php if ( $short_description || $intro_title || $show_intro_content || '' !== trim( $post_description ) || '' !== trim( $genes_analyzed ) ) : ?>
			<?php if ( $short_description ) : ?>
				<div class="body1 cardio-info__intro">
					<div class="short_description cardio-info__highlight-text">
						<?php echo wp_kses_post( wpautop( $short_description ) ); ?>
					</div>
				</div>
			<?php endif; ?>

			<?php if ( $intro_title ) : ?>
				<h5><?php echo esc_html( $intro_title ); ?></h5>
			<?php endif; ?>

			<?php if ( $show_intro_content ) : ?>
				<div class="body1">
					<?php echo wp_kses_post( wpautop( $intro_content ) ); ?>
				</div>
			<?php endif; ?>

			<?php if ( '' !== trim( $post_description ) ) : ?>
				<?php echo $post_description; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php endif; ?>

			<?php if ( '' !== trim( $genes_analyzed ) ) : ?>
				<?php echo $genes_analyzed; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
			<?php endif; ?>

			<?php if ( $important_title || $important_content || $consider_title || $consider_content ) : ?>
				<!-- <div class="is-style-gl-s36" aria-hidden="true"></div> -->
			<?php endif; ?>
		<?php endif; ?>

		<?php if ( $important_title || $important_content ) : ?>
			<?php if ( $important_title ) : ?>
				<h5><?php echo esc_html( $important_title ); ?></h5>
			<?php endif; ?>
			<?php if ( $important_content ) : ?>
				<div class="body1">
					<?php echo wp_kses_post( wpautop( $important_content ) ); ?>
				</div>
			<?php endif; ?>
			<!-- <div class="is-style-gl-s36" aria-hidden="true"></div> -->
		<?php endif; ?>

		<?php if ( $consider_title || $consider_content ) : ?>
			<?php if ( $consider_title ) : ?>
				<h5><?php echo esc_html( $consider_title ); ?></h5>
			<?php endif; ?>
			<?php if ( $consider_content ) : ?>
				<div class="body1">
					<?php echo wp_kses_post( wpautop( $consider_content ) ); ?>
				</div>
			<?php endif; ?>
		<?php endif; ?>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render the Product Stats section.
	 *
	 * @param int $post_id The post ID.
	 * @return string The rendered HTML.
	 */
	public function render_product_stats( int $post_id ): string {
		$post_id   = $this->resolve_genetic_testing_post_id( $post_id );
		$is_editor = $this->is_editor_preview();

		if ( ! $post_id ) {
			return '';
		}

		$title  = get_post_meta( $post_id, 'product_stats_title', true );
		$rows   = get_post_meta( $post_id, 'product_stats_repeater', true );
		$footer = get_post_meta( $post_id, 'product_stats_footer', true );

		if ( empty( $rows ) ) {
			return $is_editor ? $this->render_product_stats_placeholder() : '';
		}

		ob_start();
		?>
		<div class="cardio-info__stats-block">
			<?php if ( $title ) : ?>
				<h5 class="heading-5 block-title mb-0"><?php echo esc_html( $title ); ?></h5>
			<?php endif; ?>
			<?php echo $this->render_spacer( '24px', 'is-style-gl-s24' ); ?>
			<div class="cardio-info__stats">
				<?php foreach ( $rows as $row ) : ?>
					<div class="cardio-info__stat-card">
						<div class="cardio-info__stat-value"><?php echo esc_html( $row['title'] ?? '' ); ?></div>
						<div class="cardio-info__stat-label"><?php echo esc_html( $row['subtitle'] ?? '' ); ?></div>
						<?php echo $this->render_spacer( '6px', 'is-style-gl-s6' ); ?>
						<div class="cardio-info__stat-desc">
							<?php echo esc_html( $row['description'] ?? '' ); ?><span>*</span>
						</div>
						<?php if ( ! empty( $row['sub_description'] ) ) : ?>
							<div class="caption-regular cardio-info__stat-source">
								<span>*</span><?php echo esc_html( $row['sub_description'] ); ?>
							</div>
						<?php endif; ?>
					</div>
				<?php endforeach; ?>
			</div>
			<?php if ( $footer ) : ?>
				<?php echo $this->render_spacer( '24px', 'is-style-gl-s24' ); ?>
				<div class="body1 cardio-info__stat-footer">
					<?php echo wp_kses_post( $footer ); ?>
				</div>
			<?php endif; ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render an editor-only placeholder for product stats when linked data
	 * is not available for the previewed genetic testing post.
	 *
	 * @return string
	 */
	private function render_product_stats_placeholder(): string {
		ob_start();
		?>
		<div class="cardio-info__stats-block">
			<h5 class="heading-5 block-title mb-0"><?php esc_html_e( 'Product Stats Preview', 'ambrygen-web' ); ?></h5>
			<?php echo $this->render_spacer( '24px', 'is-style-gl-s24' ); ?>
			<div class="cardio-info__stats">
				<div class="cardio-info__stat-card">
					<div class="cardio-info__stat-value">96%</div>
					<div class="cardio-info__stat-label"><?php esc_html_e( 'Sensitivity', 'ambrygen-web' ); ?></div>
					<?php echo $this->render_spacer( '6px', 'is-style-gl-s6' ); ?>
					<div class="cardio-info__stat-desc"><?php esc_html_e( 'Add linked product stats to preview live values.', 'ambrygen-web' ); ?></div>
				</div>
				<div class="cardio-info__stat-card">
					<div class="cardio-info__stat-value">24</div>
					<div class="cardio-info__stat-label"><?php esc_html_e( 'Genes', 'ambrygen-web' ); ?></div>
					<?php echo $this->render_spacer( '6px', 'is-style-gl-s6' ); ?>
					<div class="cardio-info__stat-desc"><?php esc_html_e( 'Editor placeholder shown until product stats data is connected.', 'ambrygen-web' ); ?></div>
				</div>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render a genes-analyzed accordion item for a linked product version.
	 *
	 * @param int $product_id Product version post ID.
	 * @return string
	 */
	private function render_product_version_genes_group( int $product_id ): string {
		$product_id = absint( $product_id );

		if ( $product_id <= 0 || 'product_version' !== get_post_type( $product_id ) ) {
			return '';
		}

		$product_title = trim( (string) get_the_title( $product_id ) );
		if ( '' === $product_title ) {
			return '';
		}

		$gene_terms = get_the_terms( $product_id, 'gene' );
		if ( ! is_array( $gene_terms ) || is_wp_error( $gene_terms ) || empty( $gene_terms ) ) {
			return '';
		}

		$unique_gene_terms = array();
		$seen_gene_names   = array();

		foreach ( $gene_terms as $gene_term ) {
			$gene_slug = isset( $gene_term->slug ) ? sanitize_title( (string) $gene_term->slug ) : '';
			if ( in_array( $gene_slug, array( '500', 'whole-exome' ), true ) ) {
				return '';
			}

			$gene_name_key = strtolower( trim( (string) ( $gene_term->name ?? '' ) ) );
			if ( '' !== $gene_name_key && ! in_array( $gene_name_key, $seen_gene_names, true ) ) {
				$seen_gene_names[]   = $gene_name_key;
				$unique_gene_terms[] = $gene_term;
			}
		}

		$gene_terms = $unique_gene_terms;

		ob_start();

		
		?>
		<div class="test-catlouge__item">
			<div class="test-catlouge__item-main">
				<div class="test-catlouge__item-top">
					<div class="subtitle1-sbold mb-0 test-catlouge__item-title">
						<?php echo esc_html( $product_title ); ?>
					</div>
					<div class="text-sm-medium test-catlouge__badge">
						<?php
						$badge_label = sprintf(
							/* translators: %d is the number of genes. */
							_n( '%d Gene', '%d Genes', count( $gene_terms ), 'ambrygen-web' ),
							count( $gene_terms )
						);

						if ( 1 === count( $gene_terms ) && isset( $gene_terms[0]->term_id ) ) {
							$static_count_content = Helper::get_product_version_gene_static_count_table_content( (int) $gene_terms[0]->term_id );
							if ( '' !== (string) ( $static_count_content['badge_label'] ?? '' ) ) {
								$badge_label = (string) $static_count_content['badge_label'];
							}
						}

						echo esc_html( $badge_label );
						?>
					</div>
				</div>

				<div class="test-catlouge__item-content">
					<div class="test-catlouge__divider"></div>
					<div class="test-catlouge__grid test-catlouge__grid--4col">
						<?php foreach ( $gene_terms as $gene_term ) : ?>
							<div class="test-catlouge__row">
								<div class="test-catlouge__gene-name genes">
									<?php echo esc_html( $gene_term->name ); ?>
									<?php echo Helper::render_product_version_gene_static_count( (int) $gene_term->term_id, (string) $gene_term->name ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
								</div>
							</div>
						<?php endforeach; ?>
					</div>
				</div>
			</div>

			<button class="test-catlouge__item-toggle" type="button" aria-expanded="false"
				aria-label="<?php echo esc_attr( $product_title ); ?>" data-product-id="<?php echo esc_attr( $product_id ); ?>">
				<span class="test-catlouge__icon-cross"></span>
			</button>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render the "Genes Analyzed" accordion section.
	 *
	 * @param int $post_id The post ID.
	 * @return string The rendered HTML.
	 */
	public function render_genes_analyzed( int $post_id ): string {
		$post_id   = $this->resolve_genetic_testing_post_id( $post_id );
		$is_editor = $this->is_editor_preview();

		if ( ! $post_id ) {
			return '';
		}

		$linked_posts = get_post_meta( $post_id, 'linked_posts_genetic', true );

		if ( empty( $linked_posts ) ) {
			return $is_editor ? $this->render_genes_analyzed_placeholder() : '';
		}

		if ( ! is_array( $linked_posts ) ) {
			$linked_posts = array( $linked_posts );
		}

		$marketing_material_groups = array();
		$product_version_groups    = array();

		foreach ( $linked_posts as $linked_post_id ) {
			$linked_post_id = absint( $linked_post_id );

			if ( 'product_version' === get_post_type( $linked_post_id ) ) {
				$product_version_markup = $this->render_product_version_genes_group( $linked_post_id );
				if ( '' !== trim( $product_version_markup ) ) {
					$product_version_groups[] = $product_version_markup;
				}
				continue;
			}

			if ( 'marketing_material' !== get_post_type( $linked_post_id ) ) {
				continue;
			}

			$post_title = get_the_title( $linked_post_id );
			if ( ! $post_title ) {
				continue;
			}

			$terms      = get_the_terms( $linked_post_id, 'marketing_material_type' );
			$group_name = ( is_array( $terms ) && ! is_wp_error( $terms ) && ! empty( $terms ) )
				? (string) $terms[0]->name
				: (string) __( 'Marketing Materials', 'ambrygen-web' );

			if ( ! isset( $marketing_material_groups[ $group_name ] ) ) {
				$marketing_material_groups[ $group_name ] = array();
			}

			$marketing_material_groups[ $group_name ][] = array(
				'id'    => $linked_post_id,
				'title' => $post_title,
			);
		}

		if ( empty( $marketing_material_groups ) && empty( $product_version_groups ) ) {
			return $is_editor ? $this->render_genes_analyzed_placeholder() : '';
		}

		$renderable_groups = array();

		foreach ( $marketing_material_groups as $group_name => $materials ) {
			$material_rows = array();

			foreach ( $materials as $material ) {
				$rendered_row = Helper::render_marketing_material_item(
					(int) $material['id'],
					(string) $material['title']
				);

				if ( '' !== trim( $rendered_row ) ) {
					$material_rows[] = $rendered_row;
				}
			}

			if ( ! empty( $material_rows ) ) {
				$renderable_groups[ $group_name ] = $material_rows;
			}
		}

		if ( empty( $renderable_groups ) && empty( $product_version_groups ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="genetic-testing-analyzed">
			<h5 class="heading-5 block-title mb-0"><?php esc_html_e( 'Genes analyzed', 'ambrygen-web' ); ?></h5>
			<?php echo $this->render_spacer( '24px', 'is-style-gl-s24' ); ?>

			<?php
			$product_ids     = $this->get_linked_product_version_ids( $post_id );
			$quick_reference = $this->render_quick_reference_table( $product_ids );

			if ( '' !== trim( $quick_reference ) ) :
				echo $quick_reference; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				echo $this->render_spacer( '24px', 'is-style-gl-s24' );
			endif;
			?>

			<div class="test-catlouge__items">
				<?php
				foreach ( $product_version_groups as $product_version_group ) {
					echo $product_version_group; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
				}
				?>
				<?php
				foreach ( $renderable_groups as $group_name => $material_rows ) :
					?>
					<div class="test-catlouge__item">
						<div class="test-catlouge__item-main">
							<div class="test-catlouge__item-top">
								<div class="subtitle1-sbold mb-0 test-catlouge__item-title">
									<?php echo esc_html( $group_name ); ?>
								</div>
							</div>

							<div class="test-catlouge__item-content">
								<div class="test-catlouge__divider"></div>

								<div class="test-catlouge__grid">
									<?php
									foreach ( $material_rows as $material_row ) {
										echo $material_row; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
									}
									?>
								</div>
							</div>
						</div>

						<button class="test-catlouge__item-toggle" type="button" aria-expanded="false"
							aria-label="<?php echo esc_attr( $group_name ); ?>">
							<span class="test-catlouge__icon-cross"></span>
						</button>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render an editor-only placeholder for the genes analyzed block when
	 * linked product_version data is not available for preview.
	 *
	 * @return string
	 */
	private function render_genes_analyzed_placeholder(): string {
		ob_start();
		?>
		<div class="genetic-testing-analyzed">
			<h5 class="heading-5 block-title mb-0"><?php esc_html_e( 'Genes analyzed', 'ambrygen-web' ); ?></h5>
			<?php echo $this->render_spacer( '24px', 'is-style-gl-s24' ); ?>

			<div class="test-catlouge__items">
				<div class="test-catlouge__item">
					<div class="test-catlouge__item-main">
						<div class="test-catlouge__item-top">
							<div class="subtitle1-sbold mb-0 test-catlouge__item-title">
								<?php esc_html_e( 'Sample Gene Panel', 'ambrygen-web' ); ?>
							</div>
							<div class="text-sm-medium test-catlouge__badge">
								<?php esc_html_e( '4 Genes', 'ambrygen-web' ); ?>
							</div>
						</div>

						<div class="test-catlouge__item-content">
							<div class="test-catlouge__divider"></div>
							<div class="test-catlouge__grid test-catlouge__grid--4col">
								<div class="test-catlouge__row"><div class="test-catlouge__gene-name genes">FBN1</div></div>
								<div class="test-catlouge__row"><div class="test-catlouge__gene-name genes">TGFBR1</div></div>
								<div class="test-catlouge__row"><div class="test-catlouge__gene-name genes">TGFBR2</div></div>
								<div class="test-catlouge__row"><div class="test-catlouge__gene-name genes">SMAD3</div></div>
							</div>
						</div>
					</div>

					<button class="test-catlouge__item-toggle" type="button" aria-expanded="false"
						aria-label="<?php esc_attr_e( 'Toggle test details', 'ambrygen-web' ); ?>">
						<span class="test-catlouge__icon-cross"></span>
					</button>
				</div>
			</div>

			<?php echo $this->render_spacer( '24px', 'is-style-gl-s24' ); ?>
			<?php echo $this->render_quick_reference_placeholder( false ); ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render the Test Description section.
	 *
	 * @param int $post_id The post ID.
	 * @return string The rendered HTML.
	 */
	public function render_post_description( int $post_id ): string {
		$post_id = $this->resolve_genetic_testing_post_id( $post_id );

		if ( ! $post_id ) {
			return '';
		}

		$post    = get_post( $post_id );
		$content = $post instanceof \WP_Post ? (string) $post->post_content : '';

		if ( empty( $content ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="genetic-testing-post-content body1">
			<?php echo apply_filters( 'the_content', $content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render the test_description custom field content.
	 *
	 * @param int $post_id The post ID.
	 * @return string The rendered HTML.
	 */
	public function render_test_details_custom_field( int $post_id ): string {
		$post_id = $this->resolve_genetic_testing_post_id( $post_id );

		if ( ! $post_id ) {
			return '';
		}

		$content = (string) get_post_meta( $post_id, 'test_description', true );
		if ( '' === trim( $content ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="genetic-testing-test-details-custom-field body1">
			<?php echo apply_filters( 'the_content', $content ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render the Quick Reference block (top level).
	 *
	 * @param int $post_id The genetic testing post ID.
	 * @return string The rendered HTML.
	 */
	public function render_quick_reference_block( int $post_id ): string {
		return '';
	}

	/**
	 * Render an editor-only placeholder for the quick reference block when
	 * linked product data is not available for preview.
	 *
	 * @param bool $with_sidebar_title Whether to render the sidebar title.
	 * @return string
	 */
	private function render_quick_reference_placeholder( bool $with_sidebar_title = true ): string {
		ob_start();
		?>
		<div class="<?php echo esc_attr( $with_sidebar_title ? 'sidebar-widget reference-table' : 'reference-table' ); ?>">
			<?php if ( $with_sidebar_title ) : ?>
				<div class="sidebar-widget__title subtitle2-medium"><?php esc_html_e( 'Quick Reference', 'ambrygen-web' ); ?></div>
			<?php endif; ?>
			<div class="reference-table__card">
				<div class="reference-table__row">
					<div class="text-sm-bold"><?php esc_html_e( 'Test Code', 'ambrygen-web' ); ?></div>
					<div class="text-sm-bold">1234</div>
				</div>
				<div class="reference-table__row">
					<div class="text-sm-bold"><?php esc_html_e( 'Reflex code', 'ambrygen-web' ); ?></div>
					<div class="text-sm-bold">8783</div>
				</div>
				<div class="reference-table__row">
					<div class="text-sm-bold"><?php esc_html_e( 'Genes', 'ambrygen-web' ); ?></div>
					<div class="text-sm-bold">24</div>
				</div>
				<div class="reference-table__row">
					<div class="text-sm-bold"><?php esc_html_e( 'Turnaround', 'ambrygen-web' ); ?><sup>[1]</sup></div>
					<div class="text-sm-bold"><?php esc_html_e( '10-21 Days', 'ambrygen-web' ); ?></div>
				</div>
				<div class="reference-table__row">
					<div class="text-sm-bold"><?php esc_html_e( 'Technology', 'ambrygen-web' ); ?></div>
					<div class="text-sm-bold">NGS + Del/Dup</div>
				</div>
				<div class="reference-table__row">
					<div class="text-sm-bold"><?php esc_html_e( 'Specimen', 'ambrygen-web' ); ?></div>
					<div class="text-sm-bold"><?php esc_html_e( 'Blood / Saliva', 'ambrygen-web' ); ?></div>
				</div>
			</div>
			<?php echo $this->render_spacer( '12px', 'is-style-gl-s12' ); ?>
			<div class="text-small reference-table__footnote">
				<div class="reference-table__footnote--title"><?php esc_html_e( 'Preview:', 'ambrygen-web' ); ?></div>
				<?php esc_html_e( 'Link a product_version post to show the live quick reference data here.', 'ambrygen-web' ); ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render the Quick Reference card (internal helper).
	 *
	 * @param int $product_id The product version post ID.
	 * @param int $gene_count Total genes count.
	 * @param bool $with_sidebar_title Whether to render the sidebar title.
	 * @return string The rendered HTML.
	 */
	public function render_quick_reference( int $product_id, int $gene_count, bool $with_sidebar_title = false ): string {
		// Get Test Code from product_code taxonomy
		$test_codes = get_the_terms( $product_id, 'product_code' );
		$test_code  = ( ! is_wp_error( $test_codes ) && ! empty( $test_codes ) ) ? $test_codes[0]->name : '—';

		// Get Turnaround times
		$tat_low     = get_post_meta( $product_id, 'turn_around_time_low', true );
		$tat_high    = get_post_meta( $product_id, 'turn_around_time_high', true );
		$tat_display = ( $tat_low && $tat_high ) ? "{$tat_low}–{$tat_high} Days" : '—';

		// Get Footnote from featured_description
		$footnote = get_post_meta( $product_id, 'featured_description', true );

		ob_start();
		?>
		<div class="<?php echo esc_attr( $with_sidebar_title ? 'sidebar-widget reference-table' : 'reference-table' ); ?>">
			<?php if ( $with_sidebar_title ) : ?>
				<div class="sidebar-widget__title subtitle2-medium"><?php esc_html_e( 'Quick Reference', 'ambrygen-web' ); ?></div>
			<?php endif; ?>

			<div class="reference-table__card">
				<div class="reference-table__row">
					<div class="text-sm-bold"><?php esc_html_e( 'Test Code', 'ambrygen-web' ); ?></div>
					<div class="text-sm-bold"><?php echo esc_html( $test_code ); ?></div>
				</div>
				<div class="reference-table__row">
					<div class="text-sm-bold"><?php esc_html_e( 'Reflex code', 'ambrygen-web' ); ?></div>
					<div class="text-sm-bold">8783</div>
				</div>
				<div class="reference-table__row">
					<div class="text-sm-bold"><?php esc_html_e( 'Genes', 'ambrygen-web' ); ?></div>
					<div class="text-sm-bold"><?php echo esc_html( $gene_count ); ?></div>
				</div>
				<div class="reference-table__row">
					<div class="text-sm-bold"><?php esc_html_e( 'Turnaround', 'ambrygen-web' ); ?><sup>[1]</sup></div>
					<div class="text-sm-bold"><?php echo esc_html( $tat_display ); ?></div>
				</div>
				<!-- <div class="reference-table__row">
					<div class="text-sm-bold"><?php // esc_html_e('Technology', 'ambrygen-web'); ?></div>
					<div class="text-sm-bold">NGS + Del/Dup</div>
				</div>
				<div class="reference-table__row">
					<div class="text-sm-bold"><?php // esc_html_e('Specimen', 'ambrygen-web'); ?></div>
					<div class="text-sm-bold">Blood / Saliva</div>
				</div> -->
			</div>

			<?php if ( ! empty( $footnote ) ) : ?>
				<?php echo $this->render_spacer( '12px', 'is-style-gl-s12' ); ?>
				<div class="text-small reference-table__footnote">
					<div class="reference-table__footnote--title"><?php esc_html_e( 'Footnote:', 'ambrygen-web' ); ?></div>
					<?php echo wp_kses_post( $footnote ); ?>
				</div>
			<?php endif; ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render the inline Quick Reference table for all linked product versions.
	 *
	 * @param int[] $product_ids Linked product version IDs.
	 * @return string
	 */
	private function render_quick_reference_table( array $product_ids ): string {
		$rows           = array();
		$footnotes      = array();
		$footnote_index = 1;

		foreach ( $product_ids as $product_id ) {
			$product_id = absint( $product_id );
			if ( $product_id <= 0 ) {
				continue;
			}

			$turnaround_note    = trim( (string) get_post_meta( $product_id, 'turn_around_time_note', true ) );
			$row_footnote_index = 0;

			if ( '' !== $turnaround_note ) {
				$row_footnote_index = $footnote_index;
				$footnotes[]        = array(
					'index' => $footnote_index,
					'note'  => $turnaround_note,
				);
				$footnote_index++;
			}

			$row_data = $this->get_quick_reference_row_data( $product_id, $row_footnote_index );
			if ( '' === trim( $row_data['title'] ) ) {
				continue;
			}

			$rows[] = $row_data;
		}

		if ( empty( $rows ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="reference-table test">
			<div class="gl-data-table variation-gray25 gl-data-table--cols-4">
				<div class="gl-data-table__grid">
					<div class="gl-data-table__row gl-data-table__row--header">
						<div class="gl-data-table__cell"><?php esc_html_e( 'Code', 'ambrygen-web' ); ?></div>
						<div class="gl-data-table__cell"><?php esc_html_e( 'Test Name', 'ambrygen-web' ); ?></div>
						<div class="gl-data-table__cell"><?php esc_html_e( 'Turnaround', 'ambrygen-web' ); ?></div>
						<div class="gl-data-table__cell"><?php esc_html_e( 'Genes', 'ambrygen-web' ); ?></div>
					</div>

					<?php foreach ( $rows as $row ) : 
						?>
						<div class="gl-data-table__row">
							<div class="gl-data-table__cell" data-label="<?php esc_attr_e( 'Code', 'ambrygen-web' ); ?>">
								<?php echo esc_html( $row['test_code'] ); ?>
							</div>
							<div class="gl-data-table__cell gl-data-table__cell--name" id="<?php echo esc_attr( sanitize_title( $row['title'] ) ); ?>" data-label="<?php esc_attr_e( 'Test Name', 'ambrygen-web' ); ?>">
								<?php echo esc_html( $row['title'] ); ?>
							</div>
							<div class="gl-data-table__cell gl-data-table__cell--highlight" data-label="<?php esc_attr_e( 'Turnaround', 'ambrygen-web' ); ?>">
								<?php echo esc_html( $row['turnaround'] ); ?>
							</div>
							<div class="gl-data-table__cell" data-label="<?php esc_attr_e( 'Genes', 'ambrygen-web' ); ?>">
								
								
								<?php if ( '' !== trim( (string) $row['product_id'] ) AND empty( $row['gene_details'] ) ) : ?>
									<div class="text-sm-medium test-catlouge__badge"><?php echo esc_html( (string) ( $row['gene_badge_label'] ?? ( $row['gene_badge'] . ' Genes' ) ) ); ?></div>
									<div class="reference-table__details text-small">
										<button
											class="reference-table__see-genes"
											type="button"
											data-product-id="<?php echo esc_attr( $row['product_id'] ); ?>"
										>
											<?php esc_html_e( 'SEE GENES', 'ambrygen-web' ); ?>
										</button>
									</div>
								<?php elseif ( '' !== $row['gene_details'] ) : ?>
									<div class="reference-table__details text-small"><?php echo wp_kses_post( $row['gene_details'] ); ?></div>
								<?php endif; ?>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			</div>

			<?php if ( ! empty( $footnotes ) ) : ?>
				<?php echo $this->render_spacer( '12px', 'is-style-gl-s12' ); ?>
				<div class="text-small reference-table__footnote">
					<div class="reference-table__footnote--title"><?php esc_html_e( 'Footnotes:', 'ambrygen-web' ); ?></div>
					<div class="is-style-gl-s30"></div>
					<?php foreach ( $footnotes as $footnote ) : ?>
						<p>[<?php echo esc_html( (string) $footnote['index'] ); ?>] <?php echo wp_kses_post( $footnote['note'] ); ?></p>
					<?php endforeach; ?>
				</div>
			<?php endif; ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render the Downloads section.
	 *
	 * @param int $post_id The post ID.
	 * @return string The rendered HTML.
	 */
	public function render_post_downloads( int $post_id ): string {
		$post_id   = $this->resolve_genetic_testing_post_id( $post_id );
		$is_editor = $this->is_editor_preview();

		if ( ! $post_id ) {
			return $is_editor ? $this->render_post_downloads_placeholder() : '';
		}

		$linked_posts = get_post_meta( $post_id, 'linked_posts_genetic', true );
		if ( empty( $linked_posts ) ) {
			return $is_editor ? $this->render_post_downloads_placeholder() : '';
		}

		if ( ! is_array( $linked_posts ) ) {
			$linked_posts = array( $linked_posts );
		}

		$downloads = array();
		foreach ( $linked_posts as $linked_id ) {
			$linked_id = absint( $linked_id );
			if ( ! $linked_id ) {
				continue;
			}

			if ( get_post_type( $linked_id ) !== 'marketing_material' ) {
				continue;
			}

			if ( 'publish' !== get_post_status( $linked_id ) ) {
				continue;
			}

			$files = get_post_meta( $linked_id, 'marketing_material_files', true );
			if ( empty( $files ) || ! is_array( $files ) ) {
				continue;
			}

			// Get Title and Taxonomy Term
			$post_title = get_the_title( $linked_id );
			$terms      = get_the_terms( $linked_id, 'marketing_material_type' );
			$term_name  = ( is_array( $terms ) && ! is_wp_error( $terms ) && ! empty( $terms ) ) ? $terms[0]->name : '';
			$base_title = trim( $post_title . ' ' . $term_name );

			$file_links = array();
			foreach ( $files as $row ) {
				if ( ! is_array( $row ) ) {
					continue;
				}

				$file_id   = isset( $row['file_id'] ) ? absint( $row['file_id'] ) : 0;
				$status    = isset( $row['status'] ) ? sanitize_key( (string) $row['status'] ) : '';
				$is_active = isset( $row['is_active'] ) ? absint( $row['is_active'] ) : 0;

				if ( $file_id <= 0 || 'disabled_urgent' === $status || 1 !== $is_active ) {
					continue;
				}

				$file_url = wp_get_attachment_url( $file_id );
				if ( ! $file_url ) {
					continue;
				}

				$language_id    = isset( $row['language_term_id'] ) ? absint( $row['language_term_id'] ) : 0;
				$language_term  = $language_id > 0 ? get_term( $language_id, 'marketing_material_language' ) : null;
				$language_label = Helper::get_test_catalog_language_label( $language_term );

				$file_links[] = array(
					'url'   => $file_url,
					'label' => $language_label,
				);
			}

			if ( ! empty( $file_links ) ) {
				$downloads[] = array(
					'title' => $base_title,
					'links' => $file_links,
				);
			}
		}

		if ( empty( $downloads ) ) {
			return $is_editor ? $this->render_post_downloads_placeholder() : '';
		}

		ob_start();
		?>
		<div class="sidebar-widget genetic-testing-downloads">
			<div class="sidebar-widget__title subtitle2-medium"><?php esc_html_e( 'Downloads', 'ambrygen-web' ); ?></div>
			<div class="genetic-testing-downloads__list">
				<?php foreach ( $downloads as $download ) : ?>
					<div class="genetic-testing-downloads__item">
						<span class="genetic-testing-downloads__title text-sm-bold">
							<?php echo esc_html( $download['title'] ); ?>
						</span>
						<div class="genetic-testing-downloads__lang-links">
							<?php foreach ( $download['links'] as $link ) : ?>
								<?php
								$raw_label   = (string) ( $link['label'] ?? '' );
								$label_display = ( '' !== $raw_label && 'PDF' !== $raw_label ) ? '(' . $raw_label . ')' : '';
								?>
								<a href="<?php echo esc_url( $link['url'] ); ?>" target="_blank" rel="noopener" class="genetic-testing-downloads__lang-link text-sm-medium" title="<?php echo esc_attr( trim( $download['title'] . ' ' . $raw_label ) ); ?>">
									<?php if ( '' !== $label_display ) : ?>
										<span class="genetic-testing-downloads__lang-code"><?php echo esc_html( $label_display ); ?></span>
									<?php endif; ?>
									<span class="genetic-testing-downloads__icon" aria-hidden="true"></span>
								</a>
							<?php endforeach; ?>
						</div>
					</div>
				<?php endforeach; ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render an editor-only placeholder for downloads when linked marketing
	 * material files are not available for preview.
	 *
	 * @return string
	 */
	private function render_post_downloads_placeholder(): string {
		ob_start();
		?>
		<div class="sidebar-widget genetic-testing-downloads">
			<div class="sidebar-widget__title subtitle2-medium"><?php esc_html_e( 'Downloads', 'ambrygen-web' ); ?></div>
			<div class="genetic-testing-downloads__list">
				<div class="genetic-testing-downloads__item">
					<span class="genetic-testing-downloads__link text-sm-bold">
						<?php esc_html_e( 'Sample test requisition form', 'ambrygen-web' ); ?>
					</span>
				</div>
				<div class="genetic-testing-downloads__item">
					<span class="genetic-testing-downloads__link text-sm-bold">
						<?php esc_html_e( 'Sample patient brochure', 'ambrygen-web' ); ?>
					</span>
				</div>
			</div>
			<?php echo $this->render_spacer( '12px', 'is-style-gl-s12' ); ?>
			<div class="text-small reference-table__footnote">
				<div class="reference-table__footnote--title"><?php esc_html_e( 'Preview:', 'ambrygen-web' ); ?></div>
				<?php esc_html_e( 'Link marketing material files to show the live downloads list here.', 'ambrygen-web' ); ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render the Related Tests section.
	 *
	 * @param int $post_id The current post ID.
	 * @return string The rendered HTML.
	 */
	public function render_related_tests( int $post_id ): string {
		$post_id   = $this->resolve_genetic_testing_post_id( $post_id );
		$is_editor = $this->is_editor_preview();

		if ( ! $post_id ) {
			return $is_editor ? $this->render_related_tests_placeholder() : '';
		}

		$categories = get_the_terms( $post_id, 'poster_category' );
		if ( empty( $categories ) || is_wp_error( $categories ) ) {
			return $is_editor ? $this->render_related_tests_placeholder() : '';
		}

		// Get the main category (first one)
		$main_category = $categories[0];
		$category_name = $main_category->name;
		$category_slug = $main_category->slug;


		// Query related posts
		$args = array(
			'post_type'      => 'genetic-testing',
			'posts_per_page' => 3,
			'post__not_in'   => array( $post_id ),
			'tax_query'      => array(
				array(
					'taxonomy' => 'poster_category',
					'field'    => 'term_id',
					'terms'    => $main_category->term_id,
				),
			),
		);

		$related_query = new \WP_Query( $args );
		if ( ! $related_query->have_posts() ) {
			return $is_editor ? $this->render_related_tests_placeholder( $category_name ) : '';
		}

		ob_start();
		?>
		<div class="sidebar-widget related-tests">
			<div class="sidebar-widget__title subtitle2-medium">
				<?php printf( esc_html__( 'Related %s Tests', 'ambrygen-web' ), esc_html( $category_name ) ); ?>
			</div>
			<div class="related-tests__list">
				<?php
				while ( $related_query->have_posts() ) :
					$related_query->the_post();
					$rel_id = get_the_ID();

					// Get sub-category or label (Comprehensive etc)
					$rel_cats  = get_the_terms( $rel_id, 'poster_category' );
					$sub_label = '';
					if ( ! empty( $rel_cats ) && ! is_wp_error( $rel_cats ) ) {
						foreach ( $rel_cats as $cat ) {
							if ( $cat->term_id !== $main_category->term_id ) {
								$sub_label = $cat->name;
								break;
							}
						}
						// Fallback to first if only one
						if ( empty( $sub_label ) ) {
							$sub_label = $rel_cats[0]->name;
						}
					}

					// Get gene count from linked product_version
					$gene_count   = 0;
					$linked_posts = get_post_meta( $rel_id, 'linked_posts_genetic', true );
					if ( ! empty( $linked_posts ) ) {
						if ( ! is_array( $linked_posts ) ) {
							$linked_posts = array( $linked_posts );
						}
						foreach ( $linked_posts as $linked_id ) {
							if ( get_post_type( $linked_id ) === 'product_version' ) {
								$genes = get_the_terms( $linked_id, 'gene' );
								if ( ! is_wp_error( $genes ) && ! empty( $genes ) ) {
									$gene_count = count( $genes );
								}
								break;
							}
						}
					}
					?>
					<a href="<?php the_permalink(); ?>" class="related-tests__item">
						<?php if ( $sub_label ) : ?>
							<div class="related-tests__category body2-semibold"><?php echo esc_html( $sub_label ); ?></div>
						<?php endif; ?>
						<div class="related-tests__info">
							<div class="related-tests__name subtitle2-sbold"><?php the_title(); ?></div>
							<?php if ( $gene_count > 0 ) : ?>
								<div class="text-xs-regular related-tests__meta"><?php printf( esc_html__( '%d Genes', 'ambrygen-web' ), $gene_count ); ?></div>
							<?php endif; ?>
						</div>
					</a>
					<?php
				endwhile;
				wp_reset_postdata();
				?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render an editor-only placeholder for related tests when no related
	 * genetic testing posts are available for preview.
	 *
	 * @param string $category_name Optional category name for the title.
	 * @return string
	 */
	private function render_related_tests_placeholder( string $category_name = '' ): string {
		$title_suffix = '' !== $category_name ? $category_name : __( 'Genetic Testing', 'ambrygen-web' );

		ob_start();
		?>
		<div class="sidebar-widget related-tests">
			<div class="sidebar-widget__title subtitle2-medium">
				<?php printf( esc_html__( 'Related %s Tests', 'ambrygen-web' ), esc_html( $title_suffix ) ); ?>
			</div>
			<div class="related-tests__list">
				<div class="related-tests__item">
					<div class="related-tests__category body2-semibold"><?php esc_html_e( 'Comprehensive', 'ambrygen-web' ); ?></div>
					<div class="related-tests__info">
						<div class="related-tests__name subtitle2-sbold"><?php esc_html_e( 'Sample Related Test One', 'ambrygen-web' ); ?></div>
						<div class="text-xs-regular related-tests__meta"><?php esc_html_e( '18 Genes', 'ambrygen-web' ); ?></div>
					</div>
				</div>
				<div class="related-tests__item">
					<div class="related-tests__category body2-semibold"><?php esc_html_e( 'Targeted', 'ambrygen-web' ); ?></div>
					<div class="related-tests__info">
						<div class="related-tests__name subtitle2-sbold"><?php esc_html_e( 'Sample Related Test Two', 'ambrygen-web' ); ?></div>
						<div class="text-xs-regular related-tests__meta"><?php esc_html_e( '8 Genes', 'ambrygen-web' ); ?></div>
					</div>
				</div>
			</div>
			<?php echo $this->render_spacer( '12px', 'is-style-gl-s12' ); ?>
			<div class="text-small reference-table__footnote">
				<div class="reference-table__footnote--title"><?php esc_html_e( 'Preview:', 'ambrygen-web' ); ?></div>
				<?php esc_html_e( 'Assign related genetic testing posts in the same category to show live related tests here.', 'ambrygen-web' ); ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
