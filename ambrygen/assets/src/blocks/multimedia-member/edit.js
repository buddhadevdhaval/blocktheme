import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
	PanelBody,
	ToggleControl,
	CheckboxControl,
	Spinner,
	Button,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { useEffect, useRef } from '@wordpress/element';
import Swiper from 'swiper/bundle';
import { BlockExamplePreview, TagSelector } from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		title,
		headingTag = 'h2',
		memberTypes = [],
		selectionMode = 'manual',
	} = attributes;

	const { replaceInnerBlocks, insertBlock } =
		useDispatch( 'core/block-editor' );

	useEffect( () => {
		const expectedId = `section-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const memberTypeTerms = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords( 'taxonomy', 'member_type', {
				per_page: -1,
				hide_empty: false,
			} ),
		[]
	);

	const allMemberPosts = useSelect(
		( select ) =>
			select( 'core' ).getEntityRecords( 'postType', 'our_team', {
				per_page: -1,
				post_status: 'publish',
				_fields: 'id,member_type',
			} ),
		[]
	);

	useEffect( () => {
		if (
			selectionMode !== 'taxonomy' ||
			! memberTypes.length ||
			! allMemberPosts
		) {
			return;
		}

		const filteredMemberPosts = allMemberPosts.filter( ( post ) =>
			post.member_type?.some( ( id ) => memberTypes.includes( id ) )
		);

		const newBlocks = filteredMemberPosts.map( ( post ) =>
			createBlock( 'ambrygen/multimedia-member-item', {
				postId: post.id,
			} )
		);

		replaceInnerBlocks( clientId, newBlocks, false );
	}, [
		selectionMode,
		memberTypes,
		allMemberPosts,
		clientId,
		replaceInnerBlocks,
	] );

	const containerRef = useRef( null );
	const swiperInstances = useRef( [] );
	const blockProps = useBlockProps();
	const innerBlocksCount = useSelect(
		( select ) =>
			select( 'core/block-editor' ).getBlocks( clientId ).length,
		[ clientId ]
	);

	useEffect( () => {
		if ( ! containerRef.current ) {
			return;
		}

		const initSwipers = () => {
			if ( ! containerRef.current ) {
				return;
			}
			const sliders = containerRef.current.querySelectorAll(
				'.multimedia-member-item__media-slider:not(.swiper-initialized)'
			);

			sliders.forEach( ( sliderElement ) => {
				const slides =
					sliderElement.querySelectorAll( '.swiper-slide' );
				if ( slides.length === 0 ) {
					return;
				}

				swiperInstances.current.push(
					new Swiper( sliderElement, {
						slidesPerView: 1,
						spaceBetween: 0,
						loop: slides.length > 1,
						navigation:
							slides.length > 1
								? {
										nextEl: sliderElement.querySelector(
											'.custom-next'
										),
										prevEl: sliderElement.querySelector(
											'.custom-prev'
										),
								  }
								: false,
						pagination: false,
						observer: true,
						observeParents: true,
					} )
				);
			} );
		};

		const timer = setTimeout( initSwipers, 300 );

		const observer = new MutationObserver( () => {
			initSwipers();
		} );

		observer.observe( containerRef.current, {
			childList: true,
			subtree: true,
		} );

		return () => {
			clearTimeout( timer );
			observer.disconnect();
			swiperInstances.current.forEach( ( instance ) => {
				if ( instance && typeof instance.destroy === 'function' ) {
					instance.destroy( true, true );
				}
			} );
			swiperInstances.current = [];
		};
	}, [ innerBlocksCount ] );

	if ( blockId === 'multimedia-member-example' ) {
		return (
			<BlockExamplePreview
				className="multimedia-member-example-preview"
				imagePath="/assets/src/images/multimedia-member/preview.png"
			/>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Heading Settings', 'ambrygen-web' ) }>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						type="heading"
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'Member Selection Mode', 'ambrygen-web' ) }
					initialOpen
				>
					<ToggleControl
						label={ __( 'Select by Member Type', 'ambrygen-web' ) }
						checked={ selectionMode === 'taxonomy' }
						onChange={ ( enabled ) =>
							setAttributes( {
								selectionMode: enabled ? 'taxonomy' : 'manual',
								memberTypes: [],
							} )
						}
					/>

					{ selectionMode === 'taxonomy' &&
						( ! memberTypeTerms ? (
							<Spinner />
						) : (
							memberTypeTerms.map( ( term ) => (
								<CheckboxControl
									key={ term.id }
									label={ term.name }
									checked={ memberTypes.includes( term.id ) }
									onChange={ ( checked ) =>
										setAttributes( {
											memberTypes: checked
												? [ ...memberTypes, term.id ]
												: memberTypes.filter(
														( id ) => id !== term.id
												  ),
										} )
									}
								/>
							) )
						) ) }
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps } ref={ containerRef }>
				<div className="multimedia-member">
					<div className="features-media__header block__rowflex">
						<RichText
							tagName={ headingTag }
							className="block-title block__rowflex--heading-title heading-2 mb-0"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
						/>
					</div>

					{ title && (
						<div
							className="is-style-gl-s32"
							aria-hidden="true"
						></div>
					) }

					<div className="multimedia-member__items">
						<InnerBlocks
							allowedBlocks={ [
								'ambrygen/multimedia-member-item',
							] }
							orientation="horizontal"
							renderAppender={ () => false }
						/>
					</div>

					{ selectionMode !== 'taxonomy' && (
						<div
							className="multimedia-member__add-item"
							style={ { marginTop: '20px', textAlign: 'center' } }
						>
							<Button
								variant="primary"
								onClick={ () => {
									const newBlock = createBlock(
										'ambrygen/multimedia-member-item',
										{}
									);
									insertBlock(
										newBlock,
										undefined,
										clientId
									);
								} }
							>
								{ __( 'Add Multimedia Member', 'ambrygen-web' ) }
							</Button>
						</div>
					) }
				</div>
			</div>
		</>
	);
}
