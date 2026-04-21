import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { useSelect, useDispatch } from '@wordpress/data';
import { chevronUp, chevronDown } from '@wordpress/icons';
import { PanelBody, TextControl, Button } from '@wordpress/components';

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { label, url, iconId, iconUrl } = attributes;
	const blockProps = useBlockProps( {
		className: 'nav__item--mega-menu__submenu-inner--links-item',
	} ); // Add a wrapper class if needed

	const { index, rootClientId, total } = useSelect(
		( select ) => {
			const { getBlockIndex, getBlockRootClientId, getBlocks } =
				select( 'core/block-editor' );
			const rootId = getBlockRootClientId( clientId );
			return {
				index: getBlockIndex( clientId, rootId ),
				rootClientId: rootId,
				total: getBlocks( rootId ).length,
			};
		},
		[ clientId ]
	);

	const { moveBlockToPosition } = useDispatch( 'core/block-editor' );

	const onMoveUp = () => {
		if ( index > 0 ) {
			moveBlockToPosition(
				clientId,
				rootClientId,
				rootClientId,
				index - 1
			);
		}
	};

	const onMoveDown = () => {
		if ( index < total - 1 ) {
			moveBlockToPosition(
				clientId,
				rootClientId,
				rootClientId,
				index + 1
			);
		}
	};

	const onSelectMedia = ( media ) => {
		setAttributes( {
			iconId: media.id,
			iconUrl: media.url,
		} );
	};

	const removeMedia = () => {
		setAttributes( {
			iconId: 0,
			iconUrl: '',
		} );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Link Settings', 'ambrygen-web' ) }>
					<TextControl
						label={ __( 'URL', 'ambrygen-web' ) }
						value={ url }
						onChange={ ( value ) =>
							setAttributes( { url: value } )
						}
					/>
				</PanelBody>
				<PanelBody title={ __( 'Icon Settings', 'ambrygen-web' ) }>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ onSelectMedia }
							allowedTypes={ [ 'image' ] }
							value={ iconId }
							render={ ( { open } ) => (
								<>
									{ iconUrl && (
										<img
											src={ iconUrl }
											alt="Icon"
											style={ {
												display: 'block',
												marginBottom: '10px',
												maxWidth: '50px',
											} }
										/>
									) }
									<Button
										variant="secondary"
										onClick={ open }
									>
										{ iconUrl
											? __(
													'Replace Icon',
													'ambrygen-web'
											  )
											: __(
													'Upload Icon',
													'ambrygen-web'
											  ) }
									</Button>
									{ iconUrl && (
										<Button
											variant="link"
											isDestructive
											onClick={ removeMedia }
										>
											{ __(
												'Remove Icon',
												'ambrygen-web'
											) }
										</Button>
									) }
								</>
							) }
						/>
					</MediaUploadCheck>
				</PanelBody>
			</InspectorControls>

			<li { ...blockProps }>
				<div style={ { marginBottom: '4px', display: 'flex' } }>
					<Button
						icon={ chevronUp }
						size="small"
						disabled={ index === 0 }
						onClick={ onMoveUp }
						label={ __( 'Move Up', 'ambrygen-web' ) }
					/>
					<Button
						icon={ chevronDown }
						size="small"
						disabled={ index >= total - 1 }
						onClick={ onMoveDown }
						label={ __( 'Move Down', 'ambrygen-web' ) }
					/>
				</div>
				<a
					href={ url }
					className="nav__item--mega-menu__submenu-inner--link submenu-inner-link"
					onClick={ ( e ) => e.preventDefault() }
				>
					{ iconUrl && (
						<div className="nav__item--mega-menu__submenu-inner--icon">
							<img src={ iconUrl } alt="" />
						</div>
					) }
					<RichText
						tagName="div"
						className="nav__item--mega-menu__submenu-inner--link-title body2-medium"
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						placeholder={ __( 'Link Label', 'ambrygen-web' ) }
					/>
				</a>
			</li>
		</>
	);
}
