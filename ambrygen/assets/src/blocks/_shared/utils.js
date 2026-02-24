/**
 * Shared Block Utilities
 *
 * Common hooks and helpers for header and mega menu blocks.
 * Import from: '../_shared/utils'
 *
 * @package
 */
import { useCallback } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

/**
 * Text domain for i18n
 */
export const TD = 'ambrygen-web';

/**
 * Localized string helper with text domain
 * @param {string} text - Text to localize
 * @return {string} Localized string
 */
export const t = ( text ) => __( text, TD );

/**
 * Builds className string from array, filtering falsy values.
 * @param {...string} classes - Class names
 * @return {string} Combined className
 */
export const cx = ( ...classes ) => classes.filter( Boolean ).join( ' ' );

/**
 * Generates a unique menu ID.
 * @return {string} Unique ID
 */
export const generateMenuId = () =>
	`menu-${ Math.random().toString( 36 ).substr( 2, 9 ) }`;

/**
 * Creates array manipulation callbacks with immutable updates.
 *
 * @param {Function} setAttributes - Block setAttributes function
 * @param {string}   key           - Attribute key containing the array
 * @return {Object} Handler functions: { update, add, remove, move }
 */
export function useArrayHandlers( setAttributes, key ) {
	const update = useCallback(
		( index, prop, value ) => {
			setAttributes( ( prev ) => {
				const items = [ ...prev[ key ] ];
				items[ index ] = { ...items[ index ], [ prop ]: value };
				return { [ key ]: items };
			} );
		},
		[ setAttributes, key ]
	);

	const add = useCallback(
		( defaultItem ) => {
			setAttributes( ( prev ) => ( {
				[ key ]: [ ...prev[ key ], { ...defaultItem } ],
			} ) );
		},
		[ setAttributes, key ]
	);

	const remove = useCallback(
		( index, minCount = 1 ) => {
			setAttributes( ( prev ) => {
				if ( prev[ key ].length <= minCount ) {
					return {};
				}
				return {
					[ key ]: prev[ key ].filter( ( _, i ) => i !== index ),
				};
			} );
		},
		[ setAttributes, key ]
	);

	const move = useCallback(
		( index, direction ) => {
			setAttributes( ( prev ) => {
				const newIndex = index + direction;
				if ( newIndex < 0 || newIndex >= prev[ key ].length ) {
					return {};
				}
				const items = [ ...prev[ key ] ];
				[ items[ index ], items[ newIndex ] ] = [
					items[ newIndex ],
					items[ index ],
				];
				return { [ key ]: items };
			} );
		},
		[ setAttributes, key ]
	);

	return { update, add, remove, move };
}
