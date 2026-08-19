import {
	useBlockProps,
	RichText,
	InspectorControls,
	InnerBlocks,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import { __, sprintf } from '@wordpress/i18n';
import {
	PanelBody,
	Spinner,
	Button,
	SearchControl,
} from '@wordpress/components';
import { useSelect, useDispatch } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { useEffect, useMemo, useRef, useState } from '@wordpress/element';
import Swiper from 'swiper/bundle';
import { BlockExamplePreview, TagSelector } from '../_shared/components';
import { useUniqueBlockId } from '../_shared/hooks';

const AUTHORS_PER_PAGE = 20;
const SEARCH_DEBOUNCE_MS = 300;
const ITEM_BLOCK_NAME = 'ambrygen/multimedia-member-item';

const getPostTitle = ( post ) => {
	if ( typeof post?.title === 'string' ) {
		return post.title;
	}

	return post?.title?.rendered || post?.title?.raw || '';
};

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, title, headingTag = 'h2' } = attributes;
	const [ authorSearchInput, setAuthorSearchInput ] = useState( '' );
	const [ debouncedAuthorSearchInput, setDebouncedAuthorSearchInput ] =
		useState( '' );
	const isExample = blockId === 'multimedia-member-example';

	const { insertBlocks, removeBlocks } = useDispatch( 'core/block-editor' );

	useUniqueBlockId( {
		blockId,
		clientId,
		setAttributes,
		enabled: ! isExample,
	} );

	useEffect( () => {
		const timeoutId = setTimeout( () => {
			setDebouncedAuthorSearchInput( authorSearchInput.trim() );
		}, SEARCH_DEBOUNCE_MS );

		return () => clearTimeout( timeoutId );
	}, [ authorSearchInput ] );

	const manualAuthorPosts = useSelect(
		( select ) => {
			const query = {
				per_page: AUTHORS_PER_PAGE,
				status: 'publish',
				orderby: 'title',
				order: 'asc',
				_fields: 'id,title',
			};

			if ( debouncedAuthorSearchInput ) {
				query.search = debouncedAuthorSearchInput;
			}

			return select( 'core' ).getEntityRecords(
				'postType',
				'author',
				query
			);
		},
		[ debouncedAuthorSearchInput ]
	);

	const isResolvingAuthorPosts = useSelect(
		( select ) => {
			const query = {
				per_page: AUTHORS_PER_PAGE,
				status: 'publish',
				orderby: 'title',
				order: 'asc',
				_fields: 'id,title',
			};

			if ( debouncedAuthorSearchInput ) {
				query.search = debouncedAuthorSearchInput;
			}

			return select( 'core/data' ).isResolving(
				'core',
				'getEntityRecords',
				[ 'postType', 'author', query ]
			);
		},
		[ debouncedAuthorSearchInput ]
	);

	const containerRef = useRef( null );
	const itemsRef = useRef( null );
	const swiperInstances = useRef( [] );
	const blockProps = useBlockProps();
	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);
	const innerBlocksCount = innerBlocks.length;
	const selectedPostIds = useMemo(
		() =>
			innerBlocks.reduce( ( ids, block ) => {
				const postId = Number( block.attributes?.postId ) || 0;

				if ( postId ) {
					ids.push( postId );
				}

				return ids;
			}, [] ),
		[ innerBlocks ]
	);

	const selectedAuthorPostsById = useSelect(
		( select ) => {
			if ( ! selectedPostIds.length ) {
				return {};
			}

			const posts = select( 'core' ).getEntityRecords(
				'postType',
				'author',
				{
					include: selectedPostIds,
					per_page: selectedPostIds.length,
					orderby: 'include',
				}
			);

			if ( ! Array.isArray( posts ) ) {
				return {};
			}

			return posts.reduce( ( postsById, post ) => {
				postsById[ post.id ] = post;
				return postsById;
			}, {} );
		},
		[ selectedPostIds ]
	);

	const isResolvingSelectedAuthorPosts = useSelect(
		( select ) => {
			if ( ! selectedPostIds.length ) {
				return false;
			}

			return select( 'core/data' ).isResolving(
				'core',
				'getEntityRecords',
				[
					'postType',
					'author',
					{
						include: selectedPostIds,
						per_page: selectedPostIds.length,
						orderby: 'include',
					},
				]
			);
		},
		[ selectedPostIds ]
	);

	const authorOptions = useMemo( () => {
		if ( ! Array.isArray( manualAuthorPosts ) ) {
			return [];
		}

		return manualAuthorPosts.reduce( ( options, post ) => {
			if ( selectedPostIds.includes( post.id ) ) {
				return options;
			}

			const titleText = decodeEntities( getPostTitle( post ) ).trim();

			options.push( {
				label:
					titleText ||
					sprintf(
						/* translators: %d: author post ID. */
						__( 'Author #%d', 'ambrygen-web' ),
						post.id
					),
				value: String( post.id ),
			} );

			return options;
		}, [] );
	}, [ manualAuthorPosts, selectedPostIds ] );

	const selectedAuthorOptions = useMemo(
		() =>
			selectedPostIds.map( ( postId ) => {
				const post = selectedAuthorPostsById[ postId ];
				const titleText = decodeEntities( getPostTitle( post ) ).trim();

				return {
					label:
						titleText ||
						sprintf(
							/* translators: %d: author post ID. */
							__( 'Author #%d', 'ambrygen-web' ),
							postId
						),
					value: postId,
					isLoading: ! post,
				};
			} ),
		[ selectedPostIds, selectedAuthorPostsById ]
	);

	const hasAuthorOptions = authorOptions.length > 0;

	useEffect( () => {
		if (
			isResolvingSelectedAuthorPosts ||
			! selectedPostIds.length ||
			Object.keys( selectedAuthorPostsById ).length === 0
		) {
			return;
		}

		const invalidBlockClientIds = innerBlocks.reduce(
			( clientIds, block ) => {
				const postId = Number( block.attributes?.postId ) || 0;

				if ( ! postId ) {
					clientIds.push( block.clientId );
					return clientIds;
				}

				if ( ! selectedAuthorPostsById[ postId ] ) {
					clientIds.push( block.clientId );
				}

				return clientIds;
			},
			[]
		);

		if ( invalidBlockClientIds.length ) {
			removeBlocks( invalidBlockClientIds, false );
		}
	}, [
		innerBlocks,
		isResolvingSelectedAuthorPosts,
		removeBlocks,
		selectedAuthorPostsById,
		selectedPostIds,
	] );

	const toggleMemberBlock = ( postId, isSelected ) => {
		if ( isSelected ) {
			if ( selectedPostIds.includes( postId ) ) {
				return;
			}

			insertBlocks(
				createBlock( ITEM_BLOCK_NAME, { postId } ),
				innerBlocksCount,
				clientId,
				false
			);
			return;
		}

		const blocksToRemove = innerBlocks.reduce( ( clientIds, block ) => {
			if ( ( Number( block.attributes?.postId ) || 0 ) === postId ) {
				clientIds.push( block.clientId );
			}

			return clientIds;
		}, [] );

		if ( blocksToRemove.length ) {
			removeBlocks( blocksToRemove, false );
		}
	};

	useEffect( () => {
		if ( ! itemsRef.current ) {
			return;
		}

		const initSwipers = () => {
			if ( ! itemsRef.current ) {
				return;
			}
			const sliders = itemsRef.current.querySelectorAll(
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

		observer.observe( itemsRef.current, {
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

	if ( isExample ) {
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
					title={ __( 'Authors', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<p
						className="multimedia-member__member-count"
						role="status"
						aria-live="polite"
						aria-atomic="true"
					>
						{ sprintf(
							/* translators: %d: number of selected authors. */
							__( '%d author(s) selected', 'ambrygen-web' ),
							selectedPostIds.length
						) }
					</p>

					<MemberPicker
						isLoading={
							isResolvingAuthorPosts || ! manualAuthorPosts
						}
						options={ authorOptions }
						selectedMembers={ selectedAuthorOptions }
						searchValue={ authorSearchInput }
						onSearchChange={ setAuthorSearchInput }
						onToggle={ toggleMemberBlock }
						hasOptions={ hasAuthorOptions }
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps } ref={ containerRef }>
				<div className="multimedia-member  block-layout">
					<div className="features-media__header block__rowflex is-vertical">
						<RichText
							tagName={ headingTag }
							className="block-title block__rowflex--heading-title heading-2 mb-0"
							value={ title }
							allowedFormats={ [
								'core/bold',
								'core/italic',
								'core/mark',
								'core/text-color',
							] }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
						/>
					</div>

					<div className="is-style-gl-s32" aria-hidden="true"></div>

					<div className="multimedia-member__items" ref={ itemsRef }>
						<InnerBlocks
							allowedBlocks={ [ ITEM_BLOCK_NAME ] }
							orientation="horizontal"
							renderAppender={ () => false }
						/>
					</div>
				</div>
			</div>
		</>
	);
}

function MemberPicker( {
	isLoading,
	options,
	selectedMembers,
	searchValue,
	onSearchChange,
	onToggle,
	hasOptions,
} ) {
	return (
		<div className="multimedia-member__member-picker">
			{ isLoading ? (
				<Spinner />
			) : (
				<>
					{ selectedMembers.length > 0 && (
						<div className="multimedia-member__selected-members">
							<div className="multimedia-member__member-picker-label">
								{ __( 'Selected Authors', 'ambrygen-web' ) }
							</div>
							<div
								className="multimedia-member__selected-member-list"
								role="list"
								aria-label={ __(
									'Selected authors',
									'ambrygen-web'
								) }
							>
								{ selectedMembers.map( ( member ) => (
									<div
										key={ member.value }
										className="multimedia-member__selected-member"
										role="listitem"
									>
										<span>
											{ member.label }
											{ member.isLoading && (
												<span className="screen-reader-text">
													{ __(
														'loading',
														'ambrygen-web'
													) }
												</span>
											) }
										</span>
										<Button
											isDestructive
											variant="tertiary"
											size="small"
											onClick={ () =>
												onToggle( member.value, false )
											}
										>
											{ __( 'Remove', 'ambrygen-web' ) }
										</Button>
									</div>
								) ) }
							</div>
						</div>
					) }
					<div className="multimedia-member__member-picker-field">
						<SearchControl
							label={ __( 'Add Author', 'ambrygen-web' ) }
							value={ searchValue }
							onChange={ onSearchChange }
							placeholder={ __(
								'Search authors',
								'ambrygen-web'
							) }
						/>
						<p className="multimedia-member__member-help">
							{ hasOptions
								? __(
										'Search and add authors without loading the full author list.',
										'ambrygen-web'
								  )
								: __(
										'No matching authors are available to add.',
										'ambrygen-web'
								  ) }
						</p>
						{ hasOptions && (
							<div
								className="multimedia-member__member-options"
								role="list"
								aria-label={ __(
									'Available authors to add',
									'ambrygen-web'
								) }
							>
								{ options.map( ( option ) => (
									<div
										key={ option.value }
										className="multimedia-member__member-option"
										role="listitem"
									>
										<span>{ option.label }</span>
										<Button
											variant="secondary"
											size="small"
											onClick={ () =>
												onToggle(
													parseInt(
														option.value,
														10
													),
													true
												)
											}
										>
											{ __( 'Add', 'ambrygen-web' ) }
										</Button>
									</div>
								) ) }
							</div>
						) }
					</div>
				</>
			) }
		</div>
	);
}
