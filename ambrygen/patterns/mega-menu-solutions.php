<?php
/**
 * Title: Mega Menu Solutions
 * Slug: ambrygen/mega-menu-solutions
 * Categories: ambrygen
 * Keywords: mega menu, navigation, dropdown
 * Block Types: core/navigation-link
 */
?>
<!-- wp:navigation {"syncNavigation":true,"layout":{"type":"flex"},"className":"is-style-mega-menu"} -->
<!-- wp:navigation-link {"label":"Solutions","url":"#","className":"nav-mega-solutions","kind":"custom","isTopLevelLink":true} -->
<div class="wp-block-navigation-link nav-mega-solutions">
    <a class="wp-block-navigation-item__content" href="#"><span class="has-link-color wp-block-navigation-item__label">Solutions</span></a>
    
    <!-- wp:group {"className":"mega-panel mega-panel-solutions","layout":{"type":"constrained"}} -->
    <div class="wp-block-group mega-panel mega-panel-solutions">
        <!-- wp:columns {"className":"mega-grid"} -->
        <div class="wp-block-columns mega-grid">
            <!-- wp:column {"width":"50%"} -->
            <div class="wp-block-column" style="flex-basis:50%">
                <!-- wp:heading {"level":4} -->
                <h4>By Industry</h4>
                <!-- /wp:heading -->
                
                <!-- wp:navigation {"overlayMenu":"never","layout":{"type":"default"}} -->
                <!-- wp:navigation-link {"label":"Healthcare","url":"/solutions/healthcare","kind":"custom"} /-->
                <!-- wp:navigation-link {"label":"Education","url":"/solutions/education","kind":"custom"} /-->
                <!-- wp:navigation-link {"label":"Finance","url":"/solutions/finance","kind":"custom"} /-->
                <!-- /wp:navigation -->
            </div>
            <!-- /wp:column -->
            
            <!-- wp:column {"width":"50%"} -->
            <div class="wp-block-column" style="flex-basis:50%">
                <!-- wp:image {"linkDestination":"custom","href":"/solutions","sizeSlug":"large"} -->
                <figure class="wp-block-image size-large"><img src="https://via.placeholder.com/500x300" alt="Solutions Overview"/></figure>
                <!-- /wp:image -->
            </div>
            <!-- /wp:column -->
        </div>
        <!-- /wp:columns -->
    </div>
    <!-- /wp:group -->
</div>
<!-- /wp:navigation-link -->
<!-- /wp:navigation -->
