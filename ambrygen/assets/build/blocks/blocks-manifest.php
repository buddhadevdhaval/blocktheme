<?php
// This file is generated. Do not modify it manually.
return array(
	'additional-links' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/additional-links',
		'title' => 'Additional Links',
		'category' => 'layout',
		'icon' => 'align-wide',
		'description' => 'A block with heading, editor, image, and left/right layout.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => 'h2'
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'content' => array(
				'type' => 'string',
				'source' => 'html',
				'selector' => 'div.content'
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
			'imagePosition' => array(
				'type' => 'string',
				'default' => 'left'
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'ai-health-hero' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/ai-health-hero',
		'title' => 'AI Health Hero',
		'category' => 'design',
		'icon' => 'heart',
		'description' => 'Hero section with AI healthcare visuals, stats counters, and flexible media placement.',
		'supports' => array(
			'html' => false,
			'spacing' => array(
				'margin' => true,
				'padding' => true
			),
			'__experimentalLayout' => array(
				'allowSwitching' => false,
				'allowInheriting' => false
			)
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
						'number' => '',
						'prefix' => '',
						'suffix' => '',
						'label' => ''
					),
					array(
						'number' => '',
						'prefix' => '',
						'suffix' => '',
						'label' => ''
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
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'viewScript' => 'file:./view.js'
	),
	'faq-with-image' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/faq-with-image',
		'title' => 'FAQ with Image',
		'category' => 'design',
		'icon' => 'editor-help',
		'description' => 'FAQ section with image and background color.',
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
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	),
	'genetic-testing' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/genetic-testing',
		'title' => 'Genetic Testing Info',
		'category' => 'design',
		'icon' => 'video-alt3',
		'description' => 'Genetic testing section with video iFrame and description.',
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
	'hero' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/hero',
		'version' => '2.0.0',
		'title' => 'Hero',
		'category' => 'widgets',
		'icon' => 'smiley',
		'description' => 'Hero block with customizable heading and content',
		'example' => array(
			
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => 'Hero Title'
			),
			'content' => array(
				'type' => 'string',
				'default' => 'Hero content goes here'
			)
		),
		'supports' => array(
			'html' => false,
			'align' => true,
			'color' => array(
				'text' => true,
				'background' => true
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'hero-banner' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/hero-banner',
		'title' => 'Hero Banner',
		'category' => 'design',
		'icon' => 'email',
		'description' => 'Banner block with text and image for Hero section.',
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
	'image-grid' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/image-grid',
		'title' => 'Image Grid',
		'category' => 'design',
		'icon' => 'grid-view',
		'description' => 'A block to show multiple images in a grid with title and link.',
		'textdomain' => 'ambrygen-web',
		'supports' => array(
			'html' => false
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'attributes' => array(
			'columns' => array(
				'type' => 'number',
				'default' => 2
			),
			'items' => array(
				'type' => 'array',
				'default' => array(
					array(
						'imageUrl' => '',
						'imageId' => 0,
						'title' => 'Grid Item Title',
						'link' => ''
					)
				)
			)
		)
	),
	'left-right-content' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/left-right-content',
		'title' => 'Left Right Content',
		'category' => 'design',
		'icon' => 'align-wide',
		'description' => 'A block with heading, content, image, and left/right layout.',
		'textdomain' => 'ambrygen-web',
		'supports' => array(
			'html' => false
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
			)
		)
	),
	'newsletter-signup' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/newsletter-signup',
		'title' => 'Newsletter Signup',
		'category' => 'design',
		'icon' => 'email',
		'description' => 'Newsletter signup layout with image + heading.',
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
	)
);
