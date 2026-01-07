<?php
/**
 * Site breadcrumb partial (VIP safe).
 *
 * @package Ambrygen
 */

defined( 'ABSPATH' ) || exit;

if ( is_front_page() ) {
	return;
}

$separator = '/';
?>

<nav class="breadcrumb" aria-label="<?php esc_attr_e( 'Breadcrumb', 'ambrygen' ); ?>">
	<ol class="breadcrumb-list">

		<li class="breadcrumb-item">
			<a href="<?php echo esc_url( home_url( '/' ) ); ?>">
				<?php esc_html_e( 'Home', 'ambrygen' ); ?>
			</a>
		</li>

		<?php
		/**
		 * PAGE HIERARCHY
		 */
		if ( is_page() ) {

			$ancestors = array_reverse( get_post_ancestors( get_the_ID() ) );

			foreach ( $ancestors as $ancestor_id ) {
				?>
				<li class="breadcrumb-separator"><?php echo esc_html( $separator ); ?></li>
				<li class="breadcrumb-item">
					<a href="<?php echo esc_url( get_permalink( $ancestor_id ) ); ?>">
						<?php echo esc_html( get_the_title( $ancestor_id ) ); ?>
					</a>
				</li>
				<?php
			}
			?>
			<li class="breadcrumb-separator"><?php echo esc_html( $separator ); ?></li>
			<li class="breadcrumb-item current" aria-current="page">
				<?php echo esc_html( get_the_title() ); ?>
			</li>

		<?php
		/**
		 * SINGLE POST / CPT (excluding pages)
		 */
		} elseif ( is_singular() && ! is_page() ) {

			$post_type_obj = get_post_type_object( get_post_type() );

			if ( $post_type_obj && ! empty( $post_type_obj->has_archive ) ) {
				?>
				<li class="breadcrumb-separator"><?php echo esc_html( $separator ); ?></li>
				<li class="breadcrumb-item">
					<a href="<?php echo esc_url( get_post_type_archive_link( $post_type_obj->name ) ); ?>">
						<?php echo esc_html( $post_type_obj->labels->name ); ?>
					</a>
				</li>
				<?php
			}
			?>
			<li class="breadcrumb-separator"><?php echo esc_html( $separator ); ?></li>
			<li class="breadcrumb-item current" aria-current="page">
				<?php echo esc_html( get_the_title() ); ?>
			</li>

		<?php
		/**
		 * TAXONOMY / CATEGORY
		 */
		} elseif ( is_category() || is_tax() ) {

			$current_term = get_queried_object();

			if ( $current_term && ! is_wp_error( $current_term ) ) {

				$ancestors = array_reverse(
					get_ancestors( $current_term->term_id, $current_term->taxonomy )
				);

				foreach ( $ancestors as $ancestor_id ) {
					$ancestor  = get_term( $ancestor_id, $current_term->taxonomy );
					$term_link = get_term_link( $ancestor );

					if ( is_wp_error( $term_link ) ) {
						continue;
					}
					?>
					<li class="breadcrumb-separator"><?php echo esc_html( $separator ); ?></li>
					<li class="breadcrumb-item">
						<a href="<?php echo esc_url( $term_link ); ?>">
							<?php echo esc_html( $ancestor->name ); ?>
						</a>
					</li>
					<?php
				}
				?>
				<li class="breadcrumb-separator"><?php echo esc_html( $separator ); ?></li>
				<li class="breadcrumb-item current" aria-current="page">
					<?php echo esc_html( $current_term->name ); ?>
				</li>
				<?php
			}

		/**
		 * ARCHIVE
		 */
		} elseif ( is_archive() ) {
			?>
			<li class="breadcrumb-separator"><?php echo esc_html( $separator ); ?></li>
			<li class="breadcrumb-item current" aria-current="page">
				<?php echo esc_html( post_type_archive_title( '', false ) ); ?>
			</li>

		<?php
		/**
		 * SEARCH
		 */
		} elseif ( is_search() ) {
			?>
			<li class="breadcrumb-separator"><?php echo esc_html( $separator ); ?></li>
			<li class="breadcrumb-item current" aria-current="page">
				<?php
				printf(
					esc_html__( 'Search results for "%s"', 'ambrygen' ),
					esc_html( get_search_query() )
				);
				?>
			</li>
		<?php } ?>

	</ol>
</nav>
