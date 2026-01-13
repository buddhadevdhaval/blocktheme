export default function Save( { attributes } ) {
	return (
		<div
			className="testimonial-block-frontend"
			data-testimonials={ attributes.selectedTestimonials.join( ',' ) }
		/>
	);
}
