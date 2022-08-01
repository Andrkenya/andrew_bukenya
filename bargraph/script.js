var d3;
var data = 'election_data_bar.csv';


d3.csv(data, function(dataset) {
  data = dataset;
  buildChart();
});

function buildChart() {
  
  /* Initial setting up of chart*/
  /*Preparing svg and scales*/
  
  var w = 1050;
  var barSpacing = 5;
  var barThickness = 7;
  var vertPadding = 2;
  var h = (barSpacing) * data.length + vertPadding;
  
  var svg = d3.select('.container')
    .append('svg')
    .attr('width', w)
    .attr('height', h);
  
  var xScale = d3.scaleLinear()
    .domain([0, 100])
    .range([0,w]);
  
  var yScale = d3.scaleLinear()
    .domain([0, data.length])
    .range([h,0]);
  
  var xAxis = d3.axisBottom()
    .scale(xScale)
    .ticks(10)
    
  var yAxis = d3.axisRight()
    .scale(yScale)
    .ticks(0);
  
  var group = svg.selectAll('g')
    .data(data)
    .enter()
    .append('g');
  
  
  /* Graph bars*/ 

  var bars = group
    .append('rect')
    .attr('y', function(d, i) {
      return i * (barSpacing) + vertPadding
    })
    
    /* bar width is set in opening animation */
    // .attr('width', function(d) {
    //   return xScale(d.valid);
    // })
    .attr('height', function(d) {
      return h - yScale(barThickness/barSpacing);
    })
    
    .attr("fill", function(d, i){
      if(d.percentage > 69) {
        return "#00ff00";
      } else if(d.percentage > 59) {
        return "#f4bb44";
      } 
      else if(d.percentage > 49) {
        return "#ff5733";
      }
      else{
      return "#ff7f7f";}
    })  
  
  /* Axes (x and y) */
  
  svg.append('g')
    .style('font', '16px arial')
    .attr('transform', 'translate(0,' + h + ')')
    .call(xAxis);

  svg.append('g')
    .call(yAxis);

   /* Text on Bars*/
  
  var textLabels = group
    .append('text')

    .attr('text-anchor', 'start')
    .attr('x', function(d) {
      return xScale(d.percentage * 0.1) + 20;
    })
    .attr('y', function(d, i) {
      return i * (barSpacing) + vertPadding + (barSpacing /2);
    })
    .attr('font-family', 'arial, sans-serif')
    .attr('font-size', '18px')
    .attr('fill', '#223')
    .attr('opacity', 0)
    .transition().duration(2000)
    .attr('opacity', 1)
  
  
   /* Houver events */  

  group.on('mouseover', function(d){
    d3.select(this)
      .select('rect')
      .transition().duration(250)
      .style('fill', '#000000');      
  })
    .append('title')
    .text(function (d) {
        return '' + d.Deduction + '%' + '' + '      '+ d.District +'      ' + d.registered_voters +'     '+d.percentage +'%';
  }) 
    .style("opacity", 1);
  
  group.on('mouseout', function(d, i){
      d3.select(this)
      .select('rect')
      .transition().duration(400)
      .style('fill', function(d,i){
  //mouse_out color events
        if(d.percentage > 69) {
        return "#00ff00";
      } else if(d.percentage > 59) {
        return "#f4bb44";
      } 
      else if(d.percentage > 49) {
        return "#ff5733";
      }
      else{
      return "#ff7f7f";}
    });
  })
  
/* Animation*/    
  
  bars
    .transition().duration(2500) 
    .attr('width', function(d) {
        return xScale(d.percentage);
      }); 
}

//Legend /key
var svg = d3.select("#key")
svg.append("circle").attr("cx",1000).attr("cy",-630).attr("r",6).style("fill", "#ff7f7f")
svg.append("circle").attr("cx",1000).attr("cy",-660).attr("r",6).style("fill", "#ff5733")
svg.append("circle").attr("cx",1000).attr("cy",-690).attr("r",6).style("fill", "#f4bb44")
svg.append("circle").attr("cx",1000).attr("cy",-720).attr("r",6).style("fill", "#00ff00")
svg.append("text").attr("x",1020).attr("y",-720).text("Highest >69%").style("font-size", "20px").attr("alignment-baseline","middle")
svg.append("text").attr("x",1020).attr("y",-690).text("High 60% -69%").style("font-size", "20px").attr("alignment-baseline","middle")
svg.append("text").attr("x",1020).attr("y",-660).text("Medium 50% - 59%").style("font-size", "20px").attr("alignment-baseline","middle")
svg.append("text").attr("x",1020).attr("y",-630).text("Low <50%").style("font-size", "20px").attr("alignment-baseline","middle")

