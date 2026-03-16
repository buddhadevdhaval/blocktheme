import {
	useBlockProps,
	RichText,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';

import { PanelBody, Button, SelectControl } from '@wordpress/components';

import {
	ImageUploader,
	ImagePlaceholder,
	CtaButtonField,
	DEFAULT_IMAGES,
	ItemHeader,
	PanelItem,
	Field,
} from '../_shared/components';
import { useArrayHandlers } from '../_shared/utils';
import { __ } from '@wordpress/i18n';

const DEFAULT_FILE = {
	fileId: 0,
	fileUrl: '',
	fileName: '',
	sizeType: 'small',
};

export default function Edit( { attributes, setAttributes } ) {
	const { sectiontitle, description, imageUrl, cta, files } = attributes;

	const defaultImage = DEFAULT_IMAGES().placeholder.url;
	const displayImage = imageUrl || defaultImage;

	const blockProps = useBlockProps( {
		className: 'approach-card',
	} );

	const { update, add, remove, move } = useArrayHandlers(
		setAttributes,
		'files'
	);

	const updateFileMedia = ( index, media ) => {
		setAttributes( ( prev ) => {
			const nextFiles = [ ...( prev.files || [] ) ];
			nextFiles[ index ] = {
				...nextFiles[ index ],
				fileUrl: media?.url || '',
				fileId: media?.id || 0,
				fileName:
					media?.title ||
					media?.filename ||
					nextFiles[ index ]?.fileName ||
					'',
			};
			return { files: nextFiles };
		} );
	};

	const clearFileMedia = ( index ) => {
		setAttributes( ( prev ) => {
			const nextFiles = [ ...( prev.files || [] ) ];
			nextFiles[ index ] = {
				...nextFiles[ index ],
				fileUrl: '',
				fileId: 0,
			};
			return { files: nextFiles };
		} );
	};

	return (
		<>
			{ /* Sidebar Controls */ }
			<InspectorControls>
				<PanelBody
					title={ __( 'Card Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ImageUploader
						label={ __( 'Card Image', 'ambrygen-web' ) }
						url={ imageUrl }
						onSelect={ ( media ) =>
							setAttributes( {
								imageUrl: media.url,
								imageId: media.id,
							} )
						}
						onRemove={ () =>
							setAttributes( {
								imageUrl: '',
								imageId: undefined,
							} )
						}
					/>

					<CtaButtonField
						label={ __( 'CTA', 'ambrygen-web' ) }
						value={ cta }
						showVariant={ false }
						onChange={ ( value ) =>
							setAttributes( { cta: value } )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'File Downloads', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<p className="components-base-control__help">
						{ __(
							'Add files to show a download link with size type.',
							'ambrygen-web'
						) }
					</p>

					{ ( files || [] ).length === 0 && (
						<p className="components-base-control__help">
							{ __(
								'No files added yet.',
								'ambrygen-web'
							) }
						</p>
					) }

					{ ( files || [] ).map( ( fileItem, index ) => (
						<PanelItem key={ index }>
							<ItemHeader
								index={ index }
								label={
									fileItem.fileName || fileItem.fileUrl
								}
								total={ ( files || [] ).length }
								onMove={ ( i, dir ) => move( i, dir ) }
								onRemove={ ( i ) => remove( i, 0 ) }
								minCount={ 0 }
							/>

							<div style={ { marginBottom: '8px' } }>
								<MediaUploadCheck>
									<MediaUpload
										allowedTypes={ [
											'application',
											'text',
											'audio',
											'video',
										] }
										onSelect={ ( media ) =>
											updateFileMedia( index, media )
										}
										render={ ( { open } ) => (
											<Button
												variant="secondary"
												onClick={ ( e ) => {
													e.stopPropagation();
													open();
												} }
											>
												{ fileItem.fileUrl
													? __(
															'Replace File',
															'ambrygen-web'
													  )
													: __(
															'Select File',
															'ambrygen-web'
													  ) }
											</Button>
										) }
									/>
								</MediaUploadCheck>
								{ fileItem.fileUrl && (
									<Button
										variant="secondary"
										isDestructive
										onClick={ ( e ) => {
											e.stopPropagation();
											clearFileMedia( index );
										} }
										style={ { marginLeft: '8px' } }
									>
										{ __(
											'Remove File',
											'ambrygen-web'
										) }
									</Button>
								) }
							</div>

							<Field
								label={ __(
									'File Name (optional)',
									'ambrygen-web'
								) }
								value={ fileItem.fileName || '' }
								onChange={ ( value ) =>
									update( index, 'fileName', value )
								}
								onClick={ ( e ) => e.stopPropagation() }
							/>

							<SelectControl
								label={ __(
									'File Size Type',
									'ambrygen-web'
								) }
								value={ fileItem.sizeType || 'small' }
								options={ [
									{
										label: __(
											'Small',
											'ambrygen-web'
										),
										value: 'small',
									},
									{
										label: __(
											'Large',
											'ambrygen-web'
										),
										value: 'large',
									},
								] }
								onChange={ ( value ) =>
									update( index, 'sizeType', value )
								}
							/>
						</PanelItem>
					) ) }

					<Button
						variant="primary"
						onClick={ () => add( DEFAULT_FILE ) }
						style={ { width: '100%', justifyContent: 'center' } }
					>
						{ __( 'Add File', 'ambrygen-web' ) }
					</Button>
				</PanelBody>
			</InspectorControls>

			{ /* Editor Canvas */ }
			<div { ...blockProps }>
				<div className="approach-card__inner">
					<div className="approach-card__image-wrapper">
						<div className="approach-card__image">
							{ displayImage ? (
								<img src={ displayImage } alt="" />
							) : (
								<ImagePlaceholder
									text={ __(
										'No image set',
										'ambrygen-web'
									) }
								/>
							) }
						</div>
						<div
							className="is-style-gl-s24"
							aria-hidden="true"
						></div>

						<div className="approach-card__text-content">
							<RichText
								tagName="h3"
								className="approach-card__title heading-5 mb-0"
								value={ sectiontitle }
								onChange={ ( value ) =>
									setAttributes( { sectiontitle: value } )
								}
								placeholder={ __(
									'Card Title',
									'ambrygen-web'
								) }
								allowedFormats={ [ 'core/text-color' ] }
							/>

							<RichText
								tagName="div"
								className="approach-card__description body2-reg"
								value={ description }
								onChange={ ( value ) =>
									setAttributes( { description: value } )
								}
								placeholder={ __(
									'Card description…',
									'ambrygen-web'
								) }
							/>
							{/* Show files if available */}
						{ files?.length > 0 && (
							<div className="approach-card__files">
								{ files.map( ( file, index ) => {
									const extension = file?.fileUrl
										?.split('.')
										.pop()
										?.toUpperCase();

									return (
										<div
											key={ index }
											className="approach-card__file"
										>
											{ extension && (
												<span className="file-type">
													({ extension })
												</span>
											)}
										</div>
									);
								} ) }
							</div>
						) }

						</div>
					</div>

					<div className="is-style-gl-s32" aria-hidden="true"></div>

					{ /* CTA Preview */ }
					{ cta?.text && (
						<div className="approach-card__cta-wrapper">
							<span className="approach-card__cta">
								{ cta.text }
							</span>
						</div>
					) }
				</div>
			</div>
		</>
	);
}
