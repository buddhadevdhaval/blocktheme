import {
	createBlock,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks';

import blockJson from '../../../assets/src/blocks/additional-links/block.json';
import '@testing-library/jest-dom';

describe( 'Additional Links Block Registration', () => {
	beforeEach( () => {
		registerBlockType( 'ambrygen/additional-links', blockJson );
	} );

	afterEach( () => {
		unregisterBlockType( 'ambrygen/additional-links' );
	} );

	it( 'should create a block with default attributes', () => {
		const block = createBlock( 'ambrygen/additional-links' );
		expect( block.name ).toBe( 'ambrygen/additional-links' );
		expect( block.attributes.heading ).toBeUndefined();
		expect( block.attributes.headingTag ).toBe( 'h2' );
		expect( block.attributes.content ).toBeUndefined();
		expect( block.attributes.imageUrl ).toBeUndefined();
		expect( block.attributes.imageId ).toBe( 0 );
		expect( block.attributes.imageAlt ).toBe( '' );
		expect( block.attributes.imagePosition ).toBe( 'left' );
	} );

	it( 'should create a block with custom attributes', () => {
		const customAttributes = {
			heading: '<h2>Additional Resources</h2>',
			headingTag: 'h3',
			content:
				"<div class='content'><p>Find more information about our services and resources.</p></div>",
			imageUrl: 'https://example.com/additional-links-image.jpg',
			imageId: 654,
			imageAlt: 'Additional links section image',
			imagePosition: 'right',
		};

		const block = createBlock(
			'ambrygen/additional-links',
			customAttributes
		);
		expect( block.name ).toBe( 'ambrygen/additional-links' );
		expect( block.attributes.heading ).toBe(
			'<h2>Additional Resources</h2>'
		);
		expect( block.attributes.headingTag ).toBe( 'h3' );
		expect( block.attributes.content ).toBe(
			"<div class='content'><p>Find more information about our services and resources.</p></div>"
		);
		expect( block.attributes.imageUrl ).toBe(
			'https://example.com/additional-links-image.jpg'
		);
		expect( block.attributes.imageId ).toBe( 654 );
		expect( block.attributes.imageAlt ).toBe(
			'Additional links section image'
		);
		expect( block.attributes.imagePosition ).toBe( 'right' );
	} );

	it( 'should handle different heading tags', () => {
		const headingTags = [ 'h1', 'h2', 'h3', 'h4', 'h5', 'h6' ];

		headingTags.forEach( ( tag ) => {
			const block = createBlock( 'ambrygen/additional-links', {
				headingTag: tag,
			} );
			expect( block.attributes.headingTag ).toBe( tag );
		} );
	} );

	it( 'should handle image position variations', () => {
		const positions = [ 'left', 'right' ];

		positions.forEach( ( position ) => {
			const block = createBlock( 'ambrygen/additional-links', {
				imagePosition: position,
			} );
			expect( block.attributes.imagePosition ).toBe( position );
		} );
	} );

	it( 'should handle HTML content in heading and content', () => {
		const htmlHeading = '<h2>Heading with <strong>bold</strong> text</h2>';
		const htmlContent =
			"<div class='content'><p>Content with <em>italic</em> text and <a href='#'>links</a></p></div>";

		const block = createBlock( 'ambrygen/additional-links', {
			heading: htmlHeading,
			content: htmlContent,
		} );

		expect( block.attributes.heading ).toBe( htmlHeading );
		expect( block.attributes.content ).toBe( htmlContent );
	} );

	it( 'should handle empty image attributes', () => {
		const block = createBlock( 'ambrygen/additional-links', {
			imageUrl: '',
			imageId: 0,
			imageAlt: '',
		} );
		expect( block.attributes.imageUrl ).toBe( '' );
		expect( block.attributes.imageId ).toBe( 0 );
		expect( block.attributes.imageAlt ).toBe( '' );
	} );

	it( 'should handle custom image ID', () => {
		const block = createBlock( 'ambrygen/additional-links', {
			imageId: 12345,
		} );
		expect( block.attributes.imageId ).toBe( 12345 );
	} );

	it( 'should handle complex HTML content', () => {
		const complexContent = `
      <div class='content'>
        <h3>Subheading</h3>
        <ul>
          <li>First item with <strong>emphasis</strong></li>
          <li>Second item with <a href='https://example.com'>link</a></li>
        </ul>
        <p>Final paragraph content.</p>
      </div>
    `;

		const block = createBlock( 'ambrygen/additional-links', {
			content: complexContent,
		} );
		expect( block.attributes.content ).toBe( complexContent );
	} );

	it( 'should handle undefined heading and content', () => {
		const block = createBlock( 'ambrygen/additional-links', {
			heading: undefined,
			content: undefined,
		} );
		expect( block.attributes.heading ).toBeUndefined();
		expect( block.attributes.content ).toBeUndefined();
	} );
} );
