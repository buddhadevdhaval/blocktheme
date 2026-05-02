/******/ (() => { // webpackBootstrap
/*!*************************************************!*\
  !*** ./assets/src/blocks/faq-accordion/view.js ***!
  \*************************************************/
const ACCORDION_EXPAND_DURATION = 350;
const ACCORDION_COLLAPSE_DURATION = 425;
const ACCORDION_EASING = 'cubic-bezier(0.4, 0, 0.2, 1)';
const initAccordionItem = accordion => {
  if (!accordion) {
    return;
  }
  const summary = accordion.querySelector('summary');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!summary) {
    return;
  }
  let animation = null;
  let isClosing = false;
  let isExpanding = false;
  summary.setAttribute('aria-expanded', accordion.open ? 'true' : 'false');
  const onAnimationFinish = open => {
    accordion.open = open;
    animation = null;
    isClosing = false;
    isExpanding = false;
    accordion.style.height = '';
    accordion.style.overflow = '';
    summary.setAttribute('aria-expanded', open ? 'true' : 'false');
  };
  const shrink = () => {
    isClosing = true;
    const startHeight = `${accordion.offsetHeight}px`;
    const endHeight = `${summary.offsetHeight}px`;
    if (animation) {
      animation.cancel();
    }
    accordion.style.overflow = 'hidden';
    animation = accordion.animate({
      height: [startHeight, endHeight]
    }, {
      duration: ACCORDION_COLLAPSE_DURATION,
      easing: ACCORDION_EASING
    });
    animation.onfinish = () => onAnimationFinish(false);
    animation.oncancel = () => {
      isClosing = false;
    };
  };
  const expand = () => {
    isExpanding = true;
    const startHeight = `${accordion.offsetHeight}px`;
    accordion.open = true;
    summary.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => {
      const endHeight = `${accordion.scrollHeight}px`;
      if (animation) {
        animation.cancel();
      }
      accordion.style.overflow = 'hidden';
      animation = accordion.animate({
        height: [startHeight, endHeight]
      }, {
        duration: ACCORDION_EXPAND_DURATION,
        easing: ACCORDION_EASING
      });
      animation.onfinish = () => onAnimationFinish(true);
      animation.oncancel = () => {
        isExpanding = false;
      };
    });
  };
  summary.addEventListener('click', e => {
    e.preventDefault();
    if (prefersReducedMotion) {
      accordion.open = !accordion.open;
      summary.setAttribute('aria-expanded', accordion.open ? 'true' : 'false');
      return;
    }
    if (isClosing || !accordion.open) {
      expand();
    } else if (isExpanding || accordion.open) {
      shrink();
    }
  });
};
document.addEventListener('DOMContentLoaded', () => {
  const blocks = document.querySelectorAll('.wp-block-ambrygen-faq-accordion');
  blocks.forEach(block => {
    block.querySelectorAll('.faq__item').forEach(accordion => initAccordionItem(accordion));
  });
});
/******/ })()
;
//# sourceMappingURL=view.js.map