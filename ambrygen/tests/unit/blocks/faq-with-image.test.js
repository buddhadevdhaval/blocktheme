import {
	createBlock,
	registerBlockType,
	unregisterBlockType,
} from '@wordpress/blocks';

import blockJson from '../../../assets/src/blocks/faq-with-image/block.json';
import '@testing-library/jest-dom';

describe( 'FAQ with Image Block Registration', () => {
	beforeEach( () => {
		registerBlockType( 'ambrygen/faq-with-image', blockJson );
	} );

	afterEach( () => {
		unregisterBlockType( 'ambrygen/faq-with-image' );
	} );

	it( 'should create a block with default attributes', () => {
		const block = createBlock( 'ambrygen/faq-with-image' );
		expect( block.name ).toBe( 'ambrygen/faq-with-image' );
		expect( block.attributes.backgroundColor ).toBe( '#007fa3' );
		expect( block.attributes.imageUrl ).toBe( '' );
		expect( block.attributes.imageId ).toBe( 0 );
		expect( block.attributes.imageAlt ).toBe( '' );
		expect( block.attributes.faqs ).toEqual( [
			{
				question: 'What is genetic testing?',
				answer: 'Genetic testing involves examining your DNA to identify changes that may cause illness.',
			},
			{
				question: 'Is genetic testing for everyone?',
				answer: 'Genetic testing may not be necessary for everyone and depends on medical history.',
			},
		] );
	} );

	it( 'should create a block with custom attributes', () => {
		const customAttributes = {
			backgroundColor: '#ff6b6b',
			imageUrl: 'https://example.com/faq-image.jpg',
			imageId: 321,
			imageAlt: 'FAQ section image alt text',
			faqs: [
				{
					question: 'How accurate are genetic tests?',
					answer: 'Genetic tests are highly accurate when performed by certified laboratories.',
				},
				{
					question: 'What are the risks of genetic testing?',
					answer: 'The main risks are emotional and psychological, rather than physical.',
				},
			],
		};

		const block = createBlock(
			'ambrygen/faq-with-image',
			customAttributes
		);
		expect( block.name ).toBe( 'ambrygen/faq-with-image' );
		expect( block.attributes.backgroundColor ).toBe( '#ff6b6b' );
		expect( block.attributes.imageUrl ).toBe(
			'https://example.com/faq-image.jpg'
		);
		expect( block.attributes.imageId ).toBe( 321 );
		expect( block.attributes.imageAlt ).toBe(
			'FAQ section image alt text'
		);
		expect( block.attributes.faqs ).toEqual( [
			{
				question: 'How accurate are genetic tests?',
				answer: 'Genetic tests are highly accurate when performed by certified laboratories.',
			},
			{
				question: 'What are the risks of genetic testing?',
				answer: 'The main risks are emotional and psychological, rather than physical.',
			},
		] );
	} );

	it( 'should handle empty FAQs array', () => {
		const block = createBlock( 'ambrygen/faq-with-image', { faqs: [] } );
		expect( block.attributes.faqs ).toEqual( [] );
	} );

	it( 'should handle single FAQ item', () => {
		const singleFaq = {
			question: 'Single FAQ Question?',
			answer: 'Single FAQ answer.',
		};
		const block = createBlock( 'ambrygen/faq-with-image', {
			faqs: [ singleFaq ],
		} );
		expect( block.attributes.faqs ).toEqual( [ singleFaq ] );
	} );

	it( 'should handle different background colors', () => {
		const colors = [
			'#ffffff',
			'#000000',
			'#007fa3',
			'#ff6b6b',
			'transparent',
		];

		colors.forEach( ( color ) => {
			const block = createBlock( 'ambrygen/faq-with-image', {
				backgroundColor: color,
			} );
			expect( block.attributes.backgroundColor ).toBe( color );
		} );
	} );

	it( 'should handle empty image attributes', () => {
		const block = createBlock( 'ambrygen/faq-with-image', {
			imageUrl: '',
			imageId: 0,
			imageAlt: '',
		} );
		expect( block.attributes.imageUrl ).toBe( '' );
		expect( block.attributes.imageId ).toBe( 0 );
		expect( block.attributes.imageAlt ).toBe( '' );
	} );

	it( 'should handle FAQs with HTML content', () => {
		const faqsWithHtml = [
			{
				question: 'Question with <strong>bold</strong> text?',
				answer: "Answer with <em>italic</em> text and <a href='#'>links</a>.",
			},
		];
		const block = createBlock( 'ambrygen/faq-with-image', {
			faqs: faqsWithHtml,
		} );
		expect( block.attributes.faqs ).toEqual( faqsWithHtml );
	} );

	it( 'should handle custom image ID', () => {
		const block = createBlock( 'ambrygen/faq-with-image', {
			imageId: 999,
		} );
		expect( block.attributes.imageId ).toBe( 999 );
	} );
} );
