<?php
// This file is generated. Do not modify it manually.
return array(
	'ai-hero-section' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/ai-hero-section',
		'title' => 'AI Hero Section',
		'category' => 'ambrygen',
		'icon' => 'networking',
		'description' => 'Advanced hero section with AI healthcare visuals, animated counters, and multi-media layout system.',
		'supports' => array(
			'html' => false,
			'align' => true,
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'color' => array(
				'background' => true,
				'text' => true,
				'link' => false
			),
			'typography' => array(
				'fontSize' => false,
				'lineHeight' => false
			)
		),
		'keywords' => array(
			'hero',
			'ai',
			'healthcare',
			'counter',
			'statistics'
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'Transforming Healthcare with AI Innovation'
			),
			'content' => array(
				'type' => 'string',
				'default' => 'Leveraging artificial intelligence to revolutionize patient care, diagnostics, and medical research.'
			),
			'counters' => array(
				'type' => 'array',
				'default' => array(
					array(
						'number' => '100',
						'prefix' => '',
						'suffix' => '',
						'label' => 'Publications'
					),
					array(
						'number' => '50',
						'prefix' => '',
						'suffix' => '+',
						'label' => 'Partners'
					),
					array(
						'number' => '50',
						'prefix' => '',
						'suffix' => 'k',
						'label' => 'Variants to ClinVar'
					),
					array(
						'number' => '100',
						'prefix' => '',
						'suffix' => 'k+',
						'label' => 'Tests Conducted'
					)
				)
			),
			'imageTop' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageTopId' => array(
				'type' => 'number',
				'default' => 0
			),
			'imageTopAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageBottom' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageBottomId' => array(
				'type' => 'number',
				'default' => 0
			),
			'imageBottomAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'logoImage' => array(
				'type' => 'string',
				'default' => ''
			),
			'logoImageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'logoImageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageTopSrcSet' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageTopSizes' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageBottomSrcSet' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageBottomSizes' => array(
				'type' => 'string',
				'default' => ''
			),
			'logoImageSrcSet' => array(
				'type' => 'string',
				'default' => ''
			),
			'logoImageSizes' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'variations' => array(
			array(
				'name' => 'ai-hero-simple',
				'title' => 'AI Hero (Simple)',
				'description' => 'Hero section without counters',
				'attributes' => array(
					'counters' => array(
						
					)
				),
				'scope' => array(
					'inserter'
				)
			)
		),
		'example' => array(
			'attributes' => array(
				'heading' => 'Transforming Healthcare with AI Innovation',
				'content' => 'Leveraging artificial intelligence to revolutionize patient care.',
				'counters' => array(
					array(
						'number' => '100',
						'prefix' => '',
						'suffix' => '',
						'label' => 'Publications'
					),
					array(
						'number' => '50',
						'prefix' => '',
						'suffix' => '+',
						'label' => 'Partners'
					)
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'viewScript' => 'file:./view.js'
	),
	'banner' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/banner',
		'title' => 'Banner',
		'category' => 'ambrygen',
		'icon' => 'format-image',
		'description' => 'Banner section with text content and background image.',
		'supports' => array(
			'html' => false,
			'color' => array(
				'background' => true
			)
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'Title Goes Here'
			),
			'content' => array(
				'type' => 'string',
				'default' => 'Ambry Genetics focuses on quality and accuracy within the genetic testing process by employing a multi-step verification process.'
			),
			'imageUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageAlt' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'faq-accordion' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/faq-accordion',
		'title' => 'FAQ Accordion',
		'category' => 'ambrygen',
		'icon' => 'editor-help',
		'description' => 'Interactive FAQ accordion with image and expandable questions.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'backgroundColor' => array(
				'type' => 'string',
				'default' => '#007fa3'
			),
			'imageUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'imageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'faqs' => array(
				'type' => 'array',
				'default' => array(
					array(
						'question' => 'What is genetic testing?',
						'answer' => 'Genetic testing involves examining your DNA to identify changes that may cause illness.'
					),
					array(
						'question' => 'Is genetic testing for everyone?',
						'answer' => 'Genetic testing may not be necessary for everyone and depends on medical history.'
					)
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'flexible-content' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/flexible-content',
		'title' => 'Flexible Content Layout',
		'category' => 'ambrygen',
		'icon' => 'align-wide',
		'description' => 'A flexible block with heading, content, image, and multiple layout options (standard, overlap, stacked).',
		'textdomain' => 'ambrygen-web',
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'imageUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'imageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'imagePosition' => array(
				'type' => 'string',
				'default' => 'left'
			),
			'layoutStyle' => array(
				'type' => 'string',
				'default' => 'standard',
				'enum' => array(
					'standard',
					'overlap',
					'stacked'
				)
			),
			'imageSize' => array(
				'type' => 'string',
				'default' => 'medium'
			),
			'contentAlignment' => array(
				'type' => 'string',
				'default' => 'left'
			)
		)
	),
	'gallery' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/gallery',
		'title' => 'Image Gallery',
		'category' => 'ambrygen',
		'icon' => 'grid-view',
		'description' => 'Responsive image gallery with customizable columns and titles.',
		'textdomain' => 'ambrygen-web',
		'supports' => array(
			'html' => false,
			'align' => true,
			'color' => array(
				'background' => true
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'attributes' => array(
			'variation' => array(
				'type' => 'string',
				'default' => 'default'
			),
			'columns' => array(
				'type' => 'number',
				'default' => 2
			),
			'items' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'headingTag' => array(
							'type' => 'string',
							'default' => 'h5'
						),
						'imageUrl' => array(
							'type' => 'string',
							'default' => ''
						),
						'imageId' => array(
							'type' => 'number',
							'default' => 0
						),
						'title' => array(
							'type' => 'string',
							'default' => ''
						),
						'description' => array(
							'type' => 'string',
							'default' => ''
						),
						'link' => array(
							'type' => 'string',
							'default' => ''
						)
					)
				)
			)
		)
	),
	'genetic-info' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/genetic-info',
		'title' => 'Genetic Information',
		'category' => 'ambrygen',
		'icon' => 'video-alt3',
		'description' => 'Educational section about genetic testing with video embed and content.',
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'color' => array(
				'background' => true,
				'text' => true
			)
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'What is genetic testing?',
				'source' => 'html',
				'selector' => '.genetic-heading'
			),
			'description' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => '.genetic-description'
			),
			'videoUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'backgroundColor' => array(
				'type' => 'string'
			),
			'style' => array(
				'type' => 'object'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'genetic-testing-cards' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/genetic-testing-cards',
		'title' => 'Genetic Testing Cards',
		'category' => 'ambrygen',
		'icon' => 'grid-view',
		'description' => 'A layout with two stacked cards on the left and one large featured card on the right.',
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'color' => array(
				'background' => true,
				'text' => true
			)
		),
		'keywords' => array(
			'cards',
			'genetic',
			'layout',
			'grid'
		),
		'attributes' => array(
			'cardOneImage' => array(
				'type' => 'string',
				'default' => ''
			),
			'cardOneImageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'cardOneImageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'cardOneTitle' => array(
				'type' => 'string',
				'default' => 'Considering genetic testing for yourself or a family member?'
			),
			'cardOneDescription' => array(
				'type' => 'string',
				'default' => 'At Ambry Genetics, we want to empower you to navigate your healthcare with confidence.'
			),
			'cardOneLinkText' => array(
				'type' => 'string',
				'default' => 'Learn more'
			),
			'cardOneLinkUrl' => array(
				'type' => 'string',
				'default' => '#'
			),
			'cardTwoImage' => array(
				'type' => 'string',
				'default' => ''
			),
			'cardTwoImageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'cardTwoImageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'cardTwoTitle' => array(
				'type' => 'string',
				'default' => 'Classifi'
			),
			'cardTwoDescription' => array(
				'type' => 'string',
				'default' => 'How Ambry transforms raw genetic data into actionable clinical insights.'
			),
			'cardTwoLinkText' => array(
				'type' => 'string',
				'default' => 'Discover Classifi'
			),
			'cardTwoLinkUrl' => array(
				'type' => 'string',
				'default' => '#'
			),
			'cardMainImage' => array(
				'type' => 'string',
				'default' => ''
			),
			'cardMainImageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'cardMainImageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'cardMainTitle' => array(
				'type' => 'string',
				'default' => 'Patient for Life'
			),
			'cardMainDescription' => array(
				'type' => 'string',
				'default' => 'Our promise to patients living with rare and undiagnosed conditions, today and in the future.'
			),
			'cardMainLinkText' => array(
				'type' => 'string',
				'default' => 'Explore the Program'
			),
			'cardMainLinkUrl' => array(
				'type' => 'string',
				'default' => '#'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web'
	),
	'hero-section' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/hero-section',
		'title' => 'Hero Section',
		'category' => 'ambrygen',
		'icon' => 'cover-image',
		'description' => 'Hero section with rounded background image, heading, tagline, description, and dual call-to-action buttons.',
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'color' => array(
				'background' => true,
				'text' => true
			),
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true
			)
		),
		'keywords' => array(
			'hero',
			'banner',
			'intro'
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'Industry-leading genetic testing'
			),
			'content' => array(
				'type' => 'string',
				'default' => 'For over 25 years...'
			),
			'tagline' => array(
				'type' => 'string',
				'default' => 'This brings the Ambry mindset to life...'
			),
			'backgroundImage' => array(
				'type' => 'string',
				'default' => ''
			),
			'backgroundImageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'backgroundImageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'buttonPrimaryText' => array(
				'type' => 'string',
				'default' => 'Start Your Order'
			),
			'buttonPrimaryUrl' => array(
				'type' => 'string',
				'default' => '#'
			),
			'buttonSecondaryText' => array(
				'type' => 'string',
				'default' => 'Who We Are'
			),
			'buttonSecondaryUrl' => array(
				'type' => 'string',
				'default' => '#'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web'
	),
	'newsletter-form' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/newsletter-form',
		'title' => 'Newsletter Form',
		'category' => 'ambrygen',
		'icon' => 'email',
		'description' => 'Newsletter subscription form with image and customizable styling.',
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'color' => array(
				'background' => true,
				'text' => true
			)
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'Stay Informed'
			),
			'image' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'imageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'backgroundColor' => array(
				'type' => 'string'
			),
			'style' => array(
				'type' => 'object'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'section-container' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/section-container',
		'title' => 'Section Container',
		'category' => 'ambrygen',
		'icon' => 'align-center',
		'description' => 'Flexible container block with width controls, background options, and spacing settings for organizing content sections.',
		'keywords' => array(
			'section',
			'container',
			'wrapper',
			'layout'
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => false
			),
			'color' => array(
				'background' => true,
				'text' => false,
				'link' => false
			)
		),
		'attributes' => array(
			'tagName' => array(
				'type' => 'string',
				'default' => 'section'
			),
			'containerWidth' => array(
				'type' => 'string',
				'default' => 'container-1340'
			),
			'backgroundStyle' => array(
				'type' => 'string',
				'default' => ''
			),
			'isFixedBackground' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'providesContext' => array(
			'ambrygen/containerWidth' => 'containerWidth'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web'
	)
);
