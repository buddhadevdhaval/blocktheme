import {
	createBlock,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks';

import blockJson from '../../../assets/src/blocks/hero/block.json';
import '@testing-library/jest-dom';

describe( 'Hero Block Registration', () => {
	beforeEach( () => {
		registerBlockType( 'ambrygen/hero', blockJson );
	} );

	afterEach( () => {
		unregisterBlockType( 'ambrygen/hero' );
	} );

	it( 'should create a block with default attributes', () => {
		const block = createBlock( 'ambrygen/hero' );
		expect( block.name ).toBe( 'ambrygen/hero' );
		expect( block.attributes.heading ).toBe( 'Hero Title' );
		expect( block.attributes.content ).toBe( 'Hero content goes here' );
	} );

	it( 'should create a block with custom attributes', () => {
		const customAttributes = {
			heading: 'Custom Hero Title',
			content: 'Custom hero content description',
		};

		const block = createBlock( 'ambrygen/hero', customAttributes );
		expect( block.name ).toBe( 'ambrygen/hero' );
		expect( block.attributes.heading ).toBe( 'Custom Hero Title' );
		expect( block.attributes.content ).toBe(
			'Custom hero content description'
		);
	} );

	it( 'should handle empty attributes', () => {
		const block = createBlock( 'ambrygen/hero', {
			heading: '',
			content: '',
		} );
		expect( block.attributes.heading ).toBe( '' );
		expect( block.attributes.content ).toBe( '' );
	} );

	it( 'should handle HTML content in attributes', () => {
		const htmlContent = '<p>This is <strong>HTML</strong> content</p>';
		const block = createBlock( 'ambrygen/hero', { content: htmlContent } );
		expect( block.attributes.content ).toBe( htmlContent );
	} );

	it( 'should handle special characters in heading', () => {
		const specialHeading = 'Héro Tïtle with ñ & émojis 🚀';
		const block = createBlock( 'ambrygen/hero', {
			heading: specialHeading,
		} );
		expect( block.attributes.heading ).toBe( specialHeading );
	} );

	it( 'should handle very long content', () => {
		const longContent =
			'This is a very long hero content that might span multiple lines and contain a lot of text. '.repeat(
				20
			);
		const block = createBlock( 'ambrygen/hero', { content: longContent } );
		expect( block.attributes.content ).toBe( longContent );
	} );
} );
