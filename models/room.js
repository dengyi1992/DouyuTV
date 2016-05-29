/**
 * Created by deng on 16-4-18.
 */
var mongodb = require('./db');
var crypto = require('crypto');
/**
 * console.log({url:optionsfordetail.url,name:zb_name[0].children[0].data,roomName:roomname[0].children[0].data,tags:tags})
 * @param room
 * @constructor
 */
function Room(room) {
    this.name = room.name;
    this.url = room.url;
    this.roomName = room.roomName;
    this.tags = room.tags;
    this.fans=room.fans;
};

module.exports = Room;

Room.prototype.save = function (callback) {

    var room = {
        name: this.name,
        url: this.url,
        roomName: this.roomName,
        tags:this.tags,
        fans:this.fans
    };
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection('rooms', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            collection.insert(room, {
                safe: true
            }, function (err, room) {
                mongodb.close();
                if (err) {
                    return callback(err);//错误，返回 err 信息
                }
                callback(null, room[0]);//成功！err 为 null，并返回存储后的用户文档
            });
        });
    });
};

//读取用户信息
Room.get = function (name, callback) {
    //打开数据库
    mongodb.open(function (err, db) {
        if (err) {
            return callback(err);//错误，返回 err 信息
        }
        db.collection('rooms', function (err, collection) {
            if (err) {
                mongodb.close();
                return callback(err);//错误，返回 err 信息
            }
            //查找用户名（name键）值为 name 一个文档
            collection.findOne({
                name: name
            }, function (err, room) {
                mongodb.close();
                if (err) {
                    return callback(err);//失败！返回 err 信息
                }
                callback(null, room);//成功！返回查询的用户信息
            });
        });
    });
};
