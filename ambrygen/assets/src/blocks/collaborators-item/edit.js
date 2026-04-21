import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, TextControl, ToggleControl } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

export default function Edit( { attributes, setAttributes } ) {
	const { text, url, linkTarget } = attributes;

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody title="Link Settings">
					<TextControl
						label="Link URL"
						value={ url }
						onChange={ ( val ) => setAttributes( { url: val } ) }
						placeholder="https://example.com"
					/>
					<ToggleControl
						label="Open in new tab"
						checked={ linkTarget === '_blank' }
						onChange={ ( val ) =>
							setAttributes( { linkTarget: val ? '_blank' : '' } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div
				{ ...useBlockProps( {
					className: 'collaborators-item__edit',
				} ) }
			>
				<TextControl
					value={ text }
					onChange={ ( val ) => setAttributes( { text: val } ) }
					placeholder="Enter collaborator name or title..."
					className="collaborators-item__text-input"
				/>
			</div>
		</Fragment>
	);
}
