<?php
/**
 * Render: Multiple Image Alongside Text Block
 *
 * @param array    $attributes The block attributes.
 * @param string   $content    The block content.
 * @param WP_Block $block      The block instance.
 *
 * @package ambrygen
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

use Ambrygen\Theme\Core\Helper;

/**
 * Safely access block attributes.
 *
 * @var array $attributes Block attributes.
 */
$ambrygen_attributes = is_array( $attributes ?? null ) ? $attributes : array();

/*
---------------------------------
 * Heading
 * ---------------------------------
 */
$ambrygen_heading_level = $ambrygen_attributes['headingLevel'] ?? 'h2';
$ambrygen_heading_tag   = Helper::get_heading_tag( $ambrygen_heading_level, 'h2' );

$ambrygen_heading              = $ambrygen_attributes['heading'] ?? '';
$ambrygen_content              = $ambrygen_attributes['content'] ?? '';
$ambrygen_block_id             = isset( $ambrygen_attributes['blockId'] )
	? sanitize_html_class( $ambrygen_attributes['blockId'] )
	: '';
$ambrygen_variation            = $ambrygen_attributes['variation'] ?? 'stats-view';
$ambrygen_image_position       = $ambrygen_attributes['imagePosition'] ?? 'left';
$ambrygen_text_alignment       = $ambrygen_attributes['textAlignment'] ?? 'left';
$ambrygen_content_top_align    = ! empty( $ambrygen_attributes['contentTopAlign'] );
$ambrygen_allowed_variations   = array( 'stats-view', 'text-view', 'normal-view' );
$ambrygen_normalized_variation = in_array( $ambrygen_variation, $ambrygen_allowed_variations, true )
	? $ambrygen_variation
	: 'stats-view';
$ambrygen_allowed_alignments   = array( 'left', 'center', 'right' );
$ambrygen_text_alignment       = in_array( $ambrygen_text_alignment, $ambrygen_allowed_alignments, true )
	? $ambrygen_text_alignment
	: 'left';
$ambrygen_is_normal_view       = 'normal-view' === $ambrygen_normalized_variation;
$ambrygen_is_text_view         = 'text-view' === $ambrygen_normalized_variation;
$ambrygen_is_stats_view        = ! $ambrygen_is_normal_view;
$ambrygen_heading_class        = 'heading-2';
$ambrygen_heading_classes      = $ambrygen_is_text_view
	? $ambrygen_heading_class . ' mb-0 js-gsap-fade'
	: 'multiple-image-alongside-text__heading ' . $ambrygen_heading_class . ' mb-0 js-gsap-fade';
$ambrygen_image_position_class = 'right' === $ambrygen_image_position ? ' block-rtl' : '';
$ambrygen_variation_class      = $ambrygen_is_normal_view ? ' is-normal-view' : '';
$ambrygen_variation_class      = $ambrygen_is_text_view ? ' is-text-view' : $ambrygen_variation_class;
$ambrygen_alignment_class      = $ambrygen_is_text_view ? ' has-text-align-' . $ambrygen_text_alignment : '';
$ambrygen_has_heading          = '' !== trim( wp_strip_all_tags( $ambrygen_heading ) );
$ambrygen_has_content          = '' !== trim( wp_strip_all_tags( $ambrygen_content ) );
$ambrygen_heading_id           = '';

if ( $ambrygen_has_heading ) {
	$ambrygen_heading_id = $ambrygen_block_id
		? $ambrygen_block_id . '-heading'
		: wp_unique_id( 'multiple-image-alongside-text-heading-' );
}

/*
---------------------------------
 * Stats
 * ---------------------------------
 */
$ambrygen_raw_stats_input = isset( $ambrygen_attributes['stats'] ) && is_array( $ambrygen_attributes['stats'] )
	? $ambrygen_attributes['stats']
	: array();
$ambrygen_stats           = array();

foreach ( $ambrygen_raw_stats_input as $ambrygen_stat ) {
	if ( ! is_array( $ambrygen_stat ) ) {
		continue;
	}

	$ambrygen_normalized_stat = array(
		'prefix'      => isset( $ambrygen_stat['prefix'] ) ? (string) $ambrygen_stat['prefix'] : '',
		'number'      => isset( $ambrygen_stat['number'] ) ? (string) $ambrygen_stat['number'] : '',
		'postfix'     => isset( $ambrygen_stat['postfix'] )
			? (string) $ambrygen_stat['postfix']
			: ( isset( $ambrygen_stat['suffix'] ) ? (string) $ambrygen_stat['suffix'] : '' ),
		'label'       => isset( $ambrygen_stat['label'] )
			? (string) $ambrygen_stat['label']
			: ( isset( $ambrygen_stat['title'] ) ? (string) $ambrygen_stat['title'] : '' ),
		'description' => isset( $ambrygen_stat['description'] ) ? (string) $ambrygen_stat['description'] : '',
	);

	$ambrygen_has_stat_content = '' !== trim( wp_strip_all_tags( $ambrygen_normalized_stat['prefix'] ) )
		|| '' !== trim( wp_strip_all_tags( $ambrygen_normalized_stat['number'] ) )
		|| '' !== trim( wp_strip_all_tags( $ambrygen_normalized_stat['postfix'] ) )
		|| '' !== trim( wp_strip_all_tags( $ambrygen_normalized_stat['label'] ) )
		|| '' !== trim( wp_strip_all_tags( $ambrygen_normalized_stat['description'] ) );

	if ( $ambrygen_has_stat_content ) {
		$ambrygen_stats[] = $ambrygen_normalized_stat;
	}
}

