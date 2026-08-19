function resolveApiFetch() {
	const maybeApiFetch = window?.wp?.apiFetch;

	if ( typeof maybeApiFetch === 'function' ) {
		return maybeApiFetch;
	}

	if ( typeof maybeApiFetch?.default === 'function' ) {
		return maybeApiFetch.default;
	}

	return null;
}

export default function apiFetch( options ) {
	const fetchImpl = resolveApiFetch();

	if ( ! fetchImpl ) {
		return Promise.reject(
			new Error( 'WordPress apiFetch is not available on window.wp.' )
		);
	}

	return fetchImpl( options );
}
