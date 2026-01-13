<?php
// This file is generated. Do not modify it manually.
return array(
	'additional-links' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
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
			'imagePosition' => array(
				'type' => 'string',
				'default' => 'left'
			)
		),
		'textdomain' => 'ambrygen-vip-web',
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
			'counter1Number' => array(
				'type' => 'string',
				'default' => '100'
			),
			'counter1Prefix' => array(
				'type' => 'string',
				'default' => ''
			),
			'counter1Suffix' => array(
				'type' => 'string',
				'default' => ''
			),
			'counter1Label' => array(
				'type' => 'string',
				'default' => 'Publications'
			),
			'counter2Number' => array(
				'type' => 'string',
				'default' => '50'
			),
			'counter2Prefix' => array(
				'type' => 'string',
				'default' => ''
			),
			'counter2Suffix' => array(
				'type' => 'string',
				'default' => '+'
			),
			'counter2Label' => array(
				'type' => 'string',
				'default' => 'Partners'
			),
			'counter3Number' => array(
				'type' => 'string',
				'default' => ''
			),
			'counter3Prefix' => array(
				'type' => 'string',
				'default' => ''
			),
			'counter3Suffix' => array(
				'type' => 'string',
				'default' => ''
			),
			'counter3Label' => array(
				'type' => 'string',
				'default' => ''
			),
			'counter4Number' => array(
				'type' => 'string',
				'default' => ''
			),
			'counter4Prefix' => array(
				'type' => 'string',
				'default' => ''
			),
			'counter4Suffix' => array(
				'type' => 'string',
				'default' => ''
			),
			'counter4Label' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageTop' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageBottom' => array(
				'type' => 'string',
				'default' => ''
			),
			'logoImage' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen',
		'viewScript' => 'file:./view.js'
	),
	'faq-with-image' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
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
	'genetic-testing' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
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
		'textdomain' => 'ambrygen-vip-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'hero-banner' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
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
		'apiVersion' => 2,
		'name' => 'ambrygen/image-grid',
		'title' => 'Image Grid',
		'category' => 'ambrygen',
		'icon' => 'grid-view',
		'description' => 'A block to show multiple images in a grid with title and link.',
		'textdomain' => 'ambrygen-vip-web',
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
						'title' => 'Grid Item Title',
						'link' => ''
					)
				)
			)
		)
	),
	'left-right-content' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
		'name' => 'ambrygen/left-right-content',
		'title' => 'Left Right Content',
		'category' => 'ambrygen',
		'icon' => 'align-wide',
		'description' => 'A block with heading, content, image, and left/right layout.',
		'textdomain' => 'ambrygen-vip-web',
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
			'imagePosition' => array(
				'type' => 'string',
				'default' => 'left'
			)
		)
	),
	'mega-menu-item' => array(
		'apiVersion' => 3,
		'name' => 'ambrygen/mega-menu-item',
		'title' => 'Mega Menu Item',
		'category' => 'design',
		'icon' => 'menu',
		'description' => 'Navigation item with mega menu dropdown.',
		'parent' => array(
			'core/navigation'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'attributes' => array(
			'label' => array(
				'type' => 'string',
				'default' => ''
			),
			'templatePart' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'textdomain' => 'ambrygen-vip-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'newsletter-signup' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
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
	'testimonial' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/testimonial',
		'title' => 'Testimonial Block',
		'category' => 'widgets',
		'icon' => 'admin-comments',
		'description' => 'Display selected testimonials from the testimonial post type.',
		'keywords' => array(
			'testimonial',
			'review',
			'feedback'
		),
		'version' => '1.0.0',
		'textdomain' => 'ambrygen-vip-web',
		'supports' => array(
			'html' => true,
			'align' => array(
				'wide',
				'full'
			)
		),
		'attributes' => array(
			'selectedTestimonials' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'number'
				)
			),
			'testimonialsData' => array(
				'type' => 'array',
				'default' => array(
					
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js'
	)
);
