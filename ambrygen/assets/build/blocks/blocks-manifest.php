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
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
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
				'description' => ''
			)
		)
	),
	'additional-links-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/additional-links-item',
		'title' => 'Item',
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
					'text' => '',
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
					'url' => 'https://example.com/icon.svg',
					'id' => 0,
					'alt' => 'Example icon'
				),
				'cta' => array(
					'text' => 'Learn More',
					'url' => 'https://example.com',
					'target' => '_self',
					'rel' => '',
					'variant' => 'dark'
				)
			)
		)
	),
	'awards-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/awards-block',
		'title' => 'Awards Block',
		'category' => 'ambrygen',
		'icon' => 'awards',
		'description' => 'Awards content block with description, CTAs, and award logo listing.',
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
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php',
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
				'type' => 'string',
				'default' => 'Awards'
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'awards' => array(
				'type' => 'array',
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'id' => array(
							'type' => 'string'
						),
						'imageId' => array(
							'type' => 'number'
						),
						'imageUrl' => array(
							'type' => 'string'
						),
						'imageAlt' => array(
							'type' => 'string'
						)
					)
				),
				'default' => array(
					
				)
			),
			'autoplay' => array(
				'type' => 'boolean',
				'default' => false
			),
			'showNavigation' => array(
				'type' => 'boolean',
				'default' => true
			),
			'showPagination' => array(
				'type' => 'boolean',
				'default' => true
			),
			'slidesPerView' => array(
				'type' => 'number',
				'default' => 4
			),
			'isHeaderVertical' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'example' => array(
			'attributes' => array(
				'title' => 'Awards',
				'description' => '<p>Recognition and awards from our team and community.</p>'
			)
		)
	),
	'card-result-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/card-result-block',
		'title' => 'Card Result Block',
		'category' => 'ambrygen',
		'icon' => 'columns',
		'description' => 'Section block for result meaning cards.',
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
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'eyebrowText' => array(
				'type' => 'string',
				'default' => 'Understanding Results'
			),
			'heading' => array(
				'type' => 'string',
				'default' => 'What your result actually means'
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'subtitle' => array(
				'type' => 'string',
				'default' => 'Results from hereditary cancer genetic testing fall into one of three categories. Here\'s what each one means in plain language.'
			),
			'footContent' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'card-result-block-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/card-result-block-item',
		'title' => 'Card Result Block Item',
		'category' => 'ambrygen',
		'parent' => array(
			'ambrygen/card-result-block'
		),
		'icon' => 'index-card',
		'description' => 'Single result card item.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'default' => 'Negative'
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h3'
			),
			'summary' => array(
				'type' => 'string',
				'default' => ''
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'cardVariant' => array(
				'type' => 'string',
				'default' => 'negative'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'careers' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/careers',
		'title' => 'Careers',
		'category' => 'ambrygen',
		'icon' => 'groups',
		'description' => 'Parent block for careers',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
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
				'enum' => array(
					'mp4',
					'embed'
				),
				'default' => 'mp4'
			),
			'videoPoster' => array(
				'type' => 'object',
				'default' => null
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
			'joblocationicon' => array(
				'type' => 'object',
				'default' => null
			),
			'jobtypeicon' => array(
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
				'blockId' => 'careers-example'
			)
		)
	),
	'collaborator-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/collaborator-item',
		'title' => 'Collaborator Item',
		'category' => 'ambrygen',
		'icon' => 'networking',
		'parent' => array(
			'ambrygen/collaborators'
		),
		'attributes' => array(
			'termId' => array(
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
				'termId' => 1
			)
		)
	),
	'collaborators' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/collaborators',
		'title' => 'Collaborators',
		'category' => 'ambrygen',
		'icon' => 'networking',
		'description' => 'Parent block for collaborator taxonomy cards.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
				'type' => 'string',
				'default' => 'Collaborators'
			),
			'intro' => array(
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
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'title' => 'Collaborators',
				'intro' => '',
				'headingLevel' => 'h2'
			)
		)
	),
	'collaborators-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/collaborators-item',
		'title' => 'Collaborator Link Item',
		'category' => 'ambrygen',
		'icon' => 'admin-links',
		'parent' => array(
			'ambrygen/collaborators-list'
		),
		'description' => 'An individual collaborator link item.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'attributes' => array(
			'text' => array(
				'type' => 'string',
				'default' => 'Collaborator Name'
			),
			'url' => array(
				'type' => 'string',
				'default' => ''
			),
			'linkTarget' => array(
				'type' => 'string',
				'default' => '_blank'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php'
	),
	'collaborators-list' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/collaborators-list',
		'title' => 'Collaborators List',
		'category' => 'ambrygen',
		'icon' => 'list-view',
		'description' => 'A list of collaborators with external links.',
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'align' => array(
				'wide',
				'full'
			)
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'default' => 'Additional Collaborations'
			),
			'isOpen' => array(
				'type' => 'boolean',
				'default' => true
			),
			'selectionMode' => array(
				'type' => 'string',
				'default' => 'manual'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php',
		'viewScript' => 'file:./view.js'
	),
	'conference-experts' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/conference-experts',
		'version' => '1.0.0',
		'title' => 'Conference Experts',
		'category' => 'ambrygen',
		'icon' => 'businessperson',
		'description' => 'Dynamic block that renders experts linked to a conference event.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'conference-hero-content' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/conference-hero-content',
		'version' => '1.0.0',
		'title' => 'Conference Hero Content',
		'category' => 'ambrygen',
		'description' => 'Renders hero content for conference post.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'conference-intro' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/conference-intro',
		'version' => '1.0.0',
		'title' => 'Conference Intro',
		'category' => 'ambrygen',
		'description' => 'Renders conference intro text.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'conference-linked-posts-tabs' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/conference-linked-posts-tabs',
		'version' => '1.0.0',
		'title' => 'Conference Linked Posts Tabs',
		'category' => 'ambrygen',
		'description' => 'Renders tabs for linked presentations and posters.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'conference-overview-agenda' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/conference-overview-agenda',
		'version' => '1.0.0',
		'title' => 'Conference Overview Agenda',
		'category' => 'ambrygen',
		'description' => 'Renders a consolidated agenda for the conference.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'conference-posters' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/conference-posters',
		'version' => '1.0.0',
		'title' => 'Conference Posters',
		'category' => 'ambrygen',
		'description' => 'Renders linked posters list.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'conference-presentations' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/conference-presentations',
		'version' => '1.0.0',
		'title' => 'Conference Presentations',
		'category' => 'ambrygen',
		'description' => 'Renders linked presentations list.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'conference-tabs-nav' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/conference-tabs-nav',
		'version' => '1.0.0',
		'title' => 'Conference Tabs Nav',
		'category' => 'ambrygen',
		'description' => 'Renders tabs navigation for conference pages.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'counter-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/counter-block',
		'title' => 'Counter Block',
		'category' => 'ambrygen',
		'icon' => 'chart-bar',
		'description' => 'Displays a grid of counters with titles and descriptions.',
		'supports' => array(
			'html' => false
		),
		'keywords' => array(
			'counter',
			'statistics',
			'numbers'
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'variation' => array(
				'type' => 'string',
				'default' => 'variation-1'
			),
			'counters' => array(
				'type' => 'array',
				'default' => array(
					array(
						'id' => 'counter-1',
						'number' => '20,000',
						'numberSm' => '',
						'numberLg2' => '',
						'suffix' => '',
						'title' => 'Cases',
						'description' => 'In landmark methodology study (2016)'
					),
					array(
						'id' => 'counter-2',
						'number' => '60,000',
						'numberSm' => '',
						'numberLg2' => '',
						'suffix' => '',
						'title' => 'Square feet',
						'description' => 'State-of-the-art, CLIA/CAP certified custom facility'
					),
					array(
						'id' => 'counter-3',
						'number' => '25',
						'numberSm' => '',
						'numberLg2' => '',
						'suffix' => '+',
						'title' => 'Years',
						'description' => 'Pioneering genetic diagnostics since 1999'
					)
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'id' => array(
							'type' => 'string'
						),
						'number' => array(
							'type' => 'string'
						),
						'numberSm' => array(
							'type' => 'string'
						),
						'numberLg2' => array(
							'type' => 'string'
						),
						'suffix' => array(
							'type' => 'string'
						),
						'title' => array(
							'type' => 'string'
						),
						'description' => array(
							'type' => 'string'
						)
					)
				)
			)
		),
		'example' => array(
			'attributes' => array(
				'counters' => array(
					array(
						'id' => 'counter-example-1',
						'number' => '20,000',
						'suffix' => '',
						'title' => 'Cases',
						'description' => 'In landmark methodology study (2016)'
					),
					array(
						'id' => 'counter-example-2',
						'number' => '60,000',
						'suffix' => '',
						'title' => 'Square feet',
						'description' => 'State-of-the-art, CLIA/CAP certified custom facility'
					)
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'cta-block' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/cta-block',
		'title' => 'CTA Block',
		'category' => 'ambrygen',
		'icon' => 'megaphone',
		'description' => 'Mid-page Call to Action with title and two buttons',
		'supports' => array(
			'html' => false,
			'anchor' => true
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'default' => 'Learn More About Gene-Disease Validity Assessments in Hereditary Cancer Testing'
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'buttons' => array(
				'type' => 'array',
				'default' => array(
					array(
						'text' => 'Primary Default Button',
						'url' => '',
						'variant' => 'site-btn has-right-arrow'
					),
					array(
						'text' => 'Tertiary Default Button',
						'url' => '',
						'variant' => 'site-btn is-style-site-tertiary-btn has-right-arrow'
					)
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php'
	),
	'cta-tiles' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/cta-tiles',
		'title' => 'CTA Tiles',
		'category' => 'ambrygen',
		'icon' => 'grid-view',
		'description' => 'Responsive CTA tiles with design variants.',
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
			'variation' => array(
				'type' => 'string',
				'default' => 'image-only-title',
				'enum' => array(
					'image-only-title',
					'image-title-description-icon',
					'image-title-description'
				)
			),
			'topImageID' => array(
				'type' => 'number',
				'default' => null
			),
			'topImageURL' => array(
				'type' => 'string',
				'default' => ''
			),
			'topImageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'blockId' => array(
				'type' => 'string'
			)
		),
		'providesContext' => array(
			'ambrygen/ctaTilesVariation' => 'variation'
		),
		'example' => array(
			'attributes' => array(
				'blockId' => 'cta-tiles-example'
			)
		)
	),
	'cta-tiles-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/cta-tiles-item',
		'title' => 'Tiles Item',
		'textdomain' => 'ambrygen-web',
		'parent' => array(
			'ambrygen/cta-tiles'
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
				'default' => 0
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
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				),
				'default' => 'h5'
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'link' => array(
				'type' => 'object',
				'properties' => array(
					'url' => array(
						'type' => 'string'
					),
					'text' => array(
						'type' => 'string'
					),
					'target' => array(
						'type' => 'string'
					),
					'rel' => array(
						'type' => 'string'
					),
					'variant' => array(
						'type' => 'string'
					)
				),
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
			'ambrygen/ctaTilesVariation'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'imageUrl' => '',
				'imageID' => 0,
				'imageAlt' => '',
				'imageSrcSet' => '',
				'imageSizes' => '',
				'title' => 'Sample Title',
				'headingTag' => 'h5',
				'description' => 'This is a sample preview content for this block in the inserter.',
				'link' => array(
					'url' => 'https://example.com/',
					'text' => 'Sample text',
					'target' => '',
					'rel' => '',
					'variant' => 'dark'
				)
			)
		)
	),
	'cta-tiles-with-3-card' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/cta-tiles-with-3-card',
		'title' => 'CTA Tiles with 3 Card',
		'category' => 'ambrygen',
		'icon' => 'grid-view',
		'description' => '',
		'supports' => array(
			'html' => false
		),
		'keywords' => array(
			'cta',
			'tiles',
			'cards',
			'grid'
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'sectionTitle' => array(
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
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'blockId' => 'cta-tiles-with-3-card-example'
			)
		)
	),
	'cta-tiles-with-3-card-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/cta-tiles-with-3-card-item',
		'title' => 'CTA Tiles with 3 Card Item',
		'category' => 'ambrygen',
		'parent' => array(
			'ambrygen/cta-tiles-with-3-card'
		),
		'icon' => 'format-image',
		'description' => 'An individual CTA tiles with 3 card item block.',
		'supports' => array(
			'html' => false
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
				'properties' => array(
					'url' => array(
						'type' => 'string'
					),
					'text' => array(
						'type' => 'string'
					),
					'target' => array(
						'type' => 'string'
					),
					'rel' => array(
						'type' => 'string'
					),
					'variant' => array(
						'type' => 'string'
					)
				),
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
				'enum' => array(
					'small',
					'main'
				),
				'default' => 'small'
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'disclaimer-note' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/disclaimer-note',
		'title' => 'Disclaimer Note',
		'category' => 'ambrygen',
		'icon' => 'info',
		'description' => 'Display a medical disclaimer for blog posts.',
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
				'default' => 'DISCLAIMER: THIS BLOG DOES NOT PROVIDE MEDICAL ADVICE'
			),
			'content' => array(
				'type' => 'string',
				'default' => 'The information contained in this article is intended for informational and educational purposes only and does not constitute medical advice, diagnosis, or treatment. Always consult with a qualified healthcare professional or genetic counselor before making any decisions related to genetic testing or your personal health. Individual results may vary. Ambry Genetics does not provide direct-to-consumer genetic testing services.'
			)
		),
		'example' => array(
			'attributes' => array(
				'heading' => 'DISCLAIMER: THIS BLOG DOES NOT PROVIDE MEDICAL ADVICE',
				'content' => 'The information contained in this article is intended for informational and educational purposes only and does not constitute medical advice, diagnosis, or treatment.'
			)
		)
	),
	'event-grid-card' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/event-grid-card',
		'version' => '1.0.0',
		'title' => 'Event Grid Card',
		'category' => 'ambrygen',
		'description' => 'Renders an event card for grid view.',
		'attributes' => array(
			'previewPostId' => array(
				'type' => 'number',
				'default' => 0
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'event-post-meta-list' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/event-post-meta-list',
		'version' => '1.0.0',
		'title' => 'Event Post Meta List',
		'category' => 'ambrygen',
		'description' => 'Renders a summary of event post meta.',
		'attributes' => array(
			'previewPostId' => array(
				'type' => 'number',
				'default' => 0
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'faq-accordion' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/faq-accordion',
		'title' => 'FAQ Accordion',
		'textdomain' => 'ambrygen-web',
		'category' => 'ambrygen',
		'icon' => 'editor-help',
		'description' => 'Interactive FAQ accordion with image and expandable questions.',
		'supports' => array(
			'html' => false,
			'anchor' => true
		),
		'attributes' => array(
			'blockId' => array(
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
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h5',
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				)
			),
			'variant' => array(
				'type' => 'string',
				'default' => 'default',
				'enum' => array(
					'default',
					'without-image'
				)
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
						'subHeading' => array(
							'type' => 'string'
						),
						'answer' => array(
							'type' => 'string'
						),
						'items' => array(
							'type' => 'array',
							'items' => array(
								'type' => 'object',
								'properties' => array(
									'id' => array(
										'type' => 'string'
									),
									'text' => array(
										'type' => 'string'
									)
								)
							)
						)
					)
				),
				'default' => array(
					array(
						'id' => '1',
						'question' => 'WHAT IS GENETIC TESTING?',
						'subHeading' => '',
						'answer' => 'Genetic testing involves examining your DNA, the chemical database that carries instructions for your body\'s functions. Genetic testing can reveal changes or alterations, called mutations, in your genes that may lead to illness or disease. (Source: Mayo Clinic)'
					),
					array(
						'id' => '2',
						'question' => 'IS GENETIC TESTING FOR EVERYONE?',
						'subHeading' => '',
						'answer' => 'Genetic testing involves examining your DNA, the chemical database that carries instructions for your body\'s functions. Genetic testing can reveal changes or alterations, called mutations, in your genes that may lead to illness or disease. (Source: Mayo Clinic)'
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
				'description' => 'Sample description below the title.',
				'headingTag' => 'h5',
				'variant' => 'default',
				'imageId' => 0,
				'faqs' => array(
					array(
						'id' => '1',
						'question' => 'WHAT IS GENETIC TESTING?',
						'subHeading' => '',
						'answer' => 'Genetic testing involves examining your DNA, the chemical database that carries instructions for your body\'s functions. Genetic testing can reveal changes or alterations, called mutations, in your genes that may lead to illness or disease. (Source: Mayo Clinic)'
					),
					array(
						'id' => '2',
						'question' => 'IS GENETIC TESTING FOR EVERYONE?',
						'subHeading' => '',
						'answer' => 'Genetic testing involves examining your DNA, the chemical database that carries instructions for your body\'s functions. Genetic testing can reveal changes or alterations, called mutations, in your genes that may lead to illness or disease. (Source: Mayo Clinic)'
					)
				)
			)
		)
	),
	'faq-accordion-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/faq-accordion-item',
		'title' => 'FAQ Accordion Item',
		'category' => 'ambrygen',
		'icon' => 'editor-help',
		'parent' => array(
			'ambrygen/faq-accordion'
		),
		'description' => 'Item block for the FAQ Accordion block.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'attributes' => array(
			'question' => array(
				'type' => 'string',
				'default' => ''
			),
			'subHeading' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'featured-blogs' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/featured-blogs',
		'title' => 'Featured Blogs',
		'category' => 'ambrygen',
		'icon' => 'text-page',
		'description' => 'Featured Blogs slider',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
				'type' => 'string',
				'default' => 'Featured Articles'
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
			),
			'selectedPosts' => array(
				'type' => 'array',
				'default' => array(
					
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'title' => 'Featured Articles',
				'headingLevel' => 'h2',
				'selectedPosts' => array(
					
				)
			)
		)
	),
	'featured-image-fallback' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/featured-image-fallback',
		'version' => '1.0.0',
		'title' => 'Featured Image Fallback',
		'category' => 'ambrygen',
		'description' => 'Renders featured image with fallback support.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'attributes' => array(
			'className' => array(
				'type' => 'string',
				'default' => ''
			),
			'sizeSlug' => array(
				'type' => 'string',
				'default' => 'full'
			),
			'isLink' => array(
				'type' => 'boolean',
				'default' => false
			),
			'previewPostId' => array(
				'type' => 'number',
				'default' => 0
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'flexible-content' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/flexible-content',
		'title' => 'Image Alongside Text',
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
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'heading' => array(
				'type' => 'string',
				'default' => ''
			),
			'subheading' => array(
				'type' => 'string',
				'default' => ''
			),
			'eyebrowText' => array(
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
			'backgroundImageUrl' => array(
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
			'topIconUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'topIconId' => array(
				'type' => 'number',
				'default' => 0
			),
			'topIconAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'imagePosition' => array(
				'type' => 'string',
				'default' => 'right'
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
			'contentTopAlign' => array(
				'type' => 'boolean',
				'default' => false
			),
			'variation' => array(
				'type' => 'string',
				'default' => 'default',
				'enum' => array(
					'default',
					'variation-process',
					'variation-iot-author'
				)
			),
			'content' => array(
				'type' => 'string',
				'default' => ''
			),
			'buttons' => array(
				'type' => 'array',
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'text' => array(
							'type' => 'string',
							'default' => ''
						),
						'url' => array(
							'type' => 'string',
							'default' => ''
						),
						'variant' => array(
							'type' => 'string',
							'default' => ''
						),
						'target' => array(
							'type' => 'string',
							'default' => ''
						),
						'rel' => array(
							'type' => 'string',
							'default' => ''
						)
					)
				),
				'default' => array(
					array(
						'text' => '',
						'url' => '',
						'variant' => 'site-btn',
						'target' => '',
						'rel' => ''
					),
					array(
						'text' => '',
						'url' => '',
						'variant' => 'site-btn is-style-site-tertiary-btn',
						'target' => '',
						'rel' => ''
					)
				)
			),
			'borderRequired' => array(
				'type' => 'boolean',
				'default' => false
			),
			'isOriginalImage' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'example' => array(
			'attributes' => array(
				'heading' => 'Transforming Healthcare with Genetic Insight',
				'subheading' => '',
				'headingTag' => 'h2',
				'imageUrl' => '/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'imageId' => 0,
				'imageAlt' => 'Ambry default preview image',
				'backgroundImageUrl' => '',
				'backgroundImageId' => 0,
				'backgroundImageAlt' => '',
				'topIconUrl' => '',
				'topIconId' => 0,
				'topIconAlt' => '',
				'imagePosition' => 'left',
				'layoutStyle' => 'standard',
				'contentAlignment' => 'left',
				'contentTopAlign' => false,
				'variation' => 'default',
				'content' => '',
				'buttons' => array(
					array(
						'text' => '',
						'url' => '',
						'variant' => 'site-btn',
						'target' => '',
						'rel' => ''
					),
					array(
						'text' => '',
						'url' => '',
						'variant' => 'site-btn is-style-site-tertiary-btn',
						'target' => '',
						'rel' => ''
					)
				)
			)
		)
	),
	'genes-table' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/genes-table',
		'title' => 'Genes Table',
		'category' => 'ambrygen',
		'icon' => 'editor-table',
		'description' => 'Search the gene taxonomy and render results in a table layout.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'cardTitle' => array(
				'type' => 'string',
				'default' => 'Exome & Microarray'
			),
			'placeholder' => array(
				'type' => 'string',
				'default' => 'Search genes…'
			),
			'defaultSymbols' => array(
				'type' => 'string',
				'default' => ''
			),
			'instructionText' => array(
				'type' => 'string',
				'default' => 'Please enter a comma-separated the list of genes to search for.'
			),
			'noResultsText' => array(
				'type' => 'string',
				'default' => 'No genes found'
			),
			'footnoteText' => array(
				'type' => 'string',
				'default' => '1 Total number of CDS with > 90% covered with at least 10x'
			),
			'taxonomy' => array(
				'type' => 'string',
				'default' => 'gene'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'cardTitle' => 'Exome & Microarray'
			)
		)
	),
	'genetic-testing-accordion' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/genetic-testing-accordion',
		'title' => 'Genetic Testing Accordion',
		'category' => 'ambrygen-web',
		'icon' => 'list-view',
		'description' => 'Displays selected genetic testing posts in a category-based accordion.',
		'supports' => array(
			'html' => false,
			'anchor' => true
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
				'type' => 'string',
				'default' => 'Genetic Testing'
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'title' => 'Genetic Testing'
			)
		)
	),
	'genetic-testing-accordion-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/genetic-testing-accordion-item',
		'title' => 'Genetic Test Selection',
		'category' => 'ambrygen-web',
		'icon' => 'plus-circle',
		'parent' => array(
			'ambrygen/genetic-testing-accordion'
		),
		'attributes' => array(
			'postId' => array(
				'type' => 'number'
			)
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'genetic-testing-description' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/genetic-testing-description',
		'version' => '1.0.0',
		'title' => 'Genetic Testing Description',
		'category' => 'ambrygen',
		'description' => 'Displays the post content with a conditional heading.',
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'genetic-testing-details' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/genetic-testing-details',
		'version' => '0.1.0',
		'title' => 'Genetic Testing Details',
		'category' => 'theme-blocks',
		'icon' => 'clipboard',
		'description' => 'Displays the dynamic intro, consider, and important sections for genetic testing posts.',
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'genetic-testing-downloads' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/genetic-testing-downloads',
		'version' => '1.0.0',
		'title' => 'Genetic Testing Downloads',
		'category' => 'ambrygen',
		'description' => 'Displays linked marketing materials as a list of downloads.',
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'genetic-testing-genes' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/genetic-testing-genes',
		'version' => '0.1.0',
		'title' => 'Genetic Testing Genes',
		'category' => 'theme-blocks',
		'icon' => 'list-view',
		'description' => 'Displays the dynamic \'Genes analyzed\' accordion for linked products.',
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'genetic-testing-quick-reference' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/genetic-testing-quick-reference',
		'version' => '1.0.0',
		'title' => 'Genetic Testing Quick Reference',
		'category' => 'ambrygen',
		'description' => 'Displays custom data for the genetic testing post.',
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
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
			),
			'modalPosition' => array(
				'type' => 'string',
				'default' => 'center'
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
	'headline-alongside-text' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/headline-alongside-text',
		'title' => 'Headline Alongside Text',
		'category' => 'ambrygen',
		'icon' => 'align-pull-left',
		'description' => 'Headline alongside supporting text with optional background image.',
		'supports' => array(
			'html' => false,
			'color' => array(
				'background' => true,
				'text' => true
			)
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'headline' => array(
				'type' => 'string',
				'default' => ''
			),
			'headlineTag' => array(
				'type' => 'string',
				'default' => 'h2',
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				)
			),
			'title' => array(
				'type' => 'string',
				'default' => ''
			),
			'titleTag' => array(
				'type' => 'string',
				'default' => 'h2',
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				)
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
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
			'isHeaderVertical' => array(
				'type' => 'boolean',
				'default' => false
			),
			'isMediumText' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'blockId' => 'headline-alongside-text-example'
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
			'html' => false
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
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'backgroundImage' => array(
							'type' => 'string',
							'default' => ''
						),
						'backgroundImageId' => array(
							'type' => 'integer',
							'default' => 0
						),
						'backgroundImageAlt' => array(
							'type' => 'string',
							'default' => ''
						),
						'overlayImage1' => array(
							'type' => 'string',
							'default' => ''
						),
						'overlayImage1Id' => array(
							'type' => 'integer',
							'default' => 0
						),
						'overlayImage1Alt' => array(
							'type' => 'string',
							'default' => ''
						),
						'overlayImage2' => array(
							'type' => 'string',
							'default' => ''
						),
						'overlayImage2Id' => array(
							'type' => 'integer',
							'default' => 0
						),
						'overlayImage2Alt' => array(
							'type' => 'string',
							'default' => ''
						),
						'eyebrow' => array(
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
						'heading' => array(
							'type' => 'string',
							'default' => ''
						),
						'content' => array(
							'type' => 'string',
							'default' => ''
						),
						'primarybutton' => array(
							'type' => 'object',
							'properties' => array(
								'url' => array(
									'type' => 'string',
									'default' => ''
								),
								'text' => array(
									'type' => 'string',
									'default' => ''
								),
								'target' => array(
									'type' => 'string',
									'default' => ''
								),
								'rel' => array(
									'type' => 'string',
									'default' => ''
								),
								'variant' => array(
									'type' => 'string',
									'default' => 'is-style-site-tertiary-btn'
								)
							)
						),
						'secondarybutton' => array(
							'type' => 'object',
							'properties' => array(
								'url' => array(
									'type' => 'string',
									'default' => ''
								),
								'text' => array(
									'type' => 'string',
									'default' => ''
								),
								'target' => array(
									'type' => 'string',
									'default' => ''
								),
								'rel' => array(
									'type' => 'string',
									'default' => ''
								),
								'variant' => array(
									'type' => 'string',
									'default' => 'dark'
								)
							)
						)
					)
				),
				'default' => array(
					
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
				'default' => true
			),
			'autoplayDelay' => array(
				'type' => 'number',
				'default' => 5000
			),
			'showSmallImage' => array(
				'type' => 'boolean',
				'default' => false
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
						'primarybutton' => array(
							'url' => '#',
							'text' => 'Start Your Order',
							'target' => '',
							'rel' => '',
							'variant' => 'is-style-site-tertiary-btn'
						),
						'secondarybutton' => array(
							'url' => '#',
							'text' => 'Who We Are',
							'target' => '',
							'rel' => '',
							'variant' => 'dark'
						)
					)
				),
				'showSliderNav' => true,
				'showSliderDots' => true,
				'autoplay' => true,
				'autoplayDelay' => 5000,
				'showSmallImage' => false
			)
		)
	),
	'icon-card-grid' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/icon-card-grid',
		'title' => 'Icon Card Grid',
		'category' => 'ambrygen',
		'icon' => 'grid-view',
		'description' => 'A section header followed by a grid of icon cards.',
		'textdomain' => 'ambrygen-web',
		'supports' => array(
			'html' => false
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'attributes' => array(
			'tagline' => array(
				'type' => 'string',
				'default' => 'Who Should Consider Testing?'
			),
			'heading' => array(
				'type' => 'string',
				'default' => 'Situations where genetic testing may be helpful'
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
			),
			'description' => array(
				'type' => 'string',
				'default' => 'Unlike some conditions with clear risk checklists, neurological disorders don\'t follow a single pattern. Instead, testing is helpful in a range of situations. Select those that apply to your family.'
			),
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'example' => array(
			'attributes' => array(
				'tagline' => 'Who Should Consider Testing?',
				'heading' => 'Situations where genetic testing may be helpful',
				'headingLevel' => 'h2',
				'description' => 'Unlike some conditions with clear risk checklists, neurological disorders don\'t follow a single pattern. Instead, testing is helpful in a range of situations. Select those that apply to your family.'
			)
		)
	),
	'icon-card-grid-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/icon-card-grid-item',
		'title' => 'Icon Card Grid Item',
		'category' => 'ambrygen',
		'icon' => 'format-image',
		'parent' => array(
			'ambrygen/icon-card-grid'
		),
		'description' => 'A single card for the Icon Card Grid block.',
		'textdomain' => 'ambrygen-web',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'attributes' => array(
			'iconId' => array(
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
			)
		)
	),
	'icon-grids' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/icon-grids',
		'title' => 'Genetic Testing',
		'category' => 'ambrygen',
		'icon' => 'grid-view',
		'description' => 'Grid layout for icon cards with contact information',
		'supports' => array(
			'html' => false
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
						'text' => 'All Products',
						'termSlug' => 'all'
					)
				)
			),
			'isLargeIcon' => array(
				'type' => 'boolean',
				'default' => false
			),
			'backgroundImage' => array(
				'type' => 'object',
				'default' => array(
					'url' => '',
					'id' => 0,
					'alt' => ''
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
		'title' => 'Grid Item',
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
			),
			'count' => array(
				'type' => 'string',
				'default' => ''
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
		)
	),
	'latest-blogs' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/latest-blogs',
		'title' => 'Latest Blogs',
		'category' => 'ambrygen',
		'icon' => 'welcome-widgets-menus',
		'description' => 'Displays latest blogs with tag and category filters.',
		'supports' => array(
			'html' => false,
			'anchor' => true,
			'align' => array(
				'wide',
				'full'
			)
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
				'type' => 'string',
				'default' => 'Latest Articles'
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
			),
			'postsPerPage' => array(
				'type' => 'number',
				'default' => 9
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./editor.scss',
		'style' => 'file:./style.scss',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'link-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/link-item',
		'parent' => array(
			'ambrygen/link-list'
		),
		'version' => '0.1.0',
		'title' => 'Link Item',
		'category' => 'ambrygen',
		'attributes' => array(
			'cta' => array(
				'type' => 'object',
				'default' => array(
					'text' => 'Link Item',
					'url' => '#',
					'target' => '',
					'rel' => ''
				)
			)
		),
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'style' => 'file:./style.scss',
		'render' => 'file:./render.php'
	),
	'link-list' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/link-list',
		'version' => '0.1.0',
		'title' => 'Link List',
		'category' => 'ambrygen',
		'description' => 'A list of resource downloads with a side heading.',
		'attributes' => array(
			'kicker' => array(
				'type' => 'string',
				'default' => 'Resources & Downloads'
			),
			'title' => array(
				'type' => 'string',
				'default' => 'Resources & Downloads'
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'content' => array(
				'type' => 'string',
				'default' => ''
			),
			'blockId' => array(
				'type' => 'string'
			)
		),
		'supports' => array(
			'html' => false,
			'anchor' => true
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php'
	),
	'linked-authors' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/linked-authors',
		'title' => 'Linked Authors',
		'category' => 'ambrygen',
		'description' => 'Displays authors linked to a post via relationship meta.',
		'textdomain' => 'ambrygen-web',
		'supports' => array(
			'html' => false,
			'anchor' => true
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string'
			),
			'showExcerpt' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'render' => 'file:./render.php'
	),
	'location-map' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/location-map',
		'title' => 'Location Map',
		'textdomain' => 'ambrygen-web',
		'category' => 'ambrygen',
		'icon' => 'location-alt',
		'description' => 'Block with Google Maps and location list',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
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
						'id' => 'loc-headquarters',
						'name' => 'Headquarters',
						'address' => '1 Enterprise, Aliso Viejo, CA 92656'
					),
					array(
						'id' => 'loc-lab',
						'name' => 'Lab (For specimen shipments)',
						'address' => '7 Argonaut, Aliso Viejo, CA 92656'
					)
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'id' => array(
							'type' => 'string'
						),
						'name' => array(
							'type' => 'string'
						),
						'address' => array(
							'type' => 'string'
						)
					)
				)
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
						'id' => 'loc-headquarters',
						'name' => 'Headquarters',
						'address' => '1 Enterprise, Aliso Viejo, CA 92656'
					),
					array(
						'id' => 'loc-lab',
						'name' => 'Lab (For specimen shipments)',
						'address' => '7 Argonaut, Aliso Viejo, CA 92656'
					)
				),
				'headingLevel' => 'h2'
			)
		)
	),
	'logo-section' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/logo-section',
		'title' => 'Logo Section',
		'category' => 'ambrygen',
		'icon' => 'format-image',
		'description' => 'Logo usage section with downloads and guidelines.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'sectionTitle' => array(
				'type' => 'string',
				'default' => 'Logo'
			),
			'sectionTitleTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'logoImageUrl' => array(
				'type' => 'string'
			),
			'logoImageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'logoImageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'downloads' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'group' => array(
							'type' => 'string'
						),
						'label' => array(
							'type' => 'string'
						),
						'fileUrl' => array(
							'type' => 'string'
						),
						'fileId' => array(
							'type' => 'number'
						)
					)
				)
			),
			'leftItems' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'title' => array(
							'type' => 'string'
						),
						'description' => array(
							'type' => 'string'
						),
						'imageUrl' => array(
							'type' => 'string'
						),
						'imageId' => array(
							'type' => 'number'
						),
						'imageAlt' => array(
							'type' => 'string'
						),
						'secondaryImageUrl' => array(
							'type' => 'string'
						),
						'secondaryImageId' => array(
							'type' => 'number'
						),
						'secondaryImageAlt' => array(
							'type' => 'string'
						)
					)
				)
			),
			'rightTitle' => array(
				'type' => 'string',
				'default' => 'Using the Logo'
			),
			'rightContent' => array(
				'type' => 'string',
				'default' => ''
			),
			'rightSections' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'title' => array(
							'type' => 'string'
						),
						'content' => array(
							'type' => 'string'
						),
						'listItems' => array(
							'type' => 'array',
							'items' => array(
								'type' => 'string'
							)
						)
					)
				)
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'sectionTitle' => 'Logo',
				'sectionTitleTag' => 'h2',
				'logoImageId' => 0,
				'downloads' => array(
					array(
						'group' => 'web',
						'label' => 'JPG',
						'fileUrl' => '#',
						'fileId' => 0
					),
					array(
						'group' => 'web',
						'label' => 'PNG',
						'fileUrl' => '#',
						'fileId' => 0
					),
					array(
						'group' => 'print',
						'label' => 'PDF',
						'fileUrl' => '#',
						'fileId' => 0
					)
				),
				'leftItems' => array(
					array(
						'title' => 'Clear Space',
						'description' => 'Maintain clear space around the logo.',
						'imageId' => 0
					),
					array(
						'title' => 'Minimum Size',
						'description' => 'Do not print smaller than the minimum width.',
						'imageId' => 0
					)
				),
				'rightTitle' => 'Using the Logo',
				'rightContent' => 'It is important to pay attention to clear space and size standards.',
				'rightSections' => array(
					array(
						'title' => 'Using the Logo',
						'content' => 'It is important to pay attention to the clear space and minimum and maximum size standards.'
					),
					array(
						'title' => 'Clear Space',
						'content' => 'The logo should have a minimum amount of clear space around it (see example). No content, art or other imagery should impinge on this clear space.'
					)
				)
			)
		)
	),
	'marketing-files' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/marketing-files',
		'title' => 'Marketing Files',
		'category' => 'ambrygen',
		'icon' => 'media-document',
		'description' => 'Lists marketing material titles for a selected category and links each title to the latest uploaded file.',
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
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
				'type' => 'string',
				'default' => 'Marketing Files'
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'selectedCategory' => array(
				'type' => 'object',
				'default' => array(
					'id' => 0,
					'name' => '',
					'slug' => ''
				)
			),
			'selectedMaterialType' => array(
				'type' => 'object',
				'default' => array(
					'id' => 0,
					'name' => '',
					'slug' => ''
				)
			),
			'sections' => array(
				'type' => 'array',
				'default' => array(
					
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'title' => 'Marketing Files'
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
	'multimedia-logo' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/logo-section',
		'title' => 'Multimedia Logo',
		'category' => 'ambrygen',
		'icon' => 'format-image',
		'description' => 'Multimedia logo section with grouped file downloads.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string'
			),
			'heading' => array(
				'type' => 'string'
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
			'image1Url' => array(
				'type' => 'string'
			),
			'image1Id' => array(
				'type' => 'number'
			),
			'image1Alt' => array(
				'type' => 'string'
			),
			'webGroups' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'groupName' => array(
							'type' => 'string'
						),
						'linkName' => array(
							'type' => 'string'
						),
						'fileUrl' => array(
							'type' => 'string'
						),
						'fileId' => array(
							'type' => 'number'
						)
					)
				)
			),
			'printGroups' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'groupName' => array(
							'type' => 'string'
						),
						'linkName' => array(
							'type' => 'string'
						),
						'fileUrl' => array(
							'type' => 'string'
						),
						'fileId' => array(
							'type' => 'number'
						)
					)
				)
			),
			'image2Url' => array(
				'type' => 'string'
			),
			'image2Id' => array(
				'type' => 'number'
			),
			'image2Alt' => array(
				'type' => 'string'
			),
			'description' => array(
				'type' => 'string'
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'heading' => 'Heading',
				'headingTag' => 'h2',
				'webGroups' => array(
					array(
						'groupName' => 'Group Name',
						'linkName' => 'ZIP File',
						'fileUrl' => '#',
						'fileId' => 0
					)
				),
				'printGroups' => array(
					array(
						'groupName' => 'Group Name',
						'linkName' => 'PDF File',
						'fileUrl' => '#',
						'fileId' => 0
					)
				),
				'description' => 'Description'
			)
		)
	),
	'multimedia-member' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/multimedia-member',
		'title' => 'Multimedia Member',
		'category' => 'ambrygen',
		'icon' => 'images-alt2',
		'description' => 'Slider of multimedia member content pulled from our_team posts.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2',
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				)
			),
			'memberTypes' => array(
				'type' => 'array',
				'items' => array(
					'type' => 'number'
				),
				'default' => array(
					
				)
			),
			'selectionMode' => array(
				'type' => 'string',
				'default' => 'manual',
				'enum' => array(
					'manual',
					'taxonomy'
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
				'blockId' => 'multimedia-member-example'
			)
		)
	),
	'multimedia-member-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/multimedia-member-item',
		'title' => 'Multimedia Member Item',
		'category' => 'ambrygen',
		'icon' => 'format-image',
		'parent' => array(
			'ambrygen/multimedia-member'
		),
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'postId' => array(
				'type' => 'number',
				'default' => 0
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php'
	),
	'multiple-image-alongside-text' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/multiple-image-alongside-text',
		'title' => 'Multiple Image Alongside text',
		'category' => 'ambrygen',
		'icon' => 'networking',
		'description' => 'Advanced hero section with AI healthcare visuals, animated counters, and multi-media layout system.',
		'supports' => array(
			'anchor' => true,
			'html' => false
		),
		'keywords' => array(
			'hero',
			'ai',
			'healthcare',
			'counter',
			'statistics'
		),
		'attributes' => array(
			'blockId' => array(
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
			),
			'variation' => array(
				'type' => 'string',
				'enum' => array(
					'stats-view',
					'normal-view'
				),
				'default' => 'stats-view'
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
			'imageExtra' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageExtraId' => array(
				'type' => 'number',
				'default' => 0
			),
			'imageExtraAlt' => array(
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
			'contentTopAlign' => array(
				'type' => 'boolean',
				'default' => false
			),
			'imagePosition' => array(
				'type' => 'string',
				'enum' => array(
					'left',
					'right'
				),
				'default' => 'left'
			),
			'enableCounters' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'variations' => array(
			array(
				'name' => 'multiple-image-alongside-text-simple',
				'title' => 'Multiple Image Alongside Text (Simple)',
				'description' => 'Multiple image alongside text layout without counters',
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
				'variation' => 'stats-view',
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
				'imageTop' => '',
				'imageTopId' => 0,
				'imageTopAlt' => 'Ambry default preview image',
				'imageBottom' => '',
				'imageBottomId' => 0,
				'imageBottomAlt' => 'Ambry default preview image',
				'imageExtra' => '',
				'imageExtraId' => 0,
				'imageExtraAlt' => 'Ambry default preview image',
				'logoImage' => '',
				'logoImageId' => 0,
				'logoImageAlt' => 'Ambry default preview image',
				'contentTopAlign' => false,
				'imagePosition' => 'left',
				'enableCounters' => true
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'newsletter-form' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/newsletter-form',
		'title' => 'Contact Info/Form',
		'category' => 'ambrygen',
		'icon' => 'email',
		'description' => 'A block for displaying a newsletter subscription form with optional heading, description, and decorative imagery.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'eyebrow' => array(
				'type' => 'string',
				'default' => ''
			),
			'heading' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2',
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				)
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'phoneNumber' => array(
				'type' => 'string',
				'default' => ''
			),
			'emailAddress' => array(
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
			),
			'cta' => array(
				'type' => 'object',
				'default' => array(
					'text' => '',
					'url' => '',
					'target' => '',
					'rel' => ''
				)
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
				'default' => ''
			),
			'overlayBottomImage' => array(
				'type' => 'string',
				'default' => ''
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
			'isTopAligned' => array(
				'type' => 'boolean',
				'default' => false
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
				'phoneNumber' => '',
				'emailAddress' => '',
				'buttonText' => '',
				'buttonUrl' => '',
				'cta' => array(
					'text' => '',
					'url' => '',
					'target' => '',
					'rel' => ''
				),
				'image' => '/wp-content/themes/ambrygen/assets/src/images/news-latter/news-latter.jpg',
				'imageId' => 0,
				'overlayTopImageId' => 0,
				'overlayBottomImageId' => 0,
				'overlayTopImage' => '/wp-content/themes/ambrygen/assets/src/images/news-latter/overlay-top.svg',
				'overlayBottomImage' => '/wp-content/themes/ambrygen/assets/src/images/news-latter/overlay-bottom.svg',
				'backgroundImage' => '',
				'backgroundImageId' => 0,
				'backgroundImageAlt' => ''
			)
		)
	),
	'order-process-steps' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/order-process-steps',
		'title' => 'Order Process Steps',
		'category' => 'ambrygen',
		'icon' => 'list-view',
		'description' => 'Displays a step-by-step order process section.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
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
			'headingText' => array(
				'type' => 'string',
				'default' => ''
			),
			'subtitle' => array(
				'type' => 'string',
				'default' => ''
			),
			'steps' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'id' => array(
							'type' => 'string'
						),
						'title' => array(
							'type' => 'string'
						),
						'description' => array(
							'type' => 'string'
						),
						'iconUrl' => array(
							'type' => 'string'
						),
						'iconId' => array(
							'type' => 'number'
						),
						'iconAlt' => array(
							'type' => 'string'
						)
					)
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'blockId' => 'order-process-steps-example'
			)
		)
	),
	'ordering-options' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/ordering-options',
		'title' => 'Ordering Options',
		'category' => 'ambrygen',
		'icon' => 'index-card',
		'description' => 'A two-card ordering options section with images, bullet points, footnotes, and CTA buttons.',
		'supports' => array(
			'html' => false,
			'anchor' => true
		),
		'attributes' => array(
			'headingText' => array(
				'type' => 'string',
				'default' => 'Two Options for Ordering'
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
			),
			'eyebrow' => array(
				'type' => 'string',
				'default' => ''
			),
			'subtitle' => array(
				'type' => 'string',
				'default' => 'Choose the option that works best for your practice.<br>Only orders from the United States and Canada are accepted at this time.'
			),
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'options' => array(
				'type' => 'array',
				'default' => array(
					array(
						'id' => 'option-ambryport',
						'imageId' => 0,
						'imageUrl' => '',
						'imageAlt' => '',
						'title' => 'AmbryPort',
						'subtitle' => 'Our Secure Online Portal',
						'items' => array(
							array(
								'id' => 'option-ambryport-item-1',
								'text' => 'Login to AmbryPort or create an account*.'
							),
							array(
								'id' => 'option-ambryport-item-2',
								'text' => 'Complete the appropriate fields and submit your order online.'
							),
							array(
								'id' => 'option-ambryport-item-3',
								'text' => 'Ship the Sample Submission Kit using the pre-paid FedEx or DHL** envelope.'
							)
						),
						'cta' => array(
							'text' => 'Login to AmbryPort',
							'url' => '',
							'target' => '',
							'rel' => '',
							'variant' => ''
						)
					),
					array(
						'id' => 'option-paper-trf',
						'imageId' => 0,
						'imageUrl' => '',
						'imageAlt' => '',
						'title' => 'Paper TRF',
						'subtitle' => 'Test Requisition Form (Mail or Fax)',
						'items' => array(
							array(
								'id' => 'option-paper-trf-item-1',
								'text' => 'Download a copy of the test requisition form or use the form provided in your Sample Submission Kit.'
							),
							array(
								'id' => 'option-paper-trf-item-2',
								'text' => 'Complete all fields carefully to avoid delays in processing.'
							),
							array(
								'id' => 'option-paper-trf-item-3',
								'text' => 'Ship the Sample Submission Kit, with the completed TRF, using the pre-paid FedEx or DHL* envelope.'
							),
							array(
								'id' => 'option-paper-trf-item-4',
								'text' => 'If using insurance billing, please provide clinical documentation and copies of the insurance card.'
							)
						),
						'cta' => array(
							'text' => 'Order a Sample Kit',
							'url' => '',
							'target' => '',
							'rel' => '',
							'variant' => ''
						)
					)
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'id' => array(
							'type' => 'string'
						),
						'imageId' => array(
							'type' => 'number'
						),
						'imageUrl' => array(
							'type' => 'string'
						),
						'imageAlt' => array(
							'type' => 'string'
						),
						'title' => array(
							'type' => 'string'
						),
						'subtitle' => array(
							'type' => 'string'
						),
						'items' => array(
							'type' => 'array',
							'items' => array(
								'type' => 'object',
								'properties' => array(
									'id' => array(
										'type' => 'string'
									),
									'text' => array(
										'type' => 'string'
									)
								)
							)
						),
						'footnote' => array(
							'type' => 'string'
						),
						'cta' => array(
							'type' => 'object'
						)
					)
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'headingText' => 'Two Options for Ordering',
				'headingLevel' => 'h2',
				'subtitle' => 'Choose the option that works best for your practice.',
				'options' => array(
					array(
						'id' => 'example-1',
						'imageId' => 0,
						'imageUrl' => '',
						'imageAlt' => '',
						'title' => 'AmbryPort',
						'subtitle' => 'Our Secure Online Portal',
						'items' => array(
							array(
								'id' => 'example-1-item-1',
								'text' => 'Complete your order online.'
							)
						),
						'cta' => array(
							'text' => 'Learn more',
							'url' => 'https://www.ambrygen.com/',
							'target' => '',
							'rel' => '',
							'variant' => ''
						)
					)
				)
			)
		)
	),
	'ordering-options-card' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/ordering-options-card',
		'title' => 'Ordering Options Card',
		'category' => 'ambrygen',
		'icon' => 'index-card',
		'parent' => array(
			'ambrygen/ordering-options'
		),
		'description' => 'Card item for the Ordering Options block.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'attributes' => array(
			'imageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'imageUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
				'type' => 'string',
				'default' => ''
			),
			'subtitle' => array(
				'type' => 'string',
				'default' => ''
			),
			'cta' => array(
				'type' => 'object',
				'default' => array(
					'text' => '',
					'url' => '',
					'target' => '',
					'rel' => '',
					'variant' => ''
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
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
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
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
				'default' => 'h2',
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				)
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
				'type' => 'number',
				'default' => 0
			)
		),
		'supports' => array(
			'html' => false
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
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
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
				'default' => 'h2',
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				)
			),
			'memberTypes' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'number'
				)
			),
			'selectionMode' => array(
				'type' => 'string',
				'default' => 'manual',
				'enum' => array(
					'manual',
					'taxonomy'
				)
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
					1
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
				'type' => 'number',
				'default' => 0
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
	'post-hero-media' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/post-hero-media',
		'title' => 'Post Hero Media',
		'category' => 'ambrygen',
		'description' => 'Dynamic hero media for blog posts: toggles between Video MP4, Embed, and Featured Image.',
		'textdomain' => 'ambrygen-web',
		'attributes' => array(
			'className' => array(
				'type' => 'string',
				'default' => 'hero-featured-image'
			)
		),
		'supports' => array(
			'html' => false,
			'anchor' => true
		),
		'render' => 'file:./render.php'
	),
	'post-meta-list' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/post-meta-list',
		'version' => '1.0.0',
		'title' => 'Post Meta List',
		'category' => 'ambrygen',
		'description' => 'Renders a list of post meta fields.',
		'attributes' => array(
			'previewPostId' => array(
				'type' => 'number',
				'default' => 0
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'poster-filters' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/poster-filters',
		'version' => '1.0.0',
		'title' => 'Poster Filters',
		'category' => 'ambrygen',
		'description' => 'Renders filters for posters.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'poster-meta' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/poster-meta',
		'version' => '1.0.0',
		'title' => 'Poster Meta',
		'category' => 'ambrygen',
		'description' => 'Renders meta details for posters.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'poster-pdf-files' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/poster-pdf-files',
		'version' => '1.0.0',
		'title' => 'Poster PDF Files',
		'category' => 'ambrygen',
		'description' => 'Renders poster PDF file buttons for single poster pages.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'poster-result-count' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/poster-result-count',
		'version' => '1.0.0',
		'title' => 'Poster Result Count',
		'category' => 'ambrygen',
		'description' => 'Renders poster result count.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'presentation-filters' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/presentation-filters',
		'version' => '1.0.0',
		'title' => 'Presentation Filters',
		'category' => 'ambrygen',
		'description' => 'Renders filters for presentations.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'presentation-meta' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/presentation-meta',
		'version' => '1.0.0',
		'title' => 'Presentation Meta',
		'category' => 'ambrygen',
		'description' => 'Renders meta details for presentations.',
		'attributes' => array(
			'previewPostId' => array(
				'type' => 'number',
				'default' => 0
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'presentation-result-count' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/presentation-result-count',
		'version' => '1.0.0',
		'title' => 'Presentation Result Count',
		'category' => 'ambrygen',
		'description' => 'Renders presentation result count.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'publication-filters' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/publication-filters',
		'version' => '1.0.0',
		'title' => 'Publication Filters',
		'category' => 'ambrygen',
		'description' => 'Renders filters for publications.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'publication-meta' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/publication-meta',
		'version' => '1.0.0',
		'title' => 'Publication Meta',
		'category' => 'ambrygen',
		'description' => 'Renders meta details for publications.',
		'attributes' => array(
			'previewPostId' => array(
				'type' => 'number',
				'default' => 0
			)
		),
		'usesContext' => array(
			'postId',
			'postType'
		),
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'publication-result-count' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/publication-result-count',
		'version' => '1.0.0',
		'title' => 'Publication Result Count',
		'category' => 'ambrygen',
		'description' => 'Renders publication result count.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'resources' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/resources',
		'title' => 'Resources',
		'category' => 'ambrygen',
		'icon' => 'index-card',
		'description' => 'A block to display resource cards and organization logos.',
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
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
				'type' => 'string',
				'default' => 'Resources'
			),
			'subtitle' => array(
				'type' => 'string',
				'default' => 'Everything you need to understand your results and take next steps.'
			),
			'resourceCards' => array(
				'type' => 'array',
				'default' => array(
					array(
						'title' => 'Exome Patient Brochure',
						'pdfLinks' => array(
							array(
								'label' => 'EN',
								'url' => '#'
							),
							array(
								'label' => 'ES',
								'url' => '#'
							)
						)
					),
					array(
						'title' => 'Positive Epilepsy Result Guide',
						'pdfLinks' => array(
							array(
								'label' => 'EN',
								'url' => '#'
							),
							array(
								'label' => 'ES',
								'url' => '#'
							)
						)
					),
					array(
						'title' => 'Positive AutismNext Result Guide',
						'pdfLinks' => array(
							array(
								'label' => 'EN',
								'url' => '#'
							),
							array(
								'label' => 'ES',
								'url' => '#'
							)
						)
					),
					array(
						'title' => 'Carrier Result Guide — Epilepsy & Autism',
						'pdfLinks' => array(
							array(
								'label' => 'EN',
								'url' => '#'
							),
							array(
								'label' => 'ES',
								'url' => '#'
							)
						)
					)
				)
			),
			'orgTitle' => array(
				'type' => 'string',
				'default' => 'Helpful Organizations'
			),
			'collaboratorIds' => array(
				'type' => 'array',
				'default' => array(
					
				)
			),
			'resourcesCardTitle' => array(
				'type' => 'string',
				'default' => 'Test Lists & Downloads'
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2',
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				)
			),
			'customCollaborators' => array(
				'type' => 'array',
				'default' => array(
					
				)
			),
			'enableCustomCollaborators' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'example' => array(
			'attributes' => array(
				'title' => 'Resources',
				'subtitle' => 'Everything you need to understand your results and take next steps.',
				'resourceCards' => array(
					array(
						'title' => 'Exome Patient Brochure',
						'pdfLinks' => array(
							array(
								'label' => 'EN',
								'url' => '#'
							),
							array(
								'label' => 'ES',
								'url' => '#'
							)
						)
					),
					array(
						'title' => 'Positive Epilepsy Result Guide',
						'pdfLinks' => array(
							array(
								'label' => 'EN',
								'url' => '#'
							),
							array(
								'label' => 'ES',
								'url' => '#'
							)
						)
					),
					array(
						'title' => 'Positive AutismNext Result Guide',
						'pdfLinks' => array(
							array(
								'label' => 'EN',
								'url' => '#'
							),
							array(
								'label' => 'ES',
								'url' => '#'
							)
						)
					),
					array(
						'title' => 'Carrier Result Guide — Epilepsy & Autism',
						'pdfLinks' => array(
							array(
								'label' => 'EN',
								'url' => '#'
							),
							array(
								'label' => 'ES',
								'url' => '#'
							)
						)
					)
				),
				'orgTitle' => 'Helpful Organizations',
				'resourcesCardTitle' => 'Test Lists & Downloads',
				'collaboratorIds' => array(
					
				)
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
	'social-share' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
		'name' => 'ambrygen/social-share',
		'version' => '0.1.0',
		'title' => 'Social Share',
		'category' => 'theme-blocks',
		'icon' => 'share',
		'description' => 'Displays social sharing links with the designer\'s custom structure.',
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'split-content-section' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/split-content-section',
		'title' => 'Split Content Section',
		'category' => 'ambrygen',
		'icon' => 'align-pull-left',
		'description' => 'Mission statement banner with title, description, and background image.',
		'supports' => array(
			'html' => false,
			'color' => array(
				'background' => true,
				'text' => true
			)
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
				'type' => 'string',
				'default' => ''
			),
			'titleTag' => array(
				'type' => 'string',
				'default' => 'h2',
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				)
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
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
			'isHeaderVertical' => array(
				'type' => 'boolean',
				'default' => false
			),
			'isMediumText' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'blockId' => 'split-content-section-example'
			)
		)
	),
	'steps-image-alongside-text' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/steps-image-alongside-text',
		'title' => 'Steps Image Alongside Text',
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
			),
			'showFullImage' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'variations' => array(
			array(
				'name' => 'show-full-image',
				'title' => 'Show full image',
				'attributes' => array(
					'showFullImage' => true
				)
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
				'blockId' => 'steps-image-alongside-text-example'
			)
		)
	),
	'steps-image-alongside-text-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/steps-image-alongside-text-item',
		'title' => 'Steps Image Alongside Text Item',
		'category' => 'ambrygen',
		'parent' => array(
			'ambrygen/steps-image-alongside-text'
		),
		'icon' => 'format-image',
		'description' => 'Single image card for three column grid.',
		'attributes' => array(
			'stepTitle' => array(
				'type' => 'string',
				'default' => ''
			),
			'sectiontitle' => array(
				'type' => 'string',
				'default' => ''
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageId' => array(
				'type' => 'number'
			),
			'stepLabel' => array(
				'type' => 'string',
				'default' => ''
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
			),
			'showFullImage' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'variations' => array(
			array(
				'name' => 'show-full-image',
				'title' => 'Show full image',
				'attributes' => array(
					'showFullImage' => true
				)
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'render' => 'file:./render.php'
	),
	'supporting-graphs' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/supporting-graphs',
		'title' => 'Supporting Graphs',
		'category' => 'ambrygen',
		'icon' => 'chart-bar',
		'description' => 'Displays a supporting chart image with heading and description.',
		'textdomain' => 'ambrygen-web',
		'supports' => array(
			'html' => false,
			'align' => array(
				'wide',
				'full'
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
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
			'variation' => array(
				'type' => 'string',
				'enum' => array(
					'default',
					'variation-style-steps'
				),
				'default' => 'default'
			),
			'steps' => array(
				'type' => 'array',
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'id' => array(
							'type' => 'string'
						),
						'iconId' => array(
							'type' => 'number'
						),
						'iconUrl' => array(
							'type' => 'string'
						),
						'iconAlt' => array(
							'type' => 'string'
						),
						'label' => array(
							'type' => 'string'
						)
					)
				),
				'default' => array(
					
				)
			),
			'turnaroundLabel' => array(
				'type' => 'string',
				'default' => ''
			),
			'turnaroundValue' => array(
				'type' => 'string',
				'default' => ''
			),
			'turnaroundDescription' => array(
				'type' => 'string',
				'default' => ''
			),
			'socialCards' => array(
				'type' => 'array',
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'id' => array(
							'type' => 'string'
						),
						'title' => array(
							'type' => 'string'
						),
						'value' => array(
							'type' => 'string'
						),
						'unit' => array(
							'type' => 'string'
						)
					)
				),
				'default' => array(
					
				)
			)
		),
		'variations' => array(
			array(
				'name' => 'supporting-graphs-steps',
				'title' => 'Supporting Graphs Steps',
				'description' => 'Step cards with turnaround time cards.',
				'attributes' => array(
					'variation' => 'variation-style-steps'
				),
				'scope' => array(
					'inserter'
				)
			)
		),
		'example' => array(
			'attributes' => array(
				'heading' => 'Lifetime Cancer Risk for Common Cancers (%)',
				'headingTag' => 'h2',
				'description' => 'This graph represents the highest risks associated with some genes in Hereditary Cancer.'
			)
		)
	),
	'tab-menu-section' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/tab-menu-section',
		'title' => 'Tab Menu',
		'category' => 'ambrygen',
		'icon' => 'index-card',
		'description' => 'Independent tab menu with scroll targets.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string'
			),
			'tabBehavior' => array(
				'type' => 'string',
				'default' => 'tab-mode'
			),
			'tabs' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'label' => array(
							'type' => 'string'
						),
						'targetId' => array(
							'type' => 'string'
						),
						'targetClientId' => array(
							'type' => 'string'
						),
						'isActive' => array(
							'type' => 'boolean'
						)
					)
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'tabBehavior' => 'tab-mode',
				'tabs' => array(
					array(
						'label' => 'About Ambry',
						'targetId' => 'section-about',
						'isActive' => true
					),
					array(
						'label' => 'Multimedia Assets',
						'targetId' => 'section-assets',
						'isActive' => false
					)
				)
			)
		)
	),
	'tabs-content' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/tabs-content',
		'title' => 'Tabs Content',
		'category' => 'ambrygen',
		'icon' => 'editor-table',
		'description' => 'Tabbed content container (content only).',
		'supports' => array(
			'html' => false
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'innerBlocks' => array(
				array(
					'name' => 'ambrygen/tabs-content-item',
					'attributes' => array(
						'heading' => 'Order a Sample Kit',
						'description' => 'Sample description'
					)
				)
			)
		)
	),
	'tabs-content-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/tabs-content-item',
		'title' => 'Tabs Content Item',
		'category' => 'ambrygen',
		'parent' => array(
			'ambrygen/tabs-content'
		),
		'icon' => 'index-card',
		'description' => 'Single tab content item.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'attributes' => array(
			'heading' => array(
				'type' => 'string',
				'default' => ''
			),
			'isDefaultActive' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'heading' => 'Order a Sample Kit'
			),
			'innerBlocks' => array(
				array(
					'name' => 'core/paragraph',
					'attributes' => array(
						'content' => 'Tab content goes here.'
					)
				)
			)
		)
	),
	'test-catalog' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/test-catalog',
		'title' => 'Test Catalog',
		'category' => 'ambrygen',
		'icon' => 'screenoptions',
		'description' => 'Tabbed catalog of product versions grouped by category.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'eyebrow' => array(
				'type' => 'string',
				'default' => 'TEST CATALOG'
			),
			'title' => array(
				'type' => 'string',
				'default' => 'Available hereditary cancer tests'
			),
			'subtitle' => array(
				'type' => 'string',
				'default' => 'Browse tests by category. Ask your healthcare provider which panel is right for your situation.'
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'selectedTabs' => array(
				'type' => 'array',
				'default' => array(
					
				)
			),
			'marketingMaterialTypeId' => array(
				'type' => 'number',
				'default' => 0
			),
			'editVariant' => array(
				'type' => 'string',
				'default' => 'tabs'
			),
			'singleCategoryId' => array(
				'type' => 'number',
				'default' => 0
			),
			'singleProductVersionId' => array(
				'type' => 'number',
				'default' => 0
			),
			'singleProductVersionIds' => array(
				'type' => 'array',
				'default' => array(
					
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'eyebrow' => 'TEST CATALOG',
				'title' => 'Available hereditary cancer tests',
				'subtitle' => 'Browse tests by category. Ask your healthcare provider which panel is right for your situation.'
			)
		)
	),
	'test-catalog-with-table' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/test-catalog-with-table',
		'title' => 'Test Catalog with Table',
		'category' => 'ambrygen',
		'icon' => 'screenoptions',
		'description' => 'Tabbed catalog of product versions grouped by category.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'eyebrow' => array(
				'type' => 'string',
				'default' => 'TEST CATALOG'
			),
			'title' => array(
				'type' => 'string',
				'default' => 'Available hereditary cancer tests'
			),
			'subtitle' => array(
				'type' => 'string',
				'default' => 'Browse tests by category. Ask your healthcare provider which panel is right for your situation.'
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'selectedTabs' => array(
				'type' => 'array',
				'default' => array(
					
				)
			),
			'marketingMaterialTypeId' => array(
				'type' => 'number',
				'default' => 0
			),
			'editVariant' => array(
				'type' => 'string',
				'default' => 'tabs'
			),
			'mainCategoryId' => array(
				'type' => 'number',
				'default' => 0
			),
			'subCategoryId' => array(
				'type' => 'number',
				'default' => 0
			),
			'singleCategoryId' => array(
				'type' => 'number',
				'default' => 0
			),
			'singleProductVersionId' => array(
				'type' => 'number',
				'default' => 0
			),
			'singleProductVersionIds' => array(
				'type' => 'array',
				'default' => array(
					
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'eyebrow' => 'TEST CATALOG',
				'title' => 'Available hereditary cancer tests',
				'subtitle' => 'Browse tests by category. Ask your healthcare provider which panel is right for your situation.'
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
			'logoAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'quote' => array(
				'type' => 'string',
				'default' => ''
			),
			'author' => array(
				'type' => 'string',
				'default' => ''
			),
			'role' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'usesContext' => array(
			'ambrygen/mainImage',
			'ambrygen/mainImageId',
			'ambrygen/mainImageAlt'
		)
	),
	'testimonials' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/testimonials',
		'title' => 'Testimonials',
		'category' => 'ambrygen',
		'icon' => 'format-quote',
		'supports' => array(
			'color' => array(
				'background' => true
			)
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
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
			'mainImage' => array(
				'type' => 'string',
				'default' => ''
			),
			'mainImageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'mainImageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'secondaryImage' => array(
				'type' => 'string',
				'default' => ''
			),
			'secondaryImageId' => array(
				'type' => 'number',
				'default' => null
			),
			'secondaryImageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'overlayImage' => array(
				'type' => 'string',
				'default' => ''
			),
			'overlayImageId' => array(
				'type' => 'number',
				'default' => null
			),
			'overlayImageAlt' => array(
				'type' => 'string',
				'default' => ''
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
			'ambrygen/mainImageId' => 'mainImageId',
			'ambrygen/mainImageAlt' => 'mainImageAlt'
		),
		'example' => array(
			'attributes' => array(
				'blockId' => 'testimonials-example'
			)
		)
	),
	'testimonials-slider' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/testimonials-slider',
		'title' => 'Testimonials Slider',
		'category' => 'ambrygen',
		'icon' => 'format-quote',
		'description' => 'Displays a slider of testimonials with content and logos.',
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
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
				'type' => 'string',
				'default' => 'Words from the Team'
			),
			'headingLevel' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'testimonials' => array(
				'type' => 'array',
				'default' => array(
					array(
						'content' => '',
						'imageId' => 0,
						'imageUrl' => '',
						'imageAlt' => ''
					)
				)
			),
			'autoplay' => array(
				'type' => 'boolean',
				'default' => false
			),
			'showNavigation' => array(
				'type' => 'boolean',
				'default' => true
			),
			'showPagination' => array(
				'type' => 'boolean',
				'default' => true
			),
			'slidesPerView' => array(
				'type' => 'number',
				'default' => 1
			),
			'graphicLeftId' => array(
				'type' => 'number',
				'default' => 0
			),
			'graphicLeftUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'graphicLeftAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'graphicRightId' => array(
				'type' => 'number',
				'default' => 0
			),
			'graphicRightUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'graphicRightAlt' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./editor.scss',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'testimonials-slider-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/testimonials-slider-item',
		'title' => 'Testimonials Slider Item',
		'parent' => array(
			'ambrygen/testimonials-slider'
		),
		'attributes' => array(
			'content' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'imageUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageAlt' => array(
				'type' => 'string',
				'default' => ''
			),
			'authorName' => array(
				'type' => 'string',
				'default' => ''
			),
			'authorRole' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'theme-form' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/theme-form',
		'title' => 'Theme Form',
		'category' => 'ambrygen',
		'icon' => 'email',
		'description' => 'Theme form block with Gravity Form',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
				'type' => 'string',
				'default' => ''
			),
			'content' => array(
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
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'blockId' => 'theme-form-example'
			)
		)
	),
	'theme-video' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/theme-video',
		'title' => 'Theme Video',
		'textdomain' => 'ambrygen-web',
		'category' => 'ambrygen',
		'icon' => 'video-alt3',
		'description' => 'Theme video section with video embed and supporting content.',
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
			'blockId' => array(
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
			'heading' => array(
				'type' => 'string',
				'default' => ''
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'showDescription' => array(
				'type' => 'boolean',
				'default' => true
			),
			'videoUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'videoType' => array(
				'type' => 'string',
				'default' => 'embed'
			),
			'posterImage' => array(
				'type' => 'object',
				'default' => null
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
			'iframeUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'showImage' => array(
				'type' => 'boolean',
				'default' => false
			),
			'imageUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'imageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'isHeaderVertical' => array(
				'type' => 'boolean',
				'default' => false
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
				'showDescription' => true,
				'link' => array(
					'url' => 'https://example.com',
					'text' => 'Learn More',
					'target' => '_self',
					'rel' => '',
					'variant' => 'primary'
				),
				'videoUrl' => 'https://www.w3schools.com/html/mov_bbb.mp4',
				'videoType' => 'embed',
				'posterImage' => '/wp-content/themes/ambrygen/assets/src/images/ambrygen-default-image.png',
				'headingTag' => 'h2',
				'iframeUrl' => 'https://www.youtube.com/embed/ysz5S6PUM-U',
				'showImage' => false,
				'imageUrl' => '',
				'imageId' => 0
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
			'eyebrow' => array(
				'type' => 'string',
				'default' => ''
			),
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
			'variation' => array(
				'type' => 'string',
				'enum' => array(
					'variation-1',
					'variation-2'
				),
				'default' => 'variation-1'
			),
			'blockId' => array(
				'type' => 'string'
			),
			'isHeaderVertical' => array(
				'type' => 'boolean',
				'default' => false
			)
		),
		'providesContext' => array(
			'ambrygen/threeColumnVariation' => 'variation'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web',
		'example' => array(
			'attributes' => array(
				'blockId' => 'three-column-image-grid-example'
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
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'usesContext' => array(
			'ambrygen/threeColumnVariation'
		),
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
			'videoTitle' => array(
				'type' => 'string',
				'default' => ''
			),
			'videoContent' => array(
				'type' => 'string',
				'default' => ''
			),
			'formTitle' => array(
				'type' => 'string',
				'default' => ''
			),
			'formContent' => array(
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
					'variant' => 'dark',
					'isPopup' => false,
					'popupType' => 'video',
					'videoType' => 'embed',
					'iframeUrl' => '',
					'videoUrl' => ''
				)
			),
			'files' => array(
				'type' => 'array',
				'items' => array(
					'type' => 'object',
					'properties' => array(
						'id' => array(
							'type' => 'string'
						),
						'fileId' => array(
							'type' => 'number'
						),
						'fileUrl' => array(
							'type' => 'string'
						),
						'fileName' => array(
							'type' => 'string'
						),
						'sizeType' => array(
							'type' => 'string'
						)
					)
				),
				'default' => array(
					
				)
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php'
	),
	'timeline' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/timeline',
		'title' => 'Timeline',
		'textdomain' => 'ambrygen-web',
		'category' => 'ambrygen',
		'icon' => 'schedule',
		'description' => 'Timeline section with editable timeline items.',
		'supports' => array(
			'html' => false,
			'anchor' => true
		),
		'attributes' => array(
			'blockId' => array(
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
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2',
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'title' => 'Six steps from sample to report',
				'description' => 'Every sample moves through six quality checkpoints before a result reaches your patient.',
				'headingTag' => 'h2'
			)
		)
	),
	'timeline-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/timeline-item',
		'title' => 'Timeline Item',
		'category' => 'ambrygen',
		'icon' => 'marker',
		'parent' => array(
			'ambrygen/timeline'
		),
		'description' => 'Item block for the Timeline block.',
		'supports' => array(
			'html' => false,
			'reusable' => false
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
			'cta' => array(
				'type' => 'object',
				'default' => array(
					'text' => '',
					'url' => '',
					'target' => '',
					'rel' => ''
				)
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'two-column-icon-grid' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/two-column-icon-grid',
		'title' => 'Two Column Icon Grid',
		'category' => 'ambrygen',
		'icon' => 'grid-view',
		'description' => 'A two-column block with an icon grid on the left and content on the right.',
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
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'heading' => array(
				'type' => 'string',
				'default' => 'Recognize the Symptoms'
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2'
			),
			'description' => array(
				'type' => 'string',
				'default' => '<p>Inherited cardiovascular conditions can show up across multiple generations and often appear in an autosomal dominant pattern. Symptoms vary - and some people have none at all.</p><p>Because these conditions are often asymptomatic, knowing your family history and getting tested is the most reliable way to understand your risk - don\'t wait for symptoms to appear.</p>'
			),
			'items' => array(
				'type' => 'array',
				'default' => array(
					array(
						'iconId' => 0,
						'iconUrl' => '',
						'iconAlt' => '',
						'text' => 'Shortness of<br>Breath'
					),
					array(
						'iconId' => 0,
						'iconUrl' => '',
						'iconAlt' => '',
						'text' => 'Unusual<br>Fatigue'
					),
					array(
						'iconId' => 0,
						'iconUrl' => '',
						'iconAlt' => '',
						'text' => 'Chest Pain or<br>Pressure'
					),
					array(
						'iconId' => 0,
						'iconUrl' => '',
						'iconAlt' => '',
						'text' => 'Irregular<br>Heartbeat'
					),
					array(
						'iconId' => 0,
						'iconUrl' => '',
						'iconAlt' => '',
						'text' => 'Fainting or<br>Near-Fainting'
					),
					array(
						'iconId' => 0,
						'iconUrl' => '',
						'iconAlt' => '',
						'text' => 'Unexplained<br>Nausea'
					),
					array(
						'iconId' => 0,
						'iconUrl' => '',
						'iconAlt' => '',
						'text' => 'Persistent<br>Coughing'
					),
					array(
						'iconId' => 0,
						'iconUrl' => '',
						'iconAlt' => '',
						'text' => 'Sudden<br>Cardiac Arrest'
					)
				)
			)
		),
		'example' => array(
			'attributes' => array(
				'heading' => 'Recognize the Symptoms',
				'headingTag' => 'h2'
			)
		)
	),
	'two-column-solution-card' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/two-column-solution-card',
		'title' => 'Two Card Column',
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
				'blockId' => 'two-column-solution-card-example'
			)
		)
	),
	'two-column-solution-card-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/two-column-solution-card-item',
		'title' => 'Card Item',
		'category' => 'ambrygen',
		'parent' => array(
			'ambrygen/two-column-solution-card'
		),
		'icon' => 'format-image',
		'description' => 'Single image card for three column grid.',
		'supports' => array(
			'html' => false
		),
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
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'video-grid' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/video-grid',
		'title' => 'Video Grid',
		'category' => 'ambrygen',
		'icon' => 'video-alt3',
		'description' => 'Video grid section with layout variations and multiple videos.',
		'textdomain' => 'ambrygen-web',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'heading' => array(
				'type' => 'string',
				'default' => ''
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'subheading' => array(
				'type' => 'string',
				'default' => ''
			),
			'subDescription' => array(
				'type' => 'string',
				'default' => ''
			),
			'quoteAttribution' => array(
				'type' => 'string',
				'default' => ''
			),
			'headingTag' => array(
				'type' => 'string',
				'default' => 'h2',
				'enum' => array(
					'h1',
					'h2',
					'h3',
					'h4',
					'h5',
					'h6'
				)
			),
			'variation' => array(
				'type' => 'string',
				'default' => 'variation-features',
				'enum' => array(
					'variation-features',
					'variation-3'
				)
			),
			'topImageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'topImageUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'topImageAlt' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'providesContext' => array(
			'ambrygen/videoGridVariation' => 'variation'
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'viewScript' => 'file:./view.js',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'heading' => 'Transforming Healthcare with Genetic Insight',
				'description' => 'This is a sample preview content for this block in the inserter.',
				'subheading' => 'How to Videos',
				'subDescription' => 'Optional supporting text beneath the subheading.',
				'quoteAttribution' => '- Example Name, Title',
				'headingTag' => 'h2',
				'variation' => 'variation-3',
				'topImageId' => 0,
				'topImageUrl' => '',
				'topImageAlt' => ''
			)
		)
	),
	'video-grid-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/video-grid-item',
		'title' => 'Video Grid Item',
		'category' => 'ambrygen',
		'parent' => array(
			'ambrygen/video-grid'
		),
		'icon' => 'format-video',
		'description' => 'Single video item for Video Grid block.',
		'textdomain' => 'ambrygen-web',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'title' => array(
				'type' => 'string',
				'default' => ''
			),
			'description' => array(
				'type' => 'string',
				'default' => ''
			),
			'videoType' => array(
				'type' => 'string',
				'default' => 'embed',
				'enum' => array(
					'embed',
					'mp4'
				)
			),
			'iframeUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'videoUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'posterImageId' => array(
				'type' => 'number',
				'default' => 0
			),
			'posterImageUrl' => array(
				'type' => 'string',
				'default' => ''
			),
			'posterImageAlt' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'usesContext' => array(
			'ambrygen/videoGridVariation'
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'example' => array(
			'attributes' => array(
				'title' => 'Understanding Genetic Testing',
				'description' => 'Learn how testing moves from sample collection through analysis and reporting.',
				'videoType' => 'embed',
				'iframeUrl' => 'https://www.youtube.com/watch?v=ysz5S6PUM-U',
				'videoUrl' => '',
				'posterImageId' => 0,
				'posterImageUrl' => '',
				'posterImageAlt' => ''
			)
		)
	),
	'webinar-additional-info' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
		'name' => 'ambrygen/webinar-additional-info',
		'version' => '0.1.0',
		'title' => 'Webinar Additional Info',
		'category' => 'theme-blocks',
		'icon' => 'info',
		'description' => 'Displays additional content from Theme Options (Main Title, Logos, Descriptions).',
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'webinar-author-swiper' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
		'name' => 'ambrygen/webinar-author-swiper',
		'version' => '0.1.0',
		'title' => 'Webinar Author Swiper',
		'category' => 'theme-blocks',
		'icon' => 'groups',
		'description' => 'Displays the author profiles in a Swiper slider with background graphics.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
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
				'default' => ''
			),
			'overlayBottomImage' => array(
				'type' => 'string',
				'default' => ''
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'webinar-grid-card' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/webinar-grid-card',
		'version' => '1.0.0',
		'title' => 'Webinar Grid Card',
		'category' => 'ambrygen-web',
		'description' => 'Renders a webinar card for grid view.',
		'supports' => array(
			'html' => false,
			'reusable' => false
		),
		'parent' => array(
			'core/post-template'
		),
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php',
		'textdomain' => 'ambrygen-web'
	),
	'webinar-meta-summary' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
		'name' => 'ambrygen/webinar-meta-summary',
		'version' => '0.1.0',
		'title' => 'Webinar Meta Summary',
		'category' => 'theme-blocks',
		'icon' => 'calendar-alt',
		'description' => 'Displays the webinar date, time, duration, and credits dynamically.',
		'supports' => array(
			'html' => false
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'webinar-registration-button' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
		'name' => 'ambrygen/webinar-registration-button',
		'version' => '0.1.0',
		'title' => 'Webinar Registration Button',
		'category' => 'theme-blocks',
		'icon' => 'button',
		'description' => 'Displays the dynamic webinar registration button from the post meta.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'newTab' => array(
				'type' => 'boolean',
				'default' => true
			)
		),
		'textdomain' => 'ambrygen-web',
		'editorScript' => 'file:./index.js',
		'render' => 'file:./render.php'
	),
	'webinars' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/webinars',
		'title' => 'Webinar grid',
		'category' => 'ambrygen',
		'icon' => 'video-alt',
		'description' => 'A container for selected webinars',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'blockId' => array(
				'type' => 'string',
				'default' => ''
			),
			'title' => array(
				'type' => 'string',
				'default' => 'Webinars'
			),
			'scope' => array(
				'type' => 'string',
				'default' => 'upcoming'
			),
			'perPage' => array(
				'type' => 'number',
				'default' => 8
			)
		),
		'editorScript' => 'file:./index.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php'
	),
	'webinars-item' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/webinars-item',
		'title' => 'Webinar Item',
		'category' => 'ambrygen',
		'icon' => 'video-alt',
		'parent' => array(
			'ambrygen/webinars'
		),
		'attributes' => array(
			'postId' => array(
				'type' => 'number'
			)
		),
		'editorScript' => 'file:./index.js',
		'textdomain' => 'ambrygen-web',
		'render' => 'file:./render.php'
	)
);
