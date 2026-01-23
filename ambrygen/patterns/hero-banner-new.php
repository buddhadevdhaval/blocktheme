<?php
/**
 * Title: Hero
 * Slug: ambrygen/heronew
 * Categories: ambrygen
 * Keywords: hero, banner
 * Block Types: ambrygen/hero, core/group
 *
 * @package Ambrygen
 */

defined( 'ABSPATH' ) || exit;
?>
<!-- wp:navigation {"syncNavigation":true,"className":"nav-mega-solutions-parent"} -->
<ul class="wp-block-navigation nav-mega-solutions-parent">
	<!-- wp:navigation-link {"label":"Solutions","url":"#","className":"nav-mega-solutions","kind":"custom","isTopLevelLink":true} -->
	<div class="wp-block-navigation-link nav-mega-solutions">
		<a class="wp-block-navigation-item__content" href="#"><span class="has-link-color wp-block-navigation-item__label">Solutions</span></a>
		
		<!-- wp:navigation {"overlayMenu":"never","layout":{"type":"flex","orientation":"vertical"},"className":"mega-panel mega-panel-solutions"} -->
		<ul class="wp-block-navigation mega-panel mega-panel-solutions">
			<!-- wp:columns {"className":"mega-grid"} -->
			<div class="wp-block-columns mega-grid">
				<!-- wp:column -->
				<div class="wp-block-column">
					<!-- wp:heading {"level":4} -->
					<h4>By Industry</h4>
					<!-- /wp:heading -->

					<!-- wp:navigation-link {"label":"Healthcare","url":"/solutions/healthcare","kind":"custom"} /-->

					<!-- wp:navigation-link {"label":"Education","url":"/solutions/education","kind":"custom"} /-->

					<!-- wp:navigation-link {"label":"Finance","url":"/solutions/finance","kind":"custom"} /-->
				</div>
				<!-- /wp:column -->

				<!-- wp:column -->
				<div class="wp-block-column">
					<!-- wp:image {"linkDestination":"custom","href":"/solutions"} -->
					<figure class="wp-block-image"><img src="https://via.placeholder.com/500x300" alt="Solutions"/></figure>
					<!-- /wp:image -->
				</div>
				<!-- /wp:column -->
			</div>
			<!-- /wp:columns -->
		</ul>
		<!-- /wp:navigation -->
	</div>
	<!-- /wp:navigation-link -->
</ul>
<!-- /wp:navigation -->
