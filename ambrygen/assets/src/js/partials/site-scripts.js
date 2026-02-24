// import ResizeObserver from 'resize-observer-polyfill';
// window.ResizeObserver = ResizeObserver;

// import SimpleBar from 'simplebar';
// import 'simplebar/dist/simplebar.css';

// const simpleBars = new Map();

// const initSimpleBar = (context = document) => {
// 	context
// 		.querySelectorAll('.nav__item--mega-menu__wrapper')
// 		.forEach((el) => {
// 			if (!simpleBars.has(el)) {
// 				const instance = new SimpleBar(el, {
// 					autoHide: false,
// 				});
// 				simpleBars.set(el, instance);
// 			}
// 		});
// };

// const recalcSimpleBars = () => {
// 	simpleBars.forEach((instance) => {
// 		instance.recalculate();
// 	});
// };

// const forceRecalc = () => {
// 	setTimeout(() => {
// 		recalcSimpleBars();
// 	}, 60);
// };
// menuToggle.addEventListener('click', () => {
// 	navOverlay.classList.add('open');

// 	initSimpleBar(navOverlay);
// 	forceRecalc();
// });
// navItems.forEach((item) => {
// 	item.addEventListener('mouseenter', () => {
// 		item.classList.add('active');

// 		initSimpleBar(item);
// 		forceRecalc();
// 	});
// });submenuLinks.forEach((link) => {
// 	link.addEventListener('mouseenter', () => {
// 		forceRecalc();
// 	});
// });
