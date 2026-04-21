<?php

namespace Ambrygen\Theme\Core\Blocks;
 
use Ambrygen\Theme\Core\Helper;
use Ambrygen\Theme\Core\Singleton;
 
defined('ABSPATH') || exit;

final class BlockVisibilityService
{
	use Singleton;

	protected function __construct()
	{
		add_filter('render_block', array($this, 'filter_tabs_content'), 10, 2);
		add_filter('render_block', array($this, 'filter_in_progress_visibility'), 10, 2);
		add_filter('render_block', array($this, 'filter_back_link_url'), 10, 2);
		add_filter('render_block_core/post-template', array($this, 'filter_post_template_tags'), 10, 2);

		add_filter('render_block_core/query-pagination-previous', array($this, 'render_archive_pagination_as_buttons'), 10, 2);
		add_filter('render_block_core/query-pagination-next', array($this, 'render_archive_pagination_as_buttons'), 10, 2);
		add_filter('render_block_core/query-pagination-numbers', array($this, 'render_archive_pagination_as_buttons'), 10, 2);
		add_filter('render_block', array($this, 'inject_initial_total_pages'), 10, 2);
		add_filter('render_block', array($this, 'dynamic_year_dropdown_on_render'), 10, 2);
		add_filter('render_block', array($this, 'hide_empty_upcoming_webinars'), 10, 2);
		add_filter('render_block', array($this, 'hide_empty_past_webinars'), 10, 2);
	}

	public function filter_post_template_tags(string $block_content, array $block): string
	{
		if (!isset($block['attrs']['className'])) {
			return $block_content;
		}

		$current_classes = (string) $block['attrs']['className'];
		$target_classes  = array(
			'event-carousel__grid',
			'custom-event-slider',
		);

		$should_unwrap = false;
		foreach ($target_classes as $class) {
			if (strpos($current_classes, $class) !== false) {
				$should_unwrap = true;
				break;
			}
		}

		if ($should_unwrap) {
			$block_content = preg_replace('/<ul([^>]*?)>/is', '<div$1>', $block_content);
			$block_content = str_replace('</ul>', '</div>', $block_content);

			$block_content = preg_replace('/<li([^>]*?)>/is', '<div$1>', $block_content);
			$block_content = str_replace('</li>', '</div>', $block_content);
		}

		return $block_content;
	}

	public function filter_tabs_content(string $block_content, array $block): string
	{
		if (!isset($block['attrs']['className']) || strpos((string) $block['attrs']['className'], 'tabs-content') === false) {
			return $block_content;
		}

		$post_id = get_the_ID();
		if (!$post_id) {
			return $block_content;
		}

		if (!BlockRenderService::instance()->has_conference_data((int) $post_id)) {
			return BlockRenderService::instance()->render_conference_empty_message();
		}

		return $block_content;
	}

	public function filter_in_progress_visibility(string $block_content, array $block): string
	{
		if (!isset($block['attrs']['className'])) {
			return $block_content;
		}

		$class_name = (string) $block['attrs']['className'];
		$post_type = '';

		if (strpos($class_name, 'webinar-in-progress-wrapper') !== false) {
			$post_type = 'webinar';
		} elseif (strpos($class_name, 'conference-in-progress-wrapper') !== false) {
			$post_type = 'conferences';
		}

		if ('' === $post_type) {
			return $block_content;
		}

		if (!BlockRenderService::instance()->has_in_progress_posts($post_type)) {
			return '';
		}

		return $block_content;
	}

	public function filter_back_link_url(string $block_content, array $block): string
	{
		if (!is_singular()) {
			return $block_content;
		}

		$is_back_link_class    = isset($block['attrs']['className']) && strpos((string) $block['attrs']['className'], 'back-link') !== false;
		$is_archive_link_block = isset($block['blockName']) && 'post-type-archive-link' === $block['blockName'];

		if ($is_back_link_class || $is_archive_link_block) {
			$post_type = get_post_type();

			if ($is_archive_link_block && isset($block['attrs']['postType'])) {
				$post_type = $block['attrs']['postType'];
			}

			if ($post_type) {
				$archive_url = get_post_type_archive_link($post_type);
				if ($archive_url) {
					if ($is_back_link_class) {
						return str_replace('href="#"', 'href="' . esc_url($archive_url) . '"', $block_content);
					}

					$label = $block['attrs']['label'] ?? 'Back';
					$class = $block['attrs']['className'] ?? '';
					return sprintf('<a href="%s" class="%s">%s</a>', esc_url($archive_url), esc_attr($class), esc_html($label));
				}
			}
		}

		return $block_content;
	}

