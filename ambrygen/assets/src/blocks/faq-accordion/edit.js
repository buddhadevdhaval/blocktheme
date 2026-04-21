import { createBlock } from '@wordpress/blocks';
import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	DEFAULT_IMAGES,
	ImageUploader,
	TagSelector,
} from '../_shared/components';

const createParagraphBlock = ( content = '' ) =>
	createBlock( 'core/paragraph', {
		content,
	} );

const createListMarkup = ( items = [] ) => {
	if ( ! Array.isArray( items ) || ! items.length ) {
		return '<li></li>';
	}

	return items.map( ( item ) => `<li>${ item?.text || '' }</li>` ).join( '' );
};

const createFaqItemBlock = ( faq = {} ) => {
	const innerBlocks = [];

	if ( faq?.answer ) {
		innerBlocks.push( createParagraphBlock( faq.answer ) );
	}

	if ( Array.isArray( faq?.items ) && faq.items.length ) {
		innerBlocks.push(
			createBlock( 'core/list', {
				values: createListMarkup( faq.items ),
				ordered: false,
			} )
		);
	}

	if ( ! innerBlocks.length ) {
		innerBlocks.push( createParagraphBlock() );
	}

	return createBlock(
		'ambrygen/faq-accordion-item',
		{
			question: faq?.question || '',
			subHeading: faq?.subHeading || '',
		},
		innerBlocks
	);
};

const TEMPLATE = [ [ 'ambrygen/faq-accordion-item' ] ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		imageUrl,
		imageAlt,
		faqs = [],
		title,
		headingTag,
		variant = 'default',
		description,
	} = attributes;
	const showImage = variant !== 'without-image';
	const variantClassName =
		variant === 'without-image'
			? `variation-${ variant } variation-boxed`
			: `variation-${ variant }`;
	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );
	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);
	const hasInnerBlocks = innerBlocks.length > 0;
	const blockProps = useBlockProps( {
		className: `block-layout alongside-faq ${ variantClassName }`,
	} );
	const defaultImages = useMemo( () => DEFAULT_IMAGES(), [] );
	const displayImageUrl = imageUrl || defaultImages?.placeholder?.url || '';

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	useEffect( () => {
		if ( hasInnerBlocks || ! faqs.length ) {
			return;
		}

		replaceInnerBlocks( clientId, faqs.map( createFaqItemBlock ), false );
	}, [ clientId, faqs, hasInnerBlocks, replaceInnerBlocks ] );

	useEffect( () => {
		if ( showImage && ! imageUrl && defaultImages.placeholder.url ) {
			setAttributes( {
				imageUrl: defaultImages.placeholder.url,
				imageId: defaultImages.placeholder.id,
				imageAlt: defaultImages.placeholder.alt || '',
			} );
		}
	}, [ showImage, imageUrl, setAttributes, defaultImages ] );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'FAQ Setting', 'ambrygen-web' ) }
					initialOpen
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>

					<ToggleControl
						label={ __( 'Keep FAQ without image', 'ambrygen-web' ) }
						checked={ variant === 'without-image' }
						onChange={ ( isChecked ) =>
							setAttributes( {
								variant: isChecked
									? 'without-image'
									: 'default',
							} )
						}
						help={ __(
							'Enable this to hide the FAQ image.',
							'ambrygen-web'
						) }
					/>

					{ showImage && (
						<ImageUploader
							label={ __( 'FAQ Image', 'ambrygen-web' ) }
							url={ imageUrl }
							onSelect={ ( media ) =>
								setAttributes( {
									imageUrl: media.url,
									imageId: media.id,
									imageAlt: media.alt || '',
								} )
							}
							onRemove={ () =>
								setAttributes( {
									imageUrl: '',
									imageId: 0,
									imageAlt: '',
								} )
							}
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="alongside-faq__row">
					{ showImage && (
						<div className="alongside-faq__col alongside-faq__col--left">
							<div className="alongside-faq__media">
								{ displayImageUrl && (
									<img
										src={ displayImageUrl }
										alt={ imageAlt || '' }
									/>
								) }
							</div>
						</div>
					) }

					<div
						className={ `alongside-faq__col alongside-faq__col--right ${
							showImage ? '' : 'full-width'
						}` }
					>
						<div className="alongside-faq__content">
							<RichText
								tagName={ headingTag || 'h5' }
								className="heading-4 alongside-faq__title mb-0"
								value={ title }
								onChange={ ( value ) =>
									setAttributes( { title: value } )
								}
								placeholder={ __(
									'Frequently Asked Questions',
									'ambrygen-web'
								) }
							/>
							<div
								className="is-style-gl-s24"
								aria-hidden="true"
							></div>
							<RichText
								tagName="div"
								className="block-description alongside-faq__description"
								value={ description }
								onChange={ ( value ) =>
									setAttributes( { description: value } )
								}
								placeholder={ __(
									'Description',
									'ambrygen-web'
								) }
							/>

							<div
								className="is-style-gl-s64"
								aria-hidden="true"
							></div>

							<div className="faq">
								<InnerBlocks
									allowedBlocks={ [
										'ambrygen/faq-accordion-item',
									] }
									template={ TEMPLATE }
									templateLock={ false }
									renderAppender={
										InnerBlocks.ButtonBlockAppender
									}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
