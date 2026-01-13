import {
	createBlock,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks';

import blockJson from '../../../assets/src/blocks/newsletter-signup/block.json';
import '@testing-library/jest-dom';

describe( 'Newsletter Signup Block Registration', () => {
	beforeEach( () => {
		registerBlockType( 'ambrygen/newsletter-signup', blockJson );
	} );

	afterEach( () => {
		unregisterBlockType( 'ambrygen/newsletter-signup' );
	} );

	it( 'should create a block with default attributes', () => {
		const block = createBlock( 'ambrygen/newsletter-signup' );
		expect( block.name ).toBe( 'ambrygen/newsletter-signup' );
		expect( block.attributes.heading ).toBe( 'Stay Informed' );
		expect( block.attributes.image ).toBe( '' );
		expect( block.attributes.imageId ).toBe( 0 );
		expect( block.attributes.imageAlt ).toBe( '' );
		expect( block.attributes.backgroundColor ).toBeUndefined();
		expect( block.attributes.style ).toBeUndefined();
	} );

	it( 'should create a block with custom attributes', () => {
		const customAttributes = {
			heading: 'Custom Newsletter Title',
			image: 'https://example.com/newsletter-image.jpg',
			imageId: 789,
			imageAlt: 'Custom newsletter image alt text',
			backgroundColor: '#f8f9fa',
			style: {
				color: '#333333',
				border: '1px solid #dee2e6',
			},
		};

		const block = createBlock(
			'ambrygen/newsletter-signup',
			customAttributes
		);
		expect( block.name ).toBe( 'ambrygen/newsletter-signup' );
		expect( block.attributes.heading ).toBe( 'Custom Newsletter Title' );
		expect( block.attributes.image ).toBe(
			'https://example.com/newsletter-image.jpg'
		);
		expect( block.attributes.imageId ).toBe( 789 );
		expect( block.attributes.imageAlt ).toBe(
			'Custom newsletter image alt text'
		);
		expect( block.attributes.backgroundColor ).toBe( '#f8f9fa' );
		expect( block.attributes.style ).toEqual( {
			color: '#333333',
			border: '1px solid #dee2e6',
		} );
	} );

	it( 'should handle empty image attributes', () => {
		const block = createBlock( 'ambrygen/newsletter-signup', {
			image: '',
			imageId: 0,
			imageAlt: '',
		} );
		expect( block.attributes.image ).toBe( '' );
		expect( block.attributes.imageId ).toBe( 0 );
		expect( block.attributes.imageAlt ).toBe( '' );
	} );

	it( 'should handle custom image ID', () => {
		const block = createBlock( 'ambrygen/newsletter-signup', {
			imageId: 12345,
		} );
		expect( block.attributes.imageId ).toBe( 12345 );
	} );

	it( 'should handle background color', () => {
		const colors = [ '#ffffff', '#000000', '#f8f9fa', 'transparent' ];

		colors.forEach( ( color ) => {
			const block = createBlock( 'ambrygen/newsletter-signup', {
				backgroundColor: color,
			} );
			expect( block.attributes.backgroundColor ).toBe( color );
		} );
	} );

	it( 'should handle complex style object', () => {
		const complexStyle = {
			color: '#007bff',
			backgroundColor: '#e3f2fd',
			padding: '20px',
			borderRadius: '8px',
			boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
		};

		const block = createBlock( 'ambrygen/newsletter-signup', {
			style: complexStyle,
		} );
		expect( block.attributes.style ).toEqual( complexStyle );
	} );

	it( 'should handle special characters in heading', () => {
		const specialHeading =
			'Newsletter Ñame with émojis 📧 & spëcial chars!';
		const block = createBlock( 'ambrygen/newsletter-signup', {
			heading: specialHeading,
		} );
		expect( block.attributes.heading ).toBe( specialHeading );
	} );
} );