	/**
	 * Inject initial total pages count into AJAX pagination containers.
	 *
	 * @param string $block_content The block content.
	 * @param array  $block         The block being rendered.
	 * @return string
	 */
	public function inject_initial_total_pages(string $block_content, array $block): string
	{
		if (
			'core/query' === ($block['blockName'] ?? '')
			&& 'post' === ($block['attrs']['query']['postType'] ?? '')
			&& 13 === absint($block['attrs']['queryId'] ?? 0)
		) {
			$per_page = absint($block['attrs']['query']['perPage'] ?? 8);
			$per_page = $per_page > 0 ? $per_page : 8;

			$temp_query = new \WP_Query(
				array(
					'post_type'      => 'post',
					'posts_per_page' => $per_page,
					'post_status'    => 'publish',
				)
			);
			$total_pages = max(1, (int) $temp_query->max_num_pages);

			return $this->replace_blog_pagination_with_dynamic(
				$block_content,
				1,
				$total_pages,
				$per_page
			);
		}

		// Only target core/html blocks because our container is currently inside one
		if ('core/html' !== ($block['blockName'] ?? '')) {
			return $block_content;
		}

		if (!str_contains($block_content, 'ambrygen-ajax-pagination')) {
			return $block_content;
		}

		// Extract post type if present
		$post_type = 'conferences';
		if (preg_match('/data-ambrygen-post-type=["\']([^"\']+)["\']/', $block_content, $pt_matches)) {
			$post_type = $pt_matches[1];
		}

		// Extract scope
		if (!preg_match('/data-ambrygen-scope=["\']([^"\']+)["\']/', $block_content, $matches)) {
			return $block_content;
		}

		$scope    = $matches[1];
		$per_page = 8; // Default
		$today    = date('Y-m-d');

		$query_args = array(
			'post_type'      => $post_type,
			'posts_per_page' => $per_page,
			'post_status'    => 'publish',
		);

		if ('post' === $post_type && 'blog' === $scope) {
			$year = 0;
		} elseif ($scope === 'upcoming') {
			if ($post_type === 'webinar') {
				$query_args['meta_query'] = array(
					array(
						'key'     => 'start_at',
						'value'   => $today,
						'compare' => '>=',
						'type'    => 'DATE',
					),
				);
			} else {
				$query_args['meta_query'] = array(
					array(
						'key'     => 'start_at',
						'value'   => $today,
						'compare' => '>',
						'type'    => 'DATE',
					),
				);
			}
		} elseif ($scope === 'past') {
			if ($post_type === 'webinar') {
				$query_args['meta_query'] = array(
					array(
						'key'     => 'start_at',
						'value'   => $today,
						'compare' => '<',
						'type'    => 'DATE',
					),
				);
				// Default year for past webinars
				$years = Helper::get_past_webinar_years();
				if (!empty($years)) {
					$query_args['meta_query'][] = array(
						'key'     => 'start_at',
						'value'   => array($years[0] . '-01-01', $years[0] . '-12-31'),
						'compare' => 'BETWEEN',
						'type'    => 'DATE',
					);
				}
			} else {
				$query_args['meta_query'] = array(
					'relation' => 'AND',
					array(
						'key'     => 'end_at',
						'value'   => $today,
						'compare' => '<',
						'type'    => 'DATE',
					),
				);

				// Default year for past
				$years = Helper::get_past_conference_years();
				if (!empty($years)) {
					$query_args['meta_query'][] = array(
						'key'     => 'end_at',
						'value'   => array($years[0] . '-01-01', $years[0] . '-12-31'),
						'compare' => 'BETWEEN',
						'type'    => 'DATE',
					);
				}
			}
		} else {
			return $block_content;
		}

		if ('post' === $post_type && 'blog' === $scope) {
			$temp_query  = new \WP_Query($query_args);
			$total_pages = max(1, (int) $temp_query->max_num_pages);

			$block_content = $this->replace_blog_pagination_with_dynamic(
				$block_content,
				1,
				$total_pages,
				$per_page
			);

			$block_content = preg_replace(
				'/(class="[^"]*\bambrygen-ajax-pagination\b[^"]*")/',
				'$1 data-ambrygen-total-pages="' . $total_pages . '"',
				$block_content
			);

			return $block_content;
		}

		$year = 0;
		if ('past' === $scope) {
			$years = ('webinar' === $post_type) ? Helper::get_past_webinar_years() : Helper::get_past_conference_years();
			if (!empty($years)) {
				$year = (int) $years[0];
				
				// Apply the year filter to the query args so the total pages count matches the results
				$date_key = ('webinar' === $post_type) ? 'start_at' : 'end_at';
				$query_args['meta_query'][] = array(
					'key'     => $date_key,
					'value'   => array($year . '-01-01', $year . '-12-31'),
					'compare' => 'BETWEEN',
					'type'    => 'DATE',
				);
			}
		}

		$temp_query  = new \WP_Query($query_args);
		$total_pages = max(1, (int) $temp_query->max_num_pages);
		$total_posts = (int) $temp_query->found_posts;

		// Initial render should match the same dynamic pagination used by AJAX.
		$block_content = $this->replace_static_pagination_with_dynamic(
			$block_content,
			1,
			$total_pages,
			$per_page,
			$scope,
			$total_posts,
			$year,
			0,
			$post_type
		);

		// Inject the total pages attribute safely using regex
		$block_content = preg_replace(
			'/(class="[^"]*\bambrygen-ajax-pagination\b[^"]*")/',
			'$1 data-ambrygen-total-pages="' . $total_pages . '"',
			$block_content
		);

		return $block_content;
	}

