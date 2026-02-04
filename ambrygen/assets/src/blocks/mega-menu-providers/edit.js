import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'core/group',
		{ className: 'mega-menu-panel', style: { spacing: { blockGap: '0' } } },
		[
			[
				'core/columns',
				{},
				[
					[
						'core/column',
						{},
						[
							[
								'core/image',
								{
									linkDestination: 'custom',
									href: '/providers',
								},
							],
						],
					],
					[
						'core/column',
						{},
						[
							[
								'core/navigation',
								{},
								[
									[
										'core/navigation-link',
										{
											label: 'Hospitals',
											url: '/providers/hospitals',
										},
									],
									[
										'core/navigation-link',
										{
											label: 'Clinics',
											url: '/providers/clinics',
										},
									],
								],
							],
						],
					],
					[
						'core/column',
						{},
						[
							[
								'core/image',
								{
									linkDestination: 'custom',
									href: '/providers/labs',
								},
							],
						],
					],
				],
			],
		],
	],
];

export default function Edit() {
	const blockProps = useBlockProps();
	return (
		<div { ...blockProps }>
			<InnerBlocks template={ TEMPLATE } templateLock={ false } />
		</div>
	);
}
