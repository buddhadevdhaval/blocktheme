/******/ (() => { // webpackBootstrap
/*!************************************************!*\
  !*** ./assets/src/blocks/awards-block/view.js ***!
  \************************************************/
document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('.marquee-slide').forEach(container => {
    const slider = container.querySelector('.marquee-slide__slider');
    const sliderItems = Array.from(container.querySelectorAll('.marquee-slide__item'));
    if (!slider || !sliderItems.length) {
      return;
    }
    const getGap = () => window.innerWidth <= 767 ? 16 : 20;
    const autoSpeed = -3.5;
    const lerp = (v0, v1, t) => v0 * (1 - t) + v1 * t;
    const wrap = (min, max, value) => {
      const range = max - min;
      return ((value - min) % range + range) % range + min;
    };
    let itemWidth = sliderItems[0].clientWidth;
    let gap = getGap();
    let wrapWidth = sliderItems.length * (itemWidth + gap);
    let targetScroll = 0;
    let currentScroll = 0;
    const dispose = scroll => {
      sliderItems.forEach((item, index) => {
        const position = index * (itemWidth + gap) + scroll;
        const wrapped = wrap(-(itemWidth + gap), wrapWidth - (itemWidth + gap), position);
        item.style.transform = `translate3d(${wrapped}px, 0, 0)`;
      });
    };
    const updateMeasurements = () => {
      itemWidth = sliderItems[0].clientWidth;
      gap = getGap();
      wrapWidth = sliderItems.length * (itemWidth + gap);
    };
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio <= 0.45) {
          return;
        }
        entry.target.classList.add('is-visible');
      });
    }, {
      threshold: [0.45]
    });
    const render = () => {
      requestAnimationFrame(render);
      if (!prefersReducedMotion) {
        targetScroll += autoSpeed;
      }
      currentScroll = lerp(currentScroll, targetScroll, 0.06);
      dispose(currentScroll);
    };
    dispose(0);
    window.addEventListener('resize', updateMeasurements);
    sliderItems.forEach(item => observer.observe(item));
    if (prefersReducedMotion || sliderItems.length < 2) {
      return;
    }
    render();
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map