	/**
	 * Replace static blog pagination with dynamic.
	 */
	public function replace_blog_pagination_with_dynamic(string $html, int $paged, int $total_pages, int $per_page): string
	{
		// Blog template uses '-blog' suffix
		$suffix = '-blog';

		$total_pages = max(1, $total_pages);
		$page_trigger_text = sprintf('%d/%d', $paged, $total_pages);

		// Replace trigger text
		$html = preg_replace(
			'/(<button[^>]*id="pagetrigger' . preg_quote($suffix, '/') . '"[^>]*>).*?(<\/button>)/is',
			'$1' . $page_trigger_text . '$2',
			$html
		);

		// Replace list
		$pagination_list_html = $this->generate_pagination_list_html($paged, $total_pages);
		$html = preg_replace(
			'/(<div[^>]*id="paginationList' . preg_quote($suffix, '/') . '"[^>]*>).*?(<\/div>)/is',
			'$1' . $pagination_list_html . '$2',
			$html
		);

		// Replace popup grid
		$popup_grid_html = $this->generate_popup_grid_html($paged, $total_pages);
		$html = preg_replace(
			'/(<div[^>]*id="popupGrid' . preg_quote($suffix, '/') . '"[^>]*>).*?(<\/div>)/is',
			'$1' . $popup_grid_html . '$2',
			$html
		);

		return $this->update_per_page_dropdown($html, $per_page, '-blog');
	}

	/**
	 * Replace static pagination with dynamic buttons.
	 */
	public function replace_static_pagination_with_dynamic(string $html, int $paged, int $total_pages, int $per_page, string $scope, int $total_posts, int $year = 0, int $tag = 0, string $post_type = 'conferences'): string
	{
		$suffix = 'past' === $scope ? '-past' : '-upcoming';

		$pagination_list_html = $this->generate_pagination_list_html($paged, $total_pages);
		if (str_contains($html, 'id="paginationList' . $suffix . '"')) {
			$html = preg_replace(
				'/(<div[^>]*id="paginationList' . preg_quote($suffix, '/') . '"[^>]*>).*?(<\/div>)/is',
				'$1' . $pagination_list_html . '$2',
				$html
			);
		}

		$page_trigger_text = sprintf('%d/%d', $paged, max(1, $total_pages));
		if (str_contains($html, 'id="pagetrigger' . $suffix . '"')) {
			$html = preg_replace(
				'/(<button[^>]*id="pagetrigger' . preg_quote($suffix, '/') . '"[^>]*>).*?(<\/button>)/is',
				'$1' . $page_trigger_text . '$2',
				$html
			);
		}

		$popup_grid_html = $this->generate_popup_grid_html($paged, $total_pages);
		if (str_contains($html, 'id="popupGrid' . $suffix . '"')) {
			$html = preg_replace(
				'/(<div[^>]*id="popupGrid' . preg_quote($suffix, '/') . '"[^>]*>).*?(<\/div>)/is',
				'$1' . $popup_grid_html . '$2',
				$html
			);
		}

		return $this->update_per_page_dropdown($html, $per_page, $suffix);
	}

