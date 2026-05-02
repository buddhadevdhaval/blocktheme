<?php
/**
 * Render: Blog Hero Block
 *
 * Full hero section for blog posts.
 *
 * @package Ambrygen
 */

use Ambrygen\Theme\Core\Helper;
use Ambrygen\Theme\Core\Blog\BlogRenderer;

defined( 'ABSPATH' ) || exit;

$post_id         = get_the_ID();
$media_type      = get_post_meta( $post_id, 'media_type', true ) ?: 'image';
$video_source    = get_post_meta( $post_id, 'video_type', true ) ?: 'embed';
$video_url       = get_post_meta( $post_id, 'iframe_url', true ) ?: '';
$video_file_id   = get_post_meta( $post_id, 'video_url', true ) ?: 0;
$poster_meta_id  = get_post_meta( $post_id, 'poster_image_id', true ) ?: 0;

if ( ! $post_id ) {
	return;
}

// Restrict to 'post' post type only.
if ( get_post_type( $post_id ) !== 'post' ) {
	return;
}

$title = get_the_title( $post_id );
$date  = get_the_date( 'F j, Y', $post_id );
$tags  = get_the_terms( $post_id, 'post_tag' );

// Image selection logic
$featured_img_id = get_post_thumbnail_id( $post_id );

if ( 'image' === $media_type ) {
    // In image mode, always prefer Featured Image
    $poster_id = $featured_img_id ?: $poster_meta_id;
} else {
    // In video mode, always prefer Poster Meta
    $poster_id = $poster_meta_id ?: $featured_img_id;
}

$poster_url = $poster_id ? wp_get_attachment_image_url( $poster_id, 'full' ) : AMBRYGEN_DEFAULT_IMAGE;

// Author info using BlogRenderer (handles webinar_authors repeater and linked_author fallbacks with overrides)
$authors_data = BlogRenderer::instance()->get_post_authors_data( $post_id );
?>

