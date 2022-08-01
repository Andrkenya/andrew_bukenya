// define data
var dataset = [
    {label: "Amuriat O.", count: 337589},
    {label: "Kabuleeta K.", count: 45424},
    {label: "Kalembe N.", count: 38772},
    {label: "Katumba J.", count: 37554},
    {label: "Kyagulanyi S.", count: 3631437},
    {label: "Mao N.", count: 57682},
    {label: "Mayambala W", count: 15014},
    {label: "Mugisha M.", count: 67574},
    {label: "Mwesigye F.", count: 25483},
    {label: "Tumukunde H.", count: 51392},
    {label: "Yoweri M.", count: 6042898},
  ];

// chart dimensions
var width = 700;
var height = 500;

// a circle chart needs a radius
var radius = Math.min(width, height) / 2;

// legend dimensions
var legendRectSize = 25; // defines the size of the colored squares in legend
var legendSpacing = 6; // defines spacing between squares

// define color scale
var color = d3.scaleOrdinal(d3.schemeCategory20b);
// more color scales: https://bl.ocks.org/pstuffa/3393ff2711a53975040077b7453781a9

var svg = d3.select('#chart') // select element in the DOM with id 'chart'
  .append('svg') // append an svg element to the element we've selected
  .attr('width', width) // set the width of the svg element we just added
  .attr('height', height) // set the height of the svg element we just added
  .append('g') // append 'g' element to the svg element
  .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')'); // our reference is now to the 'g' element. centerting the 'g' element to the svg element

var arc = d3.arc()
  .innerRadius(0) // none for pie chart
  .outerRadius(radius); // size of overall chart

var pie = d3.pie() // start and end angles of the segments
  .value(function(d) { return d.count; }) // how to extract the numerical data from each entry in our dataset
  .sort(null); // by default, data sorts in oescending value. this will mess with our animation so we set it to null

// define tooltip
var tooltip = d3.select('#chart') // select element in the DOM with id 'chart'
  .append('div') // append a div element to the element we've selected                                    
  .attr('class', 'tooltip'); // add class 'tooltip' on the divs we just selected

tooltip.append('div') // add divs to the tooltip defined above                            
  .attr('class', 'label'); // add class 'label' on the selection                         

tooltip.append('div') // add divs to the tooltip defined above                     
  .attr('class', 'count'); // add class 'count' on the selection                  

tooltip.append('div') // add divs to the tooltip defined above  
  .attr('class', 'percent'); // add class 'percent' on the selection

// Confused? see below:

// <div id="chart">
//   <div class="tooltip">
//     <div class="label">
//     </div>
//     <div class="count">
//     </div>
//     <div class="percent">
//     </div>
//   </div>
// </div>

dataset.forEach(function(d) {
  d.count = +d.count; // calculate count as we iterate through the data
  d.enabled = true; // add enabled property to track which entries are checked
});

// creating the chart
var path = svg.selectAll('path') // select all path elements inside the svg. specifically the 'g' element. they don't exist yet but they will be created below
  .data(pie(dataset)) //associate dataset wit he path elements we're about to create. must pass through the pie function. it magically knows how to extract values and bakes it into the pie
  .enter() //creates placeholder nodes for each of the values
  .append('path') // replace placeholders with path elements
  .attr('d', arc) // define d attribute with arc function above
  .attr('fill', function(d) { return color(d.data.label); }) // use color scale to define fill of each label in dataset
  .each(function(d) { this._current - d; }); // creates a smooth animation for each track

// mouse event handlers are attached to path so they need to come after its definition
path.on('mouseover', function(d) {  // when mouse enters div      
 var total = d3.sum(dataset.map(function(d) { // calculate the total number of tickets in the dataset         
  return (d.enabled) ? d.count : 0; // checking to see if the entry is enabled. if it isn't, we return 0 and cause other percentages to increase                                      
  }));  
  
  //----------------
  d3.select(this)
  .transition().duration(250)
  .style('fill', '#4d4d4d');
  //----------------------

 var percent = Math.round(1000 * d.data.count / total) / 10; // calculate percent
 tooltip.select('.label').html(d.data.label); // set current label           
 tooltip.select('.count').html('Valid votes' + ': ' + d.data.count); // set current count            
 tooltip.select('.percent').html('Percentage: ' + percent + '%'); // set percent calculated above          
 tooltip.style('display', 'block'); // set display                     
});                                                           

path.on('mouseout', function() { // when mouse leaves div                        
  tooltip.style('display', 'none'); // hide tooltip for that element

  d3.select(this)
  .transition().duration(400)
  .style('fill', function(d,i){
    return color(d.data.label);
});

 });

path.on('mousemove', function(d) { // when mouse moves                  
  tooltip.style('top', (d3.event.layerY + 10) + 'px') // always 10px below the cursor
    .style('left', (d3.event.layerX + 10) + 'px'); // always 10px to the right of the mouse
  });

