import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
} from '@wordpress/block-editor';
import {
	ColorPicker,
	Placeholder,
	PanelRow,
	PanelBody,
	Button,
} from '@wordpress/components';

const MAX_FAQS = 10;

export default function Edit( { attributes, setAttributes } ) {
	const { backgroundColor, imageUrl, imageAlt, faqs = [] } = attributes;

	const blockProps = useBlockProps( {
		style: { backgroundColor },
	} );

	const updateFaq = ( index, field, value ) => {
		const newFaqs = [ ...faqs ];
		newFaqs[ index ] = {
			...newFaqs[ index ],
			[ field ]: value,
		};
		setAttributes( { faqs: newFaqs } );
	};

	const addFaq = () => {
		if ( faqs.length >= MAX_FAQS ) {
			return;
		}

		setAttributes( {
			faqs: [
				...faqs,
				{
					question: '',
					answer: '',
				},
			],
		} );
	};

	const removeFaq = ( index ) => {
		const newFaqs = faqs.filter( ( _, i ) => i !== index );
		setAttributes( { faqs: newFaqs } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'Background Settings', 'ambrygen-web' ) }
				>
					<ColorPicker
						color={ backgroundColor }
						onChange={ ( color ) =>
							setAttributes( { backgroundColor: color } )
						}
					/>
				</PanelBody>

				<PanelBody
					title={ __( 'FAQ Image', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					<PanelRow>
						{ ! imageUrl ? (
							<MediaUploadCheck>
								<MediaUpload
									onSelect={ ( media ) =>
										setAttributes( {
											imageUrl: media.url,
											imageId: media.id,
											imageAlt: media.alt || '',
										} )
									}
									allowedTypes={ [ 'image' ] }
									render={ ( { open } ) => (
										<Button
											onClick={ open }
											variant="primary"
										>
											{ __(
												'Upload Image',
												'ambrygen-web'
											) }
										</Button>
									) }
								/>
							</MediaUploadCheck>
						) : (
							<div className="image-preview">
								<img
									src={ imageUrl }
									alt={
										imageAlt ||
										__( 'FAQ illustration', 'ambrygen-web' )
									}
									style={ {
										maxWidth: '100px',
										height: 'auto',
										marginBottom: '10px',
									} }
								/>
								<div className="image-info">
									<p className="image-size">
										{ __(
											'FAQ image uploaded',
											'ambrygen-web'
										) }
									</p>
									{ imageAlt && (
										<p className="image-alt">
											{ __(
												'Alt text:',
												'ambrygen-web'
											) }{ ' ' }
											{ imageAlt }
										</p>
									) }
								</div>
								<MediaUploadCheck>
									<MediaUpload
										onSelect={ ( media ) =>
											setAttributes( {
												imageUrl: media.url,
												imageId: media.id,
												imageAlt: media.alt || '',
											} )
										}
										allowedTypes={ [ 'image' ] }
										render={ ( { open } ) => (
											<Button
												onClick={ open }
												variant="secondary"
											>
												{ __(
													'Replace Image',
													'ambrygen-web'
												) }
											</Button>
										) }
									/>
								</MediaUploadCheck>
								<Button
									onClick={ () =>
										setAttributes( {
											imageUrl: '',
											imageId: 0,
											imageAlt: '',
										} )
									}
									variant="link"
									isDestructive
								>
									{ __( 'Remove Image', 'ambrygen-web' ) }
								</Button>
							</div>
						) }
					</PanelRow>
				</PanelBody>
			</InspectorControls>

			<section { ...blockProps } className="ambrygen-faq">
				<div className="faq-inner">
					<div className="faq-image">
						{ imageUrl ? (
							<img
								src={ imageUrl }
								alt={
									imageAlt ||
									__( 'FAQ illustration', 'ambrygen-web' )
								}
								style={ { maxWidth: '100%', height: 'auto' } }
							/>
						) : (
							<Placeholder
								icon="format-image"
								label={ __(
									'No FAQ image selected',
									'ambrygen-web'
								) }
								instructions={ __(
									'Upload an image from the sidebar settings.',
									'ambrygen-web'
								) }
							/>
						) }
					</div>

					<div className="faq-content">
						<h2>
							{ __(
								'Frequently Asked Questions',
								'ambrygen-web'
							) }
						</h2>

						{ faqs.length === 0 && (
							<p className="faq-empty">
								{ __( 'No FAQs added yet.', 'ambrygen-web' ) }
							</p>
						) }

						{ faqs.map( ( faq, index ) => (
							<div key={ index } className="faq-item editor">
								<RichText
									tagName="h4"
									value={ faq.question }
									onChange={ ( value ) =>
										updateFaq( index, 'question', value )
									}
									placeholder={ __(
										'FAQ Question',
										'ambrygen-web'
									) }
								/>

								<RichText
									tagName="p"
									value={ faq.answer }
									onChange={ ( value ) =>
										updateFaq( index, 'answer', value )
									}
									placeholder={ __(
										'FAQ Answer',
										'ambrygen-web'
									) }
								/>

								<Button
									variant="destructive"
									onClick={ () => removeFaq( index ) }
								>
									{ __( 'Remove', 'ambrygen-web' ) }
								</Button>
							</div>
						) ) }

						{ faqs.length < MAX_FAQS && (
							<Button
								variant="primary"
								onClick={ addFaq }
								style={ { marginTop: '16px' } }
							>
								{ __( 'Add FAQ', 'ambrygen-web' ) }
							</Button>
						) }
					</div>
				</div>
			</section>
		</>
	);
}
