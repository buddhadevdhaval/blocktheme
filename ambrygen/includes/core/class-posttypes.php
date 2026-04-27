<?php

namespace Ambrygen\Theme\Core;

use Ambrygen\Theme\Core\Admin\MetaBoxController;
use Ambrygen\Theme\Core\Admin\TaxonomyMetaController;
use Ambrygen\Theme\Core\Conferences\ConferenceAjaxController;
use Ambrygen\Theme\Core\PostTypes\AbstractPostType;
use Ambrygen\Theme\Core\PostTypes\Definitions\Addresses;
use Ambrygen\Theme\Core\PostTypes\Definitions\Authors;
use Ambrygen\Theme\Core\PostTypes\Definitions\Events;
use Ambrygen\Theme\Core\PostTypes\Definitions\GeneticTesting;
use Ambrygen\Theme\Core\PostTypes\Definitions\Jobs;
use Ambrygen\Theme\Core\PostTypes\Definitions\MarketingMaterials;
use Ambrygen\Theme\Core\PostTypes\Definitions\OurTeam;
use Ambrygen\Theme\Core\PostTypes\Definitions\Posters;
use Ambrygen\Theme\Core\PostTypes\Definitions\Presentations;
use Ambrygen\Theme\Core\PostTypes\Definitions\PressRelease;
use Ambrygen\Theme\Core\PostTypes\Definitions\ProductVersions;
use Ambrygen\Theme\Core\PostTypes\Definitions\Publications;
use Ambrygen\Theme\Core\PostTypes\Definitions\Posts;
use Ambrygen\Theme\Core\PostTypes\Definitions\SharedTaxonomies;
use Ambrygen\Theme\Core\PostTypes\Definitions\TreadShows;
use Ambrygen\Theme\Core\PostTypes\Definitions\Webinars;
use Ambrygen\Theme\Core\Routes\ConferenceRouteService;
use Ambrygen\Theme\Core\Routes\PresentationRouteService;
use Ambrygen\Theme\Core\Routes\PosterRouteService;
use Ambrygen\Theme\Core\Routes\PressReleaseRouteService;
use Ambrygen\Theme\Core\Routes\PublicationRouteService;
use Ambrygen\Theme\Core\Science\ScienceRouteService;
use Ambrygen\Theme\Core\Webinars\WebinarAjaxController;

defined('ABSPATH') || exit;

final class PostTypes
{
    use Singleton;

    private const DEFINITIONS = [
        OurTeam::class,
        Authors::class,
        Posts::class,
        Jobs::class,
        TreadShows::class,
        Presentations::class,
        Posters::class,
        Events::class,
        Webinars::class,
        PressRelease::class,
        Publications::class,
        ProductVersions::class,
        GeneticTesting::class,
        MarketingMaterials::class,
        SharedTaxonomies::class,
    ];

    private array $definitions = [];

    protected function __construct()
    {
        foreach (self::DEFINITIONS as $class) {
            $instance = new $class();
            $this->definitions[$instance->slug()] = $instance;
        }

        $this->register_post_types();
        $this->register_taxonomies();
        $this->register_post_meta_fields();

        MetaBoxController::instance()->set_definitions($this->definitions);

        $tax_definitions = [];
        foreach ($this->definitions as $def) {
            foreach ($def->taxonomies() as $tax) {
                $tax_definitions[$tax['slug']] = $tax;
            }
        }
        TaxonomyMetaController::instance()->set_taxonomies($tax_definitions);

        ConferenceAjaxController::instance();
        WebinarAjaxController::instance();

        ConferenceRouteService::instance()->register_hooks();
        PressReleaseRouteService::instance()->register_hooks();
        PresentationRouteService::instance()->register_hooks();
        PosterRouteService::instance()->register_hooks();
        PublicationRouteService::instance()->register_hooks();
        ScienceRouteService::instance()->register_hooks();
    }

    public function register_post_types(): void
    {
        foreach ($this->definitions as $slug => $def) {
            if ('' === $slug) {
                continue;
            }

            register_post_type(
                $slug,
                array_merge(
                    [
                        'labels'             => $this->build_labels($def),
                        'public'             => $def->public(),
                        'show_in_menu'       => true,
                        'menu_icon'          => $def->menu_icon(),
                        'supports'           => $def->supports(),
                        'rewrite'            => ['slug' => $slug],
                        'has_archive'        => $def->has_archive(),
                        'show_in_rest'       => true,
                        'exclude_from_search' => false,
                        'publicly_queryable' => true,
                    ],
                    $def->extra_args()
                )
            );
        }
    }

