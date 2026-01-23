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
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'headingPrimary' => array(
				'type' => 'string'
			),
			'headingHighlight' => array(
				'type' => 'string'
			),
			'highlightColor' => array(
				'type' => 'string',
				'default' => '#6d28d9'
			),
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
	'custom-mega-menu' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'create-block/mega-menu-block',
		'version' => '0.1.0',
		'title' => 'Mega Menu',
		'category' => 'design',
		'description' => 'Add a mega menu to your navigation.',
		'parent' => array(
			'core/navigation'
		),
		'example' => array(
			
		),
		'attributes' => array(
			'label' => array(
				'type' => 'string'
			),
			'menuSlug' => array(
				'type' => 'string'
			)
		),
		'supports' => array(
			'html' => false,
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true,
				'__experimentalFontFamily' => true,
				'__experimentalFontWeight' => true,
				'__experimentalFontStyle' => true,
				'__experimentalTextTransform' => true,
				'__experimentalTextDecoration' => true,
				'__experimentalLetterSpacing' => true,
				'__experimentalDefaultControls' => array(
					'fontSize' => true
				)
			)
		),
		'textdomain' => 'ambrygen-vip-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
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
		'description' => 'Responsive image gallery with design variants.',
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
			'heading' => array(
				'type' => 'string',
				'default' => 'Get Started with Ambry'
			),
			'variation' => array(
				'type' => 'string',
				'default' => 'two-column'
			),
			'items' => array(
				'type' => 'array',
				'default' => array(
					
				)
			),
			'imageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageSrcSet' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageSizes' => array(
				'type' => 'string',
				'default' => ''
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
	'genetic-testing-card' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/genetic-testing-card',
		'title' => 'Genetic Testing Card',
		'category' => 'ambrygen',
		'parent' => array(
			'ambrygen/genetic-testing-cards'
		),
		'icon' => 'format-image',
		'description' => 'An individual card for genetic testing.',
		'attributes' => array(
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
			'title' => array(
				'type' => 'string',
				'default' => ''
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'linkText' => array(
				'type' => 'string',
				'default' => 'Learn more'
			),
			'linkUrl' => array(
				'type' => 'string',
				'default' => '#'
			),
			'type' => array(
				'type' => 'string',
				'default' => 'small'
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js'
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
		'description' => 'Hero section with slider, logo overlay, rounded background images, and dual call-to-action buttons.',
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
			'slider',
			'carousel'
		),
		'attributes' => array(
			'slides' => array(
				'type' => 'array',
				'default' => array(
					array(
						'backgroundImage' => '',
						'backgroundImageId' => 0,
						'backgroundImageAlt' => '',
						'overlayImage1' => '',
						'overlayImage1Id' => 0,
						'overlayImage1Alt' => '',
						'overlayImage2' => '',
						'overlayImage2Id' => 0,
						'overlayImage2Alt' => '',
						'heading' => 'Industry-leading genetic testing',
						'content' => 'For over 25 years our high-quality, accessible genetic testing solutions have shaped important care decisions that patients and families make with their healthcare providers.',
						'tagline' => 'This brings the Ambry mindset to life: a relentless pursuit to find the answers.',
						'buttonPrimaryText' => 'Start Your Order',
						'buttonPrimaryUrl' => '#',
						'buttonSecondaryText' => 'Who We Are',
						'buttonSecondaryUrl' => '#'
					)
				)
			),
			'showSliderNav' => array(
				'type' => 'boolean',
				'default' => true
			),
			'showSliderDots' => array(
				'type' => 'boolean',
				'default' => true
			),
			'autoplay' => array(
				'type' => 'boolean',
				'default' => false
			),
			'autoplayDelay' => array(
				'type' => 'number',
				'default' => 5000
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'textdomain' => 'ambrygen-web'
	),
	'hm-mega-menu-block-main' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'hm-blocks/hm-mega-menu-block',
		'version' => '1.0.1',
		'title' => 'HM Megamenu Block',
		'category' => 'theme',
		'icon' => 'columns',
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'inserter' => true,
			'__experimentalNavigationBlock' => true
		),
		'parent' => array(
			'core/navigation'
		),
		'attributes' => array(
			'label' => array(
				'type' => 'string',
				'default' => ''
			),
			'menuSlug' => array(
				'type' => 'string'
			),
			'justifyMenu' => array(
				'type' => 'string'
			),
			'width' => array(
				'type' => 'string'
			)
		),
		'description' => 'Add a mega menu to your navigation.',
		'textdomain' => 'hm-mega-menu-block',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js',
		'viewStyle' => 'file:./index.css'
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
			'eyebrow' => array(
				'type' => 'string',
				'default' => 'Newsletter'
			),
			'description' => array(
				'type' => 'string',
				'default' => 'Subscribe to the Ambry Newsletter and other updates.'
			),
			'heading' => array(
				'type' => 'string',
				'default' => 'Stay Informed'
			),
			'image' => array(
				'type' => 'string',
				'default' => '/wp-content/themes/ambrygen/assets/src/images/news-latter/news-latter.jpg'
			),
			'imageSizes' => array(
				'type' => 'object',
				'default' => array(
					
				)
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
				'type' => 'string',
				'default' => '#005E7F'
			),
			'style' => array(
				'type' => 'object'
			),
			'textColor' => array(
				'type' => 'string',
				'default' => '#8AD8F4'
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
	),
	'testimonial-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/testimonial-item',
		'title' => 'Testimonial Item',
		'parent' => array(
			'ambrygen/testimonials'
		),
		'attributes' => array(
			'logo' => array(
				'type' => 'string'
			),
			'logoSizes' => array(
				'type' => 'object'
			),
			'quote' => array(
				'type' => 'string',
				'default' => 'The Ambry Care Program has been a game changer for our healthcare management. Their dedicated team and innovative solutions streamlined our patient care processes, allowing us to spend more time on what truly matters—our patients\' well-being.'
			),
			'author' => array(
				'type' => 'string',
				'default' => 'Sarah Mitchell'
			),
			'role' => array(
				'type' => 'string',
				'default' => 'CEO of TechSpark'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'viewScript' => 'file:./view.js'
	),
	'testimonials' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/testimonials',
		'title' => 'Testimonials Section',
		'category' => 'ambrygen',
		'icon' => 'format-quote',
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'Read About Ambry’s Impact on Patient Lives'
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'backgroundImage' => array(
				'type' => 'string',
				'default' => '/wp-content/themes/ambrygen/assets/images/testimonials-background.jpg'
			),
			'backgroundImageSizes' => array(
				'type' => 'object',
				'default' => array(
					
				)
			),
			'mainImage' => array(
				'type' => 'string',
				'default' => '/wp-content/themes/ambrygen/assets/src/images/testimonial/testimonial-main.png'
			),
			'mainImageSizes' => array(
				'type' => 'object',
				'default' => array(
					
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'viewScript' => 'file:./view.js'
	)
);
