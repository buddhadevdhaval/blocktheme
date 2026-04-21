import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Fragment, useEffect } from '@wordpress/element';
import {
	Button,
	PanelBody,
} from '@wordpress/components';

import {
	ImageUploader,
	ItemHeader,
	TagSelector,
} from '../_shared/components';

const DEFAULT_ITEM = {
	iconId: 0,
	iconUrl: '',
	iconAlt: '',
	text: '',
};

const MAX_ITEMS = 8;

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, heading, headingTag, description, items = [] } = attributes;

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ blockId, clientId, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'symptoms',
	} );

	const updateItem = ( index, key, value ) => {
		const nextItems = [ ...items ];
		nextItems[ index ] = {
			...nextItems[ index ],
			[ key ]: value,
		};
		setAttributes( { items: nextItems } );
	};

	const addItem = () => {
		if ( items.length >= MAX_ITEMS ) {
			return;
		}

		setAttributes( {
			items: [ ...items, { ...DEFAULT_ITEM } ],
		} );
	};

	const removeItem = ( index ) => {
		if ( items.length <= 1 ) {
			return;
		}

		setAttributes( {
			items: items.filter( ( _, itemIndex ) => itemIndex !== index ),
		} );
	};

	const moveItem = ( index, direction ) => {
		const newIndex = index + direction;

		if ( newIndex < 0 || newIndex >= items.length ) {
			return;
		}

		const nextItems = [ ...items ];
		[ nextItems[ index ], nextItems[ newIndex ] ] = [
			nextItems[ newIndex ],
			nextItems[ index ],
		];
		setAttributes( { items: nextItems } );
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ __( 'Content Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Icon Items', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					{ items.map( ( item, index ) => (
						<div
							key={ `${ item.iconUrl || 'item' }-${ index }` }
							style={ {
								marginBottom: '16px',
								padding: '12px',
								border: '1px solid #ddd',
								borderRadius: '4px',
							} }
						>
							<ItemHeader
								index={ index }
								label={ item.iconAlt || item.text || '' }
								total={ items.length }
								onMove={ moveItem }
								onRemove={ removeItem }
								minCount={ 1 }
							/>

							<ImageUploader
								url={ item.iconUrl }
								label={ __( 'Icon', 'ambrygen-web' ) }
								onSelect={ ( media ) => {
									const nextItems = [ ...items ];
									nextItems[ index ] = {
										...nextItems[ index ],
										iconId: media.id || 0,
										iconUrl: media.url || '',
										iconAlt: media.alt || media.title || '',
									};
									setAttributes( { items: nextItems } );
								} }
								onRemove={ () => {
									updateItem( index, 'iconId', 0 );
									updateItem( index, 'iconUrl', '' );
									updateItem( index, 'iconAlt', '' );
								} }
							/>
						</div>
					) ) }

					<Button
						variant="secondary"
						onClick={ addItem }
						disabled={ items.length >= MAX_ITEMS }
					>
						{ __( 'Add Item', 'ambrygen-web' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="symptoms__grid">
					<div className="symptoms__left">
						{ items.map( ( item, index ) => (
							<div
								key={ `${ item.iconUrl || 'preview' }-${ index }` }
								className="symptoms__item"
							>
								{ item.iconUrl && (
									<img
										src={ item.iconUrl }
										alt={ item.iconAlt || '' }
										className="symptoms__icon"
									/>
								) }
								<RichText
									tagName="div"
									className="symptoms__text"
									value={ item.text || '' }
									onChange={ ( value ) =>
										updateItem( index, 'text', value )
									}
									placeholder={ __(
										'Add item text...',
										'ambrygen-web'
									) }
								/>
							</div>
						) ) }
					</div>

					<div className="symptoms__right">
						<RichText
							tagName={ headingTag || 'h2' }
							className="heading-4 block-title mb-0 symptoms__title"
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							placeholder={ __(
								'Add heading...',
								'ambrygen-web'
							) }
						/>

						<div className="is-style-gl-s12" aria-hidden="true"></div>

						<RichText
							tagName="div"
							className="subtitle1-regular symptoms__desc"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder={ __(
								'Add description...',
								'ambrygen-web'
							) }
						/>
					</div>
				</div>
			</div>
		</Fragment>
	);
}
