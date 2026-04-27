<?php
/**
 * Render: Genetic Testing Accordion Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */
defined( 'ABSPATH' ) || exit;

use Ambrygen\Theme\Core\Helper;

$ambrygen_attributes = isset( $attributes ) && is_array( $attributes ) ? $attributes : array();
$ambrygen_title      = $ambrygen_attributes['title'] ?? '';
$ambrygen_heading    = $ambrygen_attributes['headingLevel'] ?? 'h2';

// Clean the heading level
$ambrygen_allowed_headings = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' );
if ( ! in_array( $ambrygen_heading, $ambrygen_allowed_headings, true ) ) {
	$ambrygen_heading = 'h2';
}

// 1. Harvest Post IDs from inner block data markers
$ambrygen_post_ids = array();
if ( ! empty( $content ) ) {
	if ( preg_match_all( '/<!-- GENETIC_TEST_ID: (\d+) -->/', $content, $matches ) ) {
		$ambrygen_post_ids = array_map( 'intval', $matches[1] );
	}
}

// Fallback to block instance if content parsing fails
if ( empty( $ambrygen_post_ids ) && isset( $block->inner_blocks ) ) {
	foreach ( $block->inner_blocks as $inner_block ) {
		if ( isset( $inner_block->attributes['postId'] ) ) {
			$ambrygen_pid = intval( $inner_block->attributes['postId'] );
			if ( $ambrygen_pid ) {
				$ambrygen_post_ids[] = $ambrygen_pid;
			}
		}
	}
}

if ( empty( $ambrygen_post_ids ) ) {
	if ( is_admin() ) {
		echo '<div class="genetic-testing-accordion__admin-empty">Please select genetic testing posts.</div>';
	}
	return;
}

// 2. Query posts and group by category
$ambrygen_posts = get_posts( array(
	'post_type'      => 'genetic-testing',
	'post__in'       => $ambrygen_post_ids,
	'orderby'        => 'post__in',
	'posts_per_page' => -1,
	'post_status'    => 'publish',
) );

$ambrygen_grouped_posts = array();

foreach ( $ambrygen_posts as $ambrygen_post ) {
	$ambrygen_categories = get_the_terms( $ambrygen_post->ID, 'poster_category' );
	$ambrygen_cat_name   = ! empty( $ambrygen_categories ) && ! is_wp_error( $ambrygen_categories ) 
		? $ambrygen_categories[0]->name 
		: __( 'General', 'ambrygen-web' );

	if ( ! isset( $ambrygen_grouped_posts[ $ambrygen_cat_name ] ) ) {
		$ambrygen_grouped_posts[ $ambrygen_cat_name ] = array();
	}
	$ambrygen_grouped_posts[ $ambrygen_cat_name ][] = $ambrygen_post;
}

$ambrygen_unique_id = wp_unique_id('gen-');
$ambrygen_wrapper_attributes = get_block_wrapper_attributes( array(
	'class' => 'genetic-testing-accordion genetic-testing-table-wrap',
	'id'    => $ambrygen_unique_id,
) );
?>

<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	
	<?php if ( ! empty( $ambrygen_title ) ) : ?>
		<<?php echo esc_html( $ambrygen_heading ); ?> class="genetic-testing-accordion__title heading-3 js-gsap-fade">
			<?php echo wp_kses_post( $ambrygen_title ); ?>
		</<?php echo esc_html( $ambrygen_heading ); ?>>
	<?php endif; ?>

	<table class="table genetic-testing-accordion__table">
		<tbody>
			<?php 
			$ambrygen_group_index = 0;
			foreach ( $ambrygen_grouped_posts as $ambrygen_category => $ambrygen_cat_posts ) : 
				$ambrygen_group_index++;
				$ambrygen_target_id = $ambrygen_unique_id . '-group-' . $ambrygen_group_index;
				?>
				<!-- Category Header Row -->
				<tr
					class="amb-genetic-toggle test-panel js-accordion-toggle"
					data-amb-target="#<?php echo esc_attr( $ambrygen_target_id ); ?>"
					data-amb-open="true"
					aria-expanded="true"
					aria-controls="<?php echo esc_attr( $ambrygen_target_id ); ?>"
				>
					<td colspan="6" class="test-option">
						<h3>
							<div class="icon-chevron-right-chunky-white"></div> 
							<?php echo esc_html( $ambrygen_category ); ?>
						</h3>
					</td>
				</tr>

				<!-- Category Content Row -->
				<tr class="js-accordion-row">
					<td colspan="6" class="hiddenRow">
						<div class="amb-genetic-content in js-accordion-content" id="<?php echo esc_attr( $ambrygen_target_id ); ?>">
							<table class="table">
								<tbody>
									<?php foreach ( $ambrygen_cat_posts as $ambrygen_item_post ) : 
										$ambrygen_item_id = $ambrygen_item_post->ID;
										// Static placeholders
										$ambrygen_gene_count      = '40';
										$ambrygen_turnaround_time = '5-14 days';
										?>
										<tr>
											<!-- Product Title -->
											<td class="product-title">
												<a href="<?php echo esc_url( get_permalink( $ambrygen_item_id ) ); ?>" class="subtitle1-sbold">
													<?php echo esc_html( $ambrygen_item_post->post_title ); ?>
												</a>
											</td>

											<!-- Description -->
											<td class="desc">
												<div class="body2">
													<?php echo wp_kses_post( $ambrygen_item_post->post_excerpt ?: wp_trim_words( $ambrygen_item_post->post_content, 30 ) ); ?>
												</div>
											</td>

											<!-- Number of Genes -->
											<td class="number-of-genes br">
												<span class="rate"><?php echo esc_html( $ambrygen_gene_count ); ?></span>
												<br><?php esc_html_e( 'NUMBER OF GENES', 'ambrygen-web' ); ?>
											</td>

											<!-- Turnaround Time -->
											<td class="turn-around-time">
												<span class="rate"><?php echo esc_html( $ambrygen_turnaround_time ); ?></span>
												<br><?php esc_html_e( 'TURNAROUND TIME', 'ambrygen-web' ); ?>
											</td>

											<!-- Learn More -->
											<td class="learn-more">
												<a href="<?php echo esc_url( get_permalink( $ambrygen_item_id ) ); ?>">
													<nobr><?php esc_html_e( 'LEARN MORE', 'ambrygen-web' ); ?></nobr>
												</a>
											</td>

											<!-- Order -->
											<td class="order-test">
												<a href="#">
													<?php esc_html_e( 'ORDER', 'ambrygen-web' ); ?>
												</a>
											</td>
										</tr>
									<?php endforeach; ?>
								</tbody>
							</table>
						</div>
					</td>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>
</div>
