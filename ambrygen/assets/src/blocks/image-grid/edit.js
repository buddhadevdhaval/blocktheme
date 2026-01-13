import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	TextControl,
	SelectControl,
} from '@wordpress/components';
import { Fragment } from '@wordpress/element';

// Import validation utilities
import { isValidUrl } from '../../utils/validation.js';

// Placeholder image for editor only
const PLACEHOLDER_IMAGE =
	'/wp-content/themes/ambrygen/assets/src/images/uploads/default-image.webp';

export default function Edit( { attributes, setAttributes } ) {
	const { columns, items } = attributes;
	const blockProps = useBlockProps( { className: 'image-grid-block' } );

	const updateItem = ( index, key, value ) => {
		// Validate URLs for the link field
		if ( key === 'link' && ! isValidUrl( value ) ) {
			return; // Don't update if URL is invalid
		}

		const newItems = [ ...items ];
		newItems[ index ] = { ...newItems[ index ], [ key ]: value };
		setAttributes( { items: newItems } );
	};

	const addItem = () => {
		setAttributes( {
			items: [
				...items,
				{
					imageUrl: '',
					imageId: 0,
					title: __( 'Grid Item Title', 'ambrygen-web' ),
					link: '',
				},
			],
		} );
	};

	const removeItem = ( index ) => {
		const newItems = [ ...items ];
		newItems.splice( index, 1 );
		setAttributes( { items: newItems } );
	};

	return (
		<Fragment>
			<div { ...blockProps }>
				<PanelBody
					title={ __( 'Settings', 'ambrygen-web' ) }
					initialOpen={ true }
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
							setAttributes( { columns: parseInt( value, 10 ) } )
						}
					/>
				</PanelBody>

				<div className="grid-items editcodeonly">
					{ items.map( ( item, index ) => (
						<div className="grid-item-editor" key={ index }>
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) => {
										updateItem(
											index,
											'imageUrl',
											media.url
										);
										updateItem(
											index,
											'imageId',
											media.id
										);
									} }
									allowedTypes={ [ 'image' ] }
									render={ ( { open } ) => (
										<Button
											onClick={ open }
											variant="secondary"
										>
											{ item.imageUrl
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

							<img
								src={ item.imageUrl || PLACEHOLDER_IMAGE }
								alt={ item.title }
								style={ {
									maxWidth: '120px',
									display: 'block',
									margin: '10px 0',
									opacity: item.imageUrl ? 1 : 0.4,
								} }
							/>

							<TextControl
								label={ __( 'Title', 'ambrygen-web' ) }
								value={ item.title }
								onChange={ ( value ) =>
									updateItem( index, 'title', value )
								}
							/>
							<TextControl
								label={ __( 'Link', 'ambrygen-web' ) }
								value={ item.link }
								onChange={ ( value ) =>
									updateItem( index, 'link', value )
								}
								help={
									item.link && ! isValidUrl( item.link )
										? __(
												'Invalid URL. Please use a valid http/https URL.',
												'ambrygen-web'
										  )
										: __(
												'Optional: Link for when image is clicked',
												'ambrygen-web'
										  )
								}
								placeholder="https://example.com"
								className={
									item.link && ! isValidUrl( item.link )
										? 'has-error'
										: ''
								}
							/>
							<Button
								variant="destructive"
								onClick={ () => removeItem( index ) }
							>
								{ __( 'Remove Item', 'ambrygen-web' ) }
							</Button>
						</div>
					) ) }
					<Button variant="primary" onClick={ addItem }>
						{ __( 'Add Item', 'ambrygen-web' ) }
					</Button>
				</div>
			</div>
		</Fragment>
	);
}
