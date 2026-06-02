import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Button, PanelBody } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { __ } from '@wordpress/i18n';
import {
	BlockExamplePreview,
	CtaButtonField,
	ItemHeader,
	TagSelector,
} from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';

const createLinkId = () =>
	`link-${ Date.now().toString( 36 ) }-${ Math.random()
		.toString( 36 )
		.slice( 2, 8 ) }`;

const createLink = () => ( {
	id: createLinkId(),
	text: '',
	url: '',
	target: '',
	rel: '',
} );

const normalizeLinks = ( links = [] ) =>
	links.map( ( link ) => ( {
		id: link?.id || createLinkId(),
		text: link?.text || '',
		url: link?.url || '',
		target: link?.target || '',
		rel: link?.rel || '',
	} ) );

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, anchor, title, headingTag, links = [] } = attributes;
	const isExample = blockId === 'example-block-preview';

	useUniqueBlockId( {
		blockId,
		clientId,
		enabled: ! isExample,
		idPrefix: 'link-list',
		setAttributes,
	} );

	const linkItemsLength = links.length;
	const hasMissingLinkIds = links.some( ( link ) => ! link?.id );

	useEffect( () => {
		if ( isExample ) {
			return;
		}

		if ( ! linkItemsLength ) {
			setAttributes( { links: [ createLink() ] } );
			return;
		}

		if ( hasMissingLinkIds ) {
			setAttributes( {
				links: normalizeLinks( links ),
			} );
		}
	}, [
		hasMissingLinkIds,
		isExample,
		linkItemsLength,
		links,
		setAttributes,
	] );

	const updateLinkItem = ( linkId, value ) => {
		setAttributes( {
			links: normalizeLinks(
				links.map( ( link ) =>
					link.id === linkId ? { ...link, ...value } : link
				)
			),
		} );
	};

	const addLinkItem = () => {
		setAttributes( {
			links: normalizeLinks( [ ...links, createLink() ] ),
		} );
	};

	const removeLinkItem = ( linkId ) => {
		if ( links.length <= 1 ) {
			return;
		}

		setAttributes( {
			links: normalizeLinks(
				links.filter( ( link ) => link.id !== linkId )
			),
		} );
	};

	const moveLinkItem = ( index, direction ) => {
		const nextIndex = index + direction;

		if ( nextIndex < 0 || nextIndex >= links.length ) {
			return;
		}

		const reorderedItems = [ ...links ];
		[ reorderedItems[ index ], reorderedItems[ nextIndex ] ] = [
			reorderedItems[ nextIndex ],
			reorderedItems[ index ],
		];

		setAttributes( { links: normalizeLinks( reorderedItems ) } );
	};

	const blockProps = useBlockProps( {
		className: 'download-list block-layout',
		id: anchor || blockId,
	} );

	const itemsAllowedBlocks = [
		'core/paragraph',
		'core/buttons',
		'core/button',
		'core/spacer',
	];

	const itemsTemplate = [
		[
			'core/paragraph',
			{ placeholder: __( 'Add content...', 'ambrygen-web' ) },
		],
	];

	if ( isExample ) {
		return (
			<BlockExamplePreview
				className="example-block-preview"
				imagePath="/assets/src/images/link-list/preview.png"
			/>
		);
	}

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						type="heading"
						onChange={ ( val ) =>
							setAttributes( { headingTag: val } )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Links', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					{ links.map( ( link, index ) => (
						<div
							key={ link.id }
							className="link-list__inspector-link"
						>
							<ItemHeader
								index={ index }
								label={ link.text }
								total={ links.length }
								prefix={ __( 'LINK', 'ambrygen-web' ) }
								onMove={ ( itemIndex, direction ) =>
									moveLinkItem( itemIndex, direction )
								}
								onRemove={ ( itemIndex ) =>
									removeLinkItem( links[ itemIndex ].id )
								}
								minCount={ 1 }
							/>

							<CtaButtonField
								label=""
								value={ link }
								onChange={ ( newValue ) =>
									updateLinkItem( link.id, newValue )
								}
								showVariant={ false }
								textLabel={ __( 'Link Text', 'ambrygen-web' ) }
							/>
						</div>
					) ) }

					<Button variant="primary" onClick={ addLinkItem }>
						{ __( 'Add New Link', 'ambrygen-web' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div className="download-list__inner">
				<div className="download-list__header-area mb-24">
					<div className="download-list__content">
						<RichText
							tagName={ headingTag }
							className="download-list__title heading-3 block-title mb-0"
							value={ title }
							placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
							onChange={ ( val ) =>
								setAttributes( { title: val } )
							}
							allowedFormats={ [ 'core/bold', 'core/italic' ] }
						/>

						<InnerBlocks
							allowedBlocks={ itemsAllowedBlocks }
							template={ itemsTemplate }
							templateLock={ false }
						/>
					</div>
				</div>

				<div className="download-list__items">
					{ links.map( ( link ) => (
						<div key={ link.id } className="download-list__item">
							<div className="download-list__item-link">
								<span className="download-list__item-text">
									{ link.text ||
										__(
											'Add Link Text...',
											'ambrygen-web'
										) }
								</span>
							</div>
						</div>
					) ) }
				</div>
			</div>
		</div>
	);
}
