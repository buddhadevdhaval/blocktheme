/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hooks for performance optimization.
 *
 * @see https://react.dev/reference/react
 */
import { useCallback, useState, useEffect } from '@wordpress/element';
/**
 * Core block editor components for building the block interface.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/
 */
import {
	RichText,
	MediaUpload,
	MediaUploadCheck,
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
	Placeholder,
	PanelBody,
	PanelRow,
	SelectControl,
} from '@wordpress/components';

import { dispatch, select } from '@wordpress/data';

/**
 * Import validation utilities.
 */
import { validateNumber } from '../../utils/validation.js';

/**
 * MediaUploadPanel Component
 *
 * Reusable component for handling media upload, preview, and removal.
 * Follows DRY principle and WordPress VIP best practices.
 *
 * @param {Object}   props                Component properties.
 * @param {string}   props.title          Panel title.
 * @param {string}   props.imageUrl       Current image URL.
 * @param {string}   props.imageAlt       Current image alt text.
 * @param {Function} props.onSelect       Callback when image is selected.
 * @param {Function} props.onRemove       Callback when image is removed.
 * @param {string}   props.selectLabel    Label for select button.
 * @param {string}   props.replaceLabel   Label for replace button.
 * @param {string}   props.removeLabel    Label for remove button.
 * @param {string}   props.uploadedLabel  Label shown when image is uploaded.
 * @param {string}   props.placeholderAlt Default alt text for placeholder.
 * @return {JSX.Element} MediaUploadPanel component.
 */

function MediaUploadPanel( {
	title,
	imageUrl,
	imageAlt,
	onSelect,
	onRemove,
	selectLabel,
	replaceLabel,
	removeLabel,
	uploadedLabel,
	placeholderAlt,
	isOpen,
} ) {
	return (
		<PanelBody title={ title } initialOpen={ isOpen } onToggle={ () => {} }>
			<PanelRow>
				{ ! imageUrl ? (
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelect }
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button onClick={ open } variant="primary">
									{ selectLabel }
								</Button>
							) }
						/>
					</MediaUploadCheck>
				) : (
					<div className="image-preview">
						<img
							src={ imageUrl }
							alt={ imageAlt || placeholderAlt }
						/>
						<div className="image-info">
							<p className="image-size">{ uploadedLabel }</p>
							{ imageAlt && (
								<p className="image-alt">
									{ __( 'Alt text:', 'ambrygen-web' ) }{ ' ' }
									{ imageAlt }
								</p>
							) }
						</div>
						<MediaUploadCheck>
							<MediaUpload
								onSelect={ onSelect }
								allowedTypes={ [ 'image' ] }
								render={ ( { open } ) => (
									<Button
										onClick={ open }
										variant="secondary"
									>
										{ replaceLabel }
									</Button>
								) }
							/>
						</MediaUploadCheck>
						<Button
							onClick={ onRemove }
							variant="link"
							isDestructive
						>
							{ removeLabel }
						</Button>
					</div>
				) }
			</PanelRow>
		</PanelBody>
	);
}

/**
 * CounterItem Component
 *
 * Renders a single counter item with prefix, number, suffix, and label.
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
		<>
			<div className="ai-hero__counters--counter-item" key={ index }>
				<div className="ai-hero__counters--counter-number heading-3 mb-0">
					<RichText
						tagName="div"
						className="ai-hero__counters--count ai-hero__counters--counter-data"
						value={ counter.number }
						onChange={ ( value ) =>
							updateCounter(
								index,
								'number',
								validateNumber( value )
							)
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
					onChange={ ( value ) =>
						updateCounter( index, 'label', value )
					}
					placeholder={ __( 'Label', 'ambrygen-web' ) }
					aria-label={ __( 'Counter label', 'ambrygen-web' ) }
				/>
			</div>
		</>
	);
}

/**
 * ImagePlaceholder Component
 *
 * Displays a placeholder when no image is selected.
 * Extracted for consistency and reusability.
 *
 * @param {Object} props              Component properties.
 * @param {string} props.label        Placeholder label.
 * @param {string} props.instructions Placeholder instructions.
 * @return {JSX.Element} ImagePlaceholder component.
 */