    public function register_taxonomies(): void
    {
        $all_slugs = array_values(array_filter(array_keys($this->definitions)));

        foreach ($this->definitions as $slug => $def) {
            foreach ($def->taxonomies() as $tax) {
                if (!empty($tax['global'])) {
                    $object_types = $all_slugs;
                } elseif (!empty($tax['object_types'])) {
                    $object_types = $tax['object_types'];
                } else {
                    $object_types = [$slug];
                }

                if (!empty($tax['exclude_object_types']) && is_array($tax['exclude_object_types'])) {
                    $object_types = array_values(array_diff($object_types, $tax['exclude_object_types']));
                }

                if (!empty($tax['use_existing'])) {
                    $taxonomy_slug = $tax['slug'];
                    add_action(
                        'init',
                        static function () use ($taxonomy_slug, $object_types) {
                            foreach ($object_types as $object_type) {
                                register_taxonomy_for_object_type($taxonomy_slug, $object_type);
                            }
                        },
                        11
                    );
                    continue;
                }

                register_taxonomy(
                    $tax['slug'],
                    $object_types,
                    array_merge(
                        [
                            'labels' => $tax['labels'],
                            'hierarchical' => $tax['hierarchical'] ?? false,
                            'show_ui' => true,
                            'show_admin_column' => true,
                            'show_in_rest' => true,
                            'rewrite' => ['slug' => $tax['slug']],
                        ],
                        $tax['extra_args'] ?? []
                    )
                );
            }
        }
    }

