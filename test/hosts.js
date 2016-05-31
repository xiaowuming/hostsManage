var Hosts = require('./../src/util/Hosts');

Hosts.init();
setTimeout(function () {


    // 获取数据
    //Hosts.getHostsData(function (data) {
    //    console.log(data);
    //});

    // 移动
    //Hosts.changeGroupByHostsID([10008, 10009, 10010], 10000, function (a, b) {
    //    console.log(a, b);
    //});

    // 移除
    //Hosts.removeHostsByHostsIDs([10005, 10006, 10007], function (a, b) {
    //    console.log(a, b);
    //});

    // 添加组
    //Hosts.addGroup('test', function (result, data) {
    //    console.log(result, data);
    //});

    //移除组
    //Hosts.removeGroup(10004, function (result) {
    //    console.log(result)
    //});

    // 组改名
    //Hosts.renameGroupByGroupID(10004, '新名称', function (status, a) {
    //    console.log(status, a);
    //});

    //添加Hosts
    //Hosts.addHosts([{ip: '127.0.0.1', domain: 'www.google.com'}, {
    //    ip: '127.0.0.1',
    //    domain: 'www.google.hk'
    //}], 10004, function (status, a) {
    //    console.log(status, a);
    //});

    //更新
    //Hosts.updateHosts(100016, '8.8.8.8', 'www.xxxxx.com', function (a, b) {
    //    console.log(a, b);
    //});
}, 1000);