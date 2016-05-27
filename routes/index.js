var express = require('express');
var router = express.Router();

var PageAction = require('./../src/action/PageAction');

// 管理页面
router.get('/', PageAction.ManagePage.bind(PageAction));
// 更新Hosts
router.post('/update',PageAction.UpdateHosts.bind(PageAction));

//favicon.ico
router.get('favicon.ico', function (req, res) {
    res.end()
});

module.exports = router;