$ambrygen_visible_stats = array_slice( $ambrygen_stats, 0, 4 );

/*
---------------------------------
 * Images (IDs are source of truth)
 * ---------------------------------
 */
$ambrygen_images = isset( $ambrygen_attributes['images'] ) && is_array( $ambrygen_attributes['images'] )
	? $ambrygen_attributes['images']
	: array();

$ambrygen_visible_image_count = $ambrygen_is_text_view ? 0 : ( $ambrygen_is_normal_view ? 4 : 3 );
$ambrygen_images              = array_map(
	static function ( $ambrygen_image, $ambrygen_image_index ) {
		$ambrygen_image = is_array( $ambrygen_image ) ? $ambrygen_image : array();

		return array(
			'id'         => (int) ( $ambrygen_image['id'] ?? 0 ),
			'url'        => isset( $ambrygen_image['url'] ) ? (string) $ambrygen_image['url'] : '',
			'alt'        => isset( $ambrygen_image['alt'] ) ? (string) $ambrygen_image['alt'] : '',
			'slot_index' => (int) $ambrygen_image_index,
		);
	},
	array_pad( array_slice( $ambrygen_images, 0, $ambrygen_visible_image_count ), $ambrygen_visible_image_count, array() ),
	range( 0, $ambrygen_visible_image_count - 1 )
);
$ambrygen_has_images          = array_reduce(
	$ambrygen_images,
	static function ( $ambrygen_has_images, $ambrygen_image ) {
		if ( $ambrygen_has_images ) {
			return true;
		}

		return ! empty( $ambrygen_image['id'] ) || '' !== $ambrygen_image['url'];
	},
	false
);
$ambrygen_has_stats           = $ambrygen_is_stats_view && ! empty( $ambrygen_visible_stats );

if ( ! $ambrygen_has_heading && ! $ambrygen_has_content && ! $ambrygen_has_images && ! $ambrygen_has_stats ) {
	return;
}

/*
---------------------------------
 * Wrapper attributes
 * ---------------------------------
 */
$ambrygen_wrapper_args = array(
	'class' => implode(
		' ',
		array_filter(
			array(
				'multiple-image-alongside-text',
				$ambrygen_content_top_align ? 'has-top-align' : '',
				trim( $ambrygen_image_position_class ),
				trim( $ambrygen_variation_class ),
				trim( $ambrygen_alignment_class ),
			)
		)
	),
);

if ( $ambrygen_block_id ) {
	$ambrygen_wrapper_args['id'] = $ambrygen_block_id;
}

if ( $ambrygen_heading_id ) {
	$ambrygen_wrapper_args['role']            = 'region';
	$ambrygen_wrapper_args['aria-labelledby'] = $ambrygen_heading_id;
}

