/******/ (() => { // webpackBootstrap
/*!*****************************************************************!*\
  !*** ./assets/src/blocks/multiple-image-alongside-text/view.js ***!
  \*****************************************************************/
const SELECTOR = '.multiple-image-alongside-text__stats';
const NUMBER_SELECTOR = '.multiple-image-alongside-text__stats--count';
const DURATION = 1500;
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const getNumericValue = text => {
  const numericText = text.replace(/[^0-9.]/g, '');
  const value = parseFloat(numericText);
  return Number.isNaN(value) ? null : value;
};
const formatValue = (value, originalText) => {
  const decimalPart = originalText.match(/\.(\d+)/)?.[1] || '';
  const decimalPlaces = decimalPart.length;
  return decimalPlaces ? value.toLocaleString(undefined, {
    maximumFractionDigits: decimalPlaces,
    minimumFractionDigits: decimalPlaces
  }) : Math.floor(value).toLocaleString();
};
const animateCounter = element => {
  if (element.dataset.counterAnimated === 'true') {
    return;
  }
  const originalText = element.textContent.trim();
  const finalValue = getNumericValue(originalText);
  if (null === finalValue) {
    return;
  }
  element.dataset.counterAnimated = 'true';
  if (prefersReducedMotion()) {
    element.textContent = originalText;
    return;
  }
  const startTime = performance.now();
  const update = timestamp => {
    const progress = Math.min((timestamp - startTime) / DURATION, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = finalValue * easedProgress;
    const formattedValue = formatValue(currentValue, originalText);
    if (element.textContent !== formattedValue) {
      element.textContent = formattedValue;
    }
    if (progress < 1) {
      requestAnimationFrame(update);
      return;
    }
    if (element.textContent !== originalText) {
      element.textContent = originalText;
    }
  };
  requestAnimationFrame(update);
};
document.addEventListener('DOMContentLoaded', () => {
  const statsGroups = document.querySelectorAll(SELECTOR);
  if (!statsGroups.length) {
    return;
  }
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) {
        return;
      }
      entry.target.querySelectorAll(NUMBER_SELECTOR).forEach((element, index) => {
        setTimeout(() => animateCounter(element), index * 150);
      });
      observer.unobserve(entry.target);
    });
  }, {
    threshold: 0.5
  });
  statsGroups.forEach(statsGroup => observer.observe(statsGroup));
});
/******/ })()
;
//# sourceMappingURL=view.js.map