import { useBlockProps } from '@wordpress/block-editor';
import { TextControl } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { text, isNameLocked } = attributes;
	const blockProps = useBlockProps( {
		className: 'download-list__item',
	} );

	return (
		<div { ...blockProps }>
			{ isNameLocked ? (
				<div className="download-list__item-link">
					<span className="download-list__item-text">
						{ text || '' }
					</span>
				</div>
			) : (
				<TextControl
					value={ text }
					onChange={ ( val ) => setAttributes( { text: val } ) }
					placeholder=""
					className="collaborators-item__text-input"
				/>
			) }
		</div>
	);
}
