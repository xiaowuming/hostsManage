var express = require('express');
var router = express.Router();

var PageAction = require('./../src/action/PageAction'),
    HostsUtil = require('./../src/util/Hosts');


//初始化
HostsUtil.init();

// 管理页面
router.get('/', PageAction.ManagePage.bind(PageAction));

//// 更新Hosts
//router.post('/updateHosts', PageAction.UpdateHosts.bind(PageAction));
//
//// 添加组
//router.post('/addGroup', PageAction.AddGroup.bind(PageAction));
//
//启动DNS
router.get('/startDns', PageAction.StartDnsServer.bind(PageAction));

//favicon.ico
router.get('favicon.ico', function (req, res) {
    res.end()
});

module.exports = router;
