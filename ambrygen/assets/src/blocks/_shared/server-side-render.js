import { createElement } from '@wordpress/element';

function resolveServerSideRenderComponent() {
	const maybeComponent = window?.wp?.serverSideRender;

	if ( maybeComponent?.default ) {
		return maybeComponent.default;
	}

	if ( maybeComponent?.ServerSideRender ) {
		return maybeComponent.ServerSideRender;
	}

	return maybeComponent || null;
}

export default function ServerSideRender( props ) {
	const Component = resolveServerSideRenderComponent();

	if ( ! Component ) {
		return null;
	}

	return createElement( Component, props );
}

export { ServerSideRender };
