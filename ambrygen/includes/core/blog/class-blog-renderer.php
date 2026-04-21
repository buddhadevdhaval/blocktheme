<?php

namespace Ambrygen\Theme\Core\Blog;

use Ambrygen\Theme\Core\Singleton;
use Ambrygen\Theme\Core\Blocks\BlockVisibilityService;

defined('ABSPATH') || exit;

final class BlogRenderer
{
    use Singleton;

    /**
     * Render blog query block output from a template part for AJAX response.
     */
    public function render_ajax_content(int $paged, int $per_page = 8, string $s = '', int $tag = 0, int $category = 0, int $total_pages = 1, int $total_posts = 0): string
    {
        $template_path = locate_template('parts/blog-posts-grid.html');
        if (!$template_path || !file_exists($template_path)) {
            return '';
        }

        $contents = file_get_contents($template_path);
        if (false === $contents || '' === $contents) {
            return '';
        }

        $blocks = parse_blocks($contents);
        $query_block = $this->find_first_query_block($blocks);
        if (!$query_block) {
            return '';
        }

        if (!isset($query_block['attrs']['query'])) {
            $query_block['attrs']['query'] = [];
        }

        $query_block['attrs']['query']['perPage'] = $per_page;
        $query_block['attrs']['query']['offset'] = 0;

        if (!empty($s)) {
            $query_block['attrs']['query']['search'] = $s;
        }

        if ($tag > 0) {
            $query_block['attrs']['query']['taxQuery'] = [
                'post_tag' => [$tag],
            ];
        }

        if ($category > 0) {
            // If category is set, it might need to merge with taxQuery or use categoryIds
            $query_block['attrs']['query']['categoryIds'] = [$category];
        }

        $query_id = isset($query_block['attrs']['queryId']) ? absint($query_block['attrs']['queryId']) : 0;
        if ($query_id > 0) {
            $_GET['query-' . $query_id . '-page'] = (string) $paged;
        }

        if ($total_posts === 0) {
            return '<p class="no-results-message text-center text-lg-reg">No blog posts found.</p>';
        }

        $html = render_block($query_block);

        if ($query_id > 0) {
            $_GET['query-' . $query_id . '-page'] = null; // Clean up
        }

        return (string) BlockVisibilityService::instance()->replace_blog_pagination_with_dynamic($html, $paged, $total_pages, $per_page);
    }

    /**
     * Render the specific card HTML for Latest Blogs block.
     * This ensures AJAX response matches initial render.
     */
    public function render_latest_blog_content(\WP_Query $query): string
    {
        if (!$query->have_posts()) {
            return '<p class="no-results-message text-center text-lg-reg">No blog posts found.</p>';
        }

        ob_start();
        ?>
        <div class="event-carousel__grid">
            <?php while ($query->have_posts()) : $query->the_post(); 
                $post_id = get_the_ID();
                $thumbnail_id = get_post_thumbnail_id($post_id);
                ?>
                <div class="event-carousel__card">
                    <div class="event-carousel__image-wrap">
                        <a href="<?php the_permalink(); ?>">
                            <?php 
                            echo \Ambrygen\Theme\Core\Helper::image_with_placeholder(
                                $thumbnail_id,
                                'large',
                                array('class' => 'event-carousel__image')
                            ); 
                            ?>
                        </a>
                        <div class="event-carousel__month-info">
                            <span class="event-carousel__month"><?php echo get_the_date('F j, Y', $post_id); ?></span>
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
                            $linked_author_ids = get_post_meta($post_id, 'linked_author', true);
                            if (empty($linked_author_ids)) {
                                $linked_author_ids = [];
                            } elseif (!is_array($linked_author_ids)) {
                                $linked_author_ids = [$linked_author_ids];
                            }

                            $authors_data = [];
                            foreach ($linked_author_ids as $author_id) {
                                if ('author' === get_post_type($author_id)) {
                                    $authors_data[] = [
                                        'name' => get_the_title($author_id),
                                        'avatar_id' => get_post_thumbnail_id($author_id),
                                        'designation' => get_post_meta($author_id, 'designation', true),
                                    ];
                                }
                            }
                            ?>
                            <?php if (!empty($authors_data)) : ?>
                                <div class="event-carousel__author-block">
                                    <div class="event-carousel__author-avatars">
                                        <?php foreach ($authors_data as $author) : ?>
                                            <?php if ($author['avatar_id']) : ?>
                                                <div class="event-carousel__author-avatar">
                                                    <?php echo \Ambrygen\Theme\Core\Helper::image($author['avatar_id'], 'thumbnail'); ?>
                                                </div>
                                            <?php endif; ?>
                                        <?php endforeach; ?>
                                    </div>
                                    <div class="event-carousel__author-name text-small-semibold">
                                        <?php 
                                        $author_names = array_map(function($author) {
                                            $out = esc_html($author['name']);
                                            if (!empty($author['designation'])) {
                                                $out .= ', ' . esc_html($author['designation']);
                                            }
                                            return $out;
                                        }, $authors_data);
                                        echo implode(' | ', $author_names); 
                                        ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </div>

                        <div class="is-style-gl-s16" aria-hidden="true"></div>

                        <div class="event-carousel__content-wrap">
                            <div class="event-carousel__details">
                                <div class="body-s">
                                    <?php echo wp_kses_post(wp_trim_words(get_the_excerpt(), 15)); ?>
                                </div>
                            </div>

                            <div class="event-carousel__description">
                                <?php 
                                $tags = get_the_terms($post_id, 'post_tag');
                                if (!empty($tags) && !is_wp_error($tags)) : ?>
                                    <div class="event-carousel__tags" aria-hidden="true">
                                        <div class="event-carousel__tags lists-item-category">
                                            <?php foreach ($tags as $tag) : ?>
                                                <div class="category-item">
                                                    <a href="<?php echo esc_url(get_term_link($tag)); ?>" class="event-carousel__tag event-carousel__tag--success">
                                                        <div class="event-carousel__tag-dot"></div> <?php echo esc_html($tag->name); ?>
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
            <?php endwhile; ?>
        </div>
        
        <div class="load-more-wrap text-center <?php echo ($query->max_num_pages <= 1) ? 'is-hidden' : ''; ?>">
            <button type="button" class="load-more-btn text-small-semibold" 
                data-total-pages="<?php echo esc_attr($query->max_num_pages); ?>">
                <?php esc_html_e('LOAD MORE', 'ambrygen-web'); ?>
                <span class="load-more-icon"></span>
            </button>
        </div>
        <?php
        wp_reset_postdata();
        return ob_get_clean();
    }

    /**
     * Recursively find the first core/query block in a list of blocks.
     */
    private function find_first_query_block(array $blocks): ?array
    {
        foreach ($blocks as $block) {
            if (!is_array($block)) {
                continue;
            }

            if ('core/query' === ($block['blockName'] ?? '')) {
                return $block;
            }

            if (!empty($block['innerBlocks']) && is_array($block['innerBlocks'])) {
                $found = $this->find_first_query_block($block['innerBlocks']);
                if ($found) {
                    return $found;
                }
            }
        }

        return null;
    }
}
