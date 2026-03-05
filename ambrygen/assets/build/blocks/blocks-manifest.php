<?php
// This file is generated. Do not modify it manually.
return array(
	'additional-links' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/additional-links',
		'title' => 'Additional Links',
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
			'heading' => array(
				'type' => 'string',
				'default' => 'Additional Links'
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'description' => array(
				'type' => 'string',
				'default' => 'A company with 25+ years of history and regular industry "firsts," Ambry leads new clinical product development pipelines and research collaborations. Contributing to the scientific community to empower individuals is the way we do things, driven with a desire to promote the health of people worldwide.'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'heading' => 'Additional Links',
				'headingTag' => 'h2',
				'description' => 'A company with 25+ years of history and regular industry "firsts," Ambry leads new clinical product development pipelines and research collaborations. Contributing to the scientific community to empower individuals is the way we do things, driven with a desire to promote the health of people worldwide.'
			)
		)
	),
	'additional-links-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/additional-links-item',
		'title' => 'Additional Links Item',
		'category' => 'ambrygen',
		'icon' => 'format-image',
		'parent' => array(
			'ambrygen/additional-links'
		),
		'description' => 'Individual card for additional links block',
		'supports' => array(
			'html' => false,
			'reusable' => false,
			'color' => array(
				'background' => true
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
			'cta' => array(
				'type' => 'object',
				'default' => array(
					'text' => 'Title',
					'url' => '',
					'target' => '',
					'rel' => '',
					'variant' => 'dark'
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'icon' => array(
					'url' => 'Sample url',
					'id' => 0,
					'alt' => 'Preview asset'
				),
				'cta' => array(
					'text' => 'Title',
					'url' => 'Sample url',
					'target' => 'Sample target',
					'rel' => 'Sample rel',
					'variant' => 'dark'
				)
			)
		)
	),
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
				'headingLevel' => 'h2',
				'headingPrimary' => 'Transforming Healthcare with Genetic Insight',
				'heading' => 'Transforming Healthcare with AI Innovation',
				'content' => 'Leveraging artificial intelligence to revolutionize patient care, diagnostics, and medical research.',
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
				),
				'imageTop' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'imageTopId' => 0,
				'imageTopAlt' => 'Ambry default preview image',
				'imageBottom' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'imageBottomId' => 0,
				'imageBottomAlt' => 'Ambry default preview image',
				'logoImage' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'logoImageId' => 0,
				'logoImageAlt' => 'Ambry default preview image',
				'imageTopSrcSet' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png 1200w',
				'imageTopSizes' => '100vw',
				'imageBottomSrcSet' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png 1200w',
				'imageBottomSizes' => '100vw',
				'logoImageSrcSet' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png 1200w',
				'logoImageSizes' => '100vw'
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
				),
				'items' => array(
					'type' => 'object'
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
		'style' => 'file:./style-index.css',
		'example' => array(
			'attributes' => array(
				'title' => 'Our Locations',
				'iframe' => 'https://www.google.com/maps/embed?pb=...',
				'locations' => array(
					array(
						'name' => 'Headquarters',
						'address' => '1 Enterprise, Aliso Viejo, CA 92656'
					),
					array(
						'name' => 'Lab (For specimen shipments)',
						'address' => '7 Argonaut, Aliso Viejo, CA 92656'
					)
				),
				'headingLevel' => 'h2'
			)
		)
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
			'html' => true,
			'color' => array(
				'background' => true
			)
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'Title'
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
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
			),
			'eyebrow' => array(
				'type' => 'string',
				'default' => ''
			),
			'breadcrumb' => array(
				'type' => 'string',
				'default' => ''
			),
			'buttonText' => array(
				'type' => 'string',
				'default' => ''
			),
			'buttonUrl' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'heading' => 'Title',
				'headingLevel' => 'h2',
				'content' => 'Ambry Genetics focuses on quality and accuracy within the genetic testing process by employing a multi-step verification process. Everything we do is with the patient in mind so that we can deliver the most comprehensive information available.',
				'imageUrl' => 'http://ambrygen-local.local/wp-content/uploads/2026/01/contact-us.jpg',
				'imageAlt' => 'Our people',
				'shapeUrl' => 'http://ambrygen-local.local/wp-content/uploads/2026/01/shape-element-three.svg',
				'eyebrow' => 'Ambry Genetics',
				'breadcrumb' => 'Sample breadcrumb',
				'buttonText' => 'Learn More',
				'buttonUrl' => 'https://example.com'
			)
		)
	),
	'careers' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/careers',
		'title' => 'Careers Block',
		'category' => 'ambrygen',
		'icon' => 'groups',
		'description' => 'Parent block for careers',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'default' => ''
			),
			'intro' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'videoUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'videoObj' => array(
				'type' => 'object',
				'default' => null
			),
			'videoType' => array(
				'type' => 'string',
				'default' => 'mp4'
			),
			'videoPoster' => array(
				'type' => 'object',
				'default' => null
			),
			'careersLink' => array(
				'type' => 'string',
				'default' => ''
			),
			'link' => array(
				'type' => 'object',
				'default' => array(
					'url' => '',
					'text' => '',
					'target' => '',
					'rel' => '',
					'variant' => ''
				)
			),
			'careerslink' => array(
				'type' => 'object',
				'default' => array(
					'url' => '',
					'text' => '',
					'target' => '',
					'rel' => '',
					'variant' => ''
				)
			),
			'viewAllText ' => array(
				'type' => 'string',
				'default' => ''
			),
			'playIcon' => array(
				'type' => 'object',
				'default' => null
			),
			'joblocationicon' => array(
				'type' => 'object',
				'default' => null
			),
			'jobtypeicon' => array(
				'type' => 'object',
				'default' => null
			),
			'pauseIcon' => array(
				'type' => 'object',
				'default' => null
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php',
		'providesContext' => array(
			'ambrygen/joblocationicon' => 'joblocationicon',
			'ambrygen/jobtypeicon' => 'jobtypeicon'
		),
		'example' => array(
			'attributes' => array(
				'title' => 'Our Executive Team',
				'intro' => 'We are proud to be leading the industry that we love and working together.',
				'headingLevel' => 'h2',
				'videoUrl' => 'https://www.w3schools.com/html/mov_bbb.mp4',
				'videoType' => 'mp4',
				'videoPoster' => array(
					
				),
				'careersLink' => array(
					'url' => 'https://example.com',
					'text' => 'Learn More',
					'target' => '_self',
					'rel' => 'Sample rel',
					'variant' => 'primary'
				),
				'link' => array(
					'url' => 'Sample url',
					'text' => 'Sample text',
					'target' => 'Sample target',
					'rel' => 'Sample rel',
					'variant' => 'Sample variant'
				),
				'careerslink' => array(
					'url' => 'Sample url',
					'text' => 'Sample text',
					'target' => 'Sample target',
					'rel' => 'Sample rel',
					'variant' => 'Sample variant'
				),
				'viewAllText ' => 'Sample viewAllText ',
				'playIcon' => array(
					'id' => 1,
					'url' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
					'alt' => 'Icon'
				),
				'joblocationicon' => array(
					'id' => 1,
					'url' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
					'alt' => 'Icon'
				),
				'jobtypeicon' => array(
					'id' => 1,
					'url' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
					'alt' => 'Icon'
				),
				'pauseIcon' => array(
					'id' => 1,
					'url' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
					'alt' => 'Icon'
				)
			)
		)
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
			'title' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h5'
			),
			'imageUrl' => array(
				'type' => 'string'
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
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'id' => array(
							'type' => 'string'
						),
						'question' => array(
							'type' => 'string'
						),
						'answer' => array(
							'type' => 'string'
						)
					)
				),
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
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'title' => 'Sample Title',
				'headingTag' => 'h5',
				'imageId' => 0,
				'faqs' => array(
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
		)
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
		'render' => 'file:./render.php',
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
			'contentAlignment' => array(
				'type' => 'string',
				'default' => 'left'
			),
			'content' => array(
				'type' => 'string',
				'default' => 'left'
			),
			'buttons' => array(
				'type' => 'array',
				'default' => array(
					array(
						'text' => '',
						'url' => '',
						'variant' => 'site-btn'
					),
					array(
						'text' => '',
						'url' => '',
						'variant' => 'site-btn is-style-site-tertiary-btn'
					)
				)
			)
		),
		'example' => array(
			'attributes' => array(
				'heading' => 'Transforming Healthcare with Genetic Insight',
				'headingTag' => 'h2',
				'imageUrl' => '/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'imageId' => 0,
				'imageAlt' => 'Ambry default preview image',
				'imagePosition' => 'left',
				'layoutStyle' => 'standard',
				'contentAlignment' => 'left',
				'content' => 'left',
				'buttons' => array(
					array(
						'text' => '',
						'url' => '',
						'variant' => 'site-btn'
					),
					array(
						'text' => '',
						'url' => '',
						'variant' => 'site-btn is-style-site-tertiary-btn'
					)
				)
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
		'viewScript' => 'file:./view.js',
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'Title'
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'variation' => array(
				'type' => 'string',
				'default' => 'two-column'
			),
			'topImageID' => array(
				'type' => 'number',
				'default' => null
			),
			'topImageURL' => array(
				'type' => 'string',
				'default' => ''
			),
			'blockId' => array(
				'type' => 'string'
			)
		),
		'providesContext' => array(
			'ambrygen/galleryVariation' => 'variation'
		),
		'example' => array(
			'attributes' => array(
				'heading' => 'Title',
				'headingTag' => 'h2',
				'description' => 'This is a sample preview content for this block in the inserter.',
				'variation' => 'two-column',
				'topImageID' => 1,
				'topImageURL' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'blockId' => 1
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
			'imageID' => array(
				'type' => 'number',
				'default' => ''
			),
			'eyebrow' => array(
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
				'type' => 'object',
				'default' => array(
					'url' => '',
					'text' => '',
					'target' => '',
					'rel' => '',
					'variant' => 'dark'
				)
			)
		),
		'usesContext' => array(
			'ambrygen/galleryVariation'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'imageUrl' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'imageID' => 1,
				'eyebrow' => 'Ambry Genetics',
				'title' => 'Sample Title',
				'headingTag' => 'h5',
				'description' => 'This is a sample preview content for this block in the inserter.',
				'link' => array(
					'url' => 'Sample url',
					'text' => 'Sample text',
					'target' => 'Sample target',
					'rel' => 'Sample rel',
					'variant' => 'Sample variant'
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
				'default' => ''
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'videoUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'videoType' => array(
				'type' => 'string',
				'default' => 'embed'
			),
			'playIcon' => array(
				'type' => 'object',
				'default' => null
			),
			'pauseIcon' => array(
				'type' => 'object',
				'default' => null
			),
			'posterImage' => array(
				'type' => 'object',
				'default' => null
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'iframeUrl' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js',
		'example' => array(
			'attributes' => array(
				'heading' => 'Transforming Healthcare with Genetic Insight',
				'description' => 'This is a sample preview content for this block in the inserter.',
				'videoUrl' => 'https://www.w3schools.com/html/mov_bbb.mp4',
				'videoType' => 'embed',
				'playIcon' => array(
					'id' => 1,
					'url' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
					'alt' => 'Icon'
				),
				'pauseIcon' => array(
					'id' => 1,
					'url' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
					'alt' => 'Icon'
				),
				'posterImage' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'headingTag' => 'h2',
				'iframeUrl' => 'https://www.youtube.com/embed/ysz5S6PUM-U'
			)
		)
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
		'supports' => array(
			'html' => false,
			'color' => array(
				'background' => true,
				'text' => true,
				'link' => true
			),
			'spacing' => array(
				'margin' => true,
				'padding' => true,
				'blockGap' => true
			),
			'typography' => array(
				'fontSize' => true,
				'lineHeight' => true
			)
		),
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
			'link' => array(
				'type' => 'object',
				'default' => array(
					'url' => '',
					'text' => '',
					'target' => '',
					'rel' => '',
					'variant' => ''
				)
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
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'image' => '/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'imageId' => 0,
				'imageAlt' => 'Ambry default preview image',
				'title' => 'Sample Title',
				'description' => 'This is a sample preview content for this block in the inserter.',
				'link' => array(
					'url' => '#',
					'text' => 'Sample text',
					'target' => '_self',
					'rel' => '',
					'variant' => 'primary'
				),
				'type' => 'small',
				'imageSrcSet' => '',
				'imageSizes' => ''
			)
		)
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
				'default' => 'Why We’re Different'
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
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'sectionTitle' => 'Why We’re Different',
				'headingTag' => 'h2'
			)
		)
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
				'default' => ''
			),
			'content' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingLevel' => array(
				'type' => 'string',
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				),
				'default' => 'h2'
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'title' => 'Title',
				'content' => '<p>Please complete the form if you are a provider, pharma or business development partner, or payor.</p><p>All others, including patients who have received or are seeking genetic testing services, should reach out to the appropriate Ambry team at the email or phone number listed above.</p>',
				'headingLevel' => 'h2'
			)
		)
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
						'megaMenuBlock' => 'ambrygen/mega-menu-3-columns'
					),
					array(
						'label' => 'Providers',
						'url' => '#',
						'hasMegaMenu' => true,
						'megaMenuBlock' => 'ambrygen/mega-menu-3-columns'
					),
					array(
						'label' => 'Solutions',
						'url' => '#',
						'hasMegaMenu' => true,
						'megaMenuBlock' => 'ambrygen/mega-menu-split',
						'isSecondLevel' => true
					),
					array(
						'label' => 'Company',
						'url' => '#',
						'hasMegaMenu' => true,
						'megaMenuBlock' => 'ambrygen/mega-menu-split',
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
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'topBarText' => 'Find us at ACMG! We\'re on booth A312, Walk in to connect with us, or use this link to setup a 1:1.',
				'topBarLinkText' => 'Learn More',
				'topBarLinkUrl' => 'https://example.com',
				'topBarVisible' => true,
				'navItems' => array(
					array(
						'label' => 'Patients',
						'url' => '#',
						'hasMegaMenu' => true,
						'megaMenuBlock' => 'ambrygen/mega-menu-3-columns'
					),
					array(
						'label' => 'Providers',
						'url' => '#',
						'hasMegaMenu' => true,
						'megaMenuBlock' => 'ambrygen/mega-menu-3-columns'
					),
					array(
						'label' => 'Solutions',
						'url' => '#',
						'hasMegaMenu' => true,
						'megaMenuBlock' => 'ambrygen/mega-menu-split',
						'isSecondLevel' => true
					),
					array(
						'label' => 'Company',
						'url' => '#',
						'hasMegaMenu' => true,
						'megaMenuBlock' => 'ambrygen/mega-menu-split',
						'isSecondLevel' => true
					),
					array(
						'label' => 'Contact',
						'url' => '#',
						'hasMegaMenu' => false
					)
				),
				'loginUrl' => '#',
				'loginText' => 'Login',
				'mobileCtaText' => 'See a Demo',
				'mobileCtaUrl' => '#',
				'logoUrl' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'logoId' => 0,
				'logoAlt' => 'Ambry Genetics'
			)
		)
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
						'eyebrow' => '',
						'overlayImage1Alt' => '',
						'headingTag' => 'h2',
						'overlayImage2' => '',
						'overlayImage2Id' => 0,
						'overlayImage2Alt' => '',
						'heading' => 'Industry-leading genetic testing',
						'content' => 'For over 25 years our high-quality, accessible genetic testing solutions have shaped important care decisions that patients and families make with their healthcare providers.',
						'buttonPrimaryText' => 'Start Your Order',
						'buttonPrimaryUrl' => '#',
						'buttonSecondaryText' => 'Who We Are',
						'buttonSecondaryUrl' => '#',
						'primarybutton' => array(
							'type' => 'object',
							'default' => array(
								'url' => '',
								'text' => 'string',
								'target' => '',
								'rel' => '',
								'variant' => ''
							)
						),
						'secondarybutton' => array(
							'type' => 'object',
							'default' => array(
								'url' => '',
								'text' => 'string',
								'target' => '',
								'rel' => '',
								'variant' => ''
							)
						)
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
			),
			'eyebrow' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'slides' => array(
					array(
						'backgroundImage' => '',
						'backgroundImageId' => 0,
						'backgroundImageAlt' => '',
						'overlayImage1' => '',
						'overlayImage1Id' => 0,
						'eyebrow' => '',
						'overlayImage1Alt' => '',
						'headingTag' => 'h2',
						'overlayImage2' => '',
						'overlayImage2Id' => 0,
						'overlayImage2Alt' => '',
						'heading' => 'Industry-leading genetic testing',
						'content' => 'For over 25 years our high-quality, accessible genetic testing solutions have shaped important care decisions that patients and families make with their healthcare providers.',
						'tagline' => 'This brings the Ambry mindset to life: a relentless pursuit to find the answers.',
						'buttonPrimaryText' => 'Start Your Order',
						'buttonPrimaryUrl' => '#',
						'buttonSecondaryText' => 'Who We Are',
						'buttonSecondaryUrl' => '#',
						'primarybutton' => array(
							'type' => 'object',
							'default' => array(
								'url' => '',
								'text' => 'string',
								'target' => '',
								'rel' => '',
								'variant' => ''
							)
						),
						'secondarybutton' => array(
							'type' => 'object',
							'default' => array(
								'url' => '',
								'text' => 'string',
								'target' => '',
								'rel' => '',
								'variant' => ''
							)
						)
					)
				),
				'showSliderNav' => true,
				'showSliderDots' => true,
				'autoplay' => false,
				'autoplayDelay' => 5000,
				'eyebrow' => 'Ambry Genetics',
				'headingTag' => 'h2'
			)
		)
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
			'heading' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'variation' => array(
				'type' => 'string',
				'default' => 'two-column'
			),
			'blockId' => array(
				'type' => 'string'
			),
			'link' => array(
				'type' => 'object',
				'default' => array(
					'url' => '',
					'text' => '',
					'target' => '',
					'rel' => '',
					'variant' => ''
				)
			),
			'selectedTabs' => array(
				'type' => 'array',
				'default' => array(
					array(
						'text' => 'All Tests',
						'termSlug' => 'all'
					)
				)
			)
		),
		'providesContext' => array(
			'ambrygen/variation' => 'variation'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'heading' => 'Title',
				'headingTag' => 'h2',
				'description' => 'This is a sample preview content for this block in the inserter.',
				'variation' => 'two-column',
				'blockId' => '1',
				'link' => array(
					'url' => 'Sample url',
					'text' => 'Sample text',
					'target' => 'Sample target',
					'rel' => 'Sample rel',
					'variant' => 'Sample variant'
				)
			)
		)
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
			'reusable' => false
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
				'default' => ''
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'button' => array(
				'type' => 'object',
				'default' => array(
					
				)
			),
			'links' => array(
				'type' => 'array',
				'default' => array(
					
				)
			),
			'selectedTerm' => array(
				'type' => 'number',
				'default' => 0
			),
			'termData' => array(
				'type' => 'object',
				'default' => array(
					
				)
			),
			'selectedPost' => array(
				'type' => 'number',
				'default' => 0
			),
			'termlinktext' => array(
				'type' => 'string'
			),
			'showSelector' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'usesContext' => array(
			'ambrygen/variation'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'icon' => array(
					'url' => 'Sample url',
					'id' => 0,
					'alt' => 'Preview asset'
				),
				'title' => 'Title',
				'description' => 'Description',
				'button' => array(
					'url' => 'https://example.com',
					'text' => 'Learn More',
					'target' => '_self',
					'rel' => 'Sample rel',
					'variant' => 'primary'
				),
				'links' => array(
					array(
						'text' => 'Read More',
						'url' => 'https://example.com',
						'target' => '_self',
						'rel' => ''
					)
				),
				'selectedTerm' => 0,
				'termData' => array(
					array(
						'id' => 1,
						'name' => 'All',
						'slug' => 'all'
					)
				),
				'termlinktext' => 'Learn More',
				'showSelector' => false
			)
		)
	),
	'job-list-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/job-list-item',
		'title' => 'Job List Item',
		'category' => 'ambrygen',
		'icon' => 'id',
		'parent' => array(
			'ambrygen/careers'
		),
		'attributes' => array(
			'postId' => array(
				'type' => 'number'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php',
		'usesContext' => array(
			'ambrygen/joblocationicon',
			'ambrygen/jobtypeicon'
		),
		'example' => array(
			'attributes' => array(
				'postId' => 1
			)
		)
	),
	'mega-menu-3-columns' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/mega-menu-3-columns',
		'version' => '1.0.0',
		'title' => 'Mega Menu (3 Columns)',
		'category' => 'ambrygen',
		'icon' => 'groups',
		'description' => 'Generic 3-column mega menu',
		'attributes' => array(
			'menuId' => array(
				'type' => 'string',
				'default' => ''
			),
			'menuLabel' => array(
				'type' => 'string',
				'default' => 'New Menu'
			),
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
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'menuId' => 1,
				'menuLabel' => 'New Menu',
				'items' => array(
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
		)
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
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'label' => 'Sample Title',
				'url' => '#',
				'iconId' => 1,
				'iconUrl' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png'
			)
		)
	),
	'mega-menu-split' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/mega-menu-split',
		'version' => '1.0.0',
		'title' => 'Mega Menu (Split View)',
		'category' => 'ambrygen',
		'icon' => 'share',
		'description' => 'Generic Split View Mega Menu',
		'attributes' => array(
			'menuId' => array(
				'type' => 'string',
				'default' => ''
			),
			'menuLabel' => array(
				'type' => 'string',
				'default' => 'New Split Menu'
			),
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
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'menuId' => 1,
				'menuLabel' => 'New Split Menu',
				'leftTitle' => 'Solutions',
				'items' => array(
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
		)
	),
	'newsletter-form' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/newsletter-form',
		'title' => 'Newsletter Form',
		'category' => 'ambrygen',
		'icon' => 'email',
		'description' => 'Newsletter subscription form with image and customizable styling.',
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
			'overlayTopImageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'overlayBottomImageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'overlayTopImage' => array(
				'type' => 'string',
				'default' => '/wp-content/themes/ambrygen/assets/src/images/news-latter/overlay-top.svg'
			),
			'overlayBottomImage' => array(
				'type' => 'string',
				'default' => '/wp-content/themes/ambrygen/assets/src/images/news-latter/overlay-bottom.svg'
			),
			'style' => array(
				'type' => 'object'
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'example' => array(
			'attributes' => array(
				'eyebrow' => 'Newsletter',
				'heading' => 'Stay Informed',
				'headingTag' => 'h2',
				'description' => 'Subscribe to the Ambry Newsletter and other updates.',
				'image' => '/wp-content/themes/ambrygen/assets/src/images/news-latter/news-latter.jpg',
				'imageId' => 0,
				'overlayTopImageId' => 0,
				'overlayBottomImageId' => 0,
				'overlayTopImage' => '/wp-content/themes/ambrygen/assets/src/images/news-latter/overlay-top.svg',
				'overlayBottomImage' => '/wp-content/themes/ambrygen/assets/src/images/news-latter/overlay-bottom.svg',
				'style' => array(
					
				)
			)
		)
	),
	'our-team' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/our-team',
		'title' => 'Our Team',
		'category' => 'ambrygen',
		'icon' => 'groups',
		'description' => 'Parent block for team members',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'default' => 'Title'
			),
			'intro' => array(
				'type' => 'string',
				'default' => 'We are proud to be leading the industry that we love and working together.'
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'title' => 'Title',
				'intro' => 'We are proud to be leading the industry that we love and working together.',
				'headingLevel' => 'h2'
			)
		)
	),
	'our-team-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/our-team-item',
		'title' => 'Team Member',
		'category' => 'ambrygen',
		'icon' => 'id',
		'parent' => array(
			'ambrygen/our-team'
		),
		'attributes' => array(
			'postId' => array(
				'type' => 'number'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'postId' => 1
			)
		)
	),
	'our-team-slider' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/our-team-slider',
		'title' => 'Our Team Slider',
		'category' => 'ambrygen',
		'icon' => 'groups',
		'description' => 'Parent block for team members',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'default' => 'Our Leadership Team'
			),
			'intro' => array(
				'type' => 'string',
				'default' => 'We are proud to be leading the industry that we love and working together.'
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'memberTypes' => array(
				'type' => 'array',
				'default' => array(
					
				)
			),
			'selectionMode' => array(
				'type' => 'string',
				'default' => 'manual'
			),
			'slidesPerView' => array(
				'type' => 'number',
				'default' => 3
			),
			'showNavigation' => array(
				'type' => 'boolean',
				'default' => true
			),
			'showPagination' => array(
				'type' => 'boolean',
				'default' => true
			),
			'autoplay' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'title' => 'Our Leadership Team',
				'intro' => 'We are proud to be leading the industry that we love and working together.',
				'headingLevel' => 'h2',
				'memberTypes' => array(
					'leadership'
				),
				'selectionMode' => 'manual',
				'slidesPerView' => 3,
				'showNavigation' => true,
				'showPagination' => true,
				'autoplay' => false
			)
		)
	),
	'our-team-slider-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/our-team-slider-item',
		'title' => 'Team Member',
		'category' => 'ambrygen',
		'icon' => 'id',
		'parent' => array(
			'ambrygen/our-team-slider'
		),
		'attributes' => array(
			'postId' => array(
				'type' => 'number'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'postId' => 1
			)
		)
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
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'tagName' => 'section',
				'containerWidth' => 'container-1340',
				'backgroundStyle' => 'default',
				'isFixedBackground' => false
			)
		)
	),
	'tab-menu' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/tab-menu',
		'title' => 'Tab menu',
		'category' => 'ambrygen',
		'icon' => 'index-card',
		'description' => 'Sticky horizontal tab navigation.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'blockId' => 1
			)
		)
	),
	'tab-menu-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/tab-item',
		'title' => 'Tab item',
		'category' => 'ambrygen',
		'parent' => array(
			'ambrygen/tab-menu'
		),
		'icon' => 'editor-kitchensink',
		'supports' => array(
			'anchor' => true
		),
		'description' => 'Single image card for three column grid.',
		'attributes' => array(
			'label' => array(
				'type' => 'string',
				'default' => 'Tab Label'
			),
			'targetId' => array(
				'type' => 'string',
				'default' => ''
			),
			'is_active_tab' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'label' => 'Tab Label',
				'targetId' => 1,
				'is_active_tab' => false
			)
		)
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
			'logoId' => array(
				'type' => 'number'
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
			'ambrygen/mainImageId'
		),
		'example' => array(
			'attributes' => array(
				'logo' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'logoId' => 1,
				'quote' => 'The Ambry Care Program has been a game changer for our healthcare management. Their dedicated team and innovative solutions streamlined our patient care processes, allowing us to spend more time on what truly matters—our patients\' well-being.',
				'author' => 'Sarah Mitchell',
				'role' => 'CEO of TechSpark'
			)
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
				'default' => '/wp-content/themes/ambrygen/assets/src/images/testimonials-main.jpg'
			),
			'mainImageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'secondaryImage' => array(
				'type' => 'string',
				'default' => '/wp-content/themes/ambrygen/assets/src/images/testimonial/secondary-image.png'
			),
			'secondaryImageId' => array(
				'type' => 'number',
				'default' => null
			),
			'overlayImage' => array(
				'type' => 'string',
				'default' => '/wp-content/themes/ambrygen/assets/src/images/testimonial/overlay-image.png'
			),
			'overlayImageId' => array(
				'type' => 'number',
				'default' => null
			)
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'viewScript' => 'file:./view.js',
		'providesContext' => array(
			'ambrygen/mainImage' => 'mainImage',
			'ambrygen/mainImageId' => 'mainImageId'
		),
		'example' => array(
			'attributes' => array(
				'heading' => 'Read About Ambry’s Impact on Patient Lives',
				'headingTag' => 'h2',
				'mainImage' => '/wp-content/themes/ambrygen/assets/src/images/testimonials-main.jpg',
				'mainImageId' => 0,
				'secondaryImage' => '/wp-content/themes/ambrygen/assets/src/images/testimonial/secondary-image.png',
				'secondaryImageId' => 1,
				'overlayImage' => '/wp-content/themes/ambrygen/assets/src/images/testimonial/overlay-image.png',
				'overlayImageId' => 1
			)
		)
	),
	'three-column-image-grid' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/three-column-image-grid',
		'title' => 'Three Column Image Grid',
		'category' => 'ambrygen',
		'icon' => 'screenoptions',
		'description' => 'A layout with two stacked cards on the left and one large featured card on the right.',
		'supports' => array(
			'html' => false,
			'anchor' => true,
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
			'heading' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingTag' => array(
				'type' => 'string',
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				),
				'default' => 'h2'
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'blockId' => array(
				'type' => 'string'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'heading' => 'Transforming Healthcare with Genetic Insight',
				'headingTag' => 'h2',
				'description' => 'This is a sample preview content for this block in the inserter.',
				'blockId' => 'section-example'
			)
		)
	),
	'three-column-image-grid-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/three-column-image-grid-item',
		'title' => 'Image Grid Card',
		'category' => 'ambrygen',
		'parent' => array(
			'ambrygen/three-column-image-grid'
		),
		'icon' => 'format-image',
		'description' => 'Single image card for three column grid.',
		'attributes' => array(
			'sectiontitle' => array(
				'type' => 'string'
			),
			'description' => array(
				'type' => 'string'
			),
			'imageUrl' => array(
				'type' => 'string'
			),
			'imageAlt' => array(
				'type' => 'string'
			),
			'imageId' => array(
				'type' => 'number'
			),
			'cta' => array(
				'type' => 'object',
				'default' => array(
					'url' => '',
					'text' => '',
					'target' => '',
					'rel' => '',
					'variant' => ''
				)
			),
			'type' => array(
				'type' => 'string',
				'default' => 'small'
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'sectiontitle' => 'Sample Title',
				'description' => 'This is a sample preview content for this block in the inserter.',
				'imageUrl' => '/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'imageAlt' => 'Ambry default preview image',
				'imageId' => 1,
				'cta' => array(
					'url' => 'Sample url',
					'text' => 'Sample text',
					'target' => 'Sample target',
					'rel' => 'Sample rel',
					'variant' => 'Sample variant'
				),
				'type' => 'small'
			)
		)
	),
	'two-column-solution-card' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/two-column-solution-card',
		'title' => 'Two Column Solution Card Section',
		'category' => 'ambrygen',
		'icon' => 'columns',
		'description' => 'A layout with two stacked cards on the left and one large featured card on the right.',
		'supports' => array(
			'html' => false
		),
		'keywords' => array(
			'cards',
			'genetic',
			'layout',
			'grid'
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'blockId' => array(
				'type' => 'string'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'heading' => 'Transforming Healthcare with Genetic Insight',
				'headingTag' => 'h2',
				'description' => 'This is a sample preview content for this block in the inserter.',
				'blockId' => 1
			)
		)
	),
	'two-column-solution-card-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/two-column-solution-card-item',
		'title' => 'Solution Card',
		'category' => 'ambrygen',
		'parent' => array(
			'ambrygen/two-column-solution-card'
		),
		'icon' => 'format-image',
		'description' => 'Single image card for three column grid.',
		'attributes' => array(
			'sectiontitle' => array(
				'type' => 'string'
			),
			'description' => array(
				'type' => 'string'
			),
			'imageUrl' => array(
				'type' => 'string'
			),
			'imageAlt' => array(
				'type' => 'string'
			),
			'imageId' => array(
				'type' => 'number'
			),
			'cta' => array(
				'type' => 'object',
				'default' => array(
					'url' => '',
					'text' => '',
					'target' => '',
					'rel' => '',
					'variant' => ''
				)
			),
			'type' => array(
				'type' => 'string',
				'default' => 'small'
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'sectiontitle' => 'Sample Title',
				'description' => 'This is a sample preview content for this block in the inserter.',
				'imageUrl' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'imageAlt' => 'Ambry default preview image',
				'imageId' => 1,
				'cta' => array(
					'url' => 'Sample url',
					'text' => 'Sample text',
					'target' => 'Sample target',
					'rel' => 'Sample rel',
					'variant' => 'Sample variant'
				),
				'type' => 'small'
			)
		)
	),
	'two-column-tab-with-image' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/two-column-tab-with-image',
		'title' => 'Two Column Tab Content with Image',
		'category' => 'ambrygen',
		'icon' => 'columns',
		'description' => 'A layout with two stacked cards on the left and one large featured card on the right.',
		'supports' => array(
			'html' => false
		),
		'keywords' => array(
			'cards',
			'genetic',
			'layout',
			'grid'
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'blockId' => array(
				'type' => 'string'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'heading' => 'Transforming Healthcare with Genetic Insight',
				'headingTag' => 'h2',
				'description' => 'This is a sample preview content for this block in the inserter.',
				'blockId' => 1
			)
		)
	),
	'two-column-tab-with-image-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/two-column-tab-with-image-item',
		'title' => 'Tab Content with Image Item',
		'category' => 'ambrygen',
		'parent' => array(
			'ambrygen/two-column-tab-with-image'
		),
		'icon' => 'format-image',
		'description' => 'Single image card for three column grid.',
		'attributes' => array(
			'sectiontitle' => array(
				'type' => 'string'
			),
			'description' => array(
				'type' => 'string'
			),
			'imageUrl' => array(
				'type' => 'string'
			),
			'imageAlt' => array(
				'type' => 'string'
			),
			'imageId' => array(
				'type' => 'number'
			),
			'customStepLabel' => array(
				'type' => 'string',
				'default' => ''
			),
			'cta' => array(
				'type' => 'object',
				'default' => array(
					'url' => '',
					'text' => '',
					'target' => '',
					'rel' => '',
					'variant' => ''
				)
			),
			'type' => array(
				'type' => 'string',
				'default' => 'small'
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'sectiontitle' => 'Sample Title',
				'description' => 'This is a sample preview content for this block in the inserter.',
				'imageUrl' => 'https://ambry-1-develop.go-vip.net/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'imageAlt' => 'Ambry default preview image',
				'imageId' => 1,
				'customStepLabel' => 'Sample customStepLabel',
				'cta' => array(
					'url' => 'Sample url',
					'text' => 'Sample text',
					'target' => 'Sample target',
					'rel' => 'Sample rel',
					'variant' => 'Sample variant'
				),
				'type' => 'small'
			)
		)
	)
);