	private function generate_pagination_list_html(int $paged, int $total_pages): string
	{
		if ($total_pages <= 1) {
			return '<button type="button" class="page-btn is-active active">1</button>';
		}

		$html      = '';
		$range     = 1;
		$show_dots = false;

		for ($i = 1; $i <= $total_pages; $i++) {
			if ($i == 1 || $i == $total_pages || ($i >= $paged - $range && $i <= $paged + $range)) {
				$active     = ($i == $paged) ? ' is-active active' : '';
				$html      .= sprintf(
					'<button type="button" class="page-btn%s" data-ambrygen-page="%d">%d</button>',
					$active,
					$i,
					$i
				);
				$show_dots  = true;
			} elseif ($show_dots) {
				$html      .= '<span class="dots">...</span>';
				$show_dots  = false;
			}
		}

		return $html;
	}

	private function generate_popup_grid_html(int $paged, int $total_pages): string
	{
		$html = '';
		for ($i = 1; $i <= max(1, $total_pages); $i++) {
			$active  = ($i == $paged) ? ' is-active active' : '';
			$html   .= sprintf(
				'<button type="button" class="page-btn%s" data-ambrygen-page="%d">%d</button>',
				$active,
				$i,
				$i
			);
		}
		return $html;
	}

	public function render_archive_pagination_as_buttons(string $block_content, array $block): string
	{
		if (
			!is_post_type_archive('poster')
			&& !is_post_type_archive('publication')
			&& !is_post_type_archive('presentation')
			&& !is_post_type_archive('press-releases')
		) {
			return $block_content;
		}

		$block_content = preg_replace_callback(
			'/<a\s+([^>]*?)href="([^"]+)"([^>]*)>(.*?)<\/a>/is',
			static function (array $matches): string {
				$before_href = trim($matches[1]);
				$url         = esc_url($matches[2]);
				$after_href  = trim($matches[3]);
				$label       = $matches[4];

				$attributes = trim($before_href . ' ' . $after_href);
				$attributes = preg_replace('/\s+aria-current="[^"]*"/i', '', (string) $attributes);
				$attributes = preg_replace('/\s+rel="[^"]*"/i', '', (string) $attributes);
				$is_arrow   = false !== stripos((string) $attributes, 'pagination__nav');
				$attributes = Helper::append_class_to_html_attributes((string) $attributes, $is_arrow ? 'arrow-btn' : 'page-btn');
				if ($is_arrow) {
					if (false !== stripos((string) $attributes, 'pagination__nav--prev')) {
						$attributes = Helper::append_attribute_to_html_attributes((string) $attributes, 'id', 'desktopprev');
					} elseif (false !== stripos((string) $attributes, 'pagination__nav--next')) {
						$attributes = Helper::append_attribute_to_html_attributes((string) $attributes, 'id', 'desktopnext');
					}
				}
				$attributes = trim((string) $attributes);

				return sprintf(
					'<button type="button"%s data-pagination-url="%s">%s</button>',
					'' !== $attributes ? ' ' . $attributes : '',
					esc_attr($url),
					$label
				);
			},
			$block_content
		);

		$block_content = preg_replace_callback(
			'/<span\s+([^>]*class="[^"]*\bpage-numbers\b[^"]*\bcurrent\b[^"]*"[^>]*)>(.*?)<\/span>/is',
			static function (array $matches): string {
				$attributes = Helper::append_class_to_html_attributes(trim((string) $matches[1]), 'page-btn');
				$attributes = Helper::append_class_to_html_attributes((string) $attributes, 'active');
				$label      = $matches[2];

				return sprintf(
					'<button type="button" disabled aria-current="page" %s>%s</button>',
					$attributes,
					$label
				);
			},
			$block_content
		);

		return $block_content;
	}

