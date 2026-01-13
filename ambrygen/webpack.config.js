const path = require( 'path' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config.js' );

module.exports = {
	...defaultConfig,

	entry: {
		styles: path.resolve( 'assets/src/css/bundle.scss' ),
		editor: path.resolve( 'assets/src/js/editor.jsx' ),
		editorStyle: path.resolve( 'assets/src/css/editor-style.scss' ),
		scripts: path.resolve( 'assets/src/js/bundle.jsx' ),
		header: path.resolve( 'assets/src/js/header.jsx' ),
	},

	output: {
		path: path.resolve( 'assets/build' ),
		filename: '[name].min.js',
		clean: true,
	},

	plugins: [
		...defaultConfig.plugins,
		new MiniCssExtractPlugin( {
			filename: '[name].min.css',
		} ),
	],

	performance: {
		maxAssetSize: 250000,
		hints: 'warning',
	},
};
