document.addEventListener( 'DOMContentLoaded', () => {
	const blocks = document.querySelectorAll( '.testimonial-block-frontend' );

	blocks.forEach( ( block ) => {
		const ids = block.dataset.testimonials
			?.split( ',' )
			.map( Number )
			.filter( Boolean );

		if ( ! ids?.length ) {
			block.innerHTML =
				'<p class="no-testimonials">No testimonials selected.</p>';
			return;
		}

		fetch(
			`/wp-json/wp/v2/testimonial?include=${ ids.join( ',' ) }&_embed=1`
		)
			.then( ( response ) => {
				if ( ! response.ok ) {
					throw new Error( `HTTP ${ response.status }` );
				}
				return response.json();
			} )
			.then( ( posts ) => {
				if ( ! Array.isArray( posts ) || posts.length === 0 ) {
					block.innerHTML =
						'<p class="no-testimonials">No testimonials found.</p>';
					return;
				}

				block.innerHTML = posts
					.map( ( post ) => {
						// SAFE ACCESS: Use optional chaining and fallbacks
						const title =
							post.title?.rendered ||
							post.title?.raw ||
							`Testimonial ${ post.id }`;
						const excerpt =
							post.excerpt?.rendered ||
							post.excerpt?.raw ||
							post.content?.rendered?.substring( 0, 100 ) ||
							'No description available.';
						const featuredImg =
							post._embedded?.[ 'wp:featuredmedia' ]?.[ 0 ];
						const author = post._embedded?.author?.[ 0 ];

						return `
                            <div class="testimonial-card">
                                ${
									featuredImg
										? `
                                    <img src="${ featuredImg.source_url }" 
                                         alt="${
												featuredImg.alt_text || title
											}" 
                                         width="60" height="60" />
                                `
										: ''
								}
                                <h4>${ title }</h4>
                                <div class="testimonial-excerpt">${ excerpt }</div>
                                ${
									author
										? `<p class="testimonial-author">- ${ author.name }</p>`
										: ''
								}
                            </div>
                        `;
					} )
					.join( '' );
			} )
			.catch( () => {
				block.innerHTML =
					'<p class="error-msg">Error loading testimonials.</p>';
			} );
	} );
} );
