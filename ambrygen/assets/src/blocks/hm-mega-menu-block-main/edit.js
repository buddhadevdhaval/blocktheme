/**
 * WordPress dependencies
 */
import { __, sprintf } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { useEntityRecords, useEntityRecord } from '@wordpress/core-data';
import { useSelect } from '@wordpress/data';
import { createInterpolateElement } from '@wordpress/element';
import {
	ComboboxControl,
	PanelBody,
	TextControl,
	ColorPalette,
	Placeholder,
	Button,
	__experimentalHStack as HStack,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
} from '@wordpress/components';
import {
	alignNone,
	justifyLeft,
	justifyCenter,
	justifyRight,
	stretchWide,
	stretchFullWidth,
	pencil, // ✅ correct icon
} from '@wordpress/icons';

/**
 * Edit Component
 * @param root0
 * @param root0.attributes
 * @param root0.setAttributes
 */
export default function Edit( { attributes, setAttributes } ) {
	const { label, labelColor, menuSlug, justifyMenu, width } = attributes;

	/* Editor layout sizes */
	const layout = useSelect(
		( select ) =>
			select( 'core/editor' ).getEditorSettings()?.__experimentalFeatures
				?.layout,
		[]
	);

	/* Site URL */
	const siteUrl = useSelect(
		( select ) => select( 'core' ).getSite()?.url,
		[]
	);

	/* Fetch all template parts */
	const { records = [], hasResolved } = useEntityRecords(
		'postType',
		'wp_template_part',
		{ per_page: -1 }
	);

	/* Selected template part */
	const selectedTemplate = useEntityRecord(
		'postType',
		'wp_template_part',
		menuSlug
	);

	/* Build select options */
	const menuOptions = hasResolved
		? records
				.filter( ( item ) => item.area )
				.map( ( item ) => ( {
					label: item.title.rendered,
					value: item.slug,
				} ) )
		: [];

	const blockProps = useBlockProps( {
		className: 'wp-block-navigation-item wp-block-hm-mega-menu__toggle',
		style: {
			color: labelColor || undefined,
		},
	} );

	const justificationOptions = [
		{ value: 'left', icon: justifyLeft },
		{ value: 'center', icon: justifyCenter },
		{ value: 'right', icon: justifyRight },
	];

	const widthOptions = [
		{
			value: 'content',
			icon: alignNone,
			label: sprintf(
				__( 'Content width (%s)', 'hm-mega-menu-block' ),
				layout?.contentSize || 'default'
			),
		},
		{
			value: 'wide',
			icon: stretchWide,
			label: sprintf(
				__( 'Wide width (%s)', 'hm-mega-menu-block' ),
				layout?.wideSize || 'wide'
			),
		},
		{
			value: 'full',
			icon: stretchFullWidth,
			label: __( 'Full width', 'hm-mega-menu-block' ),
		},
	];
	const themeSlug = useSelect(
		( select ) => select( 'core' ).getCurrentTheme()?.stylesheet,
		[]
	);

	const editTemplateUrl =
		siteUrl && themeSlug && menuSlug
			? `${ siteUrl }/wp-admin/site-editor.php?p=/wp_template_part/${ themeSlug }//${ menuSlug }&canvas=edit`
			: '';

	return (
		<>
			{ /* Sidebar controls */ }
			<InspectorControls>
				<PanelBody title={ __( 'Settings', 'hm-mega-menu-block' ) }>
					<TextControl
						label={ __( 'Label', 'hm-mega-menu-block' ) }
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
					/>

					<ColorPalette
						label={ __( 'Label color', 'hm-mega-menu-block' ) }
						value={ labelColor }
						onChange={ ( color ) =>
							setAttributes( { labelColor: color } )
						}
						clearable
					/>

					<ComboboxControl
						label={ __(
							'Menu Template Part',
							'hm-mega-menu-block'
						) }
						value={ menuSlug }
						options={ menuOptions }
						onChange={ ( value ) =>
							setAttributes( { menuSlug: value } )
						}
						help={ createInterpolateElement(
							__(
								'Create or edit menu templates in the <a>Site Editor</a>.',
								'hm-mega-menu-block'
							),
							{
								a: (
									<a
										href={ `${ siteUrl }/wp-admin/site-editor.php?postType=wp_template_part` }
										target="_blank"
										rel="noreferrer"
									/>
								),
							}
						) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Layout', 'hm-mega-menu-block' ) }>
					<HStack>
						<ToggleGroupControl
							label={ __(
								'Justification',
								'hm-mega-menu-block'
							) }
							value={ justifyMenu }
							onChange={ ( value ) =>
								setAttributes( { justifyMenu: value } )
							}
							isDeselectable
						>
							{ justificationOptions.map( ( option ) => (
								<ToggleGroupControlOptionIcon
									key={ option.value }
									value={ option.value }
									icon={ option.icon }
								/>
							) ) }
						</ToggleGroupControl>

						<ToggleGroupControl
							label={ __( 'Width', 'hm-mega-menu-block' ) }
							value={ width || 'content' }
							onChange={ ( value ) =>
								setAttributes( { width: value } )
							}
						>
							{ widthOptions.map( ( option ) => (
								<ToggleGroupControlOptionIcon
									key={ option.value }
									value={ option.value }
									icon={ option.icon }
								/>
							) ) }
						</ToggleGroupControl>
					</HStack>
				</PanelBody>
			</InspectorControls>

			{ /* Block UI */ }
			<div { ...blockProps }>
				<button className="wp-block-navigation-item__content">
					<RichText
						className="wp-block-navigation-item__label"
						value={ label }
						onChange={ ( value ) =>
							setAttributes( { label: value } )
						}
						placeholder={ __(
							'Menu label…',
							'hm-mega-menu-block'
						) }
					/>
					<span aria-hidden>▾</span>
				</button>

				{ /* Editor preview */ }
				{ menuSlug && (
					<div className="hm-mega-menu__editor-preview">
						<Placeholder
							icon="menu"
							label={ __(
								'Mega Menu Content',
								'hm-mega-menu-block'
							) }
							instructions={ __(
								'This content is managed as a Template Part.',
								'hm-mega-menu-block'
							) }
						>
							<p>
								<strong>
									{ __( 'Template:', 'hm-mega-menu-block' ) }
								</strong>{ ' ' }
								{ selectedTemplate?.record?.title?.rendered ||
									menuSlug }
							</p>

							<Button
								variant="primary"
								icon={ pencil }
								href={ editTemplateUrl }
								target="_blank"
								disabled={ ! editTemplateUrl }
							>
								{ __(
									'Edit Template Part',
									'hm-mega-menu-block'
								) }
							</Button>
						</Placeholder>
					</div>
				) }
			</div>
		</>
	);
}
