var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var EventEmitter = require('events').EventEmitter;
var myEvents = new EventEmitter();
var router = express.Router();
var Room=require('../models/room.js');
var mysql = require('mysql');
var conn = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'dengyi',
    database:'douyu',
    port:3306
});
/* GET home page. */
router.get('/', function (req, res, next) {
    if(req.query.Start==undefined){
        return res.json({err:"err params"})
    }
    myEvents.emit('geted',parseInt(req.query.Start));

    res.json({msg:"getit"});

});

myEvents.on('geted', function (Start) {

    for (var i = Start; i < Start+20; i++) {
        console.log(i);

        doGET(i);

    }
});
function doGET(i){
    var optionsfordetail = {
        method: 'GET',
        encoding: null,
        url: "http://www.douyu.com/"+i
    };
    request(optionsfordetail, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            try {
                var $ = cheerio.load(body);  //cheerio解析data
                var tags = [];
                var roomname = $('head title').toArray();
                if (roomname["0"].children["0"].data == "提示信息 -斗鱼") {
                    return;
                }
                var zb_name = $('.live-room .relate-text .r-else .zb-name').toArray();
                var zhubotag = $('.live-room .relate-text .r-else-tag dd').toArray();

                var len = zhubotag.length;
                for (var i = 0; i < len; i++) {
                    tags.push({tag: zhubotag[i].children["1"].attribs.title})
                }
                //var room = new Room(optionsfordetail.url,zb_name[0].children[0].data,roomname[0].children[0].data,tags);
                var AddParams = [optionsfordetail.url, zb_name[0].children[0].data, roomname[0].children[0].data, JSON.stringify(tags)];
                myEvents.emit('insert', AddParams);

                console.log({
                    url: optionsfordetail.url,
                    name: zb_name[0].children[0].data,
                    roomName: roomname[0].children[0].data,
                    tags: tags
                })}catch (e){
                console.log(e)
            }

        }
    });
}
myEvents.on('insert',function(AddParams){
    var  AddSql = 'INSERT INTO dy(url,name,roomName,tags) VALUES(?,?,?,?)';
    conn.query(AddSql,AddParams,function(err,result){
        if (err){
            console.log(err);
            return;
        }
    });
});

module.exports = router;