<section class="container-1280 bg-primary_25">
    <div class="is-style-gl-s50" aria-hidden="true"></div>
    <div class="wrapper">
        <div class="blog-detail-hero blog-featured">
            <div class="blog-detail-hero__overlay blog-detail-hero__overlay--bottom">
                <img decoding="async" src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/shape-element-two.svg' ) ); ?>" class="" loading="lazy" alt="shape-element-two" width="1024" height="1024">
            </div>

            <!-- Left: Media Column -->
            <div class="blog-featured__image-col">
                <?php if ( 'video' === $media_type ) : 
                    $iframe_src      = ( 'embed' === $video_source ) ? Helper::get_iframe_src( $video_url ) : '';
                    $final_video_url = ( 'mp4' === $video_source ) ? wp_get_attachment_url( $video_file_id ) : $iframe_src;
                    $video_type_attr = ( 'mp4' === $video_source ) ? 'mp4' : 'embed';
                    
                    if ( $final_video_url ) :
                    ?>
                    <!-- video -->
                    <div class="media_video js-gsap-fade open_video_popup" 
                        data-video-src="<?php echo esc_url( $final_video_url ); ?>" 
                        data-video-type="<?php echo esc_attr( $video_type_attr ); ?>" 
                        role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false" 
                        aria-label="<?php echo esc_attr( sprintf( __( 'Play video: %s', 'ambrygen-web' ), $title ) ); ?>"
                    >
                        <?php if ( $poster_id ) : ?>
                            <div class="videos__cards-item-thumbnail">
                                <?php echo Helper::image( $poster_id, 'large', array( 'class' => 'videos__cards-item-thumbnail-img', 'alt' => $title ) ); ?>
                            </div>
                        <?php endif; ?>

                        <?php if ( 'embed' === $video_source ) : ?>
                            <div class="features-media__video-wrapper--iframe">
                                <iframe src="<?php echo esc_url( $final_video_url ); ?>" 
                                    title="<?php echo esc_attr( $title ); ?>" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowfullscreen="" class="features-media__iframe" tabindex="-1" aria-hidden="true"></iframe>
                                <div class="play-icon-video">
                                    <div class="play-icon circle-icon">
                                        <img decoding="async" src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/play-icon.svg' ) ); ?>" class="play-icon__img" alt="">
                                    </div>
                                    <div class="pause-icon circle-icon">
                                        <img decoding="async" src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/pause-icon.svg' ) ); ?>" class="pause-icon__img" alt="">
                                    </div>
                                </div>
                            </div>
                        <?php else : ?>
                            <div class="features-media__video-wrapper">
                                <video class="videos" playsinline preload="metadata" <?php echo $poster_url ? 'poster="' . esc_url( $poster_url ) . '"' : ''; ?> aria-hidden="true" tabindex="-1">
                                    <source src="<?php echo esc_url( $final_video_url ); ?>" type="video/mp4">
                                    <?php esc_html_e( 'Your browser does not support the video tag.', 'ambrygen-web' ); ?>
                                </video>
                                <div class="play-icon-video">
                                    <div class="play-icon circle-icon">
                                        <img decoding="async" src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/play-icon.svg' ) ); ?>" class="play-icon__img" alt="">
                                    </div>
                                    <div class="pause-icon circle-icon">
                                        <img decoding="async" src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/pause-icon.svg' ) ); ?>" class="pause-icon__img" alt="">
                                    </div>
                                </div>
                            </div>
                        <?php endif; ?>
                    </div>
                    <?php endif; ?>
                <?php else : ?>
                    <?php if ( $poster_url ) : ?>
                    <div class="blog-featured__image-link" aria-label="<?php echo esc_attr( sprintf( __( 'Read: %s', 'ambrygen-web' ), $title ) ); ?>">
                        <img class="blog-featured__image" src="<?php echo esc_url( $poster_url ); ?>" alt="<?php echo esc_attr( $title ); ?>" width="900" height="600" loading="eager">
                    </div>
                    <?php endif; ?>
                <?php endif; ?>
            </div>

            <!-- Right: Content Column -->
            <div class="blog-featured__content-col">

                <div class="blog-detail-hero__back mobile-only">
                    <a href="<?php echo esc_url( home_url( '/blog/' ) ); ?>" class="back-button" aria-label="<?php esc_attr_e( 'Back to Blog', 'ambrygen-web' ); ?>" title="<?php esc_attr_e( 'Back to Blog', 'ambrygen-web' ); ?>">
                        <?php esc_html_e( 'Back to Blog', 'ambrygen-web' ); ?>
                    </a>
                </div>

                <?php if ( $tags && ! is_wp_error( $tags ) ) : ?>
                <div class="blog-featured__category">
                    <?php foreach ( $tags as $tag ) : ?>
                        <a href="<?php echo esc_url( get_term_link( $tag ) ); ?>" class="blog-featured__category__item"><?php echo esc_html( $tag->name ); ?></a>
                    <?php endforeach; ?>
                </div>
                <?php endif; ?>

                <div class="is-style-gl-s16" aria-hidden="true"></div>

                <h2 class="heading-2 block-title mb-0">
                    <?php echo wp_kses_post( $title ); ?>
                </h2>

                <div class="is-style-gl-s16" aria-hidden="true"></div>

                <div class="post-info">
                    <?php if ( ! empty( $authors_data ) ) : ?>
                        <div class="blog-featured__author-block">
                            <?php 
                            // Display first author's avatar (respects override)
                            $first_author = $authors_data[0];
                            if ( ! empty( $first_author['avatar_id'] ) ) : ?>
                                <?php echo Helper::image( $first_author['avatar_id'], 'thumbnail', array( 'class' => 'blog-featured__author-avatar', 'width' => 40, 'height' => 40 ) ); ?>
                            <?php else: ?>
                                <img class="blog-featured__author-avatar" src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/icn_user_profile.svg' ) ); ?>" alt="" width="40" height="40" />
                            <?php endif; ?>
                            <div class="blog-featured__author-info">
                                <span class="blog-featured__author-name">
                                    <?php 
                                    // Combine names and designations (respects overrides)
                                    $author_names = array_map( function( $author ) {
                                        $out = esc_html( $author['name'] );
                                        if ( ! empty( $author['designation'] ) ) {
                                            $out .= ', ' . esc_html( $author['designation'] );
                                        }
                                        return $out;
                                    }, $authors_data );
                                    echo implode( ', ', $author_names );
                                    ?>
                                </span>
                            </div>
                        </div>
                    <?php endif; ?>

                    <div class="blog-featured__meta flag-details">
                        <div class="blog-featured__date flag-info flag-date-info">
                            <span class="blog-featured__meta-list-icon flag-icon"></span>
                            <span><?php echo esc_html( $date ); ?></span>
                        </div>
                    </div>
                </div>

                <div class="is-style-gl-s16" aria-hidden="true"></div>

                <div class="blog-detail-hero__bottom-row">
                    <div class="blog-detail-hero__share">
                        <span class="blog-detail-hero__share-label text-md-regular"><?php esc_html_e( 'Share:', 'ambrygen-web' ); ?></span>

                        <div class="blog-detail-hero__share-icons share-post__icons">
                            <?php
                            $share_url   = urlencode( get_permalink() );
                            $share_title = urlencode( get_the_title() );
                            ?>
                            <a href="https://www.facebook.com/sharer/sharer.php?u=<?php echo $share_url; ?>" target="_blank" rel="noopener noreferrer" class="share-post__icon share-post__facebook" aria-label="<?php esc_attr_e( 'Share on Facebook', 'ambrygen-web' ); ?>" title="<?php esc_attr_e( 'Share on Facebook', 'ambrygen-web' ); ?>">
                                <img src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/social-icons/facebook-icon.svg' ) ); ?>">
                            </a>
                            <a href="https://x.com/intent/tweet?url=<?php echo $share_url; ?>&text=<?php echo $share_title; ?>" target="_blank" rel="noopener noreferrer" class="share-post__icon share-post__twitter" aria-label="<?php esc_attr_e( 'Share on Twitter', 'ambrygen-web' ); ?>" title="<?php esc_attr_e( 'Share on Twitter', 'ambrygen-web' ); ?>">
                                <img src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/social-icons/twitter-icon.svg' ) ); ?>">
                            </a>
                            <a href="https://www.linkedin.com/shareArticle?mini=true&url=<?php echo $share_url; ?>&title=<?php echo $share_title; ?>" target="_blank" rel="noopener noreferrer" class="share-post__icon share-post__linkedin" aria-label="<?php esc_attr_e( 'Share on LinkedIn', 'ambrygen-web' ); ?>" title="<?php esc_attr_e( 'Share on LinkedIn', 'ambrygen-web' ); ?>">
                                <img src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/social-icons/linkedin-icon.svg' ) ); ?>">
                            </a>
                        </div>
                    </div>

                    <div class="blog-detail-hero__back desktop-only">
                        <a href="<?php echo get_post_type_archive_link( 'post' ); ?>" class="back-button" aria-label="<?php esc_attr_e( 'Back to Blog', 'ambrygen-web' ); ?>" title="<?php esc_attr_e( 'Back to Blog', 'ambrygen-web' ); ?>">
                            <?php esc_html_e( 'Back to Blog', 'ambrygen-web' ); ?>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="is-style-gl-s50" aria-hidden="true"></div>
</section>

<?php
$modal_id     = 'video-modal-' . wp_unique_id();
$container_id = $modal_id . '-container';
$title_id     = $modal_id . '-title';
$desc_id      = $modal_id . '-description';
?>
<div
    class="modal-popup modal-popup--video blog-hero-video-modal"
    id="<?php echo esc_attr( $modal_id ); ?>"
    data-video-modal
    aria-hidden="true"
>
    <div class="modal-popup__overlay"></div>
    <div
        class="modal-popup__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="<?php echo esc_attr( $title_id ); ?>"
        aria-describedby="<?php echo esc_attr( $desc_id ); ?>"
    >
        <button type="button" class="modal-popup__close" aria-label="<?php esc_attr_e( 'Close modal', 'ambrygen-web' ); ?>">
            <img decoding="async" src="<?php echo esc_url( get_theme_file_uri( 'assets/src/images/close-icon.svg' ) ); ?>" alt="" />
        </button>
        <div class="modal-content">
            <div
                id="<?php echo esc_attr( $container_id ); ?>"
                class="modal-content__video-wrapper"
                data-video-modal-container
            >
            </div>
        </div>
    </div>
</div>
