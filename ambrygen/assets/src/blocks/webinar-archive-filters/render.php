<?php

use Ambrygen\Theme\Core\Helper;

defined('ABSPATH') || exit;

$archive_type = isset($attributes['archiveType']) ? $attributes['archiveType'] : 'upcoming';
$years        = 'past' === $archive_type ? Helper::get_past_webinar_years() : [];
$active_year  = ! empty($years) ? (int) $years[0] : 0;
$tags         = Helper::get_webinar_tags($archive_type);
?>
<div class="wp-block-group category-filter-search">
	<div class="wp-block-group category-filter-search__dropdown">
		<?php if ($archive_type === 'past'): ?>
		<div class="tab-dropdown">
			<button class="dropdown-toggle" id="webinar-dropdown-btn" type="button" aria-expanded="false"
				aria-controls="webinar-dropdown-menu-past"><?php echo $active_year > 0 ? esc_html($active_year) : esc_html__('All Years', 'ambrygen-web'); ?></button>
			<ul id="webinar-dropdown-menu-past" class="dropdown-menu">
				<?php if (! empty($years)) : ?>
					<?php foreach ($years as $year) : ?>
						<li><a href="#"<?php echo (int) $year === $active_year ? ' aria-current="page"' : ''; ?>><?php echo esc_html($year); ?></a></li>
					<?php endforeach; ?>
				<?php else : ?>
					<li><a href="#" aria-current="page"><?php esc_html_e('All Years', 'ambrygen-web'); ?></a></li>
				<?php endif; ?>
			</ul>
		</div>
		<?php endif; ?>
	</div>

	<?php if (! empty($tags)) : ?>
	<div class="wp-block-group category-filter-search__tabs">
		<div class="horizontal-tabs tabs__nav" role="tablist" id="webinar-tabs-<?php echo esc_attr($archive_type); ?>">
			<button type="button" class="tab-button active is-active tabs__tab text-md-Semibold" data-tag-id="0" role="tab" aria-selected="true"><?php esc_html_e('All', 'ambrygen-web'); ?></button>
			<?php foreach ($tags as $tag) : ?>
				<button type="button" class="tab-button tabs__tab text-md-Semibold" data-tag-id="<?php echo esc_attr((string) $tag->term_id); ?>" role="tab" aria-selected="false"><?php echo esc_html($tag->name); ?></button>
			<?php endforeach; ?>
		</div>
	</div>
	<?php endif; ?>

	<div class="wp-block-group category-filter-search__search">
		<form id="category-search-form<?php echo $archive_type === 'past' ? '-past' : ''; ?>-webinar" role="search" method="get" action="/">
			<input type="text" name="s" aria-label="Search for:" placeholder="Search">
			<button class="button" type="submit">Search</button>
		</form>
	</div>
</div>
