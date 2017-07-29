var jsdom = require('node-jsdom');
var d3 = require("d3");
var d3Shape =  require("d3-shape");
var jsgradient = require('../utilities/jsgradient');

function validateAndFixInputs(params){

    params.segments = params.segments < 1 ? 1:params.segments
 
    params.progress = params.progress < 0 ? 0 : params.progress
    params.progress = params.progress > 100 ? 100 : params.progress
}

function generate(window,params){

    validateAndFixInputs(params)

    //init
    var colorArray = jsgradient.generateGradient('#DCC7D7','#731f61', params.segments);
    var progressValue = params.progress
    var progressSegment = Math.floor(params.segments * progressValue * 0.01);
    var arcOffset = params.segments == 1 ? 0 : 0.02
    //var degreeValue = 180 * (params.progress - 50) / 100; 

    var config = {
        baseArcs : {
            segments : params.segments,
            innerRadius: 80,
            outerRadius: 100,
            stroke: 'lightgrey',
            strokeWidth:'1',
            fill: "lightgrey",
            offset: arcOffset
        },
        arcs : {
            segments : progressSegment,
            innerRadius: 80,
            outerRadius: 100,
            stroke: params.color,
            strokeWidth:'1',
            fill: params.color,
            offset: arcOffset
        },
        label: {
            display : params.label,
            fontFamily: "sans-serif",
            fontSize: "50px",
            fill: params.color
        },
        transform: "translate(150,150)",
        colorArray: colorArray

    }

    //preparing data - segments
    var segments = [];
    
    var currentAngle = 0;
    var segmentLength = 2 * Math.PI / config.baseArcs.segments
    for(i=0;i < config.baseArcs.segments;i++){

        var segment = {};
        segment.arcData = d3Shape.arc()
                .innerRadius(config.baseArcs.innerRadius)
                .outerRadius(config.baseArcs.outerRadius)
                .startAngle(currentAngle)
                .endAngle(currentAngle + segmentLength - config.baseArcs.offset)
        
        segment.stroke = config.baseArcs.stroke;
        segment.strokeWidth = config.baseArcs.strokeWidth;
        segment.transform = config.transform;
        segment.fill = config.baseArcs.fill;

        currentAngle += segmentLength;
        segments.push(segment);
    }

    currentAngle = 0;
    for(i=0;i < config.arcs.segments;i++){

        var segment = {};
        segment.arcData = d3Shape.arc()
                .innerRadius(config.arcs.innerRadius)
                .outerRadius(config.arcs.outerRadius)
                .startAngle(currentAngle)
                .endAngle(currentAngle + segmentLength - config.arcs.offset)
        
        segment.stroke = config.arcs.stroke;
        segment.strokeWidth = config.arcs.strokeWidth;
        segment.transform = config.transform;
        segment.fill = config.arcs.fill;

        currentAngle += segmentLength;
        segments.push(segment);
    }

    var finalSegmentLength = 2 * Math.PI * ( (progressValue * 0.01) - (config.arcs.segments/config.baseArcs.segments) )
    
    if(finalSegmentLength > 0) {
        segment = {};
        segment.arcData = d3Shape.arc()
                .innerRadius(config.arcs.innerRadius)
                .outerRadius(config.arcs.outerRadius)
                .startAngle(currentAngle)
                .endAngle(currentAngle + finalSegmentLength)
        
        segment.stroke = config.arcs.stroke;
        segment.strokeWidth = config.arcs.strokeWidth;
        segment.transform = config.transform;
        segment.fill = config.arcs.fill;

        segments.push(segment);
    }



    window.d3 = d3.select(window.document); //get d3 into the dom
        
    window.d3.select('body')
    .append('div').attr('class','container') //make a container div to ease the saving process
    .append('svg')
    .attr("xmlns", 'http://www.w3.org/2000/svg')
    .attr("id","svg")
    .attr("width",300)
    .attr("height",300)
    
    var svg = window.d3.select('svg')
    
    

    svg.selectAll('path').data(segments)
    .enter()
    .append('path')
    .attr('d', function(d) {return d.arcData()})
    .attr('stroke', function(d) {return d.stroke})
    .attr('stroke-width', function(d) {return d.strokeWidth})
    .attr('transform', function(d) {return d.transform})
    .attr('fill', function(d) {return d.fill})
    

    if(config.label.display === "true") {
        svg.append('text')
        .attr("font-family", config.label.fontFamily)
        .attr("font-size", config.label.fontSize)
        .attr("fill", config.label.fill)
        .attr("text-anchor","middle")
        .text(params.progress + "%")
        .attr('transform', "translate(150,165)")
    }

    var temp = '<?xml version="1.0" encoding="utf-8"?>\n';
    temp +=   window.document.querySelector('#svg').outerHTML;

    return temp;

}

module.exports = generate