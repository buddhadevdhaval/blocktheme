import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { createBlock } from '@wordpress/blocks';
import {
	Button,
	FormTokenField,
	Notice,
	PanelBody,
	Spinner,
	ToggleControl,
} from '@wordpress/components';
import { useEffect, useMemo } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import {
	CtaButtonField,
	ItemHeader,
	TagSelector,
	BlockExamplePreview,
} from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		anchor,
		title,
		headingTag,
		selectAllCollaborators = true,
		collaboratorIds = [],
	} = attributes;

	if ( blockId === 'collaboration-link-grid-example' ) {
		return (
			<BlockExamplePreview
				imagePath="/assets/src/images/cta-tiles-with-3-card/default-image.png"
			/>
		);
	}

	const {
		insertBlock,
		removeBlocks,
		replaceInnerBlocks,
		updateBlockAttributes,
	} = useDispatch( 'core/block-editor' );

	useEffect( () => {
		const clientIdSuffix = clientId.slice( 0, 8 );
		const expectedId = `collaboration-link-grid-${ clientIdSuffix }`;

		if ( ! blockId ) {
			setAttributes( {
				blockId: expectedId,
			} );
		}
	}, [ clientId, blockId, setAttributes ] );

	const collaboratorQuery = useMemo(
		() => ( {
			per_page: 100,
			hide_empty: false,
			orderby: 'name',
			order: 'asc',
			_fields: 'id,name,meta',
		} ),
		[]
	);

	const { collaboratorTerms, isResolvingTerms, hasResolvedTerms } = useSelect(
		( select ) => {
			const core = select( 'core' );

			return {
				collaboratorTerms:
					core.getEntityRecords(
						'taxonomy',
						'collaborator',
						collaboratorQuery
					) || [],
				isResolvingTerms: core.isResolving( 'getEntityRecords', [
					'taxonomy',
					'collaborator',
					collaboratorQuery,
				] ),
				hasResolvedTerms: core.hasFinishedResolution(
					'getEntityRecords',
					[ 'taxonomy', 'collaborator', collaboratorQuery ]
				),
			};
		},
		[ collaboratorQuery ]
	);

	const collaboratorOptions = collaboratorTerms || [];
	const linkedCollaboratorTerms = collaboratorOptions.filter(
		( term ) => typeof term?.meta?.link === 'string' && term.meta.link.trim()
	);
	const visibleCollaboratorTerms = selectAllCollaborators
			? linkedCollaboratorTerms.filter(
					( term ) => ! collaboratorIds.includes( term.id )
			  )
			: collaboratorIds.length
			? linkedCollaboratorTerms.filter( ( term ) =>
					collaboratorIds.includes( term.id )
			  )
			: [];
	const suggestions = linkedCollaboratorTerms.map( ( term ) => term.name );

	const selectedCollaboratorNames = collaboratorIds
		.map( ( id ) => {
			const term = linkedCollaboratorTerms.find(
				( item ) => item.id === id
			);
			return term ? term.name : null;
		} )
		.filter( Boolean );

	const onCollaboratorsChange = ( names ) => {
		const newIds = names
			.map( ( name ) => {
				const term = linkedCollaboratorTerms.find(
					( item ) => item.name === name
				);
				return term ? term.id : null;
			} )
			.filter( Boolean );

		setAttributes( { collaboratorIds: newIds } );
	};



	const blockProps = useBlockProps( {
		className: 'download-list variation-grid-view',
		id: anchor || blockId,
	} );



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
						onChange={ ( val ) => setAttributes( { headingTag: val } ) }
					/>
				</PanelBody>



				<PanelBody
					title={ __( 'Collaborators', 'ambrygen-web' ) }
					initialOpen={ true }
				>
						<ToggleControl
							label={ __( 'Select all collaborators', 'ambrygen-web' ) }
							checked={ selectAllCollaborators }
							onChange={ ( value ) =>
								setAttributes( {
									selectAllCollaborators: value,
									collaboratorIds: [],
								} )
							}
						/>
						{ selectAllCollaborators ? (
							<FormTokenField
								label={ __( 'Remove collaborators', 'ambrygen-web' ) }
								value={ selectedCollaboratorNames }
								suggestions={ suggestions }
								onChange={ onCollaboratorsChange }
								placeholder={ __(
									'Remove collaborators...',
									'ambrygen-web'
								) }
							/>
						) : (
							<FormTokenField
								label={ __( 'Collaborators', 'ambrygen-web' ) }
								value={ selectedCollaboratorNames }
								suggestions={ suggestions }
								onChange={ onCollaboratorsChange }
								placeholder={ __(
									'Select collaborators...',
									'ambrygen-web'
								) }
							/>
						) }
					</PanelBody>

			</InspectorControls>

			<div className="download-list__inner">
				<div className="download-list__header-area mb-24">
					<RichText
						tagName={ headingTag }
						className="download-list__title heading-3 block-title mb-0"
						value={ title }
						placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
						onChange={ ( val ) => setAttributes( { title: val } ) }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
					/>
				</div>

				<div className="download-list__items">
					{ isResolvingTerms ? (
						<Spinner />
					) : visibleCollaboratorTerms.length ? (
						visibleCollaboratorTerms.map( ( term ) => (
							<div
								key={ term.id }
								className="download-list__grid-item"
							>
								<a
									href={ term.meta.link }
									className="download-list__grid-link"
									target="_blank"
									rel="noopener noreferrer"
									aria-label={ sprintf(
										/* translators: %s: collaborator name. */
										__(
											'%s (opens in a new tab)',
											'ambrygen-web'
										),
										term.name
									) }
									onClick={ ( event ) => event.preventDefault() }
								>
									{ term.name }
								</a>
							</div>
						) )
					) : hasResolvedTerms ? (
						<Notice status="warning" isDismissible={ false }>
							{ __( 'No collaborator terms found.', 'ambrygen-web' ) }
						</Notice>
					) : (
						<Spinner />
					) }
				</div>
			</div>
		</div>
	);
}
