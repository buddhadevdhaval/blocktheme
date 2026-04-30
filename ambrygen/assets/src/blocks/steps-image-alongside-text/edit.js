import {
	useBlockProps,
	RichText,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { useEffect, useRef } from '@wordpress/element';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { BlockExamplePreview, TagSelector } from '../_shared/components';
const TEMPLATE = [
	[ 'ambrygen/steps-image-alongside-text-item' ],
	[ 'ambrygen/steps-image-alongside-text-item' ],
	[ 'ambrygen/steps-image-alongside-text-item' ],
	[ 'ambrygen/steps-image-alongside-text-item' ],
];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, heading, headingTag, description, showFullImage } =
		attributes;
	const hasHeaderContent = Boolean( heading || description );

	const blockProps = useBlockProps( {
		className: `steps-iot-block ${
			showFullImage ? ' show-full-image' : ''
		}`,
	} );

	const containerRef = useRef( null );
	const activeIndex = useRef( 0 );

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId || ! blockId.endsWith( clientId.slice( 0, 8 ) ) ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ blockId, clientId, setAttributes ] );

	useEffect( () => {
		const vTabsContainer = containerRef.current;
		if ( ! vTabsContainer ) {
			return;
		}

		const setActive = ( index ) => {
			const items = vTabsContainer.querySelectorAll(
				'.vertical-tabs__item'
			);
			items.forEach( ( el, i ) => {
				el.classList.toggle( 'is-active', i === index );
			} );
			activeIndex.current = index;
		};

		const handleClick = ( e ) => {
			const item = e.target.closest( '.vertical-tabs__item' );
			if ( ! item || ! vTabsContainer.contains( item ) ) {
				return;
			}
			const items = Array.from(
				vTabsContainer.querySelectorAll( '.vertical-tabs__item' )
			);
			const idx = items.indexOf( item );
			if ( idx !== -1 ) {
				setActive( idx );
			}
		};

		const observer = new MutationObserver( () => {
			const items = vTabsContainer.querySelectorAll(
				'.vertical-tabs__item'
			);
			if ( items.length ) {
				if ( activeIndex.current >= items.length ) {
					activeIndex.current = items.length - 1;
				}
				setActive( activeIndex.current );
			}
		} );
		observer.observe( vTabsContainer, { childList: true, subtree: true } );

		setActive( activeIndex.current );

		vTabsContainer.addEventListener( 'click', handleClick );

		return () => {
			vTabsContainer.removeEventListener( 'click', handleClick );
			observer.disconnect();
		};
	}, [] );

	if ( blockId === 'steps-image-alongside-text-example' ) {
		return (
			<BlockExamplePreview
				className="steps-image-alongside-text-example-preview"
				imagePath="/assets/src/images/steps-image-alongside-text/preview.png"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Block Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<ToggleControl
						label={ __( 'Show full image', 'ambrygen-web' ) }
						checked={ !! showFullImage }
						onChange={ ( value ) =>
							setAttributes( { showFullImage: value } )
						}
					/>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
						includeTextTags={ false }
						type="heading"
					/>
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps }>
				<div className="vertical-tabs-block__header block__rowflex">
					<RichText
						tagName={ headingTag || 'h2' }
						className="heading-3 block-title mb-0 block__rowflex--heading-title"
						value={ heading }
						onChange={ ( value ) =>
							setAttributes( { heading: value } )
						}
						placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
					/>

					<div className="block__rowflex--block-content subtitle-1-regular">
						<RichText
							tagName="div"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder={ __(
								'Add Description...',
								'ambrygen-web'
							) }
						/>
					</div>
				</div>

				{ hasHeaderContent && (
					<div className="is-style-gl-s50" aria-hidden="true"></div>
				) }

				<div className="vertical-tabs" ref={ containerRef }>
					<InnerBlocks
						allowedBlocks={ [
							'ambrygen/steps-image-alongside-text-item',
						] }
						template={ TEMPLATE }
					/>
				</div>
			</section>
		</>
	);
}
