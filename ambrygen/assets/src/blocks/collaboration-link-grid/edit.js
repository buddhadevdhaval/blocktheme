import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	FormTokenField,
	Notice,
	PanelBody,
	Spinner,
	ToggleControl,
} from '@wordpress/components';
import { useEffect, useMemo } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { __, sprintf } from '@wordpress/i18n';
import { TagSelector, BlockExamplePreview } from '../_shared/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		anchor,
		title,
		headingTag,
		selectAllCollaborators = true,
		collaboratorIds = [],
	} = attributes;

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
		( term ) =>
			typeof term?.meta?.link === 'string' && term.meta.link.trim()
	);
	let visibleCollaboratorTerms = [];
	if ( selectAllCollaborators ) {
		visibleCollaboratorTerms = linkedCollaboratorTerms.filter(
			( term ) => ! collaboratorIds.includes( term.id )
		);
	} else if ( collaboratorIds.length ) {
		visibleCollaboratorTerms = linkedCollaboratorTerms.filter( ( term ) =>
			collaboratorIds.includes( term.id )
		);
	}
	const suggestions = linkedCollaboratorTerms.map( ( term ) => term.name );

	const selectedCollaboratorNames = collaboratorIds.flatMap( ( id ) => {
		const term = linkedCollaboratorTerms.find( ( item ) => item.id === id );
		return term ? [ term.name ] : [];
	} );

	const onCollaboratorsChange = ( names ) => {
		const newIds = names.flatMap( ( name ) => {
			const term = linkedCollaboratorTerms.find(
				( item ) => item.name === name
			);
			return term ? [ term.id ] : [];
		} );

		setAttributes( { collaboratorIds: newIds } );
	};

	const blockProps = useBlockProps( {
		className: 'download-list block-layout variation-grid-view',
		id: anchor || blockId,
	} );

	if ( blockId === 'collaboration-link-grid-example' ) {
		return (
			<BlockExamplePreview imagePath="/assets/src/images/cta-tiles-with-3-card/default-image.png" />
		);
	}

	let itemsContent = <Spinner />;
	if ( isResolvingTerms ) {
		itemsContent = <Spinner />;
	} else if ( visibleCollaboratorTerms.length ) {
		itemsContent = visibleCollaboratorTerms.map( ( term ) => (
			<div key={ term.id } className="download-list__grid-item">
				<div
					className="download-list__grid-link"
					aria-label={ sprintf(
						/* translators: %s: collaborator name. */
						__( '%s (opens in a new tab)', 'ambrygen-web' ),
						term.name
					) }
				>
					{ term.name }
				</div>
			</div>
		) );
	} else if ( hasResolvedTerms ) {
		itemsContent = (
			<Notice status="warning" isDismissible={ false }>
				{ __( 'No collaborator terms found.', 'ambrygen-web' ) }
			</Notice>
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
					title={ __( 'Collaborators', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __(
							'Select all collaborators',
							'ambrygen-web'
						) }
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
							label={ __(
								'Remove collaborators',
								'ambrygen-web'
							) }
							value={ selectedCollaboratorNames }
							suggestions={ suggestions }
							onChange={ onCollaboratorsChange }
							placeholder={ __(
								'Remove collaborators…',
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
								'Select collaborators…',
								'ambrygen-web'
							) }
						/>
					) }
				</PanelBody>
			</InspectorControls>

			<div className="download-list__inner">
				<div className="download-list__header-area mb-24 ">
					<RichText
						tagName={ headingTag }
						className="download-list__title heading-3 block-title mb-0"
						value={ title }
						placeholder={ __( 'Add Heading…', 'ambrygen-web' ) }
						onChange={ ( val ) => setAttributes( { title: val } ) }
						allowedFormats={ [ 'core/bold', 'core/italic' ] }
					/>
				</div>

				<div className="download-list__items">{ itemsContent }</div>
			</div>
		</div>
	);
}
