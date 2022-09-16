var d3;
var data = 'clustering_data.csv';


d3.csv(data, function(dataset) {
  data = dataset;
  buildChart();
});

function buildChart() {
  
  /* Initial setting up of chart*/
  /*Preparing svg and scales*/
  
  var w = 1050;
  var barSpacing = 100;
  var barThickness = 70;
  var vertPadding = 8;
  var h = 500;

  //(barSpacing) * data.length + vertPadding
  
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
      if(d.percentage == 78.62) {
        return "#B87333";
      } else if(d.percentage == 10.83) {
        return "#D59D69";
      } 
      else if(d.percentage == 3.67) {
        return "#EE9A49";
      }
      else if(d.percentage == 3.53) {
        return "#FDBC80";
      }
      else{
      return "#FFD8B3";}
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
        if(d.percentage == 78.62) {
        return "#B87333";
      } else if(d.percentage == 10.83) {
        return "#D59D69";
      } 
      else if(d.percentage == 3.67) {
        return "#EE9A49";
      }
      else if(d.percentage == 3.53) {
        return "#FDBC80";
      }
      else{
      return "#FFD8B3";}
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
svg.append("circle").attr("cx",1000).attr("cy",-230).attr("r",6).style("fill", "#FDBC80")
svg.append("circle").attr("cx",1000).attr("cy",-260).attr("r",6).style("fill", "#EE9A49")
svg.append("circle").attr("cx",1000).attr("cy",-290).attr("r",6).style("fill", "#D59D69")
svg.append("circle").attr("cx",1000).attr("cy",-320).attr("r",6).style("fill", "#B87333")
svg.append("text").attr("x",1020).attr("y",-320).text("High").style("font-size", "20px").attr("alignment-baseline","middle")
svg.append("text").attr("x",1020).attr("y",-290).text("Medium").style("font-size", "20px").attr("alignment-baseline","middle")
svg.append("text").attr("x",1020).attr("y",-260).text("Low").style("font-size", "20px").attr("alignment-baseline","middle")
svg.append("text").attr("x",1020).attr("y",-230).text("Lowest").style("font-size", "20px").attr("alignment-baseline","middle")

