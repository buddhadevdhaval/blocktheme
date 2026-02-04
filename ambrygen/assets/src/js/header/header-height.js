/**
 * Adjust body padding based on header height
 */
const adjustBodyPadding = () => {
	const header = document.querySelector('header');
	const adminBar = document.querySelector('#wpadminbar');

	if (header) {
		const height = header.offsetHeight;
		const adminBarHeight = adminBar ? adminBar.offsetHeight : 0;
		const totalHeight = height - adminBarHeight;

		document.body.style.paddingTop = `${totalHeight}px`;
		// Also set a CSS variable just in case
		document.documentElement.style.setProperty('--header-height', `${height}px`);
		document.documentElement.style.setProperty('--admin-bar-height', `${adminBarHeight}px`);
		document.documentElement.style.setProperty('--total-header-height', `${totalHeight}px`);
	}
};

window.addEventListener('load', adjustBodyPadding);
window.addEventListener('resize', adjustBodyPadding);
document.addEventListener('DOMContentLoaded', adjustBodyPadding);