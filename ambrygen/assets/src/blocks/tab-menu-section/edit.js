import { useEffect, useMemo } from '@wordpress/element';
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	SelectControl,
	ToggleControl,
	RangeControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import {
	ItemHeader,
	PanelItem,
	Field,
} from '../_shared/components';
import { useArrayHandlers } from '../_shared/utils';

const DEFAULT_TAB = {
	label: '',
	targetId: '',
	isActive: false,
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, tabs = [], scrollOffset, enableSticky } = attributes;

	useEffect( () => {
		const expectedId = `tab-menu-${ clientId.slice( 0, 8 ) }`;

		if ( blockId !== expectedId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const sectionOptions = useSelect( ( select ) => {
		const { getBlocks } = select( 'core/block-editor' );

		const getAllBlocks = ( blocks ) =>
			blocks.reduce( ( acc, block ) => {
				acc.push( block );

				if ( block.innerBlocks?.length ) {
					acc.push( ...getAllBlocks( block.innerBlocks ) );
				}

				return acc;
			}, [] );

		const allBlocks = getAllBlocks( getBlocks() );

		return [
			{ label: __( 'Select Section', 'ambrygen-web' ), value: '' },
			...allBlocks
				.filter( ( block ) => block.attributes?.blockId )
				.map( ( block ) => {
					const blockType = wp.blocks.getBlockType( block.name );
					const blockTitle = blockType?.title || block.name;
					const stripHTML = ( str ) =>
						str ? str.replace( /<[^>]+>/g, '' ) : '';
					const heading =
						stripHTML( block.attributes?.heading ) ||
						stripHTML( block.attributes?.title ) ||
						null;

					return {
						label: heading
							? `${ blockTitle } - ${ heading }`
							: `${ blockTitle } - ${ block.attributes.blockId }`,
						value: block.attributes.blockId,
					};
				} ),
		];
	} );

	const {
		update: updateTab,
		add: addTab,
		remove: removeTab,
		move: moveTab,
	} = useArrayHandlers( setAttributes, 'tabs' );

	const setActiveTab = ( index ) => {
		const nextTabs = tabs.map( ( tab, i ) => ( {
			...tab,
			isActive: i === index,
		} ) );
		setAttributes( { tabs: nextTabs } );
	};

	const handleAddTab = () => {
		const shouldBeActive = tabs.length === 0;
		addTab( { ...DEFAULT_TAB, isActive: shouldBeActive } );
	};

	const blockProps = useBlockProps( {
		className: 'tab-menu-section',
	} );

	const activeIndex = useMemo(
		() => tabs.findIndex( ( tab ) => tab.isActive ),
		[ tabs ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Scroll Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<RangeControl
						label={ __( 'Scroll Offset (px)', 'ambrygen-web' ) }
						value={ scrollOffset || 0 }
						onChange={ ( value ) =>
							setAttributes( { scrollOffset: value } )
						}
						min={ 0 }
						max={ 600 }
						step={ 10 }
					/>
					<ToggleControl
						label={ __( 'Enable Sticky', 'ambrygen-web' ) }
						checked={ !! enableSticky }
						onChange={ ( value ) =>
							setAttributes( { enableSticky: value } )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Tabs', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					{ tabs.length === 0 && (
						<p className="components-base-control__help">
							{ __(
								'No tabs added yet.',
								'ambrygen-web'
							) }
						</p>
					) }

					{ tabs.map( ( tab, index ) => (
						<PanelItem key={ index }>
							<ItemHeader
								index={ index }
								label={ tab.label }
								total={ tabs.length }
								onMove={ ( i, dir ) => moveTab( i, dir ) }
								onRemove={ ( i ) => removeTab( i, 0 ) }
								minCount={ 0 }
							/>

							<Field
								label={ __( 'Tab Label', 'ambrygen-web' ) }
								value={ tab.label || '' }
								onChange={ ( value ) =>
									updateTab( index, 'label', value )
								}
							/>

							<SelectControl
								label={ __( 'Scroll To Section', 'ambrygen-web' ) }
								value={ tab.targetId || '' }
								options={ sectionOptions }
								onChange={ ( value ) =>
									updateTab( index, 'targetId', value )
								}
							/>

							<ToggleControl
								label={ __(
									'Set as Default Active Tab',
									'ambrygen-web'
								) }
								checked={ !! tab.isActive }
								onChange={ ( value ) => {
									if ( value ) {
										setActiveTab( index );
									} else {
										updateTab(
											index,
											'isActive',
											false
										);
									}
								} }
							/>
						</PanelItem>
					) ) }

					<Button
						variant="primary"
						onClick={ handleAddTab }
						style={ { width: '100%', justifyContent: 'center' } }
					>
						{ __( 'Add Tab', 'ambrygen-web' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps } id={ blockId }>
				<div className="tab-menu-section__inner">
					<div className="tab-menu-section__tabs" role="tablist">
						{ tabs.length === 0 && (
							<span className="tab-menu-section__empty">
								{ __(
									'Add tabs from the sidebar.',
									'ambrygen-web'
								) }
							</span>
						) }
						{ tabs.map( ( tab, index ) => (
							<button
								key={ index }
								type="button"
								className={ `tab-menu-section__tab ${
									tab.isActive ||
									( activeIndex < 0 && index === 0 )
										? 'active'
										: ''
								}` }
								data-scroll-target={ tab.targetId || '' }
							>
								{ tab.label || __( 'Tab', 'ambrygen-web' ) }
							</button>
						) ) }
					</div>
				</div>
			</div>
		</>
	);
}
