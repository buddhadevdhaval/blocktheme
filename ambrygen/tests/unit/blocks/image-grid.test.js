import {
	createBlock,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks';

import blockJson from '../../../assets/src/blocks/image-grid/block.json';
import '@testing-library/jest-dom';

describe( 'Image Grid Block Registration', () => {
	beforeEach( () => {
		registerBlockType( 'ambrygen/image-grid', blockJson );
	} );

	afterEach( () => {
		unregisterBlockType( 'ambrygen/image-grid' );
	} );

	it( 'should create a block with default attributes', () => {
		const block = createBlock( 'ambrygen/image-grid' );
		expect( block.name ).toBe( 'ambrygen/image-grid' );
		expect( block.attributes.columns ).toBe( 2 );
		expect( block.attributes.items ).toEqual( [
			{
				imageUrl: '',
				imageId: 0,
				title: 'Grid Item Title',
				link: '',
			},
		] );
	} );

	it( 'should create a block with custom attributes', () => {
		const customAttributes = {
			columns: 3,
			items: [
				{
					imageUrl: 'https://example.com/image1.jpg',
					imageId: 123,
					title: 'First Grid Item',
					link: 'https://example.com/link1',
				},
				{
					imageUrl: 'https://example.com/image2.jpg',
					imageId: 456,
					title: 'Second Grid Item',
					link: 'https://example.com/link2',
				},
			],
		};

		const block = createBlock( 'ambrygen/image-grid', customAttributes );
		expect( block.name ).toBe( 'ambrygen/image-grid' );
		expect( block.attributes.columns ).toBe( 3 );
		expect( block.attributes.items ).toEqual( [
			{
				imageUrl: 'https://example.com/image1.jpg',
				imageId: 123,
				title: 'First Grid Item',
				link: 'https://example.com/link1',
			},
			{
				imageUrl: 'https://example.com/image2.jpg',
				imageId: 456,
				title: 'Second Grid Item',
				link: 'https://example.com/link2',
			},
		] );
	} );

	it( 'should handle different column values', () => {
		const block1 = createBlock( 'ambrygen/image-grid', { columns: 1 } );
		expect( block1.attributes.columns ).toBe( 1 );

		const block2 = createBlock( 'ambrygen/image-grid', { columns: 4 } );
		expect( block2.attributes.columns ).toBe( 4 );
	} );

	it( 'should handle empty items array', () => {
		const block = createBlock( 'ambrygen/image-grid', { items: [] } );
		expect( block.attributes.items ).toEqual( [] );
	} );

	it( 'should handle items with missing properties', () => {
		const block = createBlock( 'ambrygen/image-grid', {
			items: [
				{
					imageUrl: 'https://example.com/image.jpg',
					imageId: 789,
					// Missing title and link
				},
			],
		} );
		expect( block.attributes.items ).toEqual( [
			{
				imageUrl: 'https://example.com/image.jpg',
				imageId: 789,
			},
		] );
	} );
} );
