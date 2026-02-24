import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, SelectControl } from '@wordpress/components';

// Default cards
// Default cards matching your front-end design
const TEMPLATE = [
	[
		'ambrygen/additional-links-item',
		{
			title: 'Title',
			icon: {
				url: '',
				alt: '',
			},
		},
	],
	[
		'ambrygen/additional-links-item',
		{
			title: 'Title',
			icon: {
				url: '',
				alt: '',
			},
		},
	],
	[
		'ambrygen/additional-links-item',
		{
			title: 'Title',
			icon: {
				url: '',
				alt: '',
			},
		},
	],
	[
		'ambrygen/additional-links-item',
		{
			title: 'Title',
			icon: {
				url: '',
				alt: '',
			},
		},
	],
	[
		'ambrygen/additional-links-item',
		{
			title: 'Title',
			icon: {
				url: '',
				alt: '',
			},
		},
	],
];

export default function Edit( { attributes, setAttributes } ) {
	const { heading, headingTag, description } = attributes;
	const blockProps = useBlockProps( {
		className: 'additional-links-wrapper',
	} );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title="Heading Settings" initialOpen={ true }>
					<SelectControl
						label="Heading Tag"
						value={ headingTag }
						options={ [
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
						] }
						onChange={ ( val ) =>
							setAttributes( { headingTag: val } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div className="careers-highlight__header block__rowflex">
				<RichText
					tagName={ headingTag }
					className="careers-highlight__title block__rowflex--heading-title heading-4 mb-0"
					value={ heading }
					onChange={ ( val ) => setAttributes( { heading: val } ) }
				/>
				<RichText
					tagName="div"
					className="careers-highlight__intro block__rowflex--block-content subtitle1-reg"
					value={ description }
					onChange={ ( val ) =>
						setAttributes( { description: val } )
					}
				/>
			</div>

			<div className="wp-additional-link__cards">
				<InnerBlocks
					allowedBlocks={ [ 'ambrygen/additional-links-item' ] }
					template={ TEMPLATE }
					templateLock={ false }
				/>
			</div>
		</div>
	);
}
