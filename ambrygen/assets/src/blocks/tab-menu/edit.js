import { useEffect, useMemo } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import {
	PanelBody,
	Button,
	SelectControl,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { __ } from '@wordpress/i18n';
import { ItemHeader, PanelItem, Field } from '../_shared/components';
import { useArrayHandlers } from '../_shared/utils';

const DEFAULT_TAB = {
	label: '',
	targetId: '',
	targetClientId: '',
	isActive: false,
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, tabs = [], tabBehavior = 'scroll' } = attributes;

	useEffect( () => {
		const expectedId = `tab-menu-${ clientId.slice( 0, 8 ) }`;

		if ( blockId !== expectedId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const targetOptions = useSelect( ( select ) => {
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
				.map( ( block ) => ( {
					...block,
					targetId:
						block.attributes?.blockId ||
						block.attributes?.anchor ||
						'',
				} ) )
				.filter( ( block ) => block.targetId )
				.map( ( block ) => {
					const blockType = wp.blocks.getBlockType( block.name );
					const blockTitle = blockType?.title || block.name;
					const stripHTML = ( str ) =>
						str ? str.replace( /<[^>]+>/g, '' ) : '';
					const heading =
						stripHTML( block.attributes?.heading ) ||
						stripHTML( block.attributes?.title ) ||
						stripHTML( block.attributes?.sectionTitle ) ||
						stripHTML( block.attributes?.sectiontitle ) ||
						null;

					return {
						label: heading
							? `${ blockTitle } - ${ heading }`
							: `${ blockTitle } - ${ block.targetId }`,
						value: block.targetId,
						clientId: block.clientId,
					};
				} ),
		];
	} );

	useEffect( () => {
		if ( ! tabs.length || ! targetOptions.length ) {
			return;
		}

		const targetIdByClientId = new Map(
			targetOptions
				.filter(
					( option ) =>
						option.clientId && option.value && option.value !== ''
				)
				.map( ( option ) => [ option.clientId, option.value ] )
		);

		const optionsByValue = new Map();
		targetOptions.forEach( ( option ) => {
			if ( ! option.value ) {
				return;
			}

			if ( ! optionsByValue.has( option.value ) ) {
				optionsByValue.set( option.value, [] );
			}

			optionsByValue.get( option.value ).push( option );
		} );

		let hasChanges = false;
		const nextTabs = tabs.map( ( tab ) => {
			let nextTab = tab;

			if ( tab.targetClientId ) {
				const resolvedTargetId = targetIdByClientId.get(
					tab.targetClientId
				);

				if ( resolvedTargetId && resolvedTargetId !== tab.targetId ) {
					nextTab = {
						...nextTab,
						targetId: resolvedTargetId,
					};
					hasChanges = true;
				}
			} else if ( tab.targetId ) {
				const matchingOptions =
					optionsByValue.get( tab.targetId ) || [];

				if ( matchingOptions.length === 1 ) {
					nextTab = {
						...nextTab,
						targetClientId: matchingOptions[ 0 ].clientId || '',
					};
					hasChanges = true;
				}
			}

			return nextTab;
		} );

		if ( hasChanges ) {
			setAttributes( { tabs: nextTabs } );
		}
	}, [ tabs, targetOptions, setAttributes ] );

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
		className: 'secondary-sticky-tabs',
	} );

	const activeIndex = useMemo(
		() => tabs.findIndex( ( tab ) => tab.isActive ),
		[ tabs ]
	);

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Tab Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<ToggleControl
						label={ __( 'Tab Mode', 'ambrygen-web' ) }
						checked={ tabBehavior === 'tab-mode' }
						onChange={ ( value ) =>
							setAttributes( {
								tabBehavior: value ? 'tab-mode' : 'scroll',
							} )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Tabs', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					{ tabs.length === 0 && (
						<p className="components-base-control__help">
							{ __( 'No tabs added yet.', 'ambrygen-web' ) }
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
								label={ __(
									'Link to Section',
									'ambrygen-web'
								) }
								value={ tab.targetId || '' }
								options={ targetOptions }
								onChange={ ( value ) => {
									const selectedOption = targetOptions.find(
										( option ) => option.value === value
									);

									setAttributes( {
										tabs: tabs.map(
											( currentTab, currentIndex ) =>
												currentIndex === index
													? {
															...currentTab,
															targetId: value,
															targetClientId:
																selectedOption?.clientId ||
																'',
													  }
													: currentTab
										),
									} );
								} }
							/>

							{ tabBehavior !== 'scroll' && (
								<ToggleControl
									label={ __( 'Active Tab', 'ambrygen-web' ) }
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
							) }
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
				<div className="horizontal-tabs" role="tablist">
					{ tabs.length === 0 && (
						<span className=" tab-button tab-menu-section__empty">
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
							className={ ` tab-button tab-menu-section__tab ${
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
		</>
	);
}
