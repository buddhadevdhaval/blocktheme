<?php
defined('ABSPATH') || exit;

$archive_type = isset($attributes['archiveType']) ? $attributes['archiveType'] : 'upcoming';
?>
<div class="pagination-buttons-row">
	<div class="pagination-container">
		<div class="desktop-pages">
			<button id="desktopprev" class="arrow-btn"></button>
			<div id="paginationList-<?php echo esc_attr($archive_type); ?>" class="pagination-list">
				<button class="page-btn active">1</button>
			</div>
			<button id="desktopnext" class="arrow-btn"></button>
		</div>

		<div class="mobile-pagination">
			<button id="prevbtn" class="arrow-btn"></button>
			<button id="pagetrigger-<?php echo esc_attr($archive_type); ?>" class="page-trigger">1/1</button>
			<button id="nextbtn" class="arrow-btn"></button>
		</div>

		<div id="paginationPopup-<?php echo esc_attr($archive_type); ?>" class="pagination-popup">
			<div class="popup-body">
				<div id="popupGrid-<?php echo esc_attr($archive_type); ?>" class="popup-grid">
					<button class="page-btn active">1</button>
				</div>
				<button id="popupPrev" class="arrow-btn"></button>
				<button id="popupNext" class="arrow-btn"></button>
			</div>
		</div>
	</div>
	<div class="tab-dropdown">
		<button class="dropdown-toggle" id="category-dropdown-btn-<?php echo esc_attr($archive_type); ?>-perpage"
			type="button" aria-expanded="false"
			aria-controls="category-dropdown-menu-<?php echo esc_attr($archive_type); ?>-perpage">8 / page</button>
		<ul id="category-dropdown-menu-<?php echo esc_attr($archive_type); ?>-perpage" class="dropdown-menu">
			<li style="animation-delay: 0s;"><a href="#" aria-current="page">8 / page</a></li>
			<li style="animation-delay: 0.1s;"><a href="#">16 / page</a></li>
			<li style="animation-delay: 0.2s;"><a href="#">24 / page</a></li>
		</ul>
	</div>
</div>