    public function register_post_meta_fields(): void
    {
        register_post_meta(
            'post',
            'linked_author',
            [
                'type'         => 'integer',
                'single'       => true,
                'sanitize_callback' => null, // Let the save logic handle it
                'show_in_rest' => [
                    'schema' => [
                        'type'  => 'array',
                        'items' => [
                            'type' => 'integer',
                        ],
                    ],
                ],
                'auth_callback' => static fn(): bool => current_user_can('edit_posts'),
            ]
        );

        register_post_meta(
            'webinar',
            'linked_author',
            [
                'type'         => 'integer',
                'single'       => true,
                'sanitize_callback' => null,
                'show_in_rest' => [
                    'schema' => [
                        'type'  => 'array',
                        'items' => [
                            'type' => 'integer',
                        ],
                    ],
                ],
                'auth_callback' => static fn(): bool => current_user_can('edit_posts'),
            ]
        );

        foreach ($this->definitions as $slug => $def) {
            foreach ($def->meta_fields() as $meta_key => $field) {
                $type = $field['type'] ?? 'text';

                if (in_array($type, ['marketing_material_repeater', 'event_meet_expert_repeater'], true)) {
                    continue;
                }

                if (in_array($type, ['poster_pdf_repeater', 'presentation_pdf_repeater'], true)) {
                    register_post_meta(
                        $slug,
                        $meta_key,
                        [
                            'type'              => 'array',
                            'single'            => true,
                            'sanitize_callback' => null, // Let MetaBoxController handle repeater sanitization.
                            'show_in_rest'      => [
                                'schema' => [
                                    'type'  => 'array',
                                    'items' => [
                                        'type'       => 'object',
                                        'properties' => [
                                            'pdf_type' => [
                                                'type' => 'string',
                                            ],
                                            'file_id'  => [
                                                'type' => 'integer',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            'auth_callback'     => static fn(): bool => current_user_can('edit_posts'),
                        ]
                    );

                    continue;
                }

                if ('webinar_author_repeater' === $type) {
                    register_post_meta(
                        $slug,
                        $meta_key,
                        [
                            'type'              => 'array',
                            'single'            => true,
                            'sanitize_callback' => null,
                            'show_in_rest'      => [
                                'schema' => [
                                    'type'  => 'array',
                                    'items' => [
                                        'type'       => 'object',
                                        'properties' => [
                                            'linked_author' => [
                                                'type' => 'integer',
                                            ],
                                            'designation'   => [
                                                'type' => 'string',
                                            ],
                                            'bio'           => [
                                                'type' => 'string',
                                            ],
                                            'image_id'      => [
                                                'type' => 'integer',
                                            ],
                                        ],
                                    ],
                                ],
                            ],
                            'auth_callback'     => static fn(): bool => current_user_can('edit_posts'),
                        ]
                    );

                    continue;
                }

                $is_single = true;
                $meta_type = 'string';

                if (isset($field['multiple']) && $field['multiple']) {
                    $is_single = false;
                    $meta_type = 'array';
                }

                register_post_meta(
                    $slug,
                    $meta_key,
                    [
                        'type'         => $meta_type,
                        'single'       => $is_single,
                        'sanitize_callback' => $this->get_sanitize_callback($field, $is_single),
                        'show_in_rest' => [
                            'schema' => [
                                'type' => $meta_type,
                                'items' => [
                                    'type' => 'integer',
                                ],
                            ],
                        ],
                        'auth_callback' => static fn(): bool => current_user_can('edit_posts'),
                    ]
                );
            }
        }
    }

    private function build_labels(AbstractPostType $def): array
    {
        $singular = $def->singular_label();
        $plural   = $def->label();

        return [
            'name'                  => $plural,
            'singular_name'         => $singular,
            'menu_name'             => $plural,
            'name_admin_bar'        => $singular,
            'add_new'               => sprintf(__('Add %s', 'ambrygen-web'), $singular),
            'add_new_item'          => sprintf(__('Add New %s', 'ambrygen-web'), $singular),
            'edit_item'             => sprintf(__('Edit %s', 'ambrygen-web'), $singular),
            'new_item'              => sprintf(__('New %s', 'ambrygen-web'), $singular),
            'view_item'             => sprintf(__('View %s', 'ambrygen-web'), $singular),
            'search_items'          => sprintf(__('Search %s', 'ambrygen-web'), $plural),
            'not_found'             => sprintf(__('No %s found', 'ambrygen-web'), strtolower($plural)),
            'not_found_in_trash'    => sprintf(__('No %s found in Trash', 'ambrygen-web'), strtolower($plural)),
            'all_items'             => sprintf(__('All %s', 'ambrygen-web'), $plural),
            'parent_item_colon'     => sprintf(__('Parent %s:', 'ambrygen-web'), $singular),
            'archives'              => sprintf(__('%s Archives', 'ambrygen-web'), $singular),
            'attributes'           => sprintf(__('%s Attributes', 'ambrygen-web'), $singular),
            'insert_into_item'      => sprintf(__('Insert into %s', 'ambrygen-web'), strtolower($singular)),
            'uploaded_to_this_item' => sprintf(__('Uploaded to this %s', 'ambrygen-web'), strtolower($singular)),
            'featured_image'       => __('Featured Image', 'ambrygen-web'),
            'set_featured_image'    => __('Set featured image', 'ambrygen-web'),
            'remove_featured_image' => __('Remove featured image', 'ambrygen-web'),
            'use_featured_image'    => __('Use as featured image', 'ambrygen-web'),
            'filter_items_list'     => sprintf(__('Filter %s list', 'ambrygen-web'), strtolower($plural)),
            'items_list_navigation' => sprintf(__('%s list navigation', 'ambrygen-web'), $plural),
            'items_list'            => sprintf(__('%s list', 'ambrygen-web'), $plural),
            'item_published'       => sprintf(__('%s published', 'ambrygen-web'), $singular),
            'item_published_privately' => sprintf(__('%s published privately', 'ambrygen-web'), $singular),
            'item_reverted_to_draft' => sprintf(__('%s reverted to draft', 'ambrygen-web'), $singular),
            'item_scheduled'        => sprintf(__('%s scheduled', 'ambrygen-web'), $singular),
            'item_updated'          => sprintf(__('%s updated', 'ambrygen-web'), $singular),
        ];
    }

    private function get_sanitize_callback(array $field, bool $is_single): callable
    {
        $sanitize = $field['sanitize'] ?? null;

        if (! $is_single) {
            return [$this, 'sanitize_array'];
        }

        if (! $sanitize) {
            return 'sanitize_text_field';
        }

        $single_param_functions = ['floatval', 'intval', 'absint', 'boolval'];
        if (in_array($sanitize, $single_param_functions, true)) {
            return static function ($value) use ($sanitize) {
                return call_user_func($sanitize, $value);
            };
        }

        return $sanitize;
    }

    private function sanitize_array($value): array
    {
        if (! is_array($value)) {
            return [];
        }

        return array_filter(
            array_map('absint', $value)
        );
    }
}
