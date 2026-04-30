import { __ } from '@wordpress/i18n';
import { useBlockProps, RichText } from '@wordpress/block-editor';

/**
 * Edit component for the Blog Disclaimer block.
 *
 * @param {Object} props External props.
 * @return {JSX.Element} The edit component.
 */
export default function Edit( { attributes, setAttributes } ) {
	const { heading, content } = attributes;
	const blockProps = useBlockProps( {
		className: 'blog-disclaimer',
	} );

	return (
		<div { ...blockProps }>
			<div className="blog-disclaimer__icon" aria-hidden="true">
				<svg
					width="20"
					height="20"
					viewBox="0 0 20 20"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M10 1.667A8.333 8.333 0 1 0 10 18.334 8.333 8.333 0 0 0 10 1.667zm0 3.75a.833.833 0 1 1 0 1.667.833.833 0 0 1 0-1.667zm1.25 8.75h-2.5v-5h2.5v5z"
						fill="currentColor"
					/>
				</svg>
			</div>
			<div className="blog-disclaimer__body">
				<RichText
					tagName="div"
					className="blog-disclaimer__heading text-small-semibold"
					value={ heading }
					onChange={ ( value ) => setAttributes( { heading: value } ) }
					placeholder={ __( 'Add Header...', 'ambrygen-web' ) }
				/>
				<RichText
					tagName="div"
					className="blog-disclaimer__text text-small"
					value={ content }
					onChange={ ( value ) => setAttributes( { content: value } ) }
					placeholder={ __( 'Add Description...', 'ambrygen-web' ) }
				/>
			</div>
		</div>
	);
}
