<?php
/**
 * Genetic Testing Renderer class.
 *
 * @package Ambrygen\Theme\Core\GeneticTesting
 */

namespace Ambrygen\Theme\Core\GeneticTesting;

use Ambrygen\Theme\Core\Helper;
use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

/**
 * GeneticTestingRenderer class.
 */
final class GeneticTestingRenderer
{
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
    private function resolve_genetic_testing_post_id(int $post_id): int
    {
        if ($post_id > 0 && 'genetic-testing' === get_post_type($post_id)) {
            return $post_id;
        }

        $queried_post_id = get_queried_object_id();
        if ($queried_post_id > 0 && 'genetic-testing' === get_post_type($queried_post_id)) {
            return (int) $queried_post_id;
        }

        $is_editor = wp_is_json_request() || (defined('REST_REQUEST') && REST_REQUEST);
        if (! $is_editor) {
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

        if (empty($sample_posts)) {
            return 0;
        }

        return (int) $sample_posts[0];
    }

    /**
     * Check whether the current render is happening in editor preview context.
     *
     * @return bool
     */
    private function is_editor_preview(): bool
    {
        return wp_is_json_request() || (defined('REST_REQUEST') && REST_REQUEST);
    }

    /**
     * Render spacer markup that matches Gutenberg Spacer block output.
     *
     * @param string $height Spacer height, e.g. `24px`.
     * @param string $class_name Optional spacer utility class.
     * @return string
     */
    private function render_spacer(string $height, string $class_name = ''): string
    {
        $attributes = array(
            'height' => $height,
        );

        if ('' !== $class_name) {
            $attributes['className'] = $class_name;
        }

        $comment = sprintf(
            '<!-- wp:spacer %s -->',
            wp_json_encode($attributes)
        );

        $classes = trim('wp-block-spacer ' . $class_name);

        return $comment
            . sprintf(
                '<div style="height:%1$s" aria-hidden="true" class="%2$s"></div>',
                esc_attr($height),
                esc_attr($classes)
            )
            . '<!-- /wp:spacer -->';
    }

    /**
     * Render the Hero section for genetic testing.
     *
     * @param int $post_id The post ID.
     * @return string The rendered HTML.
     */
    public function render_hero(int $post_id): string
    {
        $post_id = $this->resolve_genetic_testing_post_id($post_id);

        if (!$post_id) {
            return '';
        }

        $title = get_the_title($post_id);
        $intro = get_post_meta($post_id, 'intro', true);
        
        // Get category if available (placeholder for now)
        $categories = get_the_terms($post_id, 'poster_category'); 
        $category_name = (is_array($categories) && !is_wp_error($categories) && !empty($categories)) ? $categories[0]->name : '';

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
                            <div class="eyebrow cardio-detail__category"><?php echo esc_html($category_name); ?></div>
                            <a href="#" class="cardio-detail__back text-small-semibold">
                                <?php esc_html_e('Back To Full Menu', 'ambrygen-web'); ?>
                            </a>
                        </div>
                        <?php echo $this->render_spacer('16px', 'is-style-gl-s16'); ?>
                        <h2 class="heading-2 block-title mb-0 cardio-detail__title"><?php echo esc_html($title); ?></h2>
                        <?php echo $this->render_spacer('16px', 'is-style-gl-s16'); ?>
                        <?php if ($intro) : ?>
                            <div class="cardio-detail__description text-md-regular">
                                <?php echo wp_kses_post($intro); ?>
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
    public function render_details(int $post_id): string
    {
        $post_id = $this->resolve_genetic_testing_post_id($post_id);

        if (!$post_id) {
            return '';
        }

        // Retrieve meta fields
        $important_title       = get_post_meta($post_id, 'why_is_this_important_title', true);
        $important_content     = get_post_meta($post_id, 'why_is_this_important', true);
        $consider_title        = get_post_meta($post_id, 'when_to_consider_title', true);
        $consider_content      = get_post_meta($post_id, 'when_to_consider_content', true);

        ob_start();
        ?>
        <?php if ($important_title || $important_content) : ?>
            <?php if ($important_title) : ?>
                <h5><?php echo esc_html($important_title); ?></h5>
            <?php endif; ?>
            <?php if ($important_content) : ?>
                <div class="body1">
                    <?php echo wp_kses_post(wpautop($important_content)); ?>
                </div>
            <?php endif; ?>
            <div class="is-style-gl-s36" aria-hidden="true"></div>
        <?php endif; ?>

        <?php if ($consider_title || $consider_content) : ?>
            <?php if ($consider_title) : ?>
                <h5><?php echo esc_html($consider_title); ?></h5>
            <?php endif; ?>
            <?php if ($consider_content) : ?>
                <div class="body1">
                    <?php echo wp_kses_post(wpautop($consider_content)); ?>
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
    public function render_product_stats(int $post_id): string
    {
        $post_id = $this->resolve_genetic_testing_post_id($post_id);
        $is_editor = $this->is_editor_preview();

        if (!$post_id) {
            return '';
        }

        $title   = get_post_meta($post_id, 'product_stats_title', true);
        $rows    = get_post_meta($post_id, 'product_stats_repeater', true);
        $footer  = get_post_meta($post_id, 'product_stats_footer', true);

        if (empty($rows)) {
            return $is_editor ? $this->render_product_stats_placeholder() : '';
        }

        ob_start();
        ?>
        <div class="cardio-info__stats-block">
            <?php if ($title) : ?>
                <h5 class="heading-5 block-title mb-0"><?php echo esc_html($title); ?></h5>
            <?php endif; ?>
            <?php echo $this->render_spacer('24px', 'is-style-gl-s24'); ?>
            <div class="cardio-info__stats">
                <?php foreach ($rows as $row) : ?>
                    <div class="cardio-info__stat-card">
                        <div class="cardio-info__stat-value"><?php echo esc_html($row['title'] ?? ''); ?></div>
                        <div class="cardio-info__stat-label"><?php echo esc_html($row['subtitle'] ?? ''); ?></div>
                        <?php echo $this->render_spacer('6px', 'is-style-gl-s6'); ?>
                        <div class="cardio-info__stat-desc">
                            <?php echo esc_html($row['description'] ?? ''); ?><span>*</span>
                        </div>
                        <?php if (!empty($row['sub_description'])) : ?>
                            <div class="caption-regular cardio-info__stat-source">
                                <span>*</span><?php echo esc_html($row['sub_description']); ?>
                            </div>
                        <?php endif; ?>
                    </div>
                <?php endforeach; ?>
            </div>
            <?php if ($footer) : ?>
                <?php echo $this->render_spacer('24px', 'is-style-gl-s24'); ?>
                <div class="body1 cardio-info__stat-footer">
                    <?php echo wp_kses_post($footer); ?>
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
    private function render_product_stats_placeholder(): string
    {
        ob_start();
        ?>
        <div class="cardio-info__stats-block">
            <h5 class="heading-5 block-title mb-0"><?php esc_html_e('Product Stats Preview', 'ambrygen-web'); ?></h5>
            <?php echo $this->render_spacer('24px', 'is-style-gl-s24'); ?>
            <div class="cardio-info__stats">
                <div class="cardio-info__stat-card">
                    <div class="cardio-info__stat-value">96%</div>
                    <div class="cardio-info__stat-label"><?php esc_html_e('Sensitivity', 'ambrygen-web'); ?></div>
                    <?php echo $this->render_spacer('6px', 'is-style-gl-s6'); ?>
                    <div class="cardio-info__stat-desc"><?php esc_html_e('Add linked product stats to preview live values.', 'ambrygen-web'); ?></div>
                </div>
                <div class="cardio-info__stat-card">
                    <div class="cardio-info__stat-value">24</div>
                    <div class="cardio-info__stat-label"><?php esc_html_e('Genes', 'ambrygen-web'); ?></div>
                    <?php echo $this->render_spacer('6px', 'is-style-gl-s6'); ?>
                    <div class="cardio-info__stat-desc"><?php esc_html_e('Editor placeholder shown until product stats data is connected.', 'ambrygen-web'); ?></div>
                </div>
            </div>
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
        $post_id = $this->resolve_genetic_testing_post_id($post_id);
        $is_editor = $this->is_editor_preview();

        if (!$post_id) {
            return '';
        }

        $linked_posts = get_post_meta($post_id, 'linked_posts_genetic', true);
        
        if (empty($linked_posts)) {
            return $is_editor ? $this->render_genes_analyzed_placeholder() : '';
        }

        if (!is_array($linked_posts)) {
            $linked_posts = array($linked_posts);
        }

        $marketing_material_groups = array();

        foreach ($linked_posts as $linked_post_id) {
            $linked_post_id = absint($linked_post_id);

            if ('marketing_material' !== get_post_type($linked_post_id)) {
                continue;
            }

            $post_title = get_the_title($linked_post_id);
            if (!$post_title) {
                continue;
            }

            $terms      = get_the_terms($linked_post_id, 'marketing_material_type');
            $group_name = (is_array($terms) && !is_wp_error($terms) && !empty($terms))
                ? (string) $terms[0]->name
                : (string) __('Marketing Materials', 'ambrygen-web');

            if (!isset($marketing_material_groups[$group_name])) {
                $marketing_material_groups[$group_name] = array();
            }

            $marketing_material_groups[$group_name][] = array(
                'id'    => $linked_post_id,
                'title' => $post_title,
            );
        }

        if (empty($marketing_material_groups)) {
            return $is_editor ? $this->render_genes_analyzed_placeholder() : '';
        }

        $renderable_groups = array();

        foreach ($marketing_material_groups as $group_name => $materials) {
            $material_rows = array();

            foreach ($materials as $material) {
                $rendered_row = Helper::render_marketing_material_item(
                    (int) $material['id'],
                    (string) $material['title']
                );

                if ('' !== trim($rendered_row)) {
                    $material_rows[] = $rendered_row;
                }
            }

            if (!empty($material_rows)) {
                $renderable_groups[$group_name] = $material_rows;
            }
        }

        if (empty($renderable_groups)) {
            return '';
        }

        ob_start();
        ?>
        <div class="genetic-testing-analyzed">
            <h5 class="heading-5 block-title mb-0"><?php esc_html_e('Genes analyzed', 'ambrygen-web'); ?></h5>
            <?php echo $this->render_spacer('24px', 'is-style-gl-s24'); ?>
            
            <div class="test-catlouge__items">
                <?php
                foreach ($renderable_groups as $group_name => $material_rows) :
                ?>
                    <div class="test-catlouge__item">
                        <div class="test-catlouge__item-main">
                            <div class="test-catlouge__item-top">
                                <div class="subtitle1-sbold mb-0 test-catlouge__item-title">
                                    <?php echo esc_html($group_name); ?>
                                </div>
                            </div>

                            <div class="test-catlouge__item-content">
                                <div class="test-catlouge__divider"></div>

                                <div class="test-catlouge__grid">
                                    <?php
                                    foreach ($material_rows as $material_row) {
                                        echo $material_row; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
                                    }
                                    ?>
                                </div>
                            </div>
                        </div>

                        <button class="test-catlouge__item-toggle" type="button" aria-expanded="false"
                            aria-label="<?php echo esc_attr($group_name); ?>">
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
    private function render_genes_analyzed_placeholder(): string
    {
        ob_start();
        ?>
        <div class="genetic-testing-analyzed">
            <h5 class="heading-5 block-title mb-0"><?php esc_html_e('Genes analyzed', 'ambrygen-web'); ?></h5>
            <?php echo $this->render_spacer('24px', 'is-style-gl-s24'); ?>

            <div class="test-catlouge__items">
                <div class="test-catlouge__item">
                    <div class="test-catlouge__item-main">
                        <div class="test-catlouge__item-top">
                            <div class="subtitle1-sbold mb-0 test-catlouge__item-title">
                                <?php esc_html_e('Sample Gene Panel', 'ambrygen-web'); ?>
                            </div>
                            <div class="text-sm-medium test-catlouge__badge">
                                <?php esc_html_e('4 Genes', 'ambrygen-web'); ?>
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
                        aria-label="<?php esc_attr_e('Toggle test details', 'ambrygen-web'); ?>">
                        <span class="test-catlouge__icon-cross"></span>
                    </button>
                </div>
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
        $post_id = $this->resolve_genetic_testing_post_id($post_id);

        if (!$post_id) {
            return '';
        }

        $content = get_post_field('post_content', $post_id);
        if (empty($content)) {
            return '';
        }

        ob_start();
        ?>
        <h5><?php esc_html_e('Test Description', 'ambrygen-web'); ?></h5>
        <div class="genetic-testing-post-content body1">
            <?php echo apply_filters('the_content', $content); ?>
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
        $post_id = $this->resolve_genetic_testing_post_id($post_id);
        $is_editor = $this->is_editor_preview();

        if (!$post_id) {
            return $is_editor ? $this->render_quick_reference_placeholder() : '';
        }

        $linked_posts = get_post_meta($post_id, 'linked_posts_genetic', true);
        if (empty($linked_posts)) {
            return $is_editor ? $this->render_quick_reference_placeholder() : '';
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
            return $is_editor ? $this->render_quick_reference_placeholder() : '';
        }

        $genes = get_the_terms($product_id, 'gene');
        $gene_count = (is_array($genes) && !is_wp_error($genes)) ? count($genes) : 0;

        ob_start();
        ?>
        <div class="sidebar-widget reference-table">
            <div class="sidebar-widget__title subtitle2-medium"><?php esc_html_e('Quick Reference', 'ambrygen-web'); ?></div>
            <?php
            $content = $this->render_quick_reference($product_id, $gene_count);
            echo $content;
            ?>
        </div>
        <?php
        return ob_get_clean();
    }

    /**
     * Render an editor-only placeholder for the quick reference block when
     * linked product data is not available for preview.
     *
     * @return string
     */
    private function render_quick_reference_placeholder(): string
    {
        ob_start();
        ?>
        <div class="sidebar-widget reference-table">
            <div class="sidebar-widget__title subtitle2-medium"><?php esc_html_e('Quick Reference', 'ambrygen-web'); ?></div>
            <div class="reference-table__card">
                <div class="reference-table__row">
                    <div class="text-sm-bold"><?php esc_html_e('Test Code', 'ambrygen-web'); ?></div>
                    <div class="text-sm-bold">1234</div>
                </div>
                <div class="reference-table__row">
                    <div class="text-sm-bold"><?php esc_html_e('Reflex code', 'ambrygen-web'); ?></div>
                    <div class="text-sm-bold">8783</div>
                </div>
                <div class="reference-table__row">
                    <div class="text-sm-bold"><?php esc_html_e('Genes', 'ambrygen-web'); ?></div>
                    <div class="text-sm-bold">24</div>
                </div>
                <div class="reference-table__row">
                    <div class="text-sm-bold"><?php esc_html_e('Turnaround', 'ambrygen-web'); ?><sup>[1]</sup></div>
                    <div class="text-sm-bold"><?php esc_html_e('10-21 Days', 'ambrygen-web'); ?></div>
                </div>
                <div class="reference-table__row">
                    <div class="text-sm-bold"><?php esc_html_e('Technology', 'ambrygen-web'); ?></div>
                    <div class="text-sm-bold">NGS + Del/Dup</div>
                </div>
                <div class="reference-table__row">
                    <div class="text-sm-bold"><?php esc_html_e('Specimen', 'ambrygen-web'); ?></div>
                    <div class="text-sm-bold"><?php esc_html_e('Blood / Saliva', 'ambrygen-web'); ?></div>
                </div>
            </div>
            <?php echo $this->render_spacer('12px', 'is-style-gl-s12'); ?>
            <div class="text-small reference-table__footnote">
                <div class="reference-table__footnote--title"><?php esc_html_e('Preview:', 'ambrygen-web'); ?></div>
                <?php esc_html_e('Link a product_version post to show the live quick reference data here.', 'ambrygen-web'); ?>
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
        $tat_display = ($tat_low && $tat_high) ? "{$tat_low}–{$tat_high} Days" : '—';

        // Get Footnote from featured_description
        $footnote = get_post_meta($product_id, 'featured_description', true);

        ob_start();
        ?>
        <div class="reference-table__card">
            <div class="reference-table__row">
                <div class="text-sm-bold"><?php esc_html_e('Test Code', 'ambrygen-web'); ?></div>
                <div class="text-sm-bold"><?php echo esc_html($test_code); ?></div>
            </div>
            <div class="reference-table__row">
                <div class="text-sm-bold"><?php esc_html_e('Reflex code', 'ambrygen-web'); ?></div>
                <div class="text-sm-bold">8783</div>
            </div>
            <div class="reference-table__row">
                <div class="text-sm-bold"><?php esc_html_e('Genes', 'ambrygen-web'); ?></div>
                <div class="text-sm-bold"><?php echo esc_html($gene_count); ?></div>
            </div>
            <div class="reference-table__row">
                <div class="text-sm-bold"><?php esc_html_e('Turnaround', 'ambrygen-web'); ?><sup>[1]</sup></div>
                <div class="text-sm-bold"><?php echo esc_html($tat_display); ?></div>
            </div>
            <!-- <div class="reference-table__row">
                <div class="text-sm-bold"><?php //esc_html_e('Technology', 'ambrygen-web'); ?></div>
                <div class="text-sm-bold">NGS + Del/Dup</div>
            </div>
            <div class="reference-table__row">
                <div class="text-sm-bold"><?php //esc_html_e('Specimen', 'ambrygen-web'); ?></div>
                <div class="text-sm-bold">Blood / Saliva</div>
            </div> -->
        </div>

        <?php if ( ! empty( $footnote ) ) : ?>
            <?php echo $this->render_spacer('12px', 'is-style-gl-s12'); ?>
            <div class="text-small reference-table__footnote">
                <div class="reference-table__footnote--title"><?php esc_html_e('Footnote:', 'ambrygen-web'); ?></div>
                <?php echo wp_kses_post( $footnote ); ?>
            </div>
        <?php endif; ?>
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
        $post_id = $this->resolve_genetic_testing_post_id($post_id);
        $is_editor = $this->is_editor_preview();

        if (!$post_id) {
            return $is_editor ? $this->render_post_downloads_placeholder() : '';
        }

        $linked_posts = get_post_meta($post_id, 'linked_posts_genetic', true);
        if (empty($linked_posts)) {
            return $is_editor ? $this->render_post_downloads_placeholder() : '';
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
            return $is_editor ? $this->render_post_downloads_placeholder() : '';
        }

        ob_start();
        ?>
        <div class="sidebar-widget genetic-testing-downloads">
            <div class="sidebar-widget__title subtitle2-medium"><?php esc_html_e('Downloads', 'ambrygen-web'); ?></div>
            <div class="genetic-testing-downloads__list">
                <?php foreach ($downloads as $download) : ?>
                    <div class="genetic-testing-downloads__item">
                        <a href="<?php echo esc_url($download['url']); ?>" target="_blank" rel="noopener" class="genetic-testing-downloads__link text-sm-bold">
                            <?php echo esc_html($download['title']); ?>
                        </a>
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
    private function render_post_downloads_placeholder(): string
    {
        ob_start();
        ?>
        <div class="sidebar-widget genetic-testing-downloads">
            <div class="sidebar-widget__title subtitle2-medium"><?php esc_html_e('Downloads', 'ambrygen-web'); ?></div>
            <div class="genetic-testing-downloads__list">
                <div class="genetic-testing-downloads__item">
                    <span class="genetic-testing-downloads__link text-sm-bold">
                        <?php esc_html_e('Sample test requisition form', 'ambrygen-web'); ?>
                    </span>
                </div>
                <div class="genetic-testing-downloads__item">
                    <span class="genetic-testing-downloads__link text-sm-bold">
                        <?php esc_html_e('Sample patient brochure', 'ambrygen-web'); ?>
                    </span>
                </div>
            </div>
            <?php echo $this->render_spacer('12px', 'is-style-gl-s12'); ?>
            <div class="text-small reference-table__footnote">
                <div class="reference-table__footnote--title"><?php esc_html_e('Preview:', 'ambrygen-web'); ?></div>
                <?php esc_html_e('Link marketing material files to show the live downloads list here.', 'ambrygen-web'); ?>
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
    public function render_related_tests(int $post_id): string
    {
        $post_id = $this->resolve_genetic_testing_post_id($post_id);
        $is_editor = $this->is_editor_preview();

        if (!$post_id) {
            return $is_editor ? $this->render_related_tests_placeholder() : '';
        }

        $categories = get_the_terms($post_id, 'poster_category');
        if (empty($categories) || is_wp_error($categories)) {
            return $is_editor ? $this->render_related_tests_placeholder() : '';
        }

        // Get the main category (first one)
        $main_category = $categories[0];
        $category_name = $main_category->name;

        // Query related posts
        $args = array(
            'post_type'      => 'genetic-testing',
            'posts_per_page' => 3,
            'post__not_in'   => array($post_id),
            'tax_query'      => array(
                array(
                    'taxonomy' => 'poster_category',
                    'field'    => 'term_id',
                    'terms'    => $main_category->term_id,
                ),
            ),
        );

        $related_query = new \WP_Query($args);
        if (!$related_query->have_posts()) {
            return $is_editor ? $this->render_related_tests_placeholder($category_name) : '';
        }

        ob_start();
        ?>
        <div class="sidebar-widget related-tests">
            <div class="sidebar-widget__title subtitle2-medium">
                <?php printf(esc_html__('Related %s Tests', 'ambrygen-web'), esc_html($category_name)); ?>
            </div>
            <div class="related-tests__list">
                <?php
                while ($related_query->have_posts()) :
                    $related_query->the_post();
                    $rel_id = get_the_ID();
                    
                    // Get sub-category or label (Comprehensive etc)
                    $rel_cats = get_the_terms($rel_id, 'poster_category');
                    $sub_label = '';
                    if (!empty($rel_cats) && !is_wp_error($rel_cats)) {
                        foreach ($rel_cats as $cat) {
                            if ($cat->term_id !== $main_category->term_id) {
                                $sub_label = $cat->name;
                                break;
                            }
                        }
                        // Fallback to first if only one
                        if (empty($sub_label)) {
                            $sub_label = $rel_cats[0]->name;
                        }
                    }

                    // Get gene count from linked product_version
                    $gene_count = 0;
                    $linked_posts = get_post_meta($rel_id, 'linked_posts_genetic', true);
                    if (!empty($linked_posts)) {
                        if (!is_array($linked_posts)) {
                            $linked_posts = array($linked_posts);
                        }
                        foreach ($linked_posts as $linked_id) {
                            if (get_post_type($linked_id) === 'product_version') {
                                $genes = get_the_terms($linked_id, 'gene');
                                if (!is_wp_error($genes) && !empty($genes)) {
                                    $gene_count = count($genes);
                                }
                                break;
                            }
                        }
                    }
                    ?>
                    <a href="<?php the_permalink(); ?>" class="related-tests__item">
                        <?php if ($sub_label) : ?>
                            <div class="related-tests__category body2-semibold"><?php echo esc_html($sub_label); ?></div>
                        <?php endif; ?>
                        <div class="related-tests__info">
                            <div class="related-tests__name subtitle2-sbold"><?php the_title(); ?></div>
                            <?php if ($gene_count > 0) : ?>
                                <div class="text-xs-regular related-tests__meta"><?php printf(esc_html__('%d Genes', 'ambrygen-web'), $gene_count); ?></div>
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
    private function render_related_tests_placeholder(string $category_name = ''): string
    {
        $title_suffix = '' !== $category_name ? $category_name : __('Genetic Testing', 'ambrygen-web');

        ob_start();
        ?>
        <div class="sidebar-widget related-tests">
            <div class="sidebar-widget__title subtitle2-medium">
                <?php printf(esc_html__('Related %s Tests', 'ambrygen-web'), esc_html($title_suffix)); ?>
            </div>
            <div class="related-tests__list">
                <div class="related-tests__item">
                    <div class="related-tests__category body2-semibold"><?php esc_html_e('Comprehensive', 'ambrygen-web'); ?></div>
                    <div class="related-tests__info">
                        <div class="related-tests__name subtitle2-sbold"><?php esc_html_e('Sample Related Test One', 'ambrygen-web'); ?></div>
                        <div class="text-xs-regular related-tests__meta"><?php esc_html_e('18 Genes', 'ambrygen-web'); ?></div>
                    </div>
                </div>
                <div class="related-tests__item">
                    <div class="related-tests__category body2-semibold"><?php esc_html_e('Targeted', 'ambrygen-web'); ?></div>
                    <div class="related-tests__info">
                        <div class="related-tests__name subtitle2-sbold"><?php esc_html_e('Sample Related Test Two', 'ambrygen-web'); ?></div>
                        <div class="text-xs-regular related-tests__meta"><?php esc_html_e('8 Genes', 'ambrygen-web'); ?></div>
                    </div>
                </div>
            </div>
            <?php echo $this->render_spacer('12px', 'is-style-gl-s12'); ?>
            <div class="text-small reference-table__footnote">
                <div class="reference-table__footnote--title"><?php esc_html_e('Preview:', 'ambrygen-web'); ?></div>
                <?php esc_html_e('Assign related genetic testing posts in the same category to show live related tests here.', 'ambrygen-web'); ?>
            </div>
        </div>
        <?php
        return ob_get_clean();
    }
}
