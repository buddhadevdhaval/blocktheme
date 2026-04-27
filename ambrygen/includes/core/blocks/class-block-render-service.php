<?php

namespace Ambrygen\Theme\Core\Blocks;

use Ambrygen\Theme\Core\Conferences\ConferenceQueryService;
use Ambrygen\Theme\Core\Conferences\ConferenceRenderer;
use Ambrygen\Theme\Core\GeneticTesting\GeneticTestingRenderer;
use Ambrygen\Theme\Core\Science\ScienceRenderer;
use Ambrygen\Theme\Core\Webinars\WebinarQueryService;
use Ambrygen\Theme\Core\Webinars\WebinarRenderer;
use Ambrygen\Theme\Core\Singleton;

defined('ABSPATH') || exit;

final class BlockRenderService
{
    use Singleton;

    public function render_conference_linked_posts_tabs(int $post_id): string
    {
        return ConferenceRenderer::instance()->render_linked_posts_tabs($post_id);
    }

    public function render_conference_hero_content(int $post_id): string
    {
        return ConferenceRenderer::instance()->render_hero_content($post_id);
    }

    public function render_conference_overview_agenda(int $post_id): string
    {
        return ConferenceRenderer::instance()->render_overview_agenda($post_id);
    }

    public function render_conference_experts(int $post_id): string
    {
        return ConferenceRenderer::instance()->render_experts($post_id);
    }

    public function render_conference_posters(int $post_id): string
    {
        return ConferenceRenderer::instance()->render_posters($post_id);
    }

    public function render_conference_presentations(int $post_id): string
    {
        return ConferenceRenderer::instance()->render_presentations($post_id);
    }

    public function render_conference_tabs_nav(int $post_id): string
    {
        return ConferenceRenderer::instance()->render_tabs_nav($post_id);
    }

    public function render_event_meta_summary(int $post_id): string
    {
        return ConferenceRenderer::instance()->render_event_meta_summary($post_id);
    }

    public function render_event_grid_card(int $post_id): string
    {
        return ConferenceRenderer::instance()->render_event_grid_card($post_id);
    }

    public function render_webinar_grid_card(int $post_id): string
    {
        return WebinarRenderer::instance()->render_webinar_grid_card($post_id);
    }

    public function render_webinar_meta_summary(int $post_id): string
    {
        return WebinarRenderer::instance()->render_webinar_meta_summary($post_id);
    }

    public function render_social_share(int $post_id): string
    {
        return WebinarRenderer::instance()->render_share_post($post_id);
    }

    public function render_webinar_registration_button(int $post_id, array $attributes = []): string
    {
        return WebinarRenderer::instance()->render_webinar_registration_button($post_id, $attributes);
    }

    public function render_webinar_author_swiper(int $post_id, array $attributes = []): string
    {
        return WebinarRenderer::instance()->render_author_swiper($post_id, $attributes);
    }

    public function render_webinar_additional_info(int $post_id): string
    {
        return WebinarRenderer::instance()->render_webinar_additional_info($post_id);
    }

    public function render_genetic_testing_details(int $post_id): string
    {
        return GeneticTestingRenderer::instance()->render_details($post_id);
    }

    public function render_genetic_testing_genes(int $post_id): string
    {
        return GeneticTestingRenderer::instance()->render_genes_analyzed($post_id);
    }
    
    public function render_genetic_testing_quick_reference(int $post_id): string
    {
        return GeneticTestingRenderer::instance()->render_quick_reference_block($post_id);
    }

    public function render_genetic_testing_description(int $post_id): string
    {
        return GeneticTestingRenderer::instance()->render_post_description($post_id);
    }

    public function render_genetic_testing_downloads(int $post_id): string
    {
        return GeneticTestingRenderer::instance()->render_post_downloads($post_id);
    }

    public function render_presentation_filters(): string
    {
        return ScienceRenderer::instance()->render_presentation_filters();
    }

    public function render_presentation_result_count(): string
    {
        return ScienceRenderer::instance()->render_presentation_result_count();
    }

    public function render_presentation_meta(): string
    {
        return ScienceRenderer::instance()->render_presentation_meta();
    }

    public function render_poster_filters(): string
    {
        return ScienceRenderer::instance()->render_poster_filters();
    }

    public function render_poster_result_count(): string
    {
        return ScienceRenderer::instance()->render_poster_result_count();
    }

    public function render_poster_meta(): string
    {
        return ScienceRenderer::instance()->render_poster_meta();
    }

    public function render_poster_pdf_files(): string
    {
        return ScienceRenderer::instance()->render_poster_pdf_files();
    }

    public function render_publication_filters(): string
    {
        return ScienceRenderer::instance()->render_publication_filters();
    }

    public function render_publication_result_count(): string
    {
        return ScienceRenderer::instance()->render_publication_result_count();
    }

    public function render_publication_meta(): string
    {
        return ScienceRenderer::instance()->render_publication_meta();
    }

    public function has_conference_data(int $post_id): bool
    {
        return ConferenceQueryService::instance()->has_conference_data($post_id);
    }

    public function has_in_progress_posts(string $post_type): bool
    {
        if ('webinar' === $post_type) {
            return WebinarQueryService::instance()->has_in_progress_webinars();
        }

        if ('conferences' === $post_type) {
            return ConferenceQueryService::instance()->has_in_progress_conferences();
        }

        return true;
    }

    public function render_conference_empty_message(): string
    {
        return sprintf(
            '<div class="wp-block-group tabs-content tabs-content--empty">
                <div class="container-1280">
                    <div class="tabs-content__empty-message">
                        <h3 class="tabs-content__empty-title h3-reg">%s</h3>
                        <p class="tabs-content__empty-text body1-reg">%s</p>
                    </div>
                </div>
            </div>',
            esc_html__("We're still working on it", 'ambrygen-web'),
            esc_html__('No registered posters or presentations yet.', 'ambrygen-web')
        );
    }
}
