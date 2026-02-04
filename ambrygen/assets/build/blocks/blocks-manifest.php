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
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'alongside-image-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/alongside-image-block',
		'title' => 'Alongside Image Block',
		'category' => 'ambrygen',
		'icon' => 'location-alt',
		'description' => 'Block with Google Maps and location list',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'default' => 'Our Locations'
			),
			'titleColor' => array(
				'type' => 'string',
				'default' => ''
			),
			'iframe' => array(
				'type' => 'string',
				'default' => 'https://www.google.com/maps/embed?pb=...'
			),
			'locations' => array(
				'type' => 'array',
				'default' => array(
					array(
						'name' => 'Headquarters',
						'address' => '1 Enterprise, Aliso Viejo, CA 92656'
					),
					array(
						'name' => 'Lab (For specimen shipments)',
						'address' => '7 Argonaut, Aliso Viejo, CA 92656'
					)
				)
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			)
		),
		'render' => 'file:./render.php',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
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
				'default' => 'Contact'
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'highlight' => array(
				'type' => 'string',
				'default' => 'Us'
			),
			'content' => array(
				'type' => 'string',
				'default' => 'Ambry Genetics focuses on quality and accuracy within the genetic testing process by employing a multi-step verification process. Everything we do is with the patient in mind so that we can deliver the most comprehensive information available.'
			),
			'imageUrl' => array(
				'type' => 'string',
				'default' => 'http://ambrygen-local.local/wp-content/uploads/2026/01/contact-us.jpg'
			),
			'imageAlt' => array(
				'type' => 'string',
				'default' => 'Our people'
			),
			'shapeUrl' => array(
				'type' => 'string',
				'default' => 'http://ambrygen-local.local/wp-content/uploads/2026/01/shape-element-three.svg'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
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
				'default' => 'http://ambrydevelopment.local/wp-content/uploads/2026/01/79403112e2997f3a27daf701924df7ea962d5131.jpg'
			),
			'imageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'imageAlt' => array(
				'type' => 'string',
				'default' => 'FAQ illustration'
			),
			'faqs' => array(
				'type' => 'array',
				'default' => array(
					array(
						'id' => '1',
						'question' => 'WHAT IS GENETIC TESTING?',
						'answer' => 'Genetic testing involves examining your DNA, the chemical data base that carries instructions for your body’s functions. Genetic testing can reveal changes or alterations, called mutations, in your genes that may lead to illness or disease. (Source: Mayo Clinic)'
					),
					array(
						'id' => '2',
						'question' => 'IS GENETIC TESTING FOR EVERYONE?',
						'answer' => 'Genetic testing involves examining your DNA, the chemical data base that carries instructions for your body’s functions. Genetic testing can reveal changes or alterations, called mutations, in your genes that may lead to illness or disease. (Source: Mayo Clinic)'
					),
					array(
						'id' => '3',
						'question' => 'WHY SHOULD SOMEONE BE TESTED?',
						'answer' => 'Genetic testing involves examining your DNA, the chemical data base that carries instructions for your body’s functions. Genetic testing can reveal changes or alterations, called mutations, in your genes that may lead to illness or disease. (Source: Mayo Clinic)'
					),
					array(
						'id' => '4',
						'question' => 'WHAT IS A GENETIC COUNSELOR?',
						'answer' => 'Genetic testing involves examining your DNA, the chemical data base that carries instructions for your body’s functions. Genetic testing can reveal changes or alterations, called mutations, in your genes that may lead to illness or disease. (Source: Mayo Clinic)'
					),
					array(
						'id' => '5',
						'question' => 'WHAT MAKES AMBRY DIFFERENT FROM ITS COMPETITORS?',
						'answer' => 'Genetic testing involves examining your DNA, the chemical data base that carries instructions for your body’s functions. Genetic testing can reveal changes or alterations, called mutations, in your genes that may lead to illness or disease. (Source: Mayo Clinic)'
					)
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
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
		'render' => 'file:./render.php',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'Get Started with Ambry'
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
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
	'gallery-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/gallery-item',
		'title' => 'Gallery Item',
		'parent' => array(
			'ambrygen/gallery'
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'imageUrl' => array(
				'type' => 'string',
				'default' => ''
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
			),
			'title' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h5'
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'link' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
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
			),
			'imageSrcSet' => array(
				'type' => 'string'
			),
			'imageSizes' => array(
				'type' => 'string'
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
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
			'sectionTitle' => array(
				'type' => 'string',
				'default' => 'Why We’re <span>Different</span>'
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'get-in-touch' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/get-in-touch',
		'title' => 'Get In Touch',
		'category' => 'ambrygen',
		'icon' => 'email',
		'description' => 'Contact block with Gravity Form',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'default' => 'Get in'
			),
			'highlightText' => array(
				'type' => 'string',
				'default' => 'Touch'
			),
			'content' => array(
				'type' => 'string',
				'default' => '<p>Please complete the form if you are a provider, pharma or business development partner, or payor.</p><p>All others, including patients who have received or are seeking genetic testing services, should reach out to the appropriate Ambry team at the email or phone number listed above.</p>'
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'header' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/header',
		'version' => '1.0.0',
		'title' => 'Site Header',
		'category' => 'ambrygen',
		'icon' => 'admin-home',
		'description' => 'Complete site header with navigation and mega menus',
		'attributes' => array(
			'topBarText' => array(
				'type' => 'string',
				'default' => 'Find us at ACMG! We\'re on booth A312, Walk in to connect with us, or use this link to setup a 1:1.'
			),
			'topBarLinkText' => array(
				'type' => 'string',
				'default' => ''
			),
			'topBarLinkUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'topBarVisible' => array(
				'type' => 'boolean',
				'default' => true
			),
			'navItems' => array(
				'type' => 'array',
				'default' => array(
					array(
						'label' => 'Patients',
						'url' => '#',
						'hasMegaMenu' => true,
						'megaMenuBlock' => 'ambrygen/mega-menu-patients'
					),
					array(
						'label' => 'Providers',
						'url' => '#',
						'hasMegaMenu' => true,
						'megaMenuBlock' => 'ambrygen/mega-menu-providers'
					),
					array(
						'label' => 'Solutions',
						'url' => '#',
						'hasMegaMenu' => true,
						'megaMenuBlock' => 'ambrygen/mega-menu-solutions',
						'isSecondLevel' => true
					),
					array(
						'label' => 'Company',
						'url' => '#',
						'hasMegaMenu' => true,
						'megaMenuBlock' => 'ambrygen/mega-menu-company',
						'isSecondLevel' => true
					),
					array(
						'label' => 'Contact',
						'url' => '#',
						'hasMegaMenu' => false
					)
				)
			),
			'loginUrl' => array(
				'type' => 'string',
				'default' => '#'
			),
			'loginText' => array(
				'type' => 'string',
				'default' => 'Login'
			),
			'mobileCtaText' => array(
				'type' => 'string',
				'default' => 'See a Demo'
			),
			'mobileCtaUrl' => array(
				'type' => 'string',
				'default' => '#'
			),
			'logoUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'logoId' => array(
				'type' => 'number',
				'default' => 0
			),
			'logoAlt' => array(
				'type' => 'string',
				'default' => 'Ambry Genetics'
			)
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'full',
				'wide'
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'render' => 'file:./render.php'
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
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js',
		'textdomain' => 'ambrygen-web'
	),
	'icon-grids' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/icon-grids',
		'title' => 'Icon Grids',
		'category' => 'ambrygen',
		'icon' => 'grid-view',
		'description' => 'Grid layout for icon cards with contact information',
		'supports' => array(
			'html' => false,
			'layout' => array(
				'allowSwitching' => true,
				'allowInheriting' => true
			)
		),
		'attributes' => array(
			
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php'
	),
	'icon-grids-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/icon-grids-item',
		'title' => 'Icon Grid Item',
		'category' => 'ambrygen',
		'icon' => 'format-image',
		'parent' => array(
			'ambrygen/icon-grids'
		),
		'description' => 'Individual icon card item for icon grids',
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'color' => array(
				'background' => true,
				'link' => true
			)
		),
		'attributes' => array(
			'icon' => array(
				'type' => 'object',
				'default' => array(
					'url' => '',
					'id' => 0,
					'alt' => ''
				)
			),
			'title' => array(
				'type' => 'string',
				'default' => 'Title'
			),
			'links' => array(
				'type' => 'array',
				'default' => array(
					
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php'
	),
	'mega-menu-company' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/mega-menu-company',
		'version' => '1.0.0',
		'title' => 'Mega Menu Company',
		'category' => 'ambrygen',
		'icon' => 'building',
		'description' => 'Company Mega Menu Block',
		'attributes' => array(
			'leftTitle' => array(
				'type' => 'string',
				'default' => 'Company'
			),
			'items' => array(
				'type' => 'array',
				'default' => array(
					array(
						'label' => 'About Us',
						'url' => '#',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=About+Us',
						'rightTitle' => 'About us',
						'rightText' => 'Ambry Genetics Patient for Life Program focuses on fostering robust pharmaceutical collaborations to advance innovative genetic testing solutions, propelling the future of personalized medicine.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Leadership',
						'url' => '#',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Leadership',
						'rightTitle' => 'Leadership',
						'rightText' => 'Meet the team driving our mission forward.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Events',
						'url' => '#',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Events',
						'rightTitle' => 'Events',
						'rightText' => 'Join us at upcoming conferences and webinars.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Media',
						'url' => '#',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Media',
						'rightTitle' => 'Media',
						'rightText' => 'Resources for press and media.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'In the News',
						'url' => '#',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=In+the+News',
						'rightTitle' => 'In the News',
						'rightText' => 'Ambry Genetics in the headlines.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Press Releases',
						'url' => '#',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Press+Releases',
						'rightTitle' => 'Press Releases',
						'rightText' => 'Official announcements and updates.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Videos',
						'url' => '#',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Videos',
						'rightTitle' => 'Videos',
						'rightText' => 'Watch our latest videos and stories.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Blog',
						'url' => '#',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Blog',
						'rightTitle' => 'Blog',
						'rightText' => 'Insights, stories, and updates from Ambry.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Careers',
						'url' => '#',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Careers',
						'rightTitle' => 'Careers',
						'rightText' => 'Join our team and make a difference.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Contact',
						'url' => '#',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Contact',
						'rightTitle' => 'Contact',
						'rightText' => 'Get in touch with us.',
						'rightUrl' => '#'
					)
				)
			)
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'full',
				'wide'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'layout' => array(
				'allowSwitching' => true,
				'allowInheriting' => true,
				'allowEditing' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'link' => true
			),
			'typography' => true
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'mega-menu-link' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/mega-menu-link',
		'version' => '1.0.0',
		'title' => 'Mega Menu Link',
		'category' => 'ambrygen',
		'icon' => 'admin-links',
		'description' => 'A single link item for mega menus, optionally with an icon.',
		'parent' => array(
			'ambrygen/mega-menu-patients',
			'ambrygen/mega-menu-solutions',
			'ambrygen/mega-menu-company',
			'ambrygen/mega-menu-providers',
			'core/group'
		),
		'attributes' => array(
			'label' => array(
				'type' => 'string',
				'default' => ''
			),
			'url' => array(
				'type' => 'string',
				'default' => '#'
			),
			'iconId' => array(
				'type' => 'number'
			),
			'iconUrl' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'mega-menu-patients' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/mega-menu-patients',
		'version' => '1.0.0',
		'title' => 'Mega Menu Patients',
		'category' => 'ambrygen',
		'icon' => 'groups',
		'description' => 'Patients Mega Menu Block',
		'attributes' => array(
			'items' => array(
				'type' => 'array',
				'default' => array(
					array(
						'image' => '',
						'imageId' => 0,
						'title' => 'Take Action',
						'url' => '#',
						'text' => 'For over 25 years our high-quality, accessible genetic testing solutions have shaped important care decisions.',
						'hasSubmenu' => true,
						'submenuTitle' => 'Our Tests',
						'submenuLinks' => array(
							array(
								'label' => 'Patient for Life Program',
								'url' => '#',
								'icon' => '/wp-content/themes/ambrygen/assets/src/images/certificate.svg'
							),
							array(
								'label' => 'Classifi Variant Program',
								'url' => '#',
								'icon' => '/wp-content/themes/ambrygen/assets/src/images/rows-icon.svg'
							),
							array(
								'label' => 'Our Tests',
								'url' => '#',
								'icon' => '/wp-content/themes/ambrygen/assets/src/images/genetic-testing-icon.svg'
							),
							array(
								'label' => 'Pharma Services',
								'url' => '#',
								'icon' => '/wp-content/themes/ambrygen/assets/src/images/pharma-icon.svg'
							),
							array(
								'label' => 'Our Technology',
								'url' => '#',
								'icon' => '/wp-content/themes/ambrygen/assets/src/images/cpu-chip-icon.svg'
							),
							array(
								'label' => 'Family Studies',
								'url' => '#',
								'icon' => '/wp-content/themes/ambrygen/assets/src/images/relatives-icon.svg'
							),
							array(
								'label' => 'Research & Collaboration',
								'url' => '#',
								'icon' => '/wp-content/themes/ambrygen/assets/src/images/microscope-icon.svg'
							)
						)
					),
					array(
						'image' => '',
						'imageId' => 0,
						'title' => 'Take Action',
						'url' => '#',
						'text' => 'For over 25 years our high-quality, accessible genetic testing solutions have shaped important care decisions.',
						'hasSubmenu' => false,
						'submenuLinks' => array(
							
						)
					),
					array(
						'image' => '',
						'imageId' => 0,
						'title' => 'Take Action',
						'url' => '#',
						'text' => 'For over 25 years our high-quality, accessible genetic testing solutions have shaped important care decisions.',
						'hasSubmenu' => false,
						'submenuLinks' => array(
							
						)
					)
				)
			)
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'full',
				'wide'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'layout' => array(
				'allowSwitching' => true,
				'allowInheriting' => true,
				'allowEditing' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'link' => true
			),
			'typography' => true
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'mega-menu-providers' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/mega-menu-providers',
		'version' => '1.0.0',
		'title' => 'Mega Menu Providers',
		'category' => 'ambrygen',
		'icon' => 'menu',
		'description' => 'Providers Mega Menu Block',
		'supports' => array(
			'html' => false,
			'align' => array(
				'full',
				'wide'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'layout' => array(
				'allowSwitching' => true,
				'allowInheriting' => true,
				'allowEditing' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'link' => true
			),
			'typography' => true
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'mega-menu-solutions' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/mega-menu-solutions',
		'version' => '1.0.0',
		'title' => 'Mega Menu Solutions',
		'category' => 'ambrygen',
		'icon' => 'share',
		'description' => 'Solutions Mega Menu Block',
		'attributes' => array(
			'leftTitle' => array(
				'type' => 'string',
				'default' => 'Solutions'
			),
			'items' => array(
				'type' => 'array',
				'default' => array(
					array(
						'label' => 'Patient for Life Program',
						'url' => '#',
						'icon' => '/wp-content/themes/ambrygen/assets/src/images/certificate.svg',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Solutions',
						'rightTitle' => 'Patient for Life Program',
						'rightText' => 'Ambry Genetics Patient for Life Program focuses on fostering robust pharmaceutical collaborations to advance innovative genetic testing solutions, propelling the future of personalized medicine.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Classifi Variant Program',
						'url' => '#',
						'icon' => '/wp-content/themes/ambrygen/assets/src/images/rows-icon.svg',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Classifi',
						'rightTitle' => 'Classifi Variant Program',
						'rightText' => 'Advanced variant classification program.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Our Tests',
						'url' => '#',
						'icon' => '/wp-content/themes/ambrygen/assets/src/images/genetic-testing-icon.svg',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Our+Tests',
						'rightTitle' => 'Our Tests',
						'rightText' => 'Comprehensive genetic testing solutions.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Pharma Services',
						'url' => '#',
						'icon' => '/wp-content/themes/ambrygen/assets/src/images/pharma-icon.svg',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Pharma',
						'rightTitle' => 'Pharma Services',
						'rightText' => 'Supporting pharmaceutical partners.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Our Technology',
						'url' => '#',
						'icon' => '/wp-content/themes/ambrygen/assets/src/images/cpu-chip-icon.svg',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Technology',
						'rightTitle' => 'Our Technology',
						'rightText' => 'State-of-the-art genetic sequencing.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Family Studies',
						'url' => '#',
						'icon' => '/wp-content/themes/ambrygen/assets/src/images/relatives-icon.svg',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Family',
						'rightTitle' => 'Family Studies',
						'rightText' => 'Helping families understand their genetics.',
						'rightUrl' => '#'
					),
					array(
						'label' => 'Research & Collaboration',
						'url' => '#',
						'icon' => '/wp-content/themes/ambrygen/assets/src/images/microscope-icon.svg',
						'image' => 'https://placehold.co/800x600/102334/ffffff?text=Research',
						'rightTitle' => 'Research & Collaboration',
						'rightText' => 'Collaborating for scientific advancement.',
						'rightUrl' => '#'
					)
				)
			)
		),
		'supports' => array(
			'html' => false,
			'align' => array(
				'full',
				'wide'
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'layout' => array(
				'allowSwitching' => true,
				'allowInheriting' => true,
				'allowEditing' => true
			),
			'color' => array(
				'text' => true,
				'background' => true,
				'link' => true
			),
			'typography' => true
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
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
			'heading' => array(
				'type' => 'string',
				'default' => 'Stay Informed'
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'description' => array(
				'type' => 'string',
				'default' => 'Subscribe to the Ambry Newsletter and other updates.'
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
			'overlayTopImage' => array(
				'type' => 'string',
				'default' => '/wp-content/themes/ambrygen/assets/src/images/news-latter/overlay-top.svg'
			),
			'overlayBottomImage' => array(
				'type' => 'string',
				'default' => '/wp-content/themes/ambrygen/assets/src/images/news-latter/overlay-bottom.svg'
			),
			'backgroundColor' => array(
				'type' => 'string',
				'default' => '#005E7F'
			),
			'textColor' => array(
				'type' => 'string',
				'default' => '#8AD8F4'
			),
			'style' => array(
				'type' => 'object'
			)
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
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
		'render' => 'file:./render.php',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'usesContext' => array(
			'ambrygen/mainImage',
			'ambrygen/mainImageSizes'
		)
	),
	'testimonials' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/testimonials',
		'title' => 'Testimonials Section',
		'category' => 'ambrygen',
		'icon' => 'format-quote',
		'supports' => array(
			'color' => array(
				'background' => true
			)
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'Read About Ambry’s Impact on Patient Lives'
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'mainImage' => array(
				'type' => 'string',
				'default' => '/wp-content/themes/ambrygen/assets/src/images/testimonial/testimonial-main.png'
			),
			'mainImageSizes' => array(
				'type' => 'object',
				'default' => array(
					
				)
			),
			'secondaryImage' => array(
				'type' => 'string',
				'default' => '/wp-content/themes/ambrygen/assets/src/images/testimonial/secondary-image.png'
			),
			'secondaryImageSizes' => array(
				'type' => 'object',
				'default' => array(
					
				)
			),
			'overlayImage' => array(
				'type' => 'string',
				'default' => '/wp-content/themes/ambrygen/assets/src/images/testimonial/overlay-image.png'
			),
			'overlayImageSizes' => array(
				'type' => 'object',
				'default' => array(
					
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'providesContext' => array(
			'ambrygen/mainImage' => 'mainImage',
			'ambrygen/mainImageSizes' => 'mainImageSizes'
		)
	)
);
