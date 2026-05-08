<?php
defined('ABSPATH') || exit;

$archive_type = isset($attributes['archiveType']) ? $attributes['archiveType'] : 'upcoming';
?>
<div class="wp-block-group category-filter-search">
	<div class="wp-block-group category-filter-search__dropdown">
		<?php if ($archive_type === 'past'): ?>
		<div class="tab-dropdown">
			<button class="dropdown-toggle" id="category-dropdown-btn" type="button" aria-expanded="false"
				aria-controls="category-dropdown-menu-past">2025</button>
			<ul id="category-dropdown-menu-past" class="dropdown-menu">
				<li><a href="#" aria-current="page">2025</a></li>
				<li><a href="#">2026</a></li>
			</ul>
		</div>
		<?php endif; ?>
	</div>

	<div class="wp-block-group category-filter-search__tabs">
		<div class="horizontal-tabs tabs__nav <?php echo $archive_type === 'past' ? 'sdsd' : ''; ?>" role="tablist" id="conference-tabs-<?php echo esc_attr($archive_type); ?>">
			<button type="button" class="tab-button active is-active tabs__tab text-md-Semibold" data-tag-id="0" role="tab" aria-selected="true">All</button>
		</div>
	</div>

	<div class="wp-block-group category-filter-search__search">
		<form id="category-search-form<?php echo $archive_type === 'past' ? '-past' : ''; ?>" role="search" method="get" action="/">
			<input type="text" name="s" aria-label="Search for:" placeholder="Search">
			<button class="button" type="submit">Search</button>
		</form>
	</div>
</div>