function ImagePlaceholder( { label, instructions } ) {
	return (
		<Placeholder
			icon="format-image"
			label={ label }
			instructions={ instructions }
		/>
	);
}

/**
 * Edit component for the AI Hero Section block.
 *
 * Renders the block interface in the editor with:
 * - Three configurable images (logo, top, bottom)
 * - Rich text heading and content
 * - Four animated counters with prefix, number, suffix, and label
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @param {Object}   props               Block properties.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Function to update attributes.
 * @return {JSX.Element} Block editor interface element.
 */
export default function Edit( { attributes, setAttributes } ) {
	const {
		heading,
		content,
		counters,
		imageTop,
		imageTopAlt,
		imageBottom,
		imageBottomAlt,
		logoImage,
		logoImageAlt,
		headingLevel,
	} = attributes;

	const [ openPanel, setOpenPanel ] = useState( null );

	/**
	 * Updates a specific counter in the counters array.
	 * Memoized with useCallback for performance optimization.
	 *
	 * @param {number} index Counter index.
	 * @param {string} field Field name (number, prefix, suffix, label).
	 * @param {string} value New value.
	 */
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

	/**
	 * Handles logo image selection.
	 * Memoized with useCallback for performance.
	 *
	 * @param {Object} media Selected media object.
	 */
	const handleLogoSelect = useCallback(
		( media ) => {
			const sizes = media?.sizes || media?.media_details?.sizes || {};

			setAttributes( {
				logoImage: media.url,
				logoImageId: media.id,
				logoImageAlt: media.alt || '',
				logoImageSrcSet: buildSrcSet( sizes ),
				logoImageSizes: '(max-width: 768px) 50vw, 200px',
			} );
		},
		[ setAttributes ]
	);

	/**
	 * Handles logo image removal.
	 * Memoized with useCallback for performance.
	 */
	const handleLogoRemove = useCallback( () => {
		setAttributes( {
			logoImage: '',
			logoImageId: 0,
			logoImageAlt: '',
		} );
	}, [ setAttributes ] );

	/**
	 * Builds a srcset string from WordPress media sizes.
	 *
	 * @param {Object<string, {url: string, width: number}>} sizes
	 *                                                             Media sizes object returned by Media Library.
	 *
	 * @return {string} Generated srcset string.
	 */
	const buildSrcSet = ( sizes = {} ) => {
		return Object.values( sizes )
			.filter( ( size ) => size?.url && size?.width )
			.map( ( size ) => `${ size.url } ${ size.width }w` )
			.join( ', ' );
	};
	/**
	 * Handles top image selection.
	 * Memoized with useCallback for performance.
	 *
	 * @param {Object} media Selected media object.
	 */

	const handleTopImageSelect = useCallback(
		( media ) => {
			const sizes = media?.sizes || media?.media_details?.sizes || {};
			setAttributes( {
				imageTop: media.url,
				imageTopId: media.id,
				imageTopAlt: media.alt || '',
				imageTopSrcSet: buildSrcSet( sizes ),
				imageTopSizes: '(max-width: 768px) 100vw, 50vw',
			} );
		},
		[ setAttributes ]
	);

	/**
	 * Handles top image removal.
	 * Memoized with useCallback for performance.
	 */
	const handleTopImageRemove = useCallback( () => {
		setAttributes( {
			imageTop: '',
			imageTopId: 0,
			imageTopAlt: '',
		} );
	}, [ setAttributes ] );

	/**
	 * Handles bottom image selection.
	 * Memoized with useCallback for performance.
	 *
	 * @param {Object} media Selected media object.
	 */
	const handleBottomImageSelect = useCallback(
		( media ) => {
			const sizes = media?.sizes || media?.media_details?.sizes || {};
			setAttributes( {
				imageBottom: media.url,
				imageBottomId: media.id,
				imageBottomAlt: media.alt || '',
				imageBottomSrcSet: buildSrcSet( sizes ),
				imageBottomSizes: '(max-width: 768px) 100vw, 50vw',
			} );
		},
		[ setAttributes ]
	);

	/**
	 * Handles bottom image removal.
	 * Memoized with useCallback for performance.
	 */
	const handleBottomImageRemove = useCallback( () => {
		setAttributes( {
			imageBottom: '',
			imageBottomId: 0,
			imageBottomAlt: '',
		} );
	}, [ setAttributes ] );

	/**
	 * Handles heading change.
	 * Memoized with useCallback for performance.
	 *
	 * @param {string} value New heading value.
	 */
	const handleHeadingChange = useCallback(
		( value ) => {
			setAttributes( { heading: value } );
		},
		[ setAttributes ]
	);

	useEffect( () => {
		const isOpen = select( 'core/edit-post' ).isEditorSidebarOpened();

		if ( ! isOpen ) {
			dispatch( 'core/edit-post' ).openGeneralSidebar(
				'edit-post/block'
			);
		}
	}, [] );

	const handlePanelOpen = ( panel ) => {
		dispatch( 'core/edit-post' ).openGeneralSidebar( 'edit-post/block' );
		setOpenPanel( panel );
	};

	/**
	 * Handles content change.
	 * Memoized with useCallback for performance.
	 *
	 * @param {string} value New content value.
	 */
	const handleContentChange = useCallback(
		( value ) => {
			setAttributes( { content: value } );
		},
		[ setAttributes ]
	);

	const blockProps = useBlockProps();
	const HeadingTag = headingLevel || 'h2';

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ openPanel === 'heading' }
					onToggle={ () => {} }
				>
					<SelectControl
						label={ __( 'Heading Level', 'ambrygen-web' ) }
						value={ headingLevel }
						options={ [
							{ label: 'H1', value: 'h1' },
							{ label: 'H2', value: 'h2' },
							{ label: 'H3', value: 'h3' },
							{ label: 'H4', value: 'h4' },
							{ label: 'H5', value: 'h5' },
							{ label: 'H6', value: 'h6' },
						] }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>
				<MediaUploadPanel
					title={ __( 'Logo Image', 'ambrygen-web' ) }
					imageUrl={ logoImage }
					imageAlt={ logoImageAlt }
					onSelect={ handleLogoSelect }
					onRemove={ handleLogoRemove }
					selectLabel={ __( 'Select Logo Image', 'ambrygen-web' ) }
					replaceLabel={ __( 'Replace Logo', 'ambrygen-web' ) }
					removeLabel={ __( 'Remove Logo', 'ambrygen-web' ) }
					uploadedLabel={ __( 'Logo uploaded', 'ambrygen-web' ) }
					placeholderAlt={ __( 'Company logo', 'ambrygen-web' ) }
					isOpen={ openPanel === 'logo' }
				/>

				<MediaUploadPanel
					title={ __( 'Top Image', 'ambrygen-web' ) }
					imageUrl={ imageTop }
					imageAlt={ imageTopAlt }
					onSelect={ handleTopImageSelect }
					onRemove={ handleTopImageRemove }
					selectLabel={ __( 'Select Top Image', 'ambrygen-web' ) }
					replaceLabel={ __( 'Replace Top Image', 'ambrygen-web' ) }
					removeLabel={ __( 'Remove Image', 'ambrygen-web' ) }
					uploadedLabel={ __( 'Top image uploaded', 'ambrygen-web' ) }
					placeholderAlt={ __( 'Hero top image', 'ambrygen-web' ) }
					isOpen={ openPanel === 'top' }
				/>

				<MediaUploadPanel
					title={ __( 'Bottom Image', 'ambrygen-web' ) }
					imageUrl={ imageBottom }
					imageAlt={ imageBottomAlt }
					onSelect={ handleBottomImageSelect }
					onRemove={ handleBottomImageRemove }
					selectLabel={ __( 'Select Bottom Image', 'ambrygen-web' ) }
					replaceLabel={ __(
						'Replace Bottom Image',
						'ambrygen-web'
					) }
					removeLabel={ __( 'Remove Image', 'ambrygen-web' ) }
					uploadedLabel={ __(
						'Bottom image uploaded',
						'ambrygen-web'
					) }
					placeholderAlt={ __( 'Hero bottom image', 'ambrygen-web' ) }
					isOpen={ openPanel === 'bottom' }
				/>
			</InspectorControls>

			<div className="ai-hero">
				<div className="is-style-gl-s50" />
				<div className="ai-hero__grid">
					<div className="ai-hero__col ai-hero__col--images">
						<div className="ai-hero__images">
							<div className="ai-hero__image-wrapper">
								<div className="ai-hero__logo">
									<div
										className="ai-hero__logo-inner"
										role="button"
										tabIndex={ 0 }
										onClick={ () =>
											handlePanelOpen( 'logo' )
										}
										onKeyDown={ ( e ) => {
											if (
												e.key === 'Enter' ||
												e.key === ' '
											) {
												handlePanelOpen( 'logo' );
											}
										} }
									>
										{ logoImage ? (
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
										) : (
											<ImagePlaceholder
												label={ __(
													'No logo selected',
													'ambrygen-web'
												) }
											/>
										) }
									</div>
								</div>
							</div>
							<div className="ai-hero__image-wrapper">
								<div
									className="ai-hero__image"
									role="button"
									tabIndex={ 0 }
									onClick={ () => handlePanelOpen( 'top' ) }
									onKeyDown={ ( e ) => {
										if (
											e.key === 'Enter' ||
											e.key === ' '
										) {
											handlePanelOpen( 'top' );
										}
									} }
								>
									{ imageTop ? (
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
									) : (
										<ImagePlaceholder
											label={ __(
												'No top image selected',
												'ambrygen-web'
											) }
											instructions={ __(
												'Upload a top image from the sidebar settings.',
												'ambrygen-web'
											) }
										/>
									) }
								</div>
							</div>
							<div
								className="ai-hero__image-wrapper ai-hero__image-wrapper--full"
								role="button"
								tabIndex={ 0 }
								onClick={ () => handlePanelOpen( 'bottom' ) }
								onKeyDown={ ( e ) => {
									if ( e.key === 'Enter' || e.key === ' ' ) {
										handlePanelOpen( 'bottom' );
									}
								} }
							>
								<div className="ai-hero__image">
									{ imageBottom ? (
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
									) : (
										<ImagePlaceholder
											label={ __(
												'No bottom image selected',
												'ambrygen-web'
											) }
											instructions={ __(
												'Upload a bottom image from the sidebar settings.',
												'ambrygen-web'
											) }
										/>
									) }
								</div>
							</div>
						</div>
					</div>
					<div className="ai-hero__col ai-hero__col--content">
						<div className="ai-hero__content">
							<HeadingTag
								className="ai-hero__heading heading-2 mb-0"
								role="button"
								tabIndex={ 0 }
								onClick={ () => handlePanelOpen( 'heading' ) }
								onKeyDown={ ( e ) => {
									if ( e.key === 'Enter' || e.key === ' ' ) {
										handlePanelOpen( 'heading' );
									}
								} }
							>
								<RichText
									tagName="div"
									value={ heading }
									onChange={ handleHeadingChange }
									allowedFormats={ [
										'core/bold',
										'core/italic',
										'core/text-color',
									] }
									placeholder={ __(
										'Hero heading…',
										'ambrygen-web'
									) }
									className="hero-heading"
									aria-label={ __(
										'Hero heading',
										'ambrygen-web'
									) }
								/>
							</HeadingTag>
							<div className="is-style-gl-s24"></div>
							<div className="ai-hero__description body1">
								<RichText
									tagName="p"
									value={ content }
									onChange={ handleContentChange }
									placeholder={ __(
										'Hero content…',
										'ambrygen-web'
									) }
									className=""
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
