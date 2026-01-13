import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import { useSelect } from '@wordpress/data';
import { PanelBody, SelectControl, Spinner } from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { selectedTestimonials = [] } = attributes;

	/**
	 * Fetch testimonials for dropdown (LIMITED)
	 */
	const allTestimonials = useSelect( ( select ) =>
		select( 'core' ).getEntityRecords( 'postType', 'testimonial', {
			per_page: 20,
		} )
	);

	/**
	 * Fetch selected testimonials for preview
	 */
	const selectedPosts = useSelect(
		( select ) => {
			if ( ! selectedTestimonials.length ) {
				return [];
			}

			return select( 'core' ).getEntityRecords(
				'postType',
				'testimonial',
				{
					include: selectedTestimonials,
					per_page: selectedTestimonials.length,
					_embed: true,
				}
			);
		},
		[ selectedTestimonials ]
	);

	/**
	 * SAFETY: normalize arrays
	 */
	const selectorOptions = Array.isArray( allTestimonials )
		? allTestimonials.map( ( post ) => ( {
				label: post?.title?.rendered || `Testimonial ${ post?.id }`,
				value: post?.id,
		  } ) )
		: [];

	const previewPosts = Array.isArray( selectedPosts ) ? selectedPosts : [];

	// FIXED: Proper block props with editor-specific class
	const blockProps = useBlockProps( {
		className: 'testimonial-block-editor-wrapper',
	} );

	// FIXED: Extract render state to avoid nested ternaries
	let renderContent;

	if ( ! selectedTestimonials.length ) {
		renderContent = (
			<div className="testimonial-placeholder">
				<p>Select testimonials to display.</p>
			</div>
		);
	} else if ( ! previewPosts.length ) {
		renderContent = (
			<div className="testimonial-loading">
				<Spinner />
			</div>
		);
	} else {
		renderContent = (
			<div className="testimonials-preview">
				{ previewPosts.map( ( post ) => (
					<div key={ post.id } className="testimonial-card">
						{ post._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ] && (
							<img
								src={
									post._embedded[ 'wp:featuredmedia' ][ 0 ]
										.source_url
								}
								alt={ post.title?.rendered || '' }
							/>
						) }

						<h4>
							{ post.title?.rendered ||
								`Testimonial ${ post.id }` }
						</h4>

						{ post.excerpt?.rendered && (
							<div className="testimonial-excerpt">
								{ post.excerpt.rendered.replace(
									/<[^>]*>/g,
									''
								) }
							</div>
						) }
					</div>
				) ) }
			</div>
		);
	}

	return (
		<>
			<InspectorControls>
				<PanelBody title="Select Testimonials">
					<SelectControl
						multiple
						label="Testimonials"
						value={ selectedTestimonials }
						options={ selectorOptions }
						onChange={ ( values ) =>
							setAttributes( {
								selectedTestimonials: Array.isArray( values )
									? values.map( Number )
									: [],
							} )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="testimonial-block-editor">
					{ renderContent }
				</div>
			</div>
		</>
	);
}
