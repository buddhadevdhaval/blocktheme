import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import { Fragment, useState } from '@wordpress/element';

const PLACEHOLDER_IMAGE =
	'/wp-content/themes/ambrygen/assets/src/images/uploads/default-image.webp';

const GALLERY_VARIATIONS = [
	{
		key: 'default',
		label: 'Default',
		preview:
			'/wp-content/themes/ambrygen/assets/src/blocks/gallery/default.png',
	},
	{
		key: 'two-column',
		label: 'Two Column',
		preview:
			'/wp-content/themes/ambrygen/assets/src/blocks/gallery/default.png',
	},
	{
		key: 'illustration',
		label: 'With Illustration',
		preview:
			'/wp-content/themes/ambrygen/assets/src/blocks/gallery/default.png',
	},
	{
		key: 'image',
		label: 'With Image',
		preview:
			'/wp-content/themes/ambrygen/assets/src/blocks/gallery/default.png',
	},
];

export default function Edit( { attributes, setAttributes } ) {
	const addItem = () => {
		setAttributes( {
			items: [
				...items,
				{
					imageUrl: '',
					imageId: 0,
					title: __( 'Grid Item Title', 'ambrygen-web' ),
					headingTag: 'h5',
					description: '',
					link: '',
				},
			],
		} );

		setSelectedIndex( items.length );
	};
	const removeItem = ( index ) => {
		const newItems = [ ...items ];
		newItems.splice( index, 1 );

		setAttributes( { items: newItems } );

		setSelectedIndex( Math.max( 0, index - 1 ) );
	};

	const updateItem = ( key, value ) => {
		const newItems = [ ...items ];
		newItems[ selectedIndex ] = {
			...newItems[ selectedIndex ],
			[ key ]: value,
		};

		setAttributes( { items: newItems } );
	};

	const { columns, items = [], variation = 'default' } = attributes;

	const blockProps = useBlockProps( {
		className: `image-grid-block variation-${ variation } columns-${ columns }`,
	} );

	const [ selectedIndex, setSelectedIndex ] = useState( 0 );

	return (
		<Fragment>
			{ /* ================= Inspector ================= */ }
			<InspectorControls>
				{ /* Choose Variation */ }
				<PanelBody
					title={ __( 'Choose Variation', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<div className="ambrygen-variation-selector">
						{ GALLERY_VARIATIONS.map( ( option ) => (
							<button
								key={ option.key }
								type="button"
								className={ `variation-card ${
									variation === option.key ? 'is-active' : ''
								}` }
								onClick={ () =>
									setAttributes( { variation: option.key } )
								}
							>
								<img
									src={ option.preview }
									alt={ option.label }
								/>
								<span>{ option.label }</span>
							</button>
						) ) }
					</div>
				</PanelBody>

				{ /* Settings */ }
				<PanelBody
					title={ __( 'Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<SelectControl
						label={ __( 'Columns', 'ambrygen-web' ) }
						value={ columns }
						options={ [
							{ label: '1', value: 1 },
							{ label: '2', value: 2 },
							{ label: '3', value: 3 },
							{ label: '4', value: 4 },
						] }
						onChange={ ( value ) =>
							setAttributes( {
								columns: parseInt( value, 10 ),
							} )
						}
					/>
				</PanelBody>

				{ /* Selected Item Image */ }
				{ items[ selectedIndex ] && (
					<PanelBody
						title={ __( 'Selected Item Image', 'ambrygen-web' ) }
						initialOpen={ false }
					>
						<MediaUploadCheck>
							<MediaUpload
								allowedTypes={ [ 'image' ] }
								value={ items[ selectedIndex ].imageId }
								onSelect={ ( media ) => {
									const newItems = [ ...items ];
									newItems[ selectedIndex ] = {
										...newItems[ selectedIndex ],
										imageUrl: media.url,
										imageId: media.id,
									};
									setAttributes( { items: newItems } );
								} }
								render={ ( { open } ) => (
									<Button
										variant="secondary"
										onClick={ open }
									>
										{ items[ selectedIndex ].imageUrl
											? __(
													'Change Image',
													'ambrygen-web'
											  )
											: __(
													'Select Image',
													'ambrygen-web'
											  ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>

						{ items[ selectedIndex ].imageUrl && (
							<img
								src={ items[ selectedIndex ].imageUrl }
								alt=""
								style={ { width: '100%', marginTop: '10px' } }
							/>
						) }
					</PanelBody>
				) }

				{ items[ selectedIndex ] && (
					<PanelBody
						title={ __( 'Selected Item Content', 'ambrygen-web' ) }
						initialOpen={ true }
					>
						<TextControl
							label={ __( 'Title', 'ambrygen-web' ) }
							value={ items[ selectedIndex ].title }
							onChange={ ( value ) =>
								updateItem( 'title', value )
							}
						/>

						<SelectControl
							label={ __( 'Heading Type', 'ambrygen-web' ) }
							value={ items[ selectedIndex ].headingTag }
							options={ [
								{ label: 'H3', value: 'h3' },
								{ label: 'H4', value: 'h4' },
								{ label: 'H5', value: 'h5' },
								{ label: 'Paragraph', value: 'p' },
							] }
							onChange={ ( value ) =>
								updateItem( 'headingTag', value )
							}
						/>

						<TextControl
							label={ __( 'Link', 'ambrygen-web' ) }
							value={ items[ selectedIndex ].link }
							onChange={ ( value ) =>
								updateItem( 'link', value )
							}
						/>

						{ /* Show description ONLY if columns > 2 */ }
						{ columns > 2 && (
							<TextControl
								label={ __( 'Description', 'ambrygen-web' ) }
								value={ items[ selectedIndex ].description }
								onChange={ ( value ) =>
									updateItem( 'description', value )
								}
							/>
						) }

						<Button
							isDestructive
							onClick={ () => removeItem( selectedIndex ) }
							style={ { marginTop: '12px' } }
						>
							{ __( 'Remove Item', 'ambrygen-web' ) }
						</Button>
					</PanelBody>
				) }

				<PanelBody>
					<Button variant="primary" onClick={ addItem }>
						{ __( 'Add Grid Item', 'ambrygen-web' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			{ /* ================= Block Canvas ================= */ }
			<div { ...blockProps } className="wp-block-group">
				<section className="container-1340">
					<div className="is-style-gl-s48" />

					<div className="wrapper">
						<div className="get-started-ambry-block">
							<h2 className="block-title heading-3 mb-0">
								<span>
									{ __( 'Get Started', 'ambrygen-web' ) }
								</span>{ ' ' }
								{ __( 'with Ambry', 'ambrygen-web' ) }
							</h2>

							<div className="card-grid-block">
								{ items.map( ( item, index ) => {
									const HeadingTag = item.headingTag || 'h5';
									const Tag = item.link ? 'a' : 'div';

									return (
										<Tag
											key={ index }
											href={ item.link || undefined }
											className={ `card-col ${
												selectedIndex === index
													? 'is-selected'
													: ''
											}` }
											onClick={ ( e ) => {
												e.preventDefault();
												setSelectedIndex( index );
											} }
										>
											<div className="image-block">
												<img
													src={
														item.imageUrl ||
														PLACEHOLDER_IMAGE
													}
													alt={
														item.title ||
														__(
															'Company logo',
															'ambrygen-web'
														)
													}
													style={ {
														maxWidth: '100%',
														height: 'auto',
														opacity: item.imageUrl
															? 1
															: 0.4,
													} }
												/>
											</div>

											<div className="card-info">
												<HeadingTag className="link-btn mb-0">
													{ item.title }
												</HeadingTag>

												{ item.description && (
													<div className="card-description text-small">
														{ item.description }
													</div>
												) }
											</div>
										</Tag>
									);
								} ) }
							</div>
						</div>
					</div>

					<div className="is-style-gl-s48" />
				</section>
			</div>
		</Fragment>
	);
}
