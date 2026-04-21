/**
 * Shared utilities
 */
import { __ } from '@wordpress/i18n';
import {
	TagSelector,
	ImageUploader,
	DEFAULT_IMAGES,
} from '../_shared/components';
import { getThemeAssetUrl } from '../../utils/assets';

/**
 * React hooks for performance optimization.
 *
 * @see https://react.dev/reference/react
 */
import { useCallback, useEffect, useMemo } from '@wordpress/element';
/**
 * Core block editor components for building the block interface.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import {
	RichText,
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * WordPress UI components.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/
 */
import { PanelBody, ToggleControl } from '@wordpress/components';

const VALID_HEADING_LEVELS = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];

const normalizeHeadingLevel = ( value ) =>
	VALID_HEADING_LEVELS.includes( value ) ? value : 'h2';

/**
 * Creates onSelect/onRemove handlers for an image attribute group.
 * Assumes attribute keys follow the pattern: baseKey, baseKeyId, baseKeyAlt, baseKeySrcSet, baseKeySizes.
 *
 * @param {string}   baseKey       Base attribute key (e.g. 'logoImage', 'imageTop').
 * @param {Function} setAttributes Block setAttributes function.
 * @return {{ onSelect: Function, onRemove: Function }} Image handler pair.
 */
function makeImageHandlers( baseKey, setAttributes ) {
	const onSelect = ( media ) =>
		setAttributes( {
			[ baseKey ]: media.url,
			[ baseKey + 'Id' ]: media.id,
			[ baseKey + 'Alt' ]: media.alt || '',
		} );

	const onRemove = () =>
		setAttributes( {
			[ baseKey ]: '',
			[ baseKey + 'Id' ]: 0,
			[ baseKey + 'Alt' ]: '',
		} );

	return { onSelect, onRemove };
}

/**
 * CounterItem Component
 *
 * Renders a single counter item with number, suffix, and label.
 * Extracted for better code organization and reusability.
 *
 * @param {Object}   props               Component properties.
 * @param {Object}   props.counter       Counter data object.
 * @param {number}   props.index         Counter index.
 * @param {Function} props.updateCounter Callback to update counter values.
 * @return {JSX.Element} CounterItem component.
 */
function CounterItem( { counter, index, updateCounter } ) {
	return (
		<div className="ai-hero__counters--counter-item">
			<div className="ai-hero__counters--counter-number heading-3 mb-0">
				<RichText
					tagName="div"
					className="ai-hero__counters--count ai-hero__counters--counter-data"
					value={ counter.number }
					onChange={ ( value ) =>
						updateCounter( index, 'number', value )
					}
					placeholder="0"
					aria-label={ __( 'Counter number', 'ambrygen-web' ) }
				/>
				<RichText
					tagName="div"
					className="ai-hero__counters--counter-suffix ai-hero__counters--counter-data"
					value={ counter.suffix }
					onChange={ ( value ) =>
						updateCounter( index, 'suffix', value )
					}
					placeholder=""
					aria-label={ __( 'Counter suffix', 'ambrygen-web' ) }
				/>
			</div>
			<RichText
				tagName="div"
				className="ai-hero__counters--counter-title body1"
				value={ counter.label }
				onChange={ ( value ) => updateCounter( index, 'label', value ) }
				placeholder={ __( 'Label', 'ambrygen-web' ) }
				aria-label={ __( 'Counter label', 'ambrygen-web' ) }
			/>
		</div>
	);
}

/**
 * Edit component for the AI Hero Section block.
 *
 * Renders the block interface in the editor with:
 * - Three configurable images (logo, top, bottom)
 * - Rich text heading and content
 * - Four animated counters with number, suffix, and label
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Block properties.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 * @param {string}   props.clientId      Unique block client ID.
 * @return {JSX.Element} Block editor interface element.
 */
