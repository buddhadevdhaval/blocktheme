import {
	createBlock,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks';

import blockJson from '../../../assets/src/blocks/hero-banner/block.json';
import '@testing-library/jest-dom';

describe( 'Hero Banner Block Registration', () => {
	beforeEach( () => {
		registerBlockType( 'ambrygen/hero-banner', blockJson );
	} );

	afterEach( () => {
		unregisterBlockType( 'ambrygen/hero-banner' );
	} );

	it( 'should create a block with default attributes', () => {
		const block = createBlock( 'ambrygen/hero-banner' );
		expect( block.name ).toBe( 'ambrygen/hero-banner' );
		expect( block.attributes.heading ).toBe( 'Title Goes Here' );
		expect( block.attributes.content ).toBe(
			'Ambry Genetics focuses on quality and accuracy within the genetic testing process by employing a multi-step verification process.'
		);
		expect( block.attributes.imageUrl ).toBe( '' );
		expect( block.attributes.imageAlt ).toBe( '' );
	} );

	it( 'should create a block with custom attributes', () => {
		const customAttributes = {
			heading: 'Custom Hero Title',
			content: 'Custom hero banner content description',
			imageUrl: 'https://example.com/hero-image.jpg',
			imageAlt: 'Custom hero image alt text',
		};

		const block = createBlock( 'ambrygen/hero-banner', customAttributes );
		expect( block.name ).toBe( 'ambrygen/hero-banner' );
		expect( block.attributes.heading ).toBe( 'Custom Hero Title' );
		expect( block.attributes.content ).toBe(
			'Custom hero banner content description'
		);
		expect( block.attributes.imageUrl ).toBe(
			'https://example.com/hero-image.jpg'
		);
		expect( block.attributes.imageAlt ).toBe(
			'Custom hero image alt text'
		);
	} );

	it( 'should handle empty image attributes', () => {
		const block = createBlock( 'ambrygen/hero-banner', {
			imageUrl: '',
			imageAlt: '',
		} );
		expect( block.attributes.imageUrl ).toBe( '' );
		expect( block.attributes.imageAlt ).toBe( '' );
	} );

	it( 'should handle long content text', () => {
		const longContent =
			'This is a very long content text that might be used in a hero banner. '.repeat(
				10
			);
		const block = createBlock( 'ambrygen/hero-banner', {
			content: longContent,
		} );
		expect( block.attributes.content ).toBe( longContent );
	} );

	it( 'should handle special characters in heading', () => {
		const specialHeading = 'Hero Title with émojis 🎉 & spëcial chars!';
		const block = createBlock( 'ambrygen/hero-banner', {
			heading: specialHeading,
		} );
		expect( block.attributes.heading ).toBe( specialHeading );
	} );
} );
