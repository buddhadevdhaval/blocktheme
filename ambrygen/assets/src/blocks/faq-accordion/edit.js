import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, Button, ToggleControl } from '@wordpress/components';
import { useState } from '@wordpress/element';

const MAX_FAQS = 10;

export default function Edit( { attributes, setAttributes } ) {
	const { imageUrl, imageAlt, faqs = [] } = attributes;

	const [ isOpen, setIsOpen ] = useState( true ); // toggle for row visibility

	const blockProps = useBlockProps();

	const updateFaq = ( index, field, value ) => {
		const newFaqs = [ ...faqs ];
		newFaqs[ index ] = { ...newFaqs[ index ], [ field ]: value };
		setAttributes( { faqs: newFaqs } );
	};

	const addFaq = () => {
		if ( faqs.length >= MAX_FAQS ) {
			return;
		}
		setAttributes( { faqs: [ ...faqs, { question: '', answer: '' } ] } );
	};

	const removeFaq = ( index ) => {
		setAttributes( { faqs: faqs.filter( ( _, i ) => i !== index ) } );
	};

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'FAQ Image', 'ambrygen-web' ) }
					initialOpen
				>
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
									<Button onClick={ open } variant="primary">
										{ __( 'Upload Image', 'ambrygen-web' ) }
									</Button>
								) }
							/>
						</MediaUploadCheck>
					) : (
						<div style={ { marginBottom: '10px' } }>
							<img
								src={ imageUrl }
								alt={
									imageAlt ||
									__( 'FAQ illustration', 'ambrygen-web' )
								}
								style={ { maxWidth: '100%' } }
							/>
							<div style={ { marginTop: '5px' } }>
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
									isDestructive
									variant="link"
								>
									{ __( 'Remove Image', 'ambrygen-web' ) }
								</Button>
							</div>
						</div>
					) }
				</PanelBody>

				<PanelBody
					title={ __( 'FAQ Row Settings', 'ambrygen-web' ) }
					initialOpen
				>
					<ToggleControl
						label={ __( 'Show FAQ Row', 'ambrygen-web' ) }
						checked={ isOpen }
						onChange={ () => setIsOpen( ! isOpen ) }
					/>
				</PanelBody>
			</InspectorControls>

			{ /* FAQ Row collapsible */ }
			<div { ...blockProps }>
				{ isOpen && (
					<div className="alongside-faq__row">
						{ /* LEFT IMAGE */ }
						<div className="alongside-faq__col alongside-faq__col--left">
							<div className="alongside-faq__media">
								{ imageUrl && (
									<img src={ imageUrl } alt={ imageAlt } />
								) }
							</div>
						</div>

						{ /* RIGHT FAQ */ }
						<div className="alongside-faq__col alongside-faq__col--right">
							<div className="alongside-faq__content">
								<div className="heading-4 alongside-faq__title mb-0">
									{ __(
										'Frequently Asked Questions',
										'ambrygen-web'
									) }
								</div>

								<div className="is-style-gl-s64"></div>

								<div className="faq">
									{ faqs.map( ( faq, index ) => (
										<div
											key={ index }
											className="faq__item editor"
										>
											<RichText
												tagName="div"
												className="faq__question"
												value={ faq.question }
												onChange={ ( value ) =>
													updateFaq(
														index,
														'question',
														value
													)
												}
												placeholder={ __(
													'FAQ Question',
													'ambrygen-web'
												) }
											/>
											<RichText
												tagName="div"
												className="faq__answer"
												value={ faq.answer }
												onChange={ ( value ) =>
													updateFaq(
														index,
														'answer',
														value
													)
												}
												placeholder={ __(
													'FAQ Answer',
													'ambrygen-web'
												) }
											/>
											<Button
												isDestructive
												onClick={ () =>
													removeFaq( index )
												}
											>
												{ __(
													'Remove',
													'ambrygen-web'
												) }
											</Button>
										</div>
									) ) }
									{ faqs.length < MAX_FAQS && (
										<Button
											variant="primary"
											onClick={ addFaq }
										>
											{ __( 'Add FAQ', 'ambrygen-web' ) }
										</Button>
									) }
								</div>
							</div>
						</div>
					</div>
				) }

				{ ! isOpen && (
					<Button
						variant="secondary"
						onClick={ () => setIsOpen( true ) }
					>
						{ __( 'Show FAQ Row', 'ambrygen-web' ) }
					</Button>
				) }
			</div>
		</>
	);
}
