/**
 * Created by deng on 16-5-31.
 */
var PROXY_LIST = [
    {"ip": "115.223.197.20", "port": "9000"},
    {"ip": "115.218.124.217", "port": "9000"},
    {"ip": "1.60.157.120	", "port": "9000"},
    {"ip": "182.109.83.60", "port": "9000"},
    {"ip": "183.130.93.73", "port": "9000"},
    {"ip": "113.77.177.36", "port": "8090"},
    {"ip": "115.223.200.96", "port": "9000"},
    {"ip": "112.195.84.125", "port": "9000"},
    {"ip": "115.218.221.155", "port": "9000"},
    {"ip": "115.223.245.132", "port": "9000"},
    {"ip": "59.55.58.8", "port": "9000"},
    {"ip": "180.104.175.222", "port": "9000"},
    {"ip": "119.7.89.146", "port": "9000"},
    {"ip": "119.7.88.192", "port": "9000"},
    {"ip": "220.177.175.170", "port": "9000"}];


exports.GetProxy = function () {
    var randomNum = parseInt(Math.floor(Math.random() * PROXY_LIST.length));
    var proxy = PROXY_LIST[randomNum];
    return 'http://' + proxy.ip + ':' + proxy.port;
}