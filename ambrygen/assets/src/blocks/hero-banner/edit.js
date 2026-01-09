import {
	useBlockProps,
	RichText,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { heading, content, imageUrl, imageAlt } = attributes;

	return (
		<div { ...useBlockProps( { className: 'contact-banner' } ) }>
			<div className="contact-banner__inner">
				<div className="contact-banner__content">
					<RichText
						tagName="h2"
						value={ heading }
						onChange={ ( val ) =>
							setAttributes( { heading: val } )
						}
						placeholder="Heading..."
					/>
					<RichText
						tagName="p"
						value={ content }
						onChange={ ( val ) =>
							setAttributes( { content: val } )
						}
						placeholder="Content..."
					/>
				</div>

				<div className="contact-banner__image">
					<MediaUploadCheck>
						<MediaUpload
							onSelect={ ( media ) =>
								setAttributes( {
									imageUrl: media.url,
									imageAlt: media.alt,
								} )
							}
							allowedTypes={ [ 'image' ] }
							render={ ( { open } ) => (
								<Button onClick={ open } variant="secondary">
									{ imageUrl
										? 'Change Image'
										: 'Select Image' }
								</Button>
							) }
						/>
					</MediaUploadCheck>

					{ imageUrl && <img src={ imageUrl } alt={ imageAlt } /> }
				</div>
			</div>
		</div>
	);
}
