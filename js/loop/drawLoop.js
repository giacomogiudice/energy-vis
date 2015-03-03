define(["d3","data"],
	function(d3,data) {
		const π = Math.PI;
		const n = 12;
		var viewRect = d3.select("#container").node().getBoundingClientRect();
		var h = viewRect.height;
		var w = viewRect.width;
		var r = h/4;
		var factors = [-50,2500,2500];
		var ucolors = ["#f1c40f","#3498db","#c0392b"];
		var hcolors = ["#27ae60","#9b59b6"];
		var cycle = 15000;
		var house = 0;
		var am = 1;
		
		var svg = d3.select("#container").append("svg")
			.attr("width", w)
        	.attr("height", h)
        	.append("g")
        	.attr("transform","translate(" + w/2 + "," + h/2 + ")");

    	var j;
    	var util = [];

    	var utilArea = d3.svg.area()
    		.x1(function(d,i) {return (r + factors[j]*d) * Math.sin(i * 2 * π/n)})
    		.y1(function(d,i) {return -(r + factors[j]*d) * Math.cos(i * 2* π/n)})
    		.x0(function(d,i) {return r * Math.sin(i * 2 * π/n)})
    		.y0(function(d,i) {return -r * Math.cos(i * 2 * π/n)})
    		.interpolate("cardinal-closed");

    	var sw_size = 25;
    	var margin = 5;
    	var legend = d3.select("svg").append("g")
    		.attr("transform","translate(" + 0 + "," + h/2 + ")");

    	for(i=0; i<3; i++) {
    		legend.append("rect")
	    		.attr("x",0)
	    		.attr("y",(i-1) * (sw_size+margin))
	    		.attr("width",sw_size)
	    		.attr("height",sw_size)
	    		.attr("rx", sw_size/3)
	    		.attr("ry", sw_size/3)
	    		.attr("class","translucent")
	    		.attr("fill",ucolors[i]);
	    	
	    	legend.append("text")
	    		.attr("class","translucent")
	    		.attr("x",sw_size + margin)
	    		.attr("y",i * (sw_size+margin) - sw_size/2)
	    		.text(data.labels[i]);
    	}

    	function getCurrentData() { return (am)? data.means[house][j].slice(0,n) : data.means[house][j].slice(n,2*n) }
    	
    	function getCurrentTime(t) {
    		var hour = Math.floor(12 * t);
    		var min = Math.floor( 720 * t) % 60;
    		if(!am) hour = hour + 12;
    		return  ((hour<10)? "0" + hour : hour) + ":" + ((min<10)? "0" + min : min);
    	}

    	for(j = 0; j < 3; j++) {
    			util[j] = svg.append("path")
    			.attr("d",utilArea(getCurrentData()))
            	.attr("fill", ucolors[j])
            	.attr("class","translucent");

    	}

    	var arc = d3.svg.arc()
    		.innerRadius(3*r/8)
    		.outerRadius(r/2);

    	svg.append("path")
    		.datum({startAngle: 0,endAngle: 2 * π})
    		.attr("d",arc)
			.attr("fill", "#7f8c8d")
			.attr("class","translucent")

    	var clock = svg.append("path")
    		.datum({startAngle: 0,endAngle: 1})
    		.attr("d",arc)
			.attr("class","translucent");

		var time = svg.append("text")
			.attr("class","label translucent");

		function arcTween(transition) {
			if(am) {
				clock.attr("fill",hcolors[house]);
				transition.attrTween("d",function(d) {
					d.startAngle = 0; d.endAngle = 0;
					var interpolate = d3.interpolate(d.endAngle,2*π);
					return function(t) {
						time.text(getCurrentTime(t));
						d.endAngle = interpolate(t);
						return arc(d);
					};
				});
			}
			else {
				house = (house+1)%2;
				transition.attrTween("d",function(d) {
					var interpolate = d3.interpolate(d.startAngle,2*π);
					return function(t) {
						time.text(getCurrentTime(t));
						d.startAngle = interpolate(t);
						return arc(d);
					};
				});
			}
			
		}
		
		(function timeCycle(){
			clock.transition()
				.duration(cycle)
				.ease("linear")
				.call(arcTween)
				.each("end",function() {
					am = (am+1)%2;
					for(j = 0; j < 3; j++) {
						util[j].transition()
							.attr("d",utilArea(getCurrentData()))
							.duration(cycle/4);
						}
					timeCycle();
				});
		})()
		
});