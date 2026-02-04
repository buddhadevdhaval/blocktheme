import './header.jsx';
requireAll( require.context( './partials/', true, /\.js$/ ) );

function requireAll( r ) {
	r.keys().forEach( r );
}
