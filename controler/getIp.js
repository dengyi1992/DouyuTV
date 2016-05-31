/**
 * Created by deng on 16-5-31.
 */
var request = require('request');
var cheerio = require('cheerio');

exports.getIp=function () {
    for(var i=1;i<10;i++){
        var options1 = {
            method: 'GET',
            encoding: null,
            url:'http://www.kuaidaili.com/free/inha/'+i
        };
        request(options1, function (error, response, body) {
            if (!error ) {
                try {
                    var $ = cheerio.load(body);  //cheerio解析data
                    var ipinfo = $('tbody tr').toArray();
                    console.log(ipinfo);

                } catch (e) {
                    console.log(e)
                }

            }
        });
    }

};
