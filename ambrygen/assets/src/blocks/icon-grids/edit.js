import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

const TEMPLATE = [
	[
		'ambrygen/icon-grids-item',
		{
			title: 'Client Services',
			links: [
				{ label: 'info@ambrygen.com', url: 'mailto:info@ambrygen.com' },
				{ label: 'P +1 949.900.5500', url: 'tel:+19499005500' },
				{ label: 'F +1 949.900.5501', url: 'tel:+19499005501' },
			],
		},
	],
	[
		'ambrygen/icon-grids-item',
		{
			title: 'Billing',
			links: [
				{
					label: 'billing@ambrygen.com',
					url: 'mailto:billing@ambrygen.com',
				},
				{ label: 'P +1 949.900.5795', url: 'tel:+19499005795' },
			],
		},
	],
	[
		'ambrygen/icon-grids-item',
		{
			title: 'Ordering Process',
			links: [ { label: 'Learn More', url: '#' } ],
		},
	],
];

export default function Edit() {
	const blockProps = useBlockProps( { className: 'info-list__row' } );

	return (
		<div { ...blockProps }>
			<InnerBlocks
				allowedBlocks={ [ 'ambrygen/icon-grids-item' ] }
				template={ TEMPLATE }
				templateLock={ false }
			/>
		</div>
	);
}
