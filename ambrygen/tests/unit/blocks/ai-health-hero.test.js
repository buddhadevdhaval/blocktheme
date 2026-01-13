import {
	createBlock,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks';

import blockJson from '../../../assets/src/blocks/ai-health-hero/block.json';
import '@testing-library/jest-dom';

describe( 'AI Health Hero Block Registration', () => {
	beforeEach( () => {
		registerBlockType( 'ambrygen/ai-health-hero', blockJson );
	} );

	afterEach( () => {
		unregisterBlockType( 'ambrygen/ai-health-hero' );
	} );

	it( 'should create a block with default attributes', () => {
		const block = createBlock( 'ambrygen/ai-health-hero' );
		expect( block.name ).toBe( 'ambrygen/ai-health-hero' );
		expect( block.attributes.heading ).toBe(
			'Transforming Healthcare with AI Innovation'
		);
		expect( block.attributes.content ).toBe(
			'Leveraging artificial intelligence to revolutionize patient care, diagnostics, and medical research.'
		);
		expect( block.attributes.counters ).toEqual( [
			{
				number: '100',
				prefix: '',
				suffix: '',
				label: 'Publications',
			},
			{
				number: '50',
				prefix: '',
				suffix: '+',
				label: 'Partners',
			},
			{
				number: '',
				prefix: '',
				suffix: '',
				label: '',
			},
			{
				number: '',
				prefix: '',
				suffix: '',
				label: '',
			},
		] );
		expect( block.attributes.imageTop ).toBe( '' );
		expect( block.attributes.imageTopId ).toBe( 0 );
		expect( block.attributes.imageTopAlt ).toBe( '' );
		expect( block.attributes.imageBottom ).toBe( '' );
		expect( block.attributes.imageBottomId ).toBe( 0 );
		expect( block.attributes.imageBottomAlt ).toBe( '' );
		expect( block.attributes.logoImage ).toBe( '' );
		expect( block.attributes.logoImageId ).toBe( 0 );
		expect( block.attributes.logoImageAlt ).toBe( '' );
	} );

	it( 'should create a block with custom attributes', () => {
		const customAttributes = {
			heading: 'Custom AI Health Title',
			content: 'Custom AI health content description',
			counters: [
				{
					number: '200',
					prefix: '',
					suffix: '+',
					label: 'Research Papers',
				},
			],
			imageTop: 'custom-image-url.jpg',
			imageTopId: 123,
			imageTopAlt: 'Custom top image alt text',
		};

		const block = createBlock(
			'ambrygen/ai-health-hero',
			customAttributes
		);
		expect( block.name ).toBe( 'ambrygen/ai-health-hero' );
		expect( block.attributes.heading ).toBe( 'Custom AI Health Title' );
		expect( block.attributes.content ).toBe(
			'Custom AI health content description'
		);
		expect( block.attributes.counters ).toEqual( [
			{
				number: '200',
				prefix: '',
				suffix: '+',
				label: 'Research Papers',
			},
		] );
		expect( block.attributes.imageTop ).toBe( 'custom-image-url.jpg' );
		expect( block.attributes.imageTopId ).toBe( 123 );
		expect( block.attributes.imageTopAlt ).toBe(
			'Custom top image alt text'
		);
	} );
} );
