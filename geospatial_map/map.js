// map container units
var width = 840,
	height = 650;

// data field
var field = "valid_votes"

//initial data formating
var valueFormat = d3.format(",");

var template = d3.select('#template').html();
Mustache.parse(template);

var template2 = d3.select('#template2').html();
Mustache.parse(template);

// houver on
var hoveron = function(d) {
	console.log('d', d, 'event', event);
	var div = document.getElementById('tooltip');
	div.style.left = event.pageX + 'px';
	div.style.top = event.pageY + 'px';

	d3.select(this)
		.style("fill", "rgba(5, 1, 41, 0.8)"); //fill white

	d3.select("#tooltip")
		.style("opacity", 1); //tooltip display

	d3.select("#tooltip .name")
		.text(d.properties.dist); // adding name

	d3.select("#tooltip .value")
		.text(valueFormat(d.properties.field)); // adding value	
		
}

//houver out
var hoverout = function(d) {
	// original choropleth restoration
	d3.select(this)
		.style("fill", function(d) {
			var value = d.properties.field;
			if (value) {
				return color(value);
			} else {
				return "#ccc";
			}
		});

	d3.select("#tooltip")
		.style("opacity", 0); //tooltip to hidden mode

}

// SVG inside map container creation. Assign dimensions to it.
var svg = d3.select("#map").append('svg')
	.attr("width", width)
	.attr("height", height);

// Defining the geographical projection
var projection	= d3.geo.mercator() // setting initial zoom for feature display
	.scale(1);

var path = d3.geo.path()
	.projection(projection); // path object preparation

var dataById = d3.map(); // Initial object preparation


var color = d3.scale.quantize()
					//.range(d3.range(9),map(function(i) { return 'q' + i + '-9';}));
				.range(["#e4cec7", "#ccaea7", "#b28e84", "#9f756a", "#8c5d50", "#7f5449", "#6f473e", "#4e2d2a"]);
				//"#ffffcc", "#ffe5cc", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#ff0000", "#cc0000", "#990000", "#660000", "#330000" 
				//"#ffffcc", "#ffe5cc", "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#ff0000", "#cc0000", "#990000", "#660000", "#330000"
				//"#330000", "#660000", "#990000", "#cc0000", "#ff0000", "#ff3333", "#ff6666", "#ff9999", "#ffcccc", "#ffe5cc", "#ffffcc"

				//"#4e2d2a", "#5f3b35", "#6f473e", "#7f5449", "#8c5d50", "#9f756a", "#b28e84", "#ccaea7", "#e4cec7"
				
//Score data input
d3.csv("districts_data_ug.csv", function(data) {

	color.domain([
		d3.min(data, function(d) { return +d[field]; }),
		d3.max(data, function(d) { return +d[field]; })  //domain to color scxale setting

		]);
//data mapping
    dataById = d3.nest()
      .key(function(d) { return d.id; })
      .rollup(function(d) { return d[0]; })
      .map(data);

	// Loading GeoJSON data
	d3.json('ug_districts.geojson', function(error, json) {

		var scaleCenter = calculateScaleCenter(json); // Centering the parameters from the features and obtaining the scale. Then applying scale, center and translate parameters.

		projection.scale(scaleCenter.scale)
				.center(scaleCenter.center)
				.translate([width/2, height/2]);

		// Merging the coverage data amd GeoJSON looping through once for each coverage score data value
		for (var i=0; i < data.length ; i++ ) {

			var dataDistrict = data[i].district; 	// getting district name

			var dataValue = +data[i][field];   //getting data value, and converting datatypes, string to float. Then checking for corresponding district from geojson.
			for (var j=0; j < json.features.length ; j++ ) {

				// Finding the district reference in json
				var jsonDistrict = json.features[j].properties.dist;

				if (dataDistrict == jsonDistrict) {

					json.features[j].properties.field = dataValue; //data transfer to geojson

					//End JSON search
					break;
				}
			}
		}
		
		svg.append('g')		// Additional <g> element to the SVG element assigned a class to style later
			.attr('class', 'features')			
		
		/*	data binding for creation of a single path*/
		svg.selectAll("path")
			.data(json.features)
			.enter()
			.append("path")
			.attr("d", path)
			.on("mouseover", hoveron)
			.on("mouseout", hoverout)
			.on('click', showDetails)
			.style("cursor", "pointer")
			.style("stroke", "#777")
			.style("fill", function(d) {

				// Get data value
				
				var value = d.properties.field;

				if (value) {
					// If value exists ...
					return color(value);
				} else {
					// If value is undefines ...
					return "#ccc";
				}

			});

	}); // End d3.json
}); // End d3.csv

// NEW: function to dynamically calculate the scale factror and center

function calculateScaleCenter(features) {
	// Get the bounding box of the paths (in pixels) and calculate a scale factor based on box and map size
	var bbox_path = path.bounds(features),
		scale = 0.95 / Math.max(
			(bbox_path[1][0] - bbox_path[0][0]) / width,
			(bbox_path[1][1] - bbox_path[0][1]) / height
			);

	// Get the bounding box of the features (in map units) and use it to calculate the center of the features.
	var bbox_feature = d3.geo.bounds(features),
		center = [
			(bbox_feature[1][0] + bbox_feature[0][0]) / 2,
			(bbox_feature[1][1] + bbox_feature[0][1]) / 2];

	return {
		'scale':scale,
		'center':center
	};
}

// NEW: function to show details on click
function showDetails(f) {
	var id = getIdOfFeature(f); //Get the ID of the feature
	var d = dataById[id]; // Use the ID to get the data entry
	//console.log(d) //testing
	var detailsHtml = Mustache.render(template, d); // Render the Mustace template with the data object

	var detailsHtml2 = Mustache.render(template2, d); // Render the Mustace template with the data object


	//Hide the initial container.
	d3.select('#initial').classed('hidden', true);

	// Put the HTML output in the details container and show (unhide) it.
	d3.select('#tooltip').html(detailsHtml);
	d3.select('#details').classed('hidden', false);

	d3.select('#details2').html(detailsHtml2);
	d3.select('#details2').classed('hidden', false);
}

// NEW: Defining getIdOfFeature
function getIdOfFeature(f) {
  return f.properties.idug;
}

//Legend /key
var svg2 = d3.select("#key")
svg.append("circle").attr("cx",10).attr("cy",120).attr("r",8).style("fill", "#4a3527")
svg.append("circle").attr("cx",10).attr("cy",150).attr("r",8).style("fill", "#8b6248")
svg.append("circle").attr("cx",10).attr("cy",180).attr("r",8).style("fill", "#ba947b")
svg.append("circle").attr("cx",10).attr("cy",210).attr("r",8).style("fill", "#dbc8bc")
svg.append("text").attr("x",20).attr("y",120).text("Highest		").style("font-size", "20px").attr("alignment-baseline","middle")
svg.append("text").attr("x",20).attr("y",150).text("High    	").style("font-size", "20px").attr("alignment-baseline","middle")
svg.append("text").attr("x",20).attr("y",180).text("Medium 		").style("font-size", "20px").attr("alignment-baseline","middle")
svg.append("text").attr("x",20).attr("y",210).text("Low			").style("font-size", "20px").attr("alignment-baseline","middle")


