require.config({
	baseUrl: '..',
	paths: {
		'mvc': '/hazdev-webutils/src/mvc',
		'util': '/hazdev-webutils/src/util',
		'leaflet': '/leaflet/dist/leaflet-src'
	},
	shim: {
		'leaflet': {
			'exports': 'L'
		}
	}
});
