import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	RichText,
	useBlockProps,
} from '@wordpress/block-editor';
import { Fragment, useEffect } from '@wordpress/element';
import {
	Button,
	PanelBody,
	ToggleControl,
} from '@wordpress/components';

import { ImageUploader, ItemHeader } from '../_shared/components';

const DEFAULT_AWARD = {
	id: 'award-1',
	imageId: 0,
	imageUrl: '',
	imageAlt: '',
};

const DEFAULT_AWARDS = [ DEFAULT_AWARD ];

const MAX_AWARDS = 40;

const createAwardId = () =>
	`award-${ Date.now().toString( 36 ) }-${ Math.random()
		.toString( 36 )
		.slice( 2, 8 ) }`;

const createAward = () => ( {
	...DEFAULT_AWARD,
	id: createAwardId(),
} );

export default function Edit( { attributes, setAttributes, clientId } ) {
	const {
		blockId,
		title,
		description,
		awards = [],
		isHeaderVertical,
	} = attributes;
	const awardsWithImages = awards.filter( ( award ) =>
		Boolean( award.imageUrl )
	);
	const hasAwards = awardsWithImages.length > 0;

	useEffect( () => {
		const clientIdSuffix = clientId.slice( 0, 8 );
		const expectedId = `section-${ clientIdSuffix }`;
		const hasMissingIds = awards.some( ( award ) => ! award?.id );
		const nextAttributes = {};

		if ( ! blockId || ! blockId.endsWith( clientIdSuffix ) ) {
			nextAttributes.blockId = expectedId;
		}

		if ( ! awards.length ) {
			nextAttributes.awards = DEFAULT_AWARDS;
		} else if ( hasMissingIds ) {
			nextAttributes.awards = awards.map( ( award ) => ( {
				...award,
				id: award?.id || createAwardId(),
			} ) );
		}

		if ( ! Object.keys( nextAttributes ).length ) {
			return;
		}

		setAttributes( nextAttributes );
	}, [ awards, blockId, clientId, setAttributes ] );

	const blockProps = useBlockProps( {
		id: blockId || undefined,
	} );

	const updateAward = ( awardId, updates ) => {
		setAttributes( {
			awards: awards.map( ( award ) =>
				award.id === awardId ? { ...award, ...updates } : award
			),
		} );
	};

	const addAward = () => {
		if ( awards.length >= MAX_AWARDS ) {
			return;
		}

		setAttributes( {
			awards: [ ...awards, createAward() ],
		} );
	};

	const removeAward = ( awardId ) => {
		if ( awards.length <= 1 ) {
			return;
		}

		setAttributes( {
			awards: awards.filter( ( award ) => award.id !== awardId ),
		} );
	};

	const moveAward = ( awardId, direction ) => {
		const currentIndex = awards.findIndex(
			( award ) => award.id === awardId
		);
		const newIndex = currentIndex + direction;

		if (
			currentIndex < 0 ||
			newIndex < 0 ||
			newIndex >= awards.length
		) {
			return;
		}

		const nextAwards = [ ...awards ];
		[ nextAwards[ currentIndex ], nextAwards[ newIndex ] ] = [
			nextAwards[ newIndex ],
			nextAwards[ currentIndex ],
		];
		setAttributes( { awards: nextAwards } );
	};

	return (
		<Fragment>
			<InspectorControls>
				<PanelBody
					title={ __( 'Award Images', 'ambrygen-web' ) }
					initialOpen={ false }
				>
					{ awards.map( ( award, index ) => (
						<div key={ award.id }>
							<ItemHeader
								index={ index }
								label={
									award.imageAlt || `Award ${ index + 1 }`
								}
								total={ awards.length }
								onMove={ ( itemIndex, direction ) =>
									moveAward( awards[ itemIndex ].id, direction )
								}
								onRemove={ ( itemIndex ) =>
									removeAward( awards[ itemIndex ].id )
								}
								minCount={ 1 }
							/>

							<ImageUploader
								url={ award.imageUrl }
								label={ __( 'Award Image', 'ambrygen-web' ) }
								onSelect={ ( media ) => {
									updateAward( award.id, {
										imageId: media.id || 0,
										imageUrl: media.url || '',
										imageAlt:
											media.alt || media.title || '',
									} );
								} }
								onRemove={ () => {
									updateAward( award.id, {
										imageId: 0,
										imageUrl: '',
										imageAlt: '',
									} );
								} }
							/>
						</div>
					) ) }

					<Button
						variant="secondary"
						onClick={ addAward }
						disabled={ awards.length >= MAX_AWARDS }
					>
						{ __( 'Add Award', 'ambrygen-web' ) }
					</Button>
				</PanelBody>

				<PanelBody
					title={ __( 'Header Settings', 'ambrygen-web' ) }
					initialOpen={ true }
				>
					<ToggleControl
						label={ __( 'Vertical Header Layout', 'ambrygen-web' ) }
						checked={ isHeaderVertical }
						onChange={ ( value ) =>
							setAttributes( { isHeaderVertical: value } )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...blockProps }>
				<div className="awards-block">
					<div
						className={ `awards-block__header block__rowflex is-${
							isHeaderVertical ? 'vertical' : 'horizontal'
						}` }
					>
						<RichText
							tagName="h2"
							className="awards-block__title block__rowflex--heading-title heading-3 mb-0"
							value={ title }
							onChange={ ( value ) =>
								setAttributes( { title: value } )
							}
							placeholder={ __( 'Add Heading...', 'ambrygen-web' ) }
						/>
						<RichText
							tagName="div"
							className="awards-block__intro block__rowflex--block-content subtitle1-reg"
							value={ description }
							onChange={ ( value ) =>
								setAttributes( { description: value } )
							}
							placeholder={ __(
								'Add Description...',
								'ambrygen-web'
							) }
						/>
					</div>
				</div>

				{ hasAwards && (
					<>
						<div
							className="is-style-gl-s50"
							aria-hidden="true"
						></div>

						<div className="marquee-slide">
							<div className="marquee-slide__track">
								<div className="marquee-slide__slider">
									<div className="marquee-slide__wrapper">
										{ awardsWithImages.map( ( award ) => (
											<div
												key={ award.id }
												className="marquee-slide__item is-visible"
											>
												<img
													src={ award.imageUrl }
													alt={ award.imageAlt || '' }
												/>
											</div>
										) ) }
									</div>
								</div>
							</div>
						</div>
					</>
				) }
			</div>
		</Fragment>
	);
}
