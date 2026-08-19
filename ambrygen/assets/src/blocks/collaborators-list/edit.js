import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	SelectControl,
	Spinner,
	Notice,
	FormTokenField,
} from '@wordpress/components';
import { Fragment, useEffect, useRef, useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';

const ALLOWED_BLOCKS = [ 'ambrygen/collaborators-item' ];
const TEMPLATE = [ [ 'ambrygen/collaborators-item', {} ] ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title, subtitle, isOpen, selectionMode } = attributes;
	const previousSelectionMode = useRef( selectionMode );
	const { replaceInnerBlocks } = useDispatch( 'core/block-editor' );

	const { collaboratorTerms, hasResolved, isResolving } = useSelect(
		( select ) => {
			const {
				getEntityRecords,
				isResolving: isResolvingRecords,
				hasFinishedResolution,
			} = select( 'core' );
			const query = {
				per_page: -1,
				orderby: 'name',
				order: 'asc',
				context: 'edit',
			};

			return {
				collaboratorTerms:
					getEntityRecords( 'taxonomy', 'collaborator', query ) || [],
				isResolving: isResolvingRecords( 'getEntityRecords', [
					'taxonomy',
					'collaborator',
					query,
				] ),
				hasResolved: hasFinishedResolution( 'getEntityRecords', [
					'taxonomy',
					'collaborator',
					query,
				] ),
			};
		},
		[]
	);

	const terms = useMemo( () => {
		return collaboratorTerms.filter(
			( term ) =>
				typeof term?.meta?.link === 'string' &&
				term.meta.link.trim() !== '' &&
				Number( term?.count || 0 ) > 0
		);
	}, [ collaboratorTerms ] );

	const termsLoaded = hasResolved;
	const isLoadingTerms = isResolving;
	const termsError = hasResolved && ! collaboratorTerms;

	const innerBlocks = useSelect(
		( select ) => select( 'core/block-editor' ).getBlocks( clientId ),
		[ clientId ]
	);

	const collaboratorOptions = terms || [];
	const collaboratorSuggestions = collaboratorOptions.map(
		( term ) => term.name
	);
	const selectedCollaboratorNames = innerBlocks.reduce( ( names, block ) => {
		if ( ! block.attributes?.isNameLocked || ! block.attributes?.text ) {
			return names;
		}

		names.push( block.attributes.text );
		return names;
	}, [] );

	const manualTemplateBlocks = TEMPLATE.map( ( [ name, blockAttributes ] ) =>
		createBlock( name, blockAttributes )
	);

	const onCollaboratorsChange = ( names ) => {
		const manualBlocks = innerBlocks.filter(
			( block ) => ! block.attributes?.isNameLocked
		);

		const collaboratorBlocks = names.reduce( ( blocks, name ) => {
			const term = collaboratorOptions.find(
				( item ) => item.name === name
			);

			if ( ! term ) {
				return blocks;
			}

			blocks.push(
				createBlock( 'ambrygen/collaborators-item', {
					text: term.name || '',
					url: term.meta?.link || '',
					linkTarget: '_blank',
					isNameLocked: true,
				} )
			);

			return blocks;
		}, [] );

		replaceInnerBlocks(
			clientId,
			[ ...manualBlocks, ...collaboratorBlocks ],
			false
		);
	};

	useEffect( () => {
		if (
			previousSelectionMode.current === 'link-all' &&
			selectionMode === 'manual'
		) {
			replaceInnerBlocks( clientId, manualTemplateBlocks, false );
		}

		previousSelectionMode.current = selectionMode;
	}, [ selectionMode, clientId, manualTemplateBlocks, replaceInnerBlocks ] );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title="Settings">
					<SelectControl
						label="Selection Mode"
						value={ selectionMode }
						options={ [
							{ label: 'Manual', value: 'manual' },
							{ label: 'Link All', value: 'link-all' },
						] }
						onChange={ ( val ) =>
							setAttributes( { selectionMode: val } )
						}
						help="Choose whether to add and remove selected collaborators manually or load all collaborator terms automatically."
					/>
					<ToggleControl
						label="Open by default"
						checked={ isOpen }
						onChange={ ( val ) => setAttributes( { isOpen: val } ) }
					/>
				</PanelBody>
				{ selectionMode === 'manual' && (
					<PanelBody title="Collaborators">
						<FormTokenField
							label="Fetch from taxonomy"
							value={ selectedCollaboratorNames }
							suggestions={ collaboratorSuggestions }
							onChange={ onCollaboratorsChange }
							placeholder="Type to search collaborator terms"
						/>
					</PanelBody>
				) }
			</InspectorControls>
			<div
				{ ...useBlockProps( {
					className: 'download-list block-layout collaborators-list',
				} ) }
			>
				<div className="download-list__inner">
					<div className="download-list__header-area mb-24">
						<RichText
							tagName="div"
							className="download-list__kicker hero-kicker"
							value={ subtitle }
							onChange={ ( value ) =>
								setAttributes( { subtitle: value } )
							}
							placeholder="Description"
						/>
						<div
							className="is-style-gl-s12"
							aria-hidden="true"
						></div>
						<div className="download-list__content">
							<RichText
								tagName="h2"
								className="download-list__title heading-3 block-title mb-0"
								value={ title }
								onChange={ ( value ) =>
									setAttributes( { title: value } )
								}
								placeholder="Heading"
							/>
						</div>
					</div>
					<div className="download-list__items">
						{ isLoadingTerms && <Spinner /> }
						{ termsLoaded &&
							Array.isArray( terms ) &&
							terms.length === 0 && (
								<Notice
									status="warning"
									isDismissible={ false }
								>
									No collaborator terms with a non-empty link
									and assigned posts are available.
								</Notice>
							) }
						{ termsError && (
							<Notice status="error" isDismissible={ false }>
								Unable to load collaborator terms with link
								meta.
							</Notice>
						) }
						{ selectionMode === 'manual' ? (
							<>
								<Notice status="info" isDismissible={ false }>
									Search collaborator terms below to add
									linked collaboration items. You can also
									keep manual items in this list.
								</Notice>
								<InnerBlocks
									allowedBlocks={ ALLOWED_BLOCKS }
									template={ TEMPLATE }
									orientation="vertical"
									renderAppender={ false }
								/>
							</>
						) : (
							<div className="collaborators-list__linked-preview">
								{ termsLoaded &&
									Array.isArray( terms ) &&
									terms.length > 0 && (
										<Notice
											status="info"
											isDismissible={ false }
										>
											Collaborator items are loaded from
											collaborator terms and shown
											automatically.
										</Notice>
									) }
								<div className="download-list__items">
									{ Array.isArray( terms ) &&
										terms.map( ( term ) => (
											<div
												key={ term.id }
												className="download-list__item wp-block-ambrygen-collaborators-item"
											>
												<div className="download-list__item-link">
													<span className="download-list__item-text">
														{ term.name || '' }
													</span>
												</div>
											</div>
										) ) }
								</div>
							</div>
						) }
						{ selectionMode === 'link-all' &&
							innerBlocks.length > 0 && (
								<Notice status="info" isDismissible={ false }>
									Existing manual child blocks are ignored
									while Link All is active. Switch back to
									Manual to edit them again.
								</Notice>
							) }
					</div>
				</div>
			</div>
		</Fragment>
	);
}
