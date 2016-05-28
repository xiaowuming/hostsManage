#!/usr/bin/env node


var program = require('commander'),
    fs = require('fs'),
    open = require('open');

program
    .version(require("./package.json").version)
    .option('start', '启动服务')
    .parse(process.argv);

var commander = process.argv;
var appoint = process.argv[2];
if (commander.length < 3) {
    appoint = "start";
}

// 检测sudo权限
fs.writeFile('/etc/.hostsManage', 'TEST', function (err, date) {
    if (err) {
        console.log('你不是使用[sudo]权限启动HostsManage,将提供只读服务.');
        setTimeout(function () {
            console.log('使用"sudo hosts-manage start"可以完整的体验本服务.');
        }, 1000);
        setTimeout(function () {
            console.log('正在尝试启动只读服务...');
        }, 2000);
        setTimeout(function () {
            startServer();
            stopTips();
        }, 3000);
    } else {
        fs.unlink('/etc/.hostsManage');
        startServer();
        stopTips();
    }

});


function startServer() {
    require('./bin/start')(function () {
        console.log('自动打开管理页面,如果打开失败,请手动访问:http://127.0.0.1:9123');
        open('http://127.0.0.1:9123');
    })
}

function stopTips() {
    console.log('服务已经启动,要停止服务请按"Command + C"');
}