/**
 * Shared utilities
 */
import { t } from '../_shared/utils';
import {
	TagSelector,
	ImageUploader,
	ImagePlaceholder,
} from '../_shared/components';

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
	InspectorControls,
	useBlockProps,
} from '@wordpress/block-editor';

/**
 * WordPress UI components.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/components/
 */
import { PanelBody } from '@wordpress/components';

import { dispatch, select } from '@wordpress/data';

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
						value={ counter.number } // keep as string
						onChange={
							( value ) => updateCounter( index, 'number', value ) // remove validateNumber
						}
						placeholder="0"
						aria-label={ t( 'Counter number' ) }
					/>
					<RichText
						tagName="div"
						className="ai-hero__counters--counter-suffix ai-hero__counters--counter-data"
						value={ counter.suffix }
						onChange={ ( value ) =>
							updateCounter( index, 'suffix', value )
						}
						placeholder=""
						aria-label={ t( 'Counter suffix' ) }
					/>
				</div>
				<RichText
					tagName="div"
					className="ai-hero__counters--counter-title body1"
					value={ counter.label }
					onChange={ ( value ) =>
						updateCounter( index, 'label', value )
					}
					placeholder={ t( 'Label' ) }
					aria-label={ t( 'Counter label' ) }
				/>
			</div>
		</>
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
			setAttributes( {
				logoImage: media.url,
				logoImageId: media.id,
				logoImageAlt: media.alt || '',
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
	 * Handles top image selection.
	 * Memoized with useCallback for performance.
	 *
	 * @param {Object} media Selected media object.
	 */

	const handleTopImageSelect = useCallback(
		( media ) => {
			setAttributes( {
				imageTop: media.url,
				imageTopId: media.id,
				imageTopAlt: media.alt || '',
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
			setAttributes( {
				imageBottom: media.url,
				imageBottomId: media.id,
				imageBottomAlt: media.alt || '',
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
					title={ t( 'Heading Settings' ) }
					initialOpen={ openPanel === 'heading' }
					onToggle={ () => {} }
				>
					<TagSelector
						label={ t( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingLevel || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingLevel: value } )
						}
					/>
				</PanelBody>
				<PanelBody
					title={ t( 'Logo Image' ) }
					initialOpen={ openPanel === 'logo' }
					onToggle={ () => {} }
				>
					<ImageUploader
						label={ t( 'Logo Image' ) }
						url={ logoImage }
						onSelect={ handleLogoSelect }
						onRemove={ handleLogoRemove }
					/>
				</PanelBody>

				<PanelBody
					title={ t( 'Top Image' ) }
					initialOpen={ openPanel === 'top' }
					onToggle={ () => {} }
				>
					<ImageUploader
						label={ t( 'Top Image' ) }
						url={ imageTop }
						onSelect={ handleTopImageSelect }
						onRemove={ handleTopImageRemove }
					/>
				</PanelBody>

				<PanelBody
					title={ t( 'Bottom Image' ) }
					initialOpen={ openPanel === 'bottom' }
					onToggle={ () => {} }
				>
					<ImageUploader
						label={ t( 'Bottom Image' ) }
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
													t( 'Company logo' )
												}
											/>
										) : (
											<ImagePlaceholder
												text={ t( 'No logo selected' ) }
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
												t( 'Hero top image' )
											}
										/>
									) : (
										<ImagePlaceholder
											text={ t(
												'No top image selected'
											) }
											instructions={ t(
												'Upload a top image from the sidebar settings.'
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
												t( 'Hero bottom image' )
											}
										/>
									) : (
										<ImagePlaceholder
											text={ t(
												'No bottom image selected'
											) }
											instructions={ t(
												'Upload a bottom image from the sidebar settings.'
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
								className="ai-hero__heading heading-1 mb-0"
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
									placeholder={ t( 'Hero heading…' ) }
									className="hero-heading"
									aria-label={ t( 'Hero heading' ) }
								/>
							</HeadingTag>
							<div className="is-style-gl-s24"></div>
							<div className="ai-hero__description-text body1 block-description">
								<RichText
									tagName="div"
									value={ content }
									onChange={ handleContentChange }
									placeholder={ t( 'Hero content…' ) }
									className=""
									aria-label={ t( 'Hero description' ) }
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
