import {
	useBlockProps,
	InspectorControls,
	LinkControl,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	TextControl,
	SelectControl,
	Spinner,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';

import { __ } from '@wordpress/i18n';
import { ImageUploader } from '../_shared/components';



export default function Edit( {
	attributes,
	setAttributes,
	context,
	clientId,
} ) {
	const { removeBlock } = useDispatch( 'core/block-editor' );

	const {
		termlinktext,
		icon = {},
		title = '',
		links = [],
		selectedTerm = 0,
		showSelector = false,
		description
	} = attributes;

	const variation = context?.[ 'ambrygen/variation' ];

	const terms = useSelect( ( select ) => {
		return select( 'core' ).getEntityRecords( 'taxonomy', 'test_type', {
			per_page: -1,
		} );
	}, [] );

	const selectedTermData = useSelect(
    (select) => {
        if (!selectedTerm) return null;
        const term = select('core').getEntityRecord('taxonomy', 'test_type', selectedTerm);
        return term ?? null;
    },
    [selectedTerm]
);

	const onSelectTerm = ( termId ) => {
		if ( ! terms ) {
			return;
		}

		const term = terms.find( ( t ) => t.id === Number( termId ) );

		setAttributes( {
			selectedTerm: term.id,
			title: term.name,
			termData: {
				count: term.count,
				image: term.meta?.term_image || '',
			},
		} );
	};

	// const updateLink = ( index, field, value ) => {
	// 	const updated = [ ...links ];

	// 	if ( field === 'url' ) {
	// 		// Only store URL if valid, otherwise empty string
	// 		updated[ index ] = {
	// 			...updated[ index ],
	// 			url: isValidUrl( value ) ? value : '',
	// 		};
	// 	} else {
	// 		updated[ index ] = {
	// 			...updated[ index ],
	// 			[ field ]: value,
	// 		};
	// 	}

	// 	setAttributes( { links: updated } );
	// };
	const updateLink = ( index, field, value ) => {
	const updated = [ ...links ];
	updated[ index ] = {
		...updated[ index ],
		[ field ]: value,
	};

	setAttributes( { links: updated } );
};


		const addLink = () => {
			setAttributes({
				links: [
					...links,
					{
						label: '',
						url: '',
						target: '',
						rel: '',
					},
				],
			});
		};


	const removeLink = ( index ) => {
		const updated = links.filter( ( _, i ) => i !== index );
		setAttributes( { links: updated } );
	};


const imageUrl = useSelect(
	( select ) => {
		if ( ! selectedTerm ) {
			return null;
		}

		const term = select( 'core' ).getEntityRecord(
			'taxonomy',
			'test_type',
			selectedTerm
		);

		const imageId = term?.meta?.term_image;

		if ( ! imageId ) {
			return null;
		}

		const media = select( 'core' ).getMedia( imageId );
		return media?.source_url || null;
	},
	[ selectedTerm ]
);




	const blockProps = useBlockProps({
    className: `${
        variation === 'our-testing-menu' ? ' item-card' : 'info-list__col'
    }`,
});

	return (
		<>
			<InspectorControls>
				<PanelBody title="Card Settings" initialOpen={ true }>
					<TextControl
						label="Title"
						value={ title }
						onChange={ ( val ) => setAttributes( { title: val } ) }
					/>
					{variation === 'our-testing-menu' && (
					<TextControl
						label={ __( 'Button Text', 'ambrygen-web' ) }
						value={ termlinktext }
						onChange={ ( value ) =>
							setAttributes( { termlinktext: value || 'View Test' } )
						}
						placeholder={ __( 'View Tests', 'ambrygen-web' ) }
					/>
					)}

					{variation !== 'our-testing-menu' && (
						<>
					<ImageUploader
						url={ icon?.url }
						label="Icon"
						onSelect={ ( media ) =>
							setAttributes( {
								icon: {
									id: media.id,
									url: media.url,
									alt: media.alt || media.title,
									sizes: media.sizes || {},
								},
							} )
						}
						onRemove={ () =>
							setAttributes( { icon: {} } )
						}
					/>


					{ links.map( ( link, i ) => (
						<div
							key={ i }
							style={ {
								marginTop: 12,
								padding: 12,
								border: '1px solid #ddd',
								borderRadius: 4,
							} }
						>
							<TextControl
								label={ `Link ${ i + 1 } Label` }
								value={ link.label }
								onChange={ ( val ) =>
									updateLink( i, 'label', val )
								}
							/>
							{/* <TextControl
								label={ `Link ${ i + 1 } URL` }
								value={ link.url }
								help="Only http:// or https:// URLs are allowed"
								onChange={ ( val ) =>
									updateLink( i, 'url', val )
								}
							/> */}
							<LinkControl
								value={{
									url: link.url || '',
									opensInNewTab: link.target === '_blank',
								}}
								onChange={(newLink) => {
									const updated = [...links];

									updated[i] = {
										...updated[i],
										url: newLink.url,
										target: newLink.opensInNewTab ? '_blank' : '',
										rel: newLink.opensInNewTab
											? 'noopener noreferrer'
											: '',
									};

									setAttributes({ links: updated });
								}}
							/>

							<Button
								onClick={ () => removeLink( i ) }
								isDestructive
								style={ { marginTop: 8 } }
							>
								Remove Link
							</Button>
						</div>
					) ) }

					<Button
						onClick={ addLink }
						isSecondary
						style={ { marginTop: 12 } }
					>
						Add Link
					</Button>

					</>
					)}


				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>


				{ variation === 'variation-4' && (
								<div className="icon-grid__item">
									<div className="icon-grid__icon">
										{ icon?.url && (
											<img src={ icon.url } alt={ icon.alt || '' } />
										)}
									</div>
				
										<RichText
										tagName="h3"
										className="icon-grid__item-title text-xl-semibold mb-0"
										value={ title }
										onChange={ ( value ) =>
											setAttributes( { title: value } )
										}
										placeholder="Enter title..."
									/>
				
									<div
										className="is-style-gl-s8"
										aria-hidden="true"
									></div>
				
										<RichText
											tagName="div"
											className="icon-grid__item-description text-md-reg"
											value={ description }
											onChange={ ( value ) =>
												setAttributes( { description: value } )
											}
											placeholder="Enter description..."
										/>
				
									<div
										className="is-style-gl-s20"
										aria-hidden="true"
									></div>
				
										{ links?.[0]?.url && links?.[0]?.label && (
											<a
												href={ links[0].url }
												target={ links[0].target || undefined }
												rel={ links[0].rel || undefined }
												className="site-btn is-style-site-text-btn has-icon"
												onClick={ ( e ) => e.preventDefault() }
											>
												{ links[0].label }
											</a>
										)}
				
							</div>
				)}


		{/* OUR TESTING MENU MODE */}
		{ variation === 'our-testing-menu' && (
			<>
				{/* No Term Selected */}
				{ !selectedTerm && !showSelector && (
					<div className="info-list__actions">
						<Button
							isPrimary
							onClick={() =>
								setAttributes({ showSelector: true })
							}
						>
							Add Test Type
						</Button>
					</div>
				)}

				{/* Show Dropdown */}
				{ showSelector && (
					<>
						{ !terms && <Spinner /> }

						{ terms && (
							<SelectControl
								label="Select Test Type"
								value=""
								options={[
									{ label: 'Select Test Type', value: '' },
									...terms.map((term) => ({
										label: `${term.name} (${term.count})`,
										value: term.id,
									})),
								]}
								onChange={(value) => {
									onSelectTerm(value);
									setAttributes({ showSelector: false });
								}}
							/>
						)}
					</>
				)}

				{/* Selected Preview */}
				{ selectedTerm && (
					<>
						<div className="item-card__icon">
							{ imageUrl  && (
								<img src={ imageUrl } alt="" />
							)}
						</div>

						<div className="item-card__content">
							<div className='item-card__info'>
								<div className="item-card__category body2-medium">
									{ title }
								</div>

							{ selectedTermData?.count != null && (
								<div className="item-card__title subtitle2-sbold">
									{ selectedTermData.count }
								</div>
							)}
							</div>
					<a
						className="site-btn is-style-site-text-btn has-icon icon-arrow-up text-14"
						href="#"
						onClick={ ( e ) => e.preventDefault() }
					>
						{ termlinktext || __( 'View Tests', 'ambrygen-web' ) }
					</a>
					<div className="is-style-gl-s32" aria-hidden="true"></div>
							<div className="info-list__actions actions-button">
								<Button
									isSecondary
									onClick={() =>
										setAttributes({
											selectedTerm: 0,
											showSelector: false,
										})
									}
								>
									Change
								</Button>

								<Button
									isDestructive
									onClick={() =>
										removeBlock(clientId)
									}
								>
									Remove
								</Button>
							</div>
						</div>
					</>
				)}
			</>

		)}

		{/* DEFAULT VARIATION MODE */}
		{ variation !== 'our-testing-menu' && 
		variation !== 'variation-4' &&(
				<div className="info-list__card">

			<>
				<div className="info-list__image">
					{ icon?.url && (
						<img src={ icon.url } alt={ icon.alt || '' } />
					)}
				</div>

				<div className="info-list__content">
					<div className="subtitle1-sbold info-list__title">
						{ title }
					</div>

					<div className="is-style-gl-s8"></div>

					<div className="info-list__links">
						{ links.map(
							( link, i ) =>
								link.label &&
								link.url && (
									<div
										key={ i }
										className="info-list__link-col text-md-Semibold"
									>
										<a
											href="#"
											className="info-list__link"
										>
											{ link.label }
										</a>
									</div>
								)
						)}
					</div>
				</div>
			</>
			</div>
		)}


</div>

		</>
	);
}
