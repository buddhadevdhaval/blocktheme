import {
	InnerBlocks,
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Placeholder,
	Button,
	PanelBody,
	SearchControl,
	Spinner,
} from '@wordpress/components';
import { useDispatch, useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { __, sprintf } from '@wordpress/i18n';
import { useEffect, useMemo, useState } from '@wordpress/element';
import { TagSelector } from '../_shared/components';

const ALLOWED_BLOCKS = [ 'ambrygen/webinars-item' ];
const TEMPLATE = [];
const ITEM_BLOCK_NAME = 'ambrygen/webinars-item';
const SEARCH_DEBOUNCE_MS = 300;
const WEBINARS_PER_PAGE = 20;

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { blockId, title, headingTag = 'h2' } = attributes;
	const HeadingTag = headingTag || 'h2';
	const { insertBlocks, removeBlocks } = useDispatch( 'core/block-editor' );
	const [ webinarSearchInput, setWebinarSearchInput ] = useState( '' );
	const [ debouncedWebinarSearchInput, setDebouncedWebinarSearchInput ] =
		useState( '' );
	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);
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

	const webinarPosts = useSelect(
		( select ) => {
			const query = {
				per_page: WEBINARS_PER_PAGE,
				status: 'publish',
				orderby: 'title',
				order: 'asc',
			};

			if ( debouncedWebinarSearchInput ) {
				query.search = debouncedWebinarSearchInput;
			}

			return select( 'core' ).getEntityRecords(
				'postType',
				'webinar',
				query
			);
		},
		[ debouncedWebinarSearchInput ]
	);

	const selectedWebinarsById = useSelect(
		( select ) => {
			if ( ! selectedPostIds.length ) {
				return {};
			}

			const posts = select( 'core' ).getEntityRecords(
				'postType',
				'webinar',
				{
					include: selectedPostIds,
					per_page: selectedPostIds.length,
					orderby: 'include',
					context: 'edit',
				}
			);

			if ( ! Array.isArray( posts ) ) {
				return {};
			}

			return posts.reduce( ( acc, post ) => {
				acc[ post.id ] = post;
				return acc;
			}, {} );
		},
		[ selectedPostIds ]
	);

	const webinarOptions = useMemo( () => {
		if ( ! webinarPosts ) {
			return [];
		}

		return webinarPosts.reduce( ( options, post ) => {
			if ( selectedPostIds.includes( post.id ) ) {
				return options;
			}

			options.push( {
				label:
					decodeEntities( post?.title?.rendered || '' ).trim() ||
					sprintf(
						/* translators: %d: webinar post ID. */
						__( 'Webinar #%d', 'ambrygen-web' ),
						post.id
					),
				value: post.id,
			} );

			return options;
		}, [] );
	}, [ webinarPosts, selectedPostIds ] );

	const selectedWebinarOptions = useMemo(
		() =>
			selectedPostIds.map( ( postId ) => {
				const post = selectedWebinarsById[ postId ];
				return {
					value: postId,
					label:
						decodeEntities( post?.title?.rendered || '' ).trim() ||
						sprintf(
							/* translators: %d: webinar post ID. */
							__( 'Webinar #%d', 'ambrygen-web' ),
							postId
						),
					isLoading: ! post,
				};
			} ),
		[ selectedPostIds, selectedWebinarsById ]
	);

	useEffect( () => {
		const expectedId = `webinars-${ clientId.slice( 0, 8 ) }`;

		if ( ! blockId ) {
			setAttributes( { blockId: expectedId } );
		}
	}, [ blockId, clientId, setAttributes ] );

	useEffect( () => {
		const timeoutId = setTimeout(
			() => setDebouncedWebinarSearchInput( webinarSearchInput.trim() ),
			SEARCH_DEBOUNCE_MS
		);

		return () => clearTimeout( timeoutId );
	}, [ webinarSearchInput ] );

	const blockProps = useBlockProps( {
		className: 'webinars webinars-static-list ',
		id: blockId || undefined,
	} );

	const toggleWebinarBlock = ( postId, isSelected ) => {
		if ( isSelected ) {
			if ( selectedPostIds.includes( postId ) ) {
				return;
			}

			insertBlocks(
				createBlock( ITEM_BLOCK_NAME, { postId } ),
				innerBlocks.length,
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

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Heading Settings', 'ambrygen-web' ) }
					initialOpen={ false }
				>
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
					title={ __( 'Webinar Items', 'ambrygen-web' ) }
					initialOpen
				>
					<p
						className="our-team__member-count"
						role="status"
						aria-live="polite"
						aria-atomic="true"
					>
						{ sprintf(
							/* translators: %d: number of selected webinars. */
							__( '%d webinar(s) selected', 'ambrygen-web' ),
							selectedPostIds.length
						) }
					</p>
					<WebinarPicker
						isLoading={ ! webinarPosts }
						options={ webinarOptions }
						selectedWebinars={ selectedWebinarOptions }
						searchValue={ webinarSearchInput }
						onSearchChange={ setWebinarSearchInput }
						onToggle={ toggleWebinarBlock }
						hasOptions={ webinarOptions.length > 0 }
					/>
				</PanelBody>
			</InspectorControls>
			<div { ...blockProps }>
				<div className="webinars__content event-carousel">
					<RichText
						tagName={ HeadingTag }
						className="heading-3 block-title mb-0"
						value={ title }
						onChange={ ( value ) =>
							setAttributes( { title: value } )
						}
						placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
					/>
				</div>

				{ title && (
					<div className="is-style-gl-s50" aria-hidden="true"></div>
				) }

				<div className="wp-block-query">
					<div className="event-carousel__grid webinar__grid wp-block-post-template">
						<InnerBlocks
							allowedBlocks={ ALLOWED_BLOCKS }
							template={ TEMPLATE }
							renderAppender={ false }
							orientation="horizontal"
						/>
						{ selectedPostIds.length === 0 && (
							<Placeholder
								icon="video-alt"
								label={ __(
									'No webinars selected',
									'ambrygen-web'
								) }
								instructions={ __(
									'Use the Webinar Items panel in the block sidebar to search and add webinars.',
									'ambrygen-web'
								) }
							/>
						) }
					</div>
				</div>
			</div>
		</>
	);
}

function WebinarPicker( {
	isLoading,
	options,
	selectedWebinars,
	searchValue,
	onSearchChange,
	onToggle,
	hasOptions,
} ) {
	return (
		<div className="our-team__member-picker">
			{ isLoading ? (
				<Spinner />
			) : (
				<>
					{ selectedWebinars.length > 0 && (
						<div className="our-team__selected-members">
							<div className="our-team__member-picker-label">
								{ __( 'Selected Webinars', 'ambrygen-web' ) }
							</div>
							<div
								className="our-team__selected-member-list"
								role="list"
								aria-label={ __(
									'Selected webinars',
									'ambrygen-web'
								) }
							>
								{ selectedWebinars.map( ( webinar ) => (
									<div
										key={ webinar.value }
										className="our-team__selected-member"
										role="listitem"
									>
										<span>
											{ webinar.label }
											{ webinar.isLoading && (
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
												onToggle( webinar.value, false )
											}
										>
											{ __( 'Remove', 'ambrygen-web' ) }
										</Button>
									</div>
								) ) }
							</div>
						</div>
					) }
					<div className="our-team__member-picker-field">
						<SearchControl
							label={ __( 'Add Webinar', 'ambrygen-web' ) }
							value={ searchValue }
							onChange={ onSearchChange }
							placeholder={ __(
								'Search webinars',
								'ambrygen-web'
							) }
						/>
						<p className="our-team__member-help">
							{ hasOptions
								? __(
										'Search and add webinars without loading the full list.',
										'ambrygen-web'
								  )
								: __(
										'No matching webinars are available to add.',
										'ambrygen-web'
								  ) }
						</p>
						{ hasOptions && (
							<div
								className="our-team__member-options"
								role="list"
								aria-label={ __(
									'Available webinars to add',
									'ambrygen-web'
								) }
							>
								{ options.map( ( option ) => (
									<div
										key={ option.value }
										className="our-team__member-option"
										role="listitem"
									>
										<span>{ option.label }</span>
										<Button
											variant="secondary"
											size="small"
											onClick={ () =>
												onToggle( option.value, true )
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
