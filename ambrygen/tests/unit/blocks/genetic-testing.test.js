import {
	createBlock,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks';

import blockJson from '../../../assets/src/blocks/genetic-testing/block.json';
import '@testing-library/jest-dom';

describe( 'Genetic Testing Block Registration', () => {
	beforeEach( () => {
		registerBlockType( 'ambrygen/genetic-testing', blockJson );
	} );

	afterEach( () => {
		unregisterBlockType( 'ambrygen/genetic-testing' );
	} );

	it( 'should create a block with default attributes', () => {
		const block = createBlock( 'ambrygen/genetic-testing' );
		expect( block.name ).toBe( 'ambrygen/genetic-testing' );
		expect( block.attributes.heading ).toBe( 'What is genetic testing?' );
		expect( block.attributes.description ).toBeUndefined();
		expect( block.attributes.videoUrl ).toBe( '' );
		expect( block.attributes.backgroundColor ).toBeUndefined();
		expect( block.attributes.style ).toBeUndefined();
	} );

	it( 'should create a block with custom attributes', () => {
		const customAttributes = {
			heading: 'Custom Genetic Testing Title',
			description:
				'<p>Custom genetic testing description with HTML content</p>',
			videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
			backgroundColor: '#f0f0f0',
			style: {
				color: '#333333',
			},
		};

		const block = createBlock(
			'ambrygen/genetic-testing',
			customAttributes
		);
		expect( block.name ).toBe( 'ambrygen/genetic-testing' );
		expect( block.attributes.heading ).toBe(
			'Custom Genetic Testing Title'
		);
		expect( block.attributes.description ).toBe(
			'<p>Custom genetic testing description with HTML content</p>'
		);
		expect( block.attributes.videoUrl ).toBe(
			'https://www.youtube.com/embed/dQw4w9WgXcQ'
		);
		expect( block.attributes.backgroundColor ).toBe( '#f0f0f0' );
		expect( block.attributes.style ).toEqual( {
			color: '#333333',
		} );
	} );

	it( 'should handle empty video URL', () => {
		const block = createBlock( 'ambrygen/genetic-testing', {
			videoUrl: '',
		} );
		expect( block.attributes.videoUrl ).toBe( '' );
	} );

	it( 'should handle custom heading with HTML', () => {
		const block = createBlock( 'ambrygen/genetic-testing', {
			heading: '<strong>Bold Genetic Testing</strong>',
		} );
		expect( block.attributes.heading ).toBe(
			'<strong>Bold Genetic Testing</strong>'
		);
	} );
} );
