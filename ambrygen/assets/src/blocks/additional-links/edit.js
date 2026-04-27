import {
	useBlockProps,
	InnerBlocks,
	RichText,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import { TagSelector } from '../_shared/components';

const createDefaultCta = ( text ) => ( {
	text,
	url: '',
	target: '',
	rel: '',
	variant: 'dark',
} );

const TEMPLATE = [
	[
		'ambrygen/additional-links-item',
		{
			cta: createDefaultCta( 'Link 1' ),
			icon: {
				id: 0,
				url: '',
				alt: '',
			},
		},
	],
	[
		'ambrygen/additional-links-item',
		{
			cta: createDefaultCta( 'Link 2' ),
			icon: {
				id: 0,
				url: '',
				alt: '',
			},
		},
	],
	[
		'ambrygen/additional-links-item',
		{
			cta: createDefaultCta( 'Link 3' ),
			icon: {
				id: 0,
				url: '',
				alt: '',
			},
		},
	],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, heading, headingTag, description } = attributes;
	const blockProps = useBlockProps( {
		className: 'additional-links-wrapper',
	} );

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						type="heading"
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
					placeholder={ __( 'Add heading...', 'ambrygen-web' ) }
					allowedFormats={ [ 'core/bold', 'core/italic' ] }
					onChange={ ( val ) => setAttributes( { heading: val } ) }
				/>
				<RichText
					tagName="div"
					className="careers-highlight__intro block__rowflex--block-content subtitle1-reg"
					value={ description }
					placeholder={ __( 'Add description...', 'ambrygen-web' ) }
					allowedFormats={ [
						'core/bold',
						'core/italic',
						'core/link',
					] }
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
