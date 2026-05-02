import { InnerBlocks, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const CONTENT_TEMPLATE = [
	[
		'core/list',
		{ ordered: false },
		[ [ 'core/list-item', { content: '' } ] ],
	],
];

export default function OrderingOptionsEdit( {
	description,
	displayImageUrl,
	imageAlt,
	imageUrl,
	sectiontitle,
	setAttributes,
} ) {
	return (
		<>
			<div className="ordering-options__card-image">
				{ displayImageUrl && (
					<img
						src={ displayImageUrl }
						alt={ imageUrl ? imageAlt || '' : '' }
					/>
				) }
			</div>

			<div className="ordering-options__card-body">
				<div className="ordering-options__card-content">
					<RichText
						tagName="div"
						className="heading-5 ordering-options__card-title mb-0"
						value={ sectiontitle }
						onChange={ ( value ) =>
							setAttributes( { sectiontitle: value } )
						}
						placeholder={ __( 'Add Title...', 'ambrygen-web' ) }
						allowedFormats={ [] }
					/>

					<RichText
						tagName="div"
						className="subtitle2-sbold ordering-options__card-subtitle"
						value={ description }
						onChange={ ( value ) =>
							setAttributes( { description: value } )
						}
						placeholder={ __(
							'Add Short Description...',
							'ambrygen-web'
						) }
					/>

					<div className="is-style-gl-s16" aria-hidden="true"></div>

					<div className="ordering-options__card-copy">
						<InnerBlocks
							allowedBlocks={ [
								'core/list',
								'core/paragraph',
								'core/spacer',
								'core/buttons',
							] }
							template={ CONTENT_TEMPLATE }
							templateLock={ false }
							renderAppender={ InnerBlocks.ButtonBlockAppender }
						/>
					</div>

					<div className="is-style-gl-s16" aria-hidden="true"></div>
				</div>
			</div>
		</>
	);
}
