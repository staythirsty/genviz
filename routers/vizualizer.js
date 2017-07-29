var http = require('http')
var jsdom = require('node-jsdom')
var url = require('url')
var express = require('express')

var router =  express.Router()
var speedometer = require("./../controllers/speedometer")
var circularprogressbar = require("./../controllers/circularprogressbar")

router.get('/speedometer', function (req, res) {
    generate(req,res, speedometer)
});


router.get('/circular', function (req, res) {
    generate(req,res, circularprogressbar)
});


function generate(req, res, vizgenerator) {

    jsdom.env({
        html:'',
		features:{ QuerySelector:true },
        done: function (errors, window) {
                res.writeHead(200, {'Content-Type': 'image/svg+xml'});
                
                var url_parts = url.parse(req.url, true);
                var query = url_parts.query;

                res.write(vizgenerator(window, query),'utf8',function(){
                res.end();
            });


         }
        });
}

module.exports = router
