document.addEventListener('DOMContentLoaded', () => {
	if (window.innerWidth < 1200) return;

	document.querySelectorAll('.nav__item--mega-menu').forEach(megaMenu => {
		const catItems = megaMenu.querySelectorAll('.submenu-inner-link');
		const submenus = megaMenu.querySelectorAll('.category-submenu-lists');

		if (!catItems.length || !submenus.length) return;

		catItems[0]?.classList.add('hover-active');
		submenus[0]?.classList.add('submenu-active');

		catItems.forEach((item, index) => {
			item.addEventListener('mouseenter', () => {
				catItems.forEach(i => i.classList.remove('hover-active'));
				submenus.forEach(s => s.classList.remove('submenu-active'));

				item.classList.add('hover-active');
				submenus[index]?.classList.add('submenu-active');
			});
		});
	});
});
