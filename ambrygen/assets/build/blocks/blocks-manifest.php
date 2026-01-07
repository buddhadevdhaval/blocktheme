<?php
// This file is generated. Do not modify it manually.
return array(
	'hero' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 3,
		'name' => 'ambrygen/hero',
		'version' => '0.1.0',
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
		'editorScript' => 'file:./index.min.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'image-grid' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
		'name' => 'ambrygen/image-grid',
		'title' => 'Image Grid',
		'category' => 'layout',
		'icon' => 'grid-view',
		'description' => 'A block to show multiple images in a grid with title and link.',
		'supports' => array(
			'html' => false
		),
		'attributes' => array(
			'columns' => array(
				'type' => 'number',
				'default' => 2
			),
			'items' => array(
				'type' => 'array',
				'default' => array(
					
				),
				'source' => 'query',
				'selector' => '.grid-item',
				'query' => array(
					'imageUrl' => array(
						'type' => 'string',
						'source' => 'attribute',
						'selector' => 'img',
						'attribute' => 'src'
					),
					'title' => array(
						'type' => 'string',
						'source' => 'html',
						'selector' => 'h4'
					),
					'link' => array(
						'type' => 'string',
						'source' => 'attribute',
						'selector' => 'a',
						'attribute' => 'href'
					)
				)
			)
		),
		'textdomain' => 'ambrygen-vip-web',
		'editorScript' => 'file:./index.min.js',
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	),
	'left-right-content' => array(
		'$schema' => 'https://schemas.wp.org/trunk/block.json',
		'apiVersion' => 2,
		'name' => 'ambrygen/left-right-content',
		'title' => 'Left Right Content',
		'category' => 'layout',
		'icon' => 'align-wide',
		'description' => 'A block with heading, editor, image, and left/right layout.',
		'supports' => array(
			'html' => false
		),
		'editorScript' => 'file:./index.min.js',
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
		'editorStyle' => 'file:./index.css',
		'style' => 'file:./style-index.css'
	)
);
