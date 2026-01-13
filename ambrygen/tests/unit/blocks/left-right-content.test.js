import {
	createBlock,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks';

import blockJson from '../../../assets/src/blocks/left-right-content/block.json';
import '@testing-library/jest-dom';

describe( 'Left Right Content Block Registration', () => {
	beforeEach( () => {
		registerBlockType( 'ambrygen/left-right-content', blockJson );
	} );

	afterEach( () => {
		unregisterBlockType( 'ambrygen/left-right-content' );
	} );

	it( 'should create a block with default attributes', () => {
		const block = createBlock( 'ambrygen/left-right-content' );
		expect( block.name ).toBe( 'ambrygen/left-right-content' );
		expect( block.attributes.heading ).toBe( '' );
		expect( block.attributes.headingTag ).toBe( 'h2' );
		expect( block.attributes.imageUrl ).toBe( '' );
		expect( block.attributes.imageId ).toBe( 0 );
		expect( block.attributes.imageAlt ).toBe( '' );
		expect( block.attributes.imagePosition ).toBe( 'left' );
	} );

	it( 'should create a block with custom attributes', () => {
		const customAttributes = {
			heading: 'Custom Left Right Content',
			headingTag: 'h3',
			imageUrl: 'https://example.com/content-image.jpg',
			imageId: 456,
			imageAlt: 'Custom content image alt text',
			imagePosition: 'right',
		};

		const block = createBlock(
			'ambrygen/left-right-content',
			customAttributes
		);
		expect( block.name ).toBe( 'ambrygen/left-right-content' );
		expect( block.attributes.heading ).toBe( 'Custom Left Right Content' );
		expect( block.attributes.headingTag ).toBe( 'h3' );
		expect( block.attributes.imageUrl ).toBe(
			'https://example.com/content-image.jpg'
		);
		expect( block.attributes.imageId ).toBe( 456 );
		expect( block.attributes.imageAlt ).toBe(
			'Custom content image alt text'
		);
		expect( block.attributes.imagePosition ).toBe( 'right' );
	} );

	it( 'should handle different heading tags', () => {
		const headingTags = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];

		headingTags.forEach( ( tag ) => {
			const block = createBlock( 'ambrygen/left-right-content', {
				headingTag: tag,
			} );
			expect( block.attributes.headingTag ).toBe( tag );
		} );
	} );

	it( 'should handle image position variations', () => {
		const positions = [ 'left', 'right' ];

		positions.forEach( ( position ) => {
			const block = createBlock( 'ambrygen/left-right-content', {
				imagePosition: position,
			} );
			expect( block.attributes.imagePosition ).toBe( position );
		} );
	} );

	it( 'should handle empty image attributes', () => {
		const block = createBlock( 'ambrygen/left-right-content', {
			imageUrl: '',
			imageId: 0,
			imageAlt: '',
		} );
		expect( block.attributes.imageUrl ).toBe( '' );
		expect( block.attributes.imageId ).toBe( 0 );
		expect( block.attributes.imageAlt ).toBe( '' );
	} );

	it( 'should handle custom image ID', () => {
		const block = createBlock( 'ambrygen/left-right-content', {
			imageId: 789,
		} );
		expect( block.attributes.imageId ).toBe( 789 );
	} );

	it( 'should handle long heading text', () => {
		const longHeading =
			'This is a very long heading that might be used in a left right content block. '.repeat(
				5
			);
		const block = createBlock( 'ambrygen/left-right-content', {
			heading: longHeading,
		} );
		expect( block.attributes.heading ).toBe( longHeading );
	} );
} );