	private function update_per_page_dropdown(string $html, int $per_page, string $suffix): string
	{
		// Update toggle text - replace only the button interior using \K
		$toggle_id      = 'category-dropdown-btn' . $suffix . '-perpage';
		$toggle_pattern = '/(<button[^>]*id="' . preg_quote($toggle_id, '/') . '"[^>]*>)\K.*?(?=<\/button>)/is';

		$html = preg_replace(
			$toggle_pattern,
			(int) $per_page . ' / page',
			$html
		);

		// Update active state in menu (hardcoded options per user request)
		$options      = array(8, 16, 24);
		$menu_id      = 'category-dropdown-menu' . $suffix . '-perpage';
		$menu_pattern = '/(<ul[^>]*id="' . preg_quote($menu_id, '/') . '"[^>]*>)(.*?)(<\/ul>)/is';

		if (preg_match($menu_pattern, $html, $matches)) {
			$menu_content = $matches[2];

			// Remove existing aria-current="page"
			$menu_content = preg_replace('/\s*aria-current="page"/i', '', $menu_content);

			foreach ($options as $opt) {
				if ((int) $opt === (int) $per_page) {
					// Add aria-current="page" to the correct option link
					$opt_link_pattern = '/<a([^>]*)>(' . preg_quote((string) $opt, '/') . '\s*\/\s*page)<\/a>/is';
					$menu_content     = preg_replace($opt_link_pattern, '<a$1 aria-current="page">$2</a>', $menu_content);
				}
			}

			$html = str_replace($matches[2], $menu_content, $html);
		}

		return $html;
	}

	/**
	 * Dynamically update the year dropdown in the block content on initial load.
	 */
	public function dynamic_year_dropdown_on_render(string $block_content, array $block): string
	{
		// Identify the past conferences section by its dropdown ID
		if (strpos($block_content, 'id="category-dropdown-menu-past"') !== false) {
			$block_content = $this->update_year_dropdown($block_content, 0, 'conferences');
		}

		if (strpos($block_content, 'id="conference-tabs-upcoming"') !== false) {
			$block_content = $this->update_tabs($block_content, 'upcoming', 0, 'conferences');
		}

		if (strpos($block_content, 'id="conference-tabs-past"') !== false) {
			$block_content = $this->update_tabs($block_content, 'past', 0, 'conferences');
		}

		// Webinar sections
		if (strpos($block_content, 'id="webinar-dropdown-menu-past"') !== false) {
			$block_content = $this->update_year_dropdown($block_content, 0, 'webinar');
		}

		if (strpos($block_content, 'id="webinar-tabs-upcoming"') !== false) {
			$block_content = $this->update_tabs($block_content, 'upcoming', 0, 'webinar');
		}

		if (strpos($block_content, 'id="webinar-tabs-past"') !== false) {
			$block_content = $this->update_tabs($block_content, 'past', 0, 'webinar');
		}

		return $block_content;
	}

	/**
	 * Update the year dropdown in the HTML.
	 */
	private function update_year_dropdown(string $html, int $year, string $post_type = 'conferences'): string
	{
		$years = ('webinar' === $post_type) ? Helper::get_past_webinar_years() : Helper::get_past_conference_years();

		if ($year === 0 && !empty($years)) {
			$year = $years[0]; // Default to most recent
		}

		// 1. Update toggle button text
		$toggle_id = ('webinar' === $post_type) ? 'webinar-dropdown-btn' : 'category-dropdown-btn';
		$html      = preg_replace(
			'/(<button[^>]*id="' . preg_quote($toggle_id, '/') . '"[^>]*>)\K.*?(?=<\/button>)/is',
			(int) $year,
			$html
		);

		// 2. Generate and replace the menu items
		$menu_id    = ('webinar' === $post_type) ? 'webinar-dropdown-menu-past' : 'category-dropdown-menu-past';
		$items_html = '';
		foreach ($years as $index => $y) {
			$current     = ($year === $y) ? ' aria-current="page"' : '';
			$items_html .= sprintf(
				'<li><a href="#"%s>%d</a></li>',
				$current,
				$y
			);
		}

		$html = preg_replace(
			'/(<ul[^>]*id="' . preg_quote($menu_id, '/') . '"[^>]*>)\K.*?(?=<\/ul>)/is',
			$items_html,
			$html
		);

		return $html;
	}

