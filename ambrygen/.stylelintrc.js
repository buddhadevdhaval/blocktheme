module.exports = {
  extends: ['@wordpress/stylelint-config/scss'],
  rules: {
    'selector-class-pattern': '^[a-z][a-zA-Z0-9-_]*$',
    'no-descending-specificity': null,
    'no-duplicate-selectors': null,
    'max-nesting-depth': null,
  },
};