$ambrygen_wrapper_attributes = get_block_wrapper_attributes( $ambrygen_wrapper_args );
?>
<div <?php echo $ambrygen_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() output is escaped by WordPress core. ?>>
	<div class="multiple-image-alongside-text__grid">
		<?php if ( ! $ambrygen_is_text_view ) : ?>
			<div class="multiple-image-alongside-text__col multiple-image-alongside-text__col--images">
				<div class="multiple-image-alongside-text__images">
					<?php foreach ( $ambrygen_images as $ambrygen_image_index => $ambrygen_image ) : ?>
						<?php
						$ambrygen_image_id      = (int) $ambrygen_image['id'];
						$ambrygen_image_url     = (string) $ambrygen_image['url'];
						$ambrygen_image_alt     = (string) $ambrygen_image['alt'];
						$ambrygen_is_full_image = ! $ambrygen_is_normal_view && 2 === (int) $ambrygen_image['slot_index'];
						$ambrygen_wrapper_class = 'multiple-image-alongside-text__image-wrapper js-gsap-fade';

						if ( $ambrygen_is_full_image ) {
							$ambrygen_wrapper_class .= ' multiple-image-alongside-text__image-wrapper--full';
						}
						?>
						<div class="<?php echo esc_attr( $ambrygen_wrapper_class ); ?>">
							<div class="multiple-image-alongside-text__image<?php echo $ambrygen_is_full_image ? ' multiple-image-alongside-text__image--bottom' : ''; ?>">
								<div class="multiple-image-alongside-text__image-container">
									<?php
									echo Helper::image_from_source( // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Helper::image_from_source() escapes attributes and returns wp_kses_post()-sanitized image markup.
										$ambrygen_image_id,
										$ambrygen_image_url,
										$ambrygen_is_full_image ? 'full' : 'large',
										array(
											'alt'   => $ambrygen_image_alt,
											'class' => 'multiple-image-alongside-text__image-img',
										),
										true
									);
									?>
								</div>
							</div>
						</div>
					<?php endforeach; ?>
				</div>
			</div>
		<?php endif; ?>

		<div class="multiple-image-alongside-text__col multiple-image-alongside-text__col--content">
			<div class="multiple-image-alongside-text__content">

				<?php if ( $ambrygen_has_heading ) : ?>
					<<?php echo tag_escape( $ambrygen_heading_tag ); ?>
						class="<?php echo esc_attr( $ambrygen_heading_classes ); ?>"
						id="<?php echo esc_attr( $ambrygen_heading_id ); ?>"
						>
						<?php
						echo wp_kses(
							$ambrygen_heading,
							Helper::allowed_heading_html()
						);
						?>
					</<?php echo tag_escape( $ambrygen_heading_tag ); ?>>
				<?php endif; ?>

				<?php if ( $ambrygen_has_content ) : ?>
					<?php if ( $ambrygen_has_heading ) : ?>
						<div class="is-style-gl-s24" aria-hidden="true"></div>
					<?php endif; ?>
					<div class="multiple-image-alongside-text__description-text body1 block-description js-gsap-fade">
						<?php echo wp_kses_post( $ambrygen_content ); ?>
					</div>
				<?php endif; ?>



				<?php if ( $ambrygen_has_stats ) : ?>
					<?php if ( $ambrygen_has_heading || $ambrygen_has_content ) : ?>
						<div class="is-style-gl-s24" aria-hidden="true"></div>
					<?php endif; ?>
					<div class="multiple-image-alongside-text__stats" role="list">
						<?php foreach ( $ambrygen_visible_stats as $ambrygen_stat ) : ?>
							<?php
							$ambrygen_prefix      = trim( wp_strip_all_tags( $ambrygen_stat['prefix'] ) );
							$ambrygen_number      = trim( wp_strip_all_tags( $ambrygen_stat['number'] ) );
							$ambrygen_postfix     = trim( wp_strip_all_tags( $ambrygen_stat['postfix'] ) );
							$ambrygen_label       = $ambrygen_stat['label'];
							$ambrygen_description = $ambrygen_stat['description'];

							$ambrygen_aria_label = trim(
								$ambrygen_prefix .
								$ambrygen_number .
								$ambrygen_postfix .
								( $ambrygen_label ? ' ' . wp_strip_all_tags( $ambrygen_label ) : '' )
							);
							?>
							<div class="multiple-image-alongside-text__stats--stat-item js-gsap-fade" role="listitem">

								<?php if ( '' !== $ambrygen_prefix || '' !== $ambrygen_number || '' !== $ambrygen_postfix ) : ?>
									<div class="multiple-image-alongside-text__stats--stat-number heading-3 mb-0"
										aria-label="<?php echo esc_attr( $ambrygen_aria_label ); ?>">
										<?php if ( '' !== $ambrygen_prefix ) : ?>
											<div class="multiple-image-alongside-text__stats--stat-prefix"><?php echo esc_html( $ambrygen_prefix ); ?></div>
										<?php endif; ?>
										<div class="multiple-image-alongside-text__stats--count">
											<?php echo esc_html( $ambrygen_number ); ?>
										</div>
										<?php if ( '' !== $ambrygen_postfix ) : ?>
											<div class="multiple-image-alongside-text__stats--stat-postfix"><?php echo esc_html( $ambrygen_postfix ); ?></div>
										<?php endif; ?>
									</div>
								<?php endif; ?>

								<?php if ( $ambrygen_label ) : ?>
									<div class="multiple-image-alongside-text__stats--stat-title body1">
										<?php
										echo wp_kses_post( $ambrygen_label );
										?>
									</div>
								<?php endif; ?>

								<?php if ( $ambrygen_description ) : ?>
									<div class="multiple-image-alongside-text__stats--stat-description">
										<?php echo wp_kses_post( $ambrygen_description ); ?>
									</div>
								<?php endif; ?>

							</div>
						<?php endforeach; ?>
					</div>
				<?php endif; ?>

			</div>
		</div>
	</div>
</div>
