import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	RichText,
} from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import {
	TagSelector,
	ImageUploader,
	DEFAULT_IMAGES,
} from '../_shared/components';

const MAX_FAQS = 10;

export default function Edit( { attributes, setAttributes } ) {
	const { imageUrl, faqs = [], title, headingTag } = attributes;

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
	useEffect( () => {
		if ( ! imageUrl ) {
			const defaults = DEFAULT_IMAGES();

			if ( defaults.placeholder.url ) {
				setAttributes( {
					imageUrl: defaults.placeholder.url,
					imageId: defaults.placeholder.id,
				} );
			}
		}
	}, [] );

	return (
		<>
			<InspectorControls>
				<PanelBody
					title={ __( 'FAQ Setting', 'ambrygen-web' ) }
					initialOpen
				>
					<TagSelector
						label={ __( 'Heading Tag', 'ambrygen-web' ) }
						value={ headingTag }
						onChange={ ( value ) =>
							setAttributes( { headingTag: value } )
						}
					/>

					<ImageUploader
						label={ __( 'FAQ Image', 'ambrygen-web' ) }
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
								imageId: 0,
							} )
						}
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
								<img
									src={ imageUrl || defaults.placeholder.url }
								/>
							</div>
						</div>

						{ /* RIGHT FAQ */ }
						<div className="alongside-faq__col alongside-faq__col--right">
							<div className="alongside-faq__content">
								<RichText
									tagName={ headingTag || 'h5' }
									className="heading-4 alongside-faq__title mb-0"
									value={ title }
									onChange={ ( value ) =>
										setAttributes( { title: value } )
									}
									placeholder={ __(
										'Frequently Asked Questions',
										'ambrygen-web'
									) }
								/>

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
