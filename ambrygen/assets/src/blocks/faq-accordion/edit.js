import { createBlock } from '@wordpress/blocks';
import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody } from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { useEffect, useMemo } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

import {
	BlockVariationsExamplePreview,
	DEFAULT_IMAGES,
	ImageUploader,
	TagSelector,
} from '../_shared/components';
import { getThemeAssetUrl } from '../../utils/assets';

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
const FAQ_VARIANTS = {
	WITH_IMAGE: 'default',
	NORMAL: 'without-image',
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		imageUrl,
		imageId,
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
	const { insertBlock, replaceInnerBlocks } = useDispatch(
		'core/block-editor'
	);
	const hasInnerBlocks = useSelect(
		(select) => select('core/block-editor').getBlockCount(clientId) > 0,
		[clientId]
	);
	const hasDescription = Boolean( description );
	const hasFaqContent = hasInnerBlocks || faqs.length > 0;
	const blockProps = useBlockProps( {
		className: `block-layout alongside-faq ${ variantClassName }`,
	} );
	const defaultImage = useMemo(
		() => DEFAULT_IMAGES()?.placeholder || {},
		[]
	);
	const displayImageUrl = imageUrl || defaultImage.url || '';
	const isDefaultImage =
		imageUrl === defaultImage.url && imageId === defaultImage.id;
	const variants = useMemo(
		() => [
			{
				label: __( 'With Image View', 'ambrygen-web' ),
				value: FAQ_VARIANTS.WITH_IMAGE,
				image: getThemeAssetUrl(
					'/assets/src/images/faq-accordion/withimage.png'
				),
			},
			{
				label: __( 'Normal View', 'ambrygen-web' ),
				value: FAQ_VARIANTS.NORMAL,
				image: getThemeAssetUrl(
					'/assets/src/images/faq-accordion/without-image.png'
				),
			},
		],
		[]
	);

	useEffect( () => {
		const clientIdSuffix = clientId.slice( 0, 8 );
		const expectedId = `section-${ clientIdSuffix }`;

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
		setAttributes({ faqs: [] });
	}, [ clientId, faqs, hasInnerBlocks, replaceInnerBlocks, setAttributes]);

	if ( blockId === 'faq-accordion-example' ) {
		return (
			<BlockVariationsExamplePreview
				variants={ variants }
				className="cta-tiles-example-preview"
				itemClass="cta-tiles-example-preview__item"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Layout Variation', 'ambrygen-web' ) }
					initialOpen
				>
					<div className="layout-variant-selector">
						{ variants.map( ( item ) => (
							<button
								key={ item.value }
								type="button"
								className={ `variant-button ${
									variant === item.value
										? 'is-selected'
										: ''
								}` }
								aria-pressed={ variant === item.value }
								onClick={ () =>
									setAttributes( {
										variant: item.value,
									} )
								}
							>
								<img
									src={ item.image }
									alt=""
									aria-hidden="true"
								/>
								<span>{ item.label }</span>
							</button>
						) ) }
					</div>

				</PanelBody>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) } initialOpen={ false }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type='heading'
					/>
				</PanelBody>
				<PanelBody title={ __( 'FAQ Settings', 'ambrygen-web' ) } initialOpen={ true }>
					{ showImage && (
						<ImageUploader
							label={ __( 'FAQ Image', 'ambrygen-web' ) }
							url={ isDefaultImage ? '' : imageUrl }
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
									'Add Heading...',
									'ambrygen-web'
								) }
							/>
							<div
								className="is-style-gl-s12"
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
									'Add Description...',
									'ambrygen-web'
								) }
							/>

							<div
								className="is-style-gl-s24"
								aria-hidden="true"
							></div>

							<div className="faq">
								<InnerBlocks
									allowedBlocks={ [
										'ambrygen/faq-accordion-item',
									] }
									template={ TEMPLATE }
									templateLock={ false }
									renderAppender={ false }
								/>
								<Button
									variant="primary"
									onClick={ () => {
										insertBlock(
											createBlock(
												'ambrygen/faq-accordion-item'
											),
											undefined,
											clientId
										);
									} }
								>
									{ __(
										'Add FAQ Accordion Item',
										'ambrygen-web'
									) }
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}