export default function Edit( { attributes, setAttributes, clientId } ) {
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );
	const fallbackImage = defaults?.placeholder || {};

	const {
		blockId,
		className,
		variation = 'default',
		heading,
		content,
		counters = [],
		imageTop,
		imageTopAlt,
		imageBottom,
		imageBottomAlt,
		imageExtra,
		imageExtraAlt,
		logoImage,
		logoImageAlt,
		headingLevel,
		contentTopAlign,
		imagePosition = 'left',
		enableCounters,
	} = attributes;
	const isImageRight = imagePosition === 'right';
	const isHistoryVariation =
		'variation-history-block' === variation ||
		( typeof className === 'string' &&
			className.includes( 'variation-history-block' ) );

	const updateCounter = useCallback(
		( index, field, value ) => {
			const newCounters = [ ...counters ];
			newCounters[ index ] = {
				...newCounters[ index ],
				[ field ]: value,
			};
			setAttributes( { counters: newCounters } );
		},
		[ counters, setAttributes ]
	);

	const { onSelect: handleLogoSelect, onRemove: handleLogoRemove } =
		makeImageHandlers( 'logoImage', setAttributes );
	const { onSelect: handleTopImageSelect, onRemove: handleTopImageRemove } =
		makeImageHandlers( 'imageTop', setAttributes );
	const {
		onSelect: handleBottomImageSelect,
		onRemove: handleBottomImageRemove,
	} = makeImageHandlers( 'imageBottom', setAttributes );
	const {
		onSelect: handleExtraImageSelect,
		onRemove: handleExtraImageRemove,
	} = makeImageHandlers( 'imageExtra', setAttributes );

	const blockProps = useBlockProps();
	const HeadingTag = normalizeHeadingLevel( headingLevel );
	const headingClass = isHistoryVariation ? 'heading-3' : 'heading-1';
	const logoImageUrl = logoImage || fallbackImage.url;
	const imageTopUrl = imageTop || fallbackImage.url;
	const imageBottomUrl = imageBottom || fallbackImage.url;
	const imageExtraUrl = imageExtra || fallbackImage.url;
	const VARIANTS = useMemo(
		() => [
			{
				label: __( 'Stats View', 'ambrygen-web' ),
				value: 'default',
				image: getThemeAssetUrl(
					'/assets/src/images/multiple-image-alongside-text/states-view.png'
				),
			},
			{
				label: __( 'Normal View', 'ambrygen-web' ),
				value: 'variation-history-block',
				image: getThemeAssetUrl(
					'/assets/src/images/multiple-image-alongside-text/normal-view.png'
				),
			},
		],
		[]
	);

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
				<PanelBody title={ __( 'Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ HeadingTag }
						onChange={ ( value ) =>
							setAttributes( {
								headingLevel: normalizeHeadingLevel( value ),
							} )
						}
						type="heading"
					/>
					<div className="layout-variant-selector">
						{ VARIANTS.map( ( variant ) => (
							<button
								key={ variant.value }
								type="button"
								className={ `variant-button ${
									variation === variant.value
										? 'is-selected'
										: ''
								}` }
								aria-pressed={ variation === variant.value }
								onClick={ () =>
									setAttributes( {
										variation: variant.value,
									} )
								}
							>
								<img
									src={ variant.image }
									alt={ variant.label }
								/>
								<span>{ variant.label }</span>
							</button>
						) ) }
					</div>
					<ToggleControl
						label={ __(
							'Top Align Content Column',
							'ambrygen-web'
						) }
						checked={ !! contentTopAlign }
						onChange={ ( value ) =>
							setAttributes( { contentTopAlign: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Enable Counters', 'ambrygen-web' ) }
						checked={ enableCounters !== false }
						onChange={ ( value ) =>
							setAttributes( { enableCounters: value } )
						}
					/>
					<ToggleControl
						label={ __( 'Show Image on Right', 'ambrygen-web' ) }
						checked={ isImageRight }
						onChange={ ( value ) =>
							setAttributes( {
								imagePosition: value ? 'right' : 'left',
							} )
						}
					/>

					<ImageUploader
						label={ __( 'Logo Image', 'ambrygen-web' ) }
						url={ logoImage }
						onSelect={ handleLogoSelect }
						onRemove={ handleLogoRemove }
					/>

					<ImageUploader
						label={ __( 'Top Image', 'ambrygen-web' ) }
						url={ imageTop }
						onSelect={ handleTopImageSelect }
						onRemove={ handleTopImageRemove }
					/>

					<ImageUploader
						label={ __( 'Bottom Image', 'ambrygen-web' ) }
						url={ imageBottom }
						onSelect={ handleBottomImageSelect }
						onRemove={ handleBottomImageRemove }
					/>
					{ isHistoryVariation && (
						<ImageUploader
							label={ __( 'Bottom right', 'ambrygen-web' ) }
							url={ imageExtra }
							onSelect={ handleExtraImageSelect }
							onRemove={ handleExtraImageRemove }
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div
				className={ `ai-hero ${
					contentTopAlign ? ' has-top-align' : ''
				}${ isImageRight ? ' block-rtl' : '' }${
					isHistoryVariation ? ' variation-history-block' : ''
				}` }
			>
				<div className="is-style-gl-s50" />
				<div className="ai-hero__grid">
					<div className="ai-hero__col ai-hero__col--images">
						<div className="ai-hero__images">
							<div className="ai-hero__image-wrapper">
								<div className="ai-hero__logo">
									<div className="ai-hero__logo-inner">
										{ logoImageUrl && (
											<img
												src={ logoImageUrl }
												alt={
													logoImageAlt ||
													fallbackImage.alt ||
													__(
														'Company logo',
														'ambrygen-web'
													)
												}
											/>
										) }
									</div>
								</div>
							</div>
							<div className="ai-hero__image-wrapper">
								<div className="ai-hero__image">
									{ imageTopUrl && (
										<img
											src={ imageTopUrl }
											alt={
												imageTopAlt ||
												fallbackImage.alt ||
												__(
													'Hero top image',
													'ambrygen-web'
												)
											}
										/>
									) }
								</div>
							</div>
							<div
								className={ `ai-hero__image-wrapper${
									isHistoryVariation
										? ''
										: ' ai-hero__image-wrapper--full'
								}` }
							>
								<div className="ai-hero__image">
									{ imageBottomUrl && (
										<img
											src={ imageBottomUrl }
											alt={
												imageBottomAlt ||
												fallbackImage.alt ||
												__(
													'Hero bottom Left',
													'ambrygen-web'
												)
											}
										/>
									) }
								</div>
							</div>
							{ isHistoryVariation && (
								<div className="ai-hero__image-wrapper">
									<div className="ai-hero__image">
										{ imageExtraUrl && (
											<img
												src={ imageExtraUrl }
												alt={
													imageExtraAlt ||
													fallbackImage.alt ||
													__(
														'Hero bottom right',
														'ambrygen-web'
													)
												}
											/>
										) }
									</div>
								</div>
							) }
						</div>
					</div>
					<div className="ai-hero__col ai-hero__col--content">
						<div className="ai-hero__content">
							<RichText
								tagName={ HeadingTag }
								className={ `ai-hero__heading ${ headingClass } mb-0` }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								allowedFormats={ [ 'core/text-color' ] }
								placeholder={ __(
									'Hero heading…',
									'ambrygen-web'
								) }
								aria-label={ __(
									'Hero heading',
									'ambrygen-web'
								) }
							/>
							<div className="is-style-gl-s24"></div>
							<div className="ai-hero__description-text body1 block-description">
								<RichText
									tagName="div"
									value={ content }
									onChange={ ( value ) =>
										setAttributes( { content: value } )
									}
									placeholder={ __(
										'Hero content…',
										'ambrygen-web'
									) }
									aria-label={ __(
										'Hero description',
										'ambrygen-web'
									) }
								/>
							</div>

							{ enableCounters !== false && (
								<>
									<div className="is-style-gl-s24"></div>
									<div className="ai-hero__counters">
										{ counters.map( ( counter, index ) => (
											<CounterItem
												key={ index }
												counter={ counter }
												index={ index }
												updateCounter={ updateCounter }
											/>
										) ) }
									</div>
								</>
							) }
						</div>
					</div>
				</div>
				<div className="is-style-gl-s50" />
			</div>
		</div>
	);
}
