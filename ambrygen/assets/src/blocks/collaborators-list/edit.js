import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import {
	PanelBody,
	TextControl,
	ToggleControl,
	SelectControl,
	Spinner,
	Notice,
	Button,
} from '@wordpress/components';
import { Fragment, useState, useEffect, useRef, useMemo } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import apiFetch from '@wordpress/api-fetch';

const ALLOWED_BLOCKS = [ 'ambrygen/collaborators-item' ];
const TEMPLATE = [ [ 'ambrygen/collaborators-item', {} ] ];

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { title, isOpen, selectionMode } = attributes;
	const previousSelectionMode = useRef( selectionMode );
	const { insertBlock, replaceInnerBlocks } = useDispatch( 'core/block-editor' );

	const { collaboratorTerms, hasResolved, isResolving } = useSelect(
		( select ) => {
			const { getEntityRecords, isResolving, hasFinishedResolution } =
				select( 'core' );
			const query = {
				per_page: 100,
				orderby: 'name',
				order: 'asc',
				context: 'edit',
			};

			return {
				collaboratorTerms:
					getEntityRecords( 'taxonomy', 'collaborator', query ) || [],
				isResolving: isResolving( 'getEntityRecords', [
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

	const manualTemplateBlocks = TEMPLATE.map( ( [ name, blockAttributes ] ) =>
		createBlock( name, blockAttributes )
	);

	const loadLinkedCollaborators = () => {
		if ( ! Array.isArray( terms ) || terms.length === 0 ) {
			return;
		}

		const blocks = terms.map( ( term ) =>
			createBlock( 'ambrygen/collaborators-item', {
				text: term.name || '',
				url: term.meta?.link || '',
				linkTarget: '_blank',
			} )
		);

		replaceInnerBlocks( clientId, blocks, false );
	};

	useEffect( () => {
		if ( selectionMode === 'link-all' && termsLoaded ) {
			loadLinkedCollaborators();
		}
	}, [ selectionMode, terms, termsLoaded ] );

	useEffect( () => {
		if (
			previousSelectionMode.current === 'link-all' &&
			selectionMode === 'manual'
		) {
			replaceInnerBlocks( clientId, manualTemplateBlocks, false );
		}

		previousSelectionMode.current = selectionMode;
	}, [ selectionMode, clientId ] );

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title="Settings">
					<ToggleControl
						label="Open by default"
						checked={ isOpen }
						onChange={ ( val ) => setAttributes( { isOpen: val } ) }
					/>
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
					/>
				</PanelBody>
			</InspectorControls>

			<div
				{ ...useBlockProps( {
					className: 'collaborators-list__container',
				} ) }
			>
				<div className="collaborators-list__header">
					<TextControl
						value={ title }
						onChange={ ( val ) => setAttributes( { title: val } ) }
						placeholder="Title"
						className="collaborators-list__title-input"
					/>
				</div>
				<div className="collaborators-list__content">
					{ isLoadingTerms && <Spinner /> }
					{ termsLoaded && Array.isArray( terms ) && terms.length === 0 && (
						<Notice status="warning" isDismissible={ false }>
							No collaborator terms with a non-empty link and assigned posts are available.
						</Notice>
					) }
					{ termsError && (
						<Notice status="error" isDismissible={ false }>
							Unable to load collaborator terms with link meta.
						</Notice>
					) }
					<InnerBlocks
						allowedBlocks={ ALLOWED_BLOCKS }
						template={ TEMPLATE }
						orientation="vertical"
						renderAppender={ false }
					/>
					{ selectionMode === 'manual' && (
						<div className="collaborators-list__actions actions-button">
							<Button
								variant="secondary"
								onClick={ () => {
									insertBlock(
										createBlock(
											'ambrygen/collaborators-item',
											{}
										),
										innerBlocks.length,
										clientId
									);
								} }
							>
								Add Collaborator Link Item
							</Button>
						</div>
					) }
					{ selectionMode === 'link-all' && innerBlocks.length > 0 && (
						<Notice status="info" isDismissible={ false }>
							Linked collaborator items can still be updated or removed manually.
						</Notice>
					) }
				</div>
			</div>
		</Fragment>
	);
}
