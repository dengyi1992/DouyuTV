

var request = require('request');

var EventEmitter = require('events').EventEmitter;
var myEvents = new EventEmitter();

var count = 0;

//var start =11111;
//var start =18955;
var start =19194;

exports.timeTask = function () {

    var options1 = {
        method: 'GET',
        encoding: null,
        url: "http://localhost:3000?Start="+start
    };
    request(options1, function (error, response, body) {
        console.log(new Date());
        start=start+20
    });

};




