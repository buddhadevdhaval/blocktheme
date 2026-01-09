/**
 * WordPress VIP – Webpack Configuration
 *
 * - Extends @wordpress/scripts
 * - VIP-compliant asset sizes
 * - Block-based architecture
 * - Build-time PHP manifest generation (no runtime FS access)
 */

const path = require( 'path' );
const fs = require( 'fs' );
const MiniCssExtractPlugin = require( 'mini-css-extract-plugin' );
const CopyPlugin = require( 'copy-webpack-plugin' );
const RemovePlugin = require( 'remove-files-webpack-plugin' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config.js' );

/**
 * Discover block entry points dynamically
 */
function getBlockEntries() {
	const blocksDir = path.resolve( process.cwd(), 'assets/src/blocks' );

	if ( ! fs.existsSync( blocksDir ) ) {
		return {};
	}

	return fs
		.readdirSync( blocksDir, { withFileTypes: true } )
		.filter( ( dirent ) => dirent.isDirectory() )
		.reduce( ( entries, dirent ) => {
			const entryFile = path.join( blocksDir, dirent.name, 'index.js' );

			if ( fs.existsSync( entryFile ) ) {
				entries[ `blocks/${ dirent.name }/index` ] = entryFile;
			}

			return entries;
		}, {} );
}

module.exports = {
	...defaultConfig,

	entry: {
		styles: path.resolve( 'assets/src/css/bundle.scss' ),
		editor: path.resolve( 'assets/src/js/editor.jsx' ),
		editorStyle: path.resolve( 'assets/src/css/editor-style.scss' ),
		scripts: path.resolve( 'assets/src/js/bundle.jsx' ),
		header: path.resolve( 'assets/src/js/header.jsx' ),
		...getBlockEntries(),
	},

	output: {
		path: path.resolve( 'assets/build' ),
		filename: '[name].min.js',
		clean: true, // VIP prefers deterministic output
	},

	module: {
		...defaultConfig.module,
		rules: [
			...defaultConfig.module.rules,

			// Fonts
			{
				test: /\.(woff2?|ttf|eot|otf)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name][ext]',
				},
			},

			// Images
			{
				test: /\.(png|jpe?g|gif|webp|bmp)$/i,
				type: 'asset/resource',
				generator: {
					filename: 'images/[name][ext]',
				},
			},
		],
	},

	plugins: [
		...defaultConfig.plugins,

		new MiniCssExtractPlugin( {
			filename: '[name].min.css',
		} ),

		/**
		 * Copy and normalize block.json
		 */
		new CopyPlugin( {
			patterns: [
				{
					from: 'assets/src/blocks/**/block.json',
					to( { absoluteFilename } ) {
						const normalized = absoluteFilename.replace(
							/\\/g,
							'/'
						);
						const match = normalized.match(
							/blocks\/([^/]+)\/block\.json$/
						);

						if ( ! match ) {
							throw new Error( 'Invalid block.json path' );
						}

						return `blocks/${ match[ 1 ] }/block.json`;
					},

					transform( content ) {
						const json = JSON.parse( content.toString() );

						json.editorScript = 'file:./index.min.js';
						json.editorStyle = 'file:./index.css';
						json.style = 'file:./style-index.css';

						return JSON.stringify( json, null, '\t' );
					},
				},
			],
		} ),

		/**
		 * Remove files VIP does not want
		 */
		new RemovePlugin( {
			after: {
				include: [
					'assets/build/**/*.asset.php',
					'assets/build/block.json',
				],
			},
		} ),
	],

	/**
	 * VIP Performance Rules
	 */
	performance: {
		maxAssetSize: 250000, // 250 KB hard recommendation
		hints: 'warning',
	},
};
