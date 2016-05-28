#!/usr/bin/env node

var program = require('commander');

program
    .version(require("./package.json").version)
    .option('start', '启动服务')
    .parse(process.argv);

var commander = process.argv;
var appoint = process.argv[2];
if (commander.length < 3) {
    appoint = "start";
}
