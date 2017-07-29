var jsdom = require('node-jsdom');
var d3 = require("d3");
var d3Shape =  require("d3-shape");
var jsgradient = require('../utilities/jsgradient');


function calcSemiArcMarker(cx,cy,r,sangle){

	sangle = (sangle + 270) % 360;
	var sx = cx + Math.cos(sangle/ 360 * 2 * Math.PI) * r;
	var sy = cy + Math.sin(sangle/ 360 * 2 * Math.PI) * r;

	var lx = cx + Math.cos((sangle - 3)/ 360 * 2 * Math.PI) * (r-20);
	var ly = cy + Math.sin((sangle - 3)/ 360 * 2 * Math.PI) * (r-20);

	var rx = cx + Math.cos((sangle + 3)/ 360 * 2 * Math.PI) * (r-20);
	var ry = cy + Math.sin((sangle + 3)/ 360 * 2 * Math.PI) * (r-20);

	var mx = cx + Math.cos((sangle)/ 360 * 2 * Math.PI) * (r-30);
	var my = cy + Math.sin((sangle)/ 360 * 2 * Math.PI) * (r-30);

	
	var path = "M " + sx +" " + sy;
	path += "L " + lx + " " + ly;
	path += "Q " + mx + " " + my + " " + rx + " " + ry;
	path += "L " + sx + " " + sy;

	return path;
}

function validateAndFixInputs(params){

    params.segments = params.segments < 1 ? 1:params.segments
 
    params.progress = params.progress < 0 ? 0 : params.progress
    params.progress = params.progress > 100 ? 100 : params.progress
}


function generate(window,params){

    validateAndFixInputs(params)
    
    //init
    var colorArray = jsgradient.generateGradient('#DCC7D7','#731f61', params.segments);

    //preparing data - marker
    var degreeValue = 180 * (params.progress - 50) / 100; 


    var config = {
        arcs : {
            segments : params.segments,
            innerRadius: 120,
            outerRadius: 140,
            stroke: '#731f61',
            strokeWidth:'0'
        },
        label: {
            display : params.label,
            fontFamily: "sans-serif",
            fontSize: "60px"
        },
        marker: {
            degreeValue: degreeValue
        },
        transform: "translate(200,200)",
        colorArray: colorArray

    }

    //preparing data - segments
    var segments = [];
    var currentAngle = - Math.PI/2;
    var segmentLength = Math.PI / config.arcs.segments
    for(i=0;i<config.arcs.segments;i++){

        var segment = {};
        segment.arcData = d3Shape.arc()
                .innerRadius(config.arcs.innerRadius)
                .outerRadius(config.arcs.outerRadius)
                .startAngle(currentAngle)
                .endAngle(currentAngle + segmentLength)
        
        segment.stroke = config.arcs.stroke;
        segment.strokeWidth = config.arcs.strokeWidth;
        segment.transform = config.transform;
        segment.fill = config.colorArray[i];

        currentAngle += segmentLength;
        segments.push(segment);
    }

    window.d3 = d3.select(window.document); //get d3 into the dom
        
    window.d3.select('body')
    .append('div').attr('class','container') //make a container div to ease the saving process
    .append('svg')
    .attr("xmlns", 'http://www.w3.org/2000/svg')
    .attr("id","svg")
    .attr("width",400)
    .attr("height",250)
    
    var svg = window.d3.select('svg')
    
    svg.selectAll('path').data(segments)
    .enter()
    .append('path')
    .attr('d', function(d) {return d.arcData()})
    .attr('stroke', function(d) {return d.stroke})
    .attr('stroke-width', function(d) {return d.strokeWidth})
    .attr('transform', function(d) {return d.transform})
    .attr('fill', function(d) {return d.fill})

    svg.append('path')
    .attr('d', calcSemiArcMarker(0,0,125,config.marker.degreeValue))
    .attr('transform', "translate(200,200)")

    if(config.label.display === "true") {
        svg.append('text')
        .attr("font-family", config.label.fontFamily)
        .attr("font-size", config.label.fontSize)
        .attr("fill", config.label.fontColor)
        .attr("text-anchor","middle")
        .text(params.progress + "%")
        .attr('transform', "translate(200,185)")
    }

    var temp = '<?xml version="1.0" encoding="utf-8"?>\n';
    temp +=   window.document.querySelector('#svg').outerHTML;

    return temp;

}

module.exports = generate