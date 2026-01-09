module.exports = {
	root: true,
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [ 'plugin:@wordpress/eslint-plugin/recommended' ],
	settings: {
		'import/core-modules': [
			'@wordpress/block-editor',
			'@wordpress/blocks',
			'@wordpress/components',
			'@wordpress/element',
			'@wordpress/i18n',
			'@wordpress/data',
		],
	},
};
