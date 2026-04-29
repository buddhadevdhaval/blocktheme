/**
 * Shared utilities
 */
import { __ } from '@wordpress/i18n';
import {
	TagSelector,
	DEFAULT_IMAGES,
	ImageUploader,
} from '../_shared/components';
import { getThemeAssetUrl } from '../../utils/assets';

/**
 * React hooks.
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
import {
	Button,
	PanelBody,
	TextareaControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';

const VALID_HEADING_LEVELS = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];
const MAX_STATS = 4;
const MAX_IMAGES = 4;
const EMPTY_STAT_PLACEHOLDER = '0';

const normalizeHeadingLevel = ( value ) =>
	VALID_HEADING_LEVELS.includes( value ) ? value : 'h2';

const getHeadingClass = ( headingLevel ) =>
	`heading-${ normalizeHeadingLevel( headingLevel ).replace( 'h', '' ) }`;

const normalizeImage = ( image = {} ) => ( {
	url: image.url || '',
	id: Number( image.id ) || 0,
	alt: image.alt || '',
} );

const normalizeStat = ( stat = {} ) => ( {
	prefix: stat.prefix || '',
	number: stat.number || '',
	postfix: stat.postfix ?? stat.suffix ?? '',
	label: stat.label ?? stat.title ?? '',
	description: stat.description || '',
} );

const getStatKey = ( _stat, index ) => `stat-slot-${ index + 1 }`;

const hasStatContent = ( stat ) =>
	Boolean(
		stat.prefix ||
			stat.number ||
			stat.postfix ||
			stat.label ||
			stat.description
	);

function StatControls( { stat, index, updateStat, removeStat } ) {
	return (
		<div className="multiple-image-alongside-text__stat-controls">
			<TextControl
				label={ __( 'Prefix', 'ambrygen-web' ) }
				value={ stat.prefix }
				onChange={ ( value ) => updateStat( index, 'prefix', value ) }
			/>
			<TextControl
				label={ __( 'Number', 'ambrygen-web' ) }
				value={ stat.number }
				onChange={ ( value ) => updateStat( index, 'number', value ) }
			/>
			<TextControl
				label={ __( 'Postfix', 'ambrygen-web' ) }
				value={ stat.postfix }
				onChange={ ( value ) => updateStat( index, 'postfix', value ) }
			/>
			<TextControl
				label={ __( 'Label', 'ambrygen-web' ) }
				value={ stat.label }
				onChange={ ( value ) => updateStat( index, 'label', value ) }
			/>
			<TextareaControl
				label={ __( 'Description', 'ambrygen-web' ) }
				value={ stat.description }
				onChange={ ( value ) =>
					updateStat( index, 'description', value )
				}
			/>
			<Button
				isDestructive
				size="small"
				variant="tertiary"
				onClick={ () => removeStat( index ) }
			>
				{ __( 'Remove Stat', 'ambrygen-web' ) }
			</Button>
		</div>
	);
}

/**
 * Edit component for the Multiple Image Alongside Text block.
 *
 * Renders the block interface in the editor with:
 * - Three or four configurable foreground images
 * - Rich text heading and content
 * - Four animated stats with prefix, number, postfix, label, and description
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
	const {
		blockId,
		variation = 'stats-view',
		heading,
		content,
		stats = [],
		images = [],
		headingLevel,
		contentTopAlign,
		imagePosition = 'left',
	} = attributes;
	const defaults = useMemo( () => DEFAULT_IMAGES(), [] );
	const placeholderImage = defaults?.placeholder || {};
	const isImageRight = imagePosition === 'right';
	const normalizedVariation =
		variation === 'normal-view' ? 'normal-view' : 'stats-view';
	const isNormalView = 'normal-view' === normalizedVariation;
	const isStatsView = ! isNormalView;
	const normalizedStats = useMemo(
		() => ( Array.isArray( stats ) ? stats : [] ).map( normalizeStat ),
		[ stats ]
	);
	const visibleStats = normalizedStats.slice( 0, MAX_STATS );
	const sourceImages = Array.isArray( images ) ? images : [];
	const normalizedImages = useMemo(
		() =>
			Array.from( { length: MAX_IMAGES }, ( _value, index ) =>
				normalizeImage( sourceImages[ index ] )
			),
		[ sourceImages ]
	);
	const visibleImageCount = isNormalView ? MAX_IMAGES : 3;
	const visibleImages = normalizedImages.slice( 0, visibleImageCount );

	const updateStat = useCallback(
		( index, field, value ) => {
			const newStats = [ ...normalizedStats ];
			newStats[ index ] = {
				...newStats[ index ],
				[ field ]: value,
			};
			setAttributes( { stats: newStats } );
		},
		[ normalizedStats, setAttributes ]
	);

	const addStat = useCallback( () => {
		if ( normalizedStats.length >= MAX_STATS ) {
			return;
		}

		setAttributes( {
			stats: [
				...normalizedStats,
				{
					prefix: '',
					number: '',
					postfix: '',
					label: '',
					description: '',
				},
			],
		} );
	}, [ normalizedStats, setAttributes ] );

	const removeStat = useCallback(
		( index ) => {
			setAttributes( {
				stats: normalizedStats.filter(
					( _stat, statIndex ) => statIndex !== index
				),
			} );
		},
		[ normalizedStats, setAttributes ]
	);

	const updateImage = useCallback(
		( index, media ) => {
			const nextImages = [ ...normalizedImages ];
			nextImages[ index ] = normalizeImage( {
				url: media?.url,
				id: media?.id,
				alt: media?.alt,
			} );
			setAttributes( { images: nextImages } );
		},
		[ normalizedImages, setAttributes ]
	);

	const removeImage = useCallback(
		( index ) => {
			const nextImages = [ ...normalizedImages ];
			nextImages[ index ] = normalizeImage();
			setAttributes( { images: nextImages } );
		},
		[ normalizedImages, setAttributes ]
	);

	const blockProps = useBlockProps();
	const HeadingTag = normalizeHeadingLevel( headingLevel );
	const headingClass = getHeadingClass( HeadingTag );
	const hasHeading = Boolean( heading );
	const hasContent = Boolean( content );
	const showStats = isStatsView;
	const hasVisibleStats = showStats && visibleStats.length > 0;
	const previewImages = visibleImages
		.map( ( image, index ) => ( {
			key: `preview-image-slot-${ index + 1 }`,
			url: image.url || placeholderImage.url || '',
			alt:
				image.alt ||
				placeholderImage.alt ||
				`${ __( 'Foreground image', 'ambrygen-web' ) } ${
					index + 1
				}`,
			isPlaceholder: ! image.url,
			isFullImage: ! isNormalView && index === 2,
		} ) )
		.filter( ( image ) => image.url );
	const layoutVariants = [
		{
			label: __( 'Stats View', 'ambrygen-web' ),
			value: 'stats-view',
			image: getThemeAssetUrl(
				'/assets/src/images/multiple-image-alongside-text/states-view.png'
			),
		},
		{
			label: __( 'Normal View', 'ambrygen-web' ),
			value: 'normal-view',
			image: getThemeAssetUrl(
				'/assets/src/images/multiple-image-alongside-text/normal-view.png'
			),
		},
	];

	useEffect( () => {
		const clientIdSuffix = clientId.slice( 0, 8 );
		const expectedId = `section-${ clientIdSuffix }`;

		if ( ! blockId || ! blockId.endsWith( clientId.slice( 0, 8 ) ) ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Layout Variation', 'ambrygen-web' ) }
					initialOpen
				>
					<div className="layout-variant-selector">
						{ layoutVariants.map( ( variant ) => (
							<button
								key={ variant.value }
								type="button"
								className={ `variant-button ${
									normalizedVariation === variant.value
										? 'is-selected'
										: ''
								}` }
								aria-pressed={
									normalizedVariation === variant.value
								}
								onClick={ () =>
									setAttributes( {
										variation: variant.value,
									} )
								}
							>
								<img
									src={ variant.image }
									alt=""
									aria-hidden="true"
								/>
								<span>{ variant.label }</span>
							</button>
						) ) }
					</div>
				</PanelBody>

				<PanelBody
					title={ __( 'Content Layout', 'ambrygen-web' ) }
					initialOpen={ false }
				>
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
						label={ __( 'Show Image on Right', 'ambrygen-web' ) }
						checked={ isImageRight }
						onChange={ ( value ) =>
							setAttributes( {
								imagePosition: value ? 'right' : 'left',
							} )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Images', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					{ visibleImages.map( ( image, index ) => (
						<ImageUploader
							key={ `foreground-image-${ index + 1 }` }
							label={ `${
								__( 'Foreground Image', 'ambrygen-web' )
							} ${ index + 1 }` }
							url={ image.url }
							onSelect={ ( media ) =>
								updateImage( index, media )
							}
							onRemove={ () => removeImage( index ) }
						/>
					) ) }
				</PanelBody>

				{ isStatsView && (
					<PanelBody
						title={ __( 'Stats', 'ambrygen-web' ) }
						initialOpen={ false }
					>
						{ visibleStats.map( ( stat, index ) => (
							<StatControls
								key={ getStatKey( stat, index ) }
								stat={ stat }
								index={ index }
								updateStat={ updateStat }
								removeStat={ removeStat }
							/>
						) ) }
						{ visibleStats.length < MAX_STATS && (
							<Button variant="secondary" onClick={ addStat }>
								{ __( 'Add Stat', 'ambrygen-web' ) }
							</Button>
						) }
					</PanelBody>
				) }
			</InspectorControls>

			<div
				className={ `multiple-image-alongside-text ${
					contentTopAlign ? ' has-top-align' : ''
				}${ isImageRight ? ' block-rtl' : '' }${
					isNormalView ? ' is-normal-view' : ''
				}` }
			>
				<div className="is-style-gl-s50" aria-hidden="true" />
				<div className="multiple-image-alongside-text__grid">
					<div className="multiple-image-alongside-text__col multiple-image-alongside-text__col--images">
						<div className="multiple-image-alongside-text__images">
							{ previewImages.map( ( image, index ) => (
								<div
									key={ image.key }
									className={ `multiple-image-alongside-text__image-wrapper${
										image.isFullImage
											? ' multiple-image-alongside-text__image-wrapper--full'
											: ''
									}${
										image.isPlaceholder
											? ' is-placeholder'
											: ''
									}` }
								>
									<div className="multiple-image-alongside-text__image">
										{ image.url && (
											<img
												src={ image.url }
												alt={ image.alt }
											/>
										) }
									</div>
								</div>
							) ) }
						</div>
					</div>
					<div className="multiple-image-alongside-text__col multiple-image-alongside-text__col--content">
						<div className="multiple-image-alongside-text__content">
							<RichText
								tagName={ HeadingTag }
								className={ `multiple-image-alongside-text__heading ${ headingClass } mb-0` }
								value={ heading }
								onChange={ ( value ) =>
									setAttributes( { heading: value } )
								}
								allowedFormats={ [ 'core/text-color' ] }
								placeholder={ __(
									'Add Heading...',
									'ambrygen-web'
								) }
								aria-label={ __(
									'Add Heading...',
									'ambrygen-web'
								) }
								aria-label={ __( 'Heading', 'ambrygen-web' ) }
							/>
							{ hasHeading && hasContent && (
								<div
									className="is-style-gl-s24"
									aria-hidden="true"
								></div>
							) }
							<div className="multiple-image-alongside-text__description-text body1 block-description">
								<RichText
									tagName="div"
									value={ content }
									onChange={ ( value ) =>
										setAttributes( { content: value } )
									}
									placeholder={ __(
										'Add Description...',
										'ambrygen-web'
									) }
									aria-label={ __(
										'Description',
										'ambrygen-web'
									) }
								/>
							</div>

							{ showStats && (
								<>
									{ ( hasHeading || hasContent ) &&
										hasVisibleStats && (
											<div
												className="is-style-gl-s24"
												aria-hidden="true"
											></div>
										) }
					{ hasVisibleStats && (
										<div className="multiple-image-alongside-text__stats">
											{ visibleStats.map(
												( stat, index ) => {
													const isEmpty =
														! hasStatContent(
															stat
														);

													return (
														<div
															key={ getStatKey(
																stat,
																index
															) }
															className={ `multiple-image-alongside-text__stats--stat-item${
																isEmpty
																	? ' is-placeholder'
																	: ''
															}` }
														>
															<div className="multiple-image-alongside-text__stats--stat-number heading-3 mb-0">
																<span className="multiple-image-alongside-text__stats--stat-prefix">
																	{
																		stat.prefix
																	}
																</span>
																<span className="multiple-image-alongside-text__stats--count multiple-image-alongside-text__stats--stat-data">
																	{ stat.number ||
																		EMPTY_STAT_PLACEHOLDER }
																</span>
																<span className="multiple-image-alongside-text__stats--stat-postfix multiple-image-alongside-text__stats--stat-data">
																	{
																		stat.postfix
																	}
																</span>
															</div>
															{ stat.label && (
																<div className="multiple-image-alongside-text__stats--stat-title body1">
																	{
																		stat.label
																	}
																</div>
															) }
															{ stat.description && (
																<div className="multiple-image-alongside-text__stats--stat-description">
																	{
																		stat.description
																	}
																</div>
															) }
														</div>
													);
												}
											) }
										</div>
									) }
								</>
							) }
						</div>
					</div>
				</div>
				<div className="is-style-gl-s50" aria-hidden="true" />
			</div>
		</div>
	);
}
