import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Fragment, useEffect } from '@wordpress/element';
import {
	Button,
	Notice,
	PanelBody,
	TextControl,
} from '@wordpress/components';

import {
	BlockExamplePreview,
	ImageUploader,
	ItemHeader,
	TagSelector,
} from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';

function createItemId() {
	return `icon-item-${ Date.now() }-${ Math.random()
		.toString( 36 )
		.slice( 2, 10 ) }`;
}

function createDefaultItem() {
	return {
		id: createItemId(),
		iconId: 0,
		iconUrl: '',
		iconAlt: '',
		text: '',
	};
}

function normalizeItemsWithIds( items = [] ) {
	let hasChanges = false;

	const normalizedItems = items.map( ( item ) => {
		if ( item?.id ) {
			return item;
		}

		hasChanges = true;

		return {
			...item,
			id: createItemId(),
		};
	} );

	return {
		hasChanges,
		normalizedItems,
	};
}

function sanitizePlainText( text = '' ) {
	return text.replace( /<[^>]*>/g, ' ' ).replace( /\s+/g, ' ' ).trim();
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		anchor,
		heading,
		headingTag,
		description,
		items = [],
	} = attributes;
	const HeadingTag = headingTag || 'h2';
	const isExample = blockId === 'icon-with-split-content-example';

	useUniqueBlockId( {
		blockId,
		clientId,
		setAttributes,
		enabled: ! isExample,
	} );

	useEffect( () => {
		if ( isExample ) {
			return;
		}

		const { hasChanges, normalizedItems } = normalizeItemsWithIds( items );

		if ( hasChanges ) {
			setAttributes( { items: normalizedItems } );
		}
	}, [ isExample, items, setAttributes ] );

	const blockProps = useBlockProps( {
		className: 'symptoms',
		id: anchor || blockId || undefined,
	} );

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="icon-with-split-content-example-preview"
				imagePath="/assets/src/images/icon-with-split-content/preview.png"
			/>
		);
	}

	const updateItem = ( itemId, updates ) => {
		setAttributes( {
			items: items.map( ( item ) =>
				item.id === itemId ? { ...item, ...updates } : item
			),
		} );
	};

	const addItem = () => {
		setAttributes( {
			items: [ ...items, createDefaultItem() ],
		} );
	};

	const removeItem = ( index ) => {
		const itemId = items[ index ]?.id;

		if ( ! itemId ) {
			return;
		}

		setAttributes( {
			items: items.filter( ( item ) => item.id !== itemId ),
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
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag || 'h2' }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						type="heading"
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Repeater', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					{ items.map( ( item, index ) => (
						<div key={ item.id }>
							<ItemHeader
								index={ index }
								label={
									sanitizePlainText( item.text || '' ) ||
									__( 'Title', 'ambrygen-web' )
								}
								total={ items.length }
								onMove={ moveItem }
								onRemove={ removeItem }
								minCount={ 0 }
							/>

							<ImageUploader
								url={ item.iconUrl }
								label={ __( 'ICON', 'ambrygen-web' ) }
								onSelect={ ( media ) => {
									updateItem( item.id, {
										iconId: media.id || 0,
										iconUrl: media.url || '',
										iconAlt: media.alt || '',
									} );
								} }
								onRemove={ () => {
									updateItem( item.id, {
										iconId: 0,
										iconUrl: '',
										iconAlt: '',
									} );
								} }
							/>

							<TextControl
								label={ __( 'Title', 'ambrygen-web' ) }
								value={ item.text || '' }
								onChange={ ( value ) =>
									updateItem( item.id, {
										text: value,
									} )
								}
								placeholder={ __( 'Title', 'ambrygen-web' ) }
							/>
						</div>
					) ) }

					<Button variant="secondary" onClick={ addItem }>
						{ __( 'Add Item', 'ambrygen-web' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="symptoms__grid">
					<div className="symptoms__left">
						{ items.length === 0 && (
							<Notice status="info" isDismissible={ false }>
								{ __(
									'Add each icon image from the left-side repeater settings panel.',
									'ambrygen-web'
								) }
							</Notice>
						) }

						{ items.map( ( item ) => (
							<div
								key={ item.id }
								className="symptoms__item"
							>
								{ item.iconUrl && (
									<img
										src={ item.iconUrl }
										alt={ item.iconAlt || '' }
										className="symptoms__icon"
									/>
								) }
								<div className="symptoms__text">
									{ sanitizePlainText( item.text || '' ) ||
										__( 'Title', 'ambrygen-web' ) }
								</div>
							</div>
						) ) }
					</div>

					<div className="symptoms__right">
						<RichText
							tagName={ HeadingTag }
							className="heading-4 block-title mb-0 symptoms__title"
							value={ heading }
							onChange={ ( value ) =>
								setAttributes( { heading: value } )
							}
							placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
						/>

						<div className="is-style-gl-s12" aria-hidden="true"></div>

						<RichText
							tagName="div"
							className="subtitle1-regular symptoms__desc"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder={ __( 'Add Description...', 'ambrygen-web' ) }
						/>
					</div>
				</div>
			</div>
		</Fragment>
	);
}
