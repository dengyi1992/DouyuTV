var express = require('express');
var cheerio = require('cheerio');
var request = require('request');
var EventEmitter = require('events').EventEmitter;
var myEvents = new EventEmitter();
var router = express.Router();
var Room = require('../models/room.js');
var mysql = require('mysql');
var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'dengyi',
    database: 'douyu',
    port: 3306
});
/* GET home page. */
router.get('/', function (req, res, next) {
    if (req.query.Start == undefined) {
        return res.json({err: "err params"})
    }
    myEvents.emit('geted', parseInt(req.query.Start));

    res.json({msg: "getit"});

});
router.get('/crawlerAndroid', function (req, res, next) {
    if (req.query.pagenumber == undefined) {
        return res.json({err: "err params"})
    }
    myEvents.emit('initData',req.query.pagenumber);
    res.json({msg: 'android api initing'});

});

myEvents.on('geted', function (Start) {

    for (var i = Start; i < Start + 20; i++) {
        console.log(i);

        doGET(i);

    }
});
function doGET(i) {
    var optionsfordetail = {
        method: 'GET',
        encoding: null,
        url: "http://www.douyu.com/" + i
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
                })
            } catch (e) {
                console.log(e)
            }

        }
    });
}
myEvents.on('insert', function (AddParams) {
    var AddSql = 'INSERT INTO dy(url,name,roomName,tags) VALUES(?,?,?,?)';
    conn.query(AddSql, AddParams, function (err, result) {
        if (err) {
            console.log(err);
            return;
        }
    });
});
myEvents.on('initData', function (pn) {
    var douyuApi = {
        method: 'GET',
        encoding: null,
        url: "http://capi.douyucdn.cn/api/v1/live?limit=100&offset="+parseInt(pn)*100
    };
    request(douyuApi, function (err, response, body) {
        if (err) {
            return console.log(err);
        }
        acquireData(JSON.parse(body))
    })

});
/**
 * room_id : 4809
 * room_src : http://rpic.douyucdn.cn/z1605/30/11/4809_160530111408.jpg
 * vertical_src : http://rpic.douyucdn.cn/z1605/30/11/4809_160530111408.jpg
 * isVertical : 0
 * cate_id : 1
 * room_name : 【饼干】新版皮城女警打野!
 * show_status : 1
 * subject :
 * show_time : 1464564457
 * owner_uid : 184165
 * specific_catalog :
 * specific_status : 1
 * vod_quality : 0
 * nickname : 饼干狂魔MasterB
 * online : 506338
 * url : /4809
 * game_url : /directory/game/LOL
 * game_name : 英雄联盟
 * child_id : 33
 * avatar : http://uc.douyutv.com/upload/avatar/000/18/41/65_avatar_big.jpg
 * fans : 1256209
 * ranktype : 0
 */
function acquireData(data) {
    var sql = 'replace INTO dy (room_id, room_name, owner_uid, nickname, online, game_name, fans) VALUES (?,?,?,?,?,?,?)';
    data.data.forEach(function (item) {
        var params=[item.room_id, item.room_name, item.owner_uid, item.nickname, item.online, item.game_name, item.fans];
        conn.query(sql,params, function (err, result) {
            if (err) {
                console.log(err);
                return;
            }


        });

    });
}

module.exports = router;
