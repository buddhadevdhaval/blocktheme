<?php
/**
 * Genetic Testing Renderer class.
 *
 * @package Ambrygen\Theme\Core\GeneticTesting
 */

namespace Ambrygen\Theme\Core\GeneticTesting;

use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

/**
 * GeneticTestingRenderer class.
 */
final class GeneticTestingRenderer
{
    use Singleton;

    /**
     * Render the main details of a genetic testing post.
     * Includes Intro, When to Consider, and Why Important sections.
     *
     * @param int $post_id The post ID.
     * @return string The rendered HTML.
     */
    public function render_details(int $post_id): string
    {
        if (!$post_id) {
            return '';
        }

        // Retrieve meta fields
        $meta_title             = get_post_meta($post_id, 'meta_title', true);
        $intro                  = get_post_meta($post_id, 'intro', true);
        $consider_title        = get_post_meta($post_id, 'when_to_consider_title', true);
        $consider_content      = get_post_meta($post_id, 'when_to_consider_content', true);
        $important_title       = get_post_meta($post_id, 'why_is_this_important_title', true);
        $important_content     = get_post_meta($post_id, 'why_is_this_important', true);

        ob_start();
        ?>
        <div class="genetic-testing-details">
            <?php if ($meta_title || $intro) : ?>
                <section class="genetic-testing-section genetic-testing-intro">
                    <?php if ($meta_title) : ?>
                        <h2 class="heading-3 text-primary-600 mb-4"><?php echo esc_html($meta_title); ?></h2>
                    <?php endif; ?>
                    <?php if ($intro) : ?>
                        <div class="genetic-testing-content body-regular">
                            <?php echo wp_kses_post(wpautop($intro)); ?>
                        </div>
                    <?php endif; ?>
                </section>
                <div class="is-style-gl-s48" aria-hidden="true"></div>
            <?php endif; ?>

            <?php if ($consider_title || $consider_content) : ?>
                <section class="genetic-testing-section genetic-testing-consider">
                    <?php if ($consider_title) : ?>
                        <h2 class="heading-3 text-primary-600 mb-4"><?php echo esc_html($consider_title); ?></h2>
                    <?php endif; ?>
                    <?php if ($consider_content) : ?>
                        <div class="genetic-testing-content body-regular">
                            <?php echo wp_kses_post(wpautop($consider_content)); ?>
                        </div>
                    <?php endif; ?>
                </section>
                <div class="is-style-gl-s48" aria-hidden="true"></div>
            <?php endif; ?>

            <?php if ($important_title || $important_content) : ?>
                <section class="genetic-testing-section genetic-testing-important">
                    <?php if ($important_title) : ?>
                        <h2 class="heading-3 text-primary-600 mb-4"><?php echo esc_html($important_title); ?></h2>
                    <?php endif; ?>
                    <?php if ($important_content) : ?>
                        <div class="genetic-testing-content body-regular">
                            <?php echo wp_kses_post(wpautop($important_content)); ?>
                        </div>
                    <?php endif; ?>
                </section>
            <?php endif; ?>
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
    public function render_genes_analyzed(int $post_id): string
    {
        $linked_posts = get_post_meta($post_id, 'linked_posts_genetic', true);
        
        if (empty($linked_posts)) {
            return '';
        }

        if (!is_array($linked_posts)) {
            $linked_posts = array($linked_posts);
        }

        // Filter to ensure only product_version posts are processed
        $linked_posts = array_filter($linked_posts, function($id) {
            return get_post_type($id) === 'product_version';
        });

        if (empty($linked_posts)) {
            return '';
        }

        ob_start();
        ?>
        <div class="genetic-testing-genes-analyzed">
            <h2 class="heading-3 text-primary-600 mb-4"><?php esc_html_e('Genes analyzed', 'ambrygen-web'); ?></h2>
            <div class="test-catlouge__items">
                <?php
                foreach ($linked_posts as $linked_post_id) :
                    $linked_post_id = absint($linked_post_id);
                    $post_title     = get_the_title($linked_post_id);
                    $genes          = get_the_terms($linked_post_id, 'gene');
                    $gene_count     = (is_array($genes) && !is_wp_error($genes)) ? count($genes) : 0;

                    if (!$post_title) {
                        continue;
                    }
                    ?>
                    <div class="test-catlouge__item">
                        <div class="test-catlouge__item-main">
                            <div class="test-catlouge__item-top">
                                <div class="subtitle1-sbold mb-0 test-catlouge__item-title">
                                    <?php echo esc_html($post_title); ?>
                                </div>
                                <?php if ($gene_count > 0) : ?>
                                    <div class="text-sm-medium test-catlouge__badge">
                                        <?php printf(esc_html__('%d Genes', 'ambrygen-web'), $gene_count); ?>
                                    </div>
                                <?php endif; ?>
                            </div>

                            <div class="test-catlouge__item-content">
                                <div class="test-catlouge__divider"></div>
                                
                                <?php if ($gene_count > 0) : ?>
                                    <div class="test-catlouge__grid test-catlouge__grid--2col">
                                        <?php foreach ($genes as $gene) : ?>
                                            <div class="test-catlouge__row">
                                                <div class="test-catlouge__gene-name">
                                                    <?php echo esc_html($gene->name); ?>
                                                </div>
                                            </div>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                        </div>

                        <button class="test-catlouge__item-toggle" type="button" aria-expanded="false"
                            aria-label="<?php esc_attr_e('Toggle test details', 'ambrygen-web'); ?>">
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
     * Render the Test Description section.
     *
     * @param int $post_id The post ID.
     * @return string The rendered HTML.
     */
    public function render_post_description(int $post_id): string
    {
        $content = get_post_field('post_content', $post_id);
        if (empty($content)) {
            return '';
        }

        ob_start();
        ?>
        <div class="genetic-testing-description-section">
            <h2 class="heading-3 text-primary-600 mb-4"><?php esc_html_e('Test Description', 'ambrygen-web'); ?></h2>
            <div class="genetic-testing-post-content body1">
                <?php echo apply_filters('the_content', $content); ?>
            </div>
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
    public function render_quick_reference_block(int $post_id): string
    {
        $linked_posts = get_post_meta($post_id, 'linked_posts_genetic', true);
        if (empty($linked_posts)) {
            return '';
        }

        if (!is_array($linked_posts)) {
            $linked_posts = array($linked_posts);
        }

        // Use the first linked product_version
        $product_id = 0;
        foreach ($linked_posts as $id) {
            if (get_post_type($id) === 'product_version') {
                $product_id = absint($id);
                break;
            }
        }

        if (!$product_id) {
            return '';
        }

        $genes = get_the_terms($product_id, 'gene');
        $gene_count = (is_array($genes) && !is_wp_error($genes)) ? count($genes) : 0;

        ob_start();
        ?>
        <h2 class="heading-3 text-primary-600 mb-4"><?php esc_html_e('Quick Reference', 'ambrygen-web'); ?></h2>
        <?php
        $content = $this->render_quick_reference($product_id, $gene_count);
        echo $content;
        return ob_get_clean();
    }

    /**
     * Render the Quick Reference card (internal helper).
     *
     * @param int $product_id The product version post ID.
     * @param int $gene_count Total genes count.
     * @return string The rendered HTML.
     */
    public function render_quick_reference(int $product_id, int $gene_count): string
    {
        // Get Test Code from product_code taxonomy
        $test_codes = get_the_terms($product_id, 'product_code');
        $test_code  = (!is_wp_error($test_codes) && !empty($test_codes)) ? $test_codes[0]->name : '—';

        // Get Turnaround times
        $tat_low  = get_post_meta($product_id, 'turn_around_time_low', true);
        $tat_high = get_post_meta($product_id, 'turn_around_time_high', true);
        $tat_display = ($tat_low && $tat_high) ? "{$tat_low}-{$tat_high} Days" : '—';

        // Get Footnote from featured_description
        $footnote = get_post_meta($product_id, 'featured_description', true);

        ob_start();
        ?>
        <div class="quick-reference-card">
            <div class="quick-reference-card__table">
                <div class="quick-reference-card__row">
                    <span class="quick-reference-card__label body1-sbold"><?php esc_html_e('Test Code', 'ambrygen-web'); ?></span>
                    <span class="quick-reference-card__value body1-sbold"><?php echo esc_html($test_code); ?></span>
                </div>
                <div class="quick-reference-card__row">
                    <span class="quick-reference-card__label body1-sbold"><?php esc_html_e('Reflex code', 'ambrygen-web'); ?></span>
                    <span class="quick-reference-card__value body1-sbold">8783</span>
                </div>
                <div class="quick-reference-card__row">
                    <span class="quick-reference-card__label body1-sbold"><?php esc_html_e('Genes', 'ambrygen-web'); ?></span>
                    <span class="quick-reference-card__value body1-sbold"><?php echo esc_html($gene_count); ?></span>
                </div>
                <div class="quick-reference-card__row">
                    <span class="quick-reference-card__label body1-sbold"><?php esc_html_e('Turnaround', 'ambrygen-web'); ?><sup>[1]</sup></span>
                    <span class="quick-reference-card__value body1-sbold"><?php echo esc_html($tat_display); ?></span>
                </div>
                <div class="quick-reference-card__row">
                    <span class="quick-reference-card__label body1-sbold"><?php esc_html_e('Technology', 'ambrygen-web'); ?></span>
                    <span class="quick-reference-card__value body1-sbold">NGS + Del/Dup</span>
                </div>
                <div class="quick-reference-card__row">
                    <span class="quick-reference-card__label body1-sbold"><?php esc_html_e('Specimen', 'ambrygen-web'); ?></span>
                    <span class="quick-reference-card__value body1-sbold">Blood / Saliva</span>
                </div>
            </div>

            <?php if ($footnote) : ?>
                <div class="quick-reference-card__footnote body2 mt-4">
                    <p><?php esc_html_e('Footnote:', 'ambrygen-web'); ?></p>
                    <p><?php echo wp_kses_post($footnote); ?></p>
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
    public function render_post_downloads(int $post_id): string
    {
        $linked_posts = get_post_meta($post_id, 'linked_posts_genetic', true);
        if (empty($linked_posts)) {
            return '';
        }

        if (!is_array($linked_posts)) {
            $linked_posts = array($linked_posts);
        }

        $downloads = [];
        foreach ($linked_posts as $linked_id) {
            if (get_post_type($linked_id) !== 'marketing_material') {
                continue;
            }

            $files = get_post_meta($linked_id, 'marketing_material_files', true);
            if (empty($files) || !is_array($files)) {
                continue;
            }

            // Find the latest file based on created_at
            $latest_file_id = 0;
            $latest_date = '';
            foreach ($files as $row) {
                $file_id = isset($row['file_id']) ? absint($row['file_id']) : 0;
                if (!$file_id) continue;

                $created_at = isset($row['created_at']) ? $row['created_at'] : '';
                if (!$latest_date || strtotime($created_at) > strtotime($latest_date)) {
                    $latest_date = $created_at;
                    $latest_file_id = $file_id;
                }
            }

            if (!$latest_file_id) continue;

            $file_url = wp_get_attachment_url($latest_file_id);
            if (!$file_url) continue;

            // Get Title and Taxonomy Term
            $post_title = get_the_title($linked_id);
            $terms = get_the_terms($linked_id, 'marketing_material_type');
            $term_name = (is_array($terms) && !is_wp_error($terms) && !empty($terms)) ? $terms[0]->name : '';

            $combined_title = trim($post_title . ' ' . $term_name);

            $downloads[] = [
                'title' => $combined_title,
                'url'   => $file_url
            ];
        }

        if (empty($downloads)) {
            return '';
        }

        ob_start();
        ?>
        <div class="genetic-testing-downloads-section">
            <div class="test-catlouge__item is-downloads-accordion">
                <div class="test-catlouge__item-main">
                    <div class="test-catlouge__item-top">
                        <h2 class="heading-3 text-primary-600 mb-0"><?php esc_html_e('Downloads', 'ambrygen-web'); ?></h2>
                    </div>
                    
                    <div class="test-catlouge__item-content">
                        <div class="test-catlouge__divider"></div>
                        <div class="test-catlouge__list">
                            <?php foreach ($downloads as $download) : ?>
                                <div class="test-catlouge__row">
                                    <div class="test-catlouge__info">
                                        <a href="<?php echo esc_url($download['url']); ?>" target="_blank" rel="noopener" class="body1-sbold">
                                            <?php echo esc_html($download['title']); ?>
                                        </a>
                                    </div>
                                    <div class="test-catlouge__action">
                                        <a href="<?php echo esc_url($download['url']); ?>" target="_blank" rel="noopener">
                                            <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/src/images/download-icon.svg'); ?>" alt="<?php esc_attr_e('Download icon', 'ambrygen-web'); ?>" />
                                        </a>
                                    </div>
                                </div>
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>

                <button class="test-catlouge__item-toggle" type="button" aria-expanded="false"
                    aria-label="<?php esc_attr_e('Toggle downloads', 'ambrygen-web'); ?>">
                    <span class="test-catlouge__icon-cross"></span>
                </button>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