	/**
	 * Update the tags tabs in the HTML.
	 */
	private function update_tabs(string $html, string $scope, int $current_tag_id = 0, string $post_type = 'conferences'): string
	{
		$tags = ('webinar' === $post_type) ? Helper::get_webinar_tags($scope) : Helper::get_conference_tags($scope);
		$id   = ('webinar' === $post_type) ? 'webinar-tabs-' . $scope : 'conference-tabs-' . $scope;

		// If no tags are found for webinars, remove the entire tabs container
		if (empty($tags) && 'webinar' === $post_type) {
			// Find and remove the parent group with class 'category-filter-search__tabs' containing this specific ID
			$html = preg_replace(
				'/(<!--\s*wp:group\s*\{"className":"category-filter-search__tabs"[^>]*-->\s*<div[^>]*class="[^"]*category-filter-search__tabs"[^>]*>.*?<div[^>]*id="' . preg_quote($id, '/') . '"[^>]*>.*?<\/div>.*?<\/div>\s*<!--\s*\/wp:group\s*-->)/is',
				'',
				$html
			);
			// Also fallback clean in case the comments are missing
			$html = preg_replace(
				'/(<div[^>]*class="[^"]*category-filter-search__tabs"[^>]*>.*?<div[^>]*id="' . preg_quote($id, '/') . '"[^>]*>.*?<\/div>.*?<\/div>)/is',
				'',
				$html
			);
			return $html;
		}

		$tabs_html = '<div class="horizontal-tabs tabs__nav" role="tablist" id="' . $id . '">';

		// "All" tab
		$active_class = (0 === $current_tag_id) ? ' is-active active' : '';
		$tabs_html  .= sprintf(
			'<button type="button" class="tabs__tab text-md-Semibold tab-button%s" data-tag-id="0" role="tab">%s</button>',
			$active_class,
			esc_html__('All', 'ambrygen-web')
		);

		foreach ($tags as $tag) {
			$active_class = ($current_tag_id === (int) $tag->term_id) ? ' is-active' : '';
			$tabs_html  .= sprintf(
				'<button type="button" class="tabs__tab text-md-Semibold tab-button%s" data-tag-id="%d" role="tab">%s</button>',
				$active_class,
				(int) $tag->term_id,
				esc_html($tag->name)
			);
		}

		$tabs_html .= '</div>';

		$html = preg_replace(
			'/(<div[^>]*id="' . preg_quote($id, '/') . '"[^>]*>).*?(<\/div>)/is',
			$tabs_html,
			$html
		);

		return $html;
	}

	/**
	 * Hide the upcoming webinars section if no upcoming webinars exist.
	 *
	 * @param string $block_content
	 * @param array $block
	 * @return string
	 */
	public function hide_empty_upcoming_webinars(string $block_content, array $block): string
	{
		$is_target = false;
		if (isset($block['attrs']['className']) && strpos((string) $block['attrs']['className'], 'upcoming-webinars-wrapper') !== false) {
			$is_target = true;
		} elseif (isset($block['attrs']['slug']) && $block['attrs']['slug'] === 'upcoming-webinars') {
			$is_target = true;
		}

		if (!$is_target) {
			return $block_content;
		}

		$upcoming = Helper::get_tagged_post_ids_for_scope('webinar', 'upcoming');
		if (empty($upcoming)) {
			return '';
		}

		return $block_content;
	}

	/**
	 * Hide the past webinars section if no past webinars exist.
	 *
	 * @param string $block_content
	 * @param array $block
	 * @return string
	 */
	public function hide_empty_past_webinars(string $block_content, array $block): string
	{
		$is_target = false;
		if (isset($block['attrs']['className']) && strpos((string) $block['attrs']['className'], 'past-webinars-wrapper') !== false) {
			$is_target = true;
		} elseif (isset($block['attrs']['slug']) && $block['attrs']['slug'] === 'past-webinars') {
			$is_target = true;
		}

		if (!$is_target) {
			return $block_content;
		}

		$past = Helper::get_tagged_post_ids_for_scope('webinar', 'past');
		if (empty($past)) {
			return '';
		}

		return $block_content;
	}
}
