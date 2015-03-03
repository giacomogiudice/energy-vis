require.config({
	paths: {
		"jquery": "https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min",
		"d3": "http://d3js.org/d3.v3.min",
		},
	shim: {
		d3: {
			exports: 'd3'
		},
	}
});
requirejs(["init"]);