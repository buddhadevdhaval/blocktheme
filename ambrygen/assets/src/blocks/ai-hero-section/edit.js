/**
 * Shared utilities
 */
import { __ } from '@wordpress/i18n';
import {
	TagSelector,
	ImageUploader,
	DEFAULT_IMAGES,
} from '../_shared/components';

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
import { PanelBody } from '@wordpress/components';

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
 * @return {JSX.Element} Block editor interface element.
 */
export default function Edit( { attributes, setAttributes } ) {
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );

	const {
		heading,
		content,
		counters = [],
		imageTop,
		imageTopAlt,
		imageBottom,
		imageBottomAlt,
		logoImage,
		logoImageAlt,
		headingLevel,
	} = attributes;

	useEffect( () => {
		const update = {};
		if ( ! logoImage ) {
			update.logoImage = defaults?.placeholder?.url;
			update.logoImageAlt = defaults?.placeholder?.alt || '';
		}
		if ( ! imageTop ) {
			update.imageTop = defaults?.placeholder?.url;
			update.imageTopAlt = defaults?.placeholder?.alt || '';
		}
		if ( ! imageBottom ) {
			update.imageBottom = defaults?.placeholder?.url;
			update.imageBottomAlt = defaults?.placeholder?.alt || '';
		}
		if ( Object.keys( update ).length ) {
			setAttributes( update );
		}
	}, [ logoImage, imageTop, imageBottom, defaults, setAttributes ] );

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

	const blockProps = useBlockProps();
	const HeadingTag = headingLevel || 'h2';

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingLevel || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
						type="heading"
					/>
				</PanelBody>
				<PanelBody title={ __( 'Logo Image', 'ambrygen-web' ) }>
					<ImageUploader
						label={ __( 'Logo Image', 'ambrygen-web' ) }
						url={ logoImage }
						onSelect={ handleLogoSelect }
						onRemove={ handleLogoRemove }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Top Image', 'ambrygen-web' ) }>
					<ImageUploader
						label={ __( 'Top Image', 'ambrygen-web' ) }
						url={ imageTop }
						onSelect={ handleTopImageSelect }
						onRemove={ handleTopImageRemove }
					/>
				</PanelBody>
				<PanelBody title={ __( 'Bottom Image', 'ambrygen-web' ) }>
					<ImageUploader
						label={ __( 'Bottom Image', 'ambrygen-web' ) }
						url={ imageBottom }
						onSelect={ handleBottomImageSelect }
						onRemove={ handleBottomImageRemove }
					/>
				</PanelBody>
			</InspectorControls>

			<div className="ai-hero">
				<div className="is-style-gl-s50" />
				<div className="ai-hero__grid">
					<div className="ai-hero__col ai-hero__col--images">
						<div className="ai-hero__images">
							<div className="ai-hero__image-wrapper">
								<div className="ai-hero__logo">
									<div className="ai-hero__logo-inner">
										{ logoImage && (
											<img
												src={ logoImage }
												alt={
													logoImageAlt ||
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
									{ imageTop && (
										<img
											src={ imageTop }
											alt={
												imageTopAlt ||
												__(
													'Hero top image',
													'ambrygen-web'
												)
											}
										/>
									) }
								</div>
							</div>
							<div className="ai-hero__image-wrapper ai-hero__image-wrapper--full">
								<div className="ai-hero__image">
									{ imageBottom && (
										<img
											src={ imageBottom }
											alt={
												imageBottomAlt ||
												__(
													'Hero bottom image',
													'ambrygen-web'
												)
											}
										/>
									) }
								</div>
							</div>
						</div>
					</div>
					<div className="ai-hero__col ai-hero__col--content">
						<div className="ai-hero__content">
							<RichText
								tagName={ HeadingTag }
								className="ai-hero__heading heading-1 mb-0"
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
						</div>
					</div>
				</div>
				<div className="is-style-gl-s50" />
			</div>
		</div>
	);
}
