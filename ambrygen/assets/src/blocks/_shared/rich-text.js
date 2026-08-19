function resolveRichTextPackage() {
	return window?.wp?.richText || null;
}

function getRichTextMethod( methodName ) {
	const richTextPackage = resolveRichTextPackage();
	const method = richTextPackage?.[ methodName ];

	if ( typeof method !== 'function' ) {
		throw new Error(
			`WordPress richText.${ methodName } is not available on window.wp.`
		);
	}

	return method;
}

export const registerFormatType = ( ...args ) =>
	getRichTextMethod( 'registerFormatType' )( ...args );

export const getActiveFormat = ( ...args ) =>
	getRichTextMethod( 'getActiveFormat' )( ...args );

export const applyFormat = ( ...args ) =>
	getRichTextMethod( 'applyFormat' )( ...args );

export const removeFormat = ( ...args ) =>
	getRichTextMethod( 'removeFormat' )( ...args );
