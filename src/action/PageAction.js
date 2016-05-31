var HostsFileAction = require('./HostsFileAction'),
    IPAdress = require('./../util/IPAdress'),
    DNSServer = require('./../util/DnsServer'),
    Print = require('./../util/print');

module.exports = {
    /**
     * 初始化
     */
    init: function () {
        HostsFileAction.getHostsFileContent(function (data) {
            global._hostData = data;
        });
    },
    /**
     * 管理页面
     */
    ManagePage: function (req, res) {
        res.render('index', {
            title: 'hosts-manage',
            data: global._hostData,
            localIP: IPAdress.getLocalIP(),
            dnsStart: global.dnsIsStart
        });
    },
    /**
     * 更新hosts
     */
    UpdateHosts: function (req, res) {
        var content = req.body.content;
        var hostsGroup = JSON.parse(content);
        HostsFileAction.writeHosts(hostsGroup, function (status) {
            if (status) {
                Print(req, res, 100);
            } else {
                Print(req, res, -1);
            }
        });
    },
    /**
     * 启动DNS服务
     */
    StartDnsServer: function (req, res) {
        DNSServer(function (result) {
            if (result) {
                Print(req, res, 100);
            } else {
                Print(req, res, -1);
            }
        });

    },
    /**
     * 添加组
     * @param req
     * @param res
     * @constructor
     */
    AddGroup: function (req, res) {
        var groupName = req.body.groupName;
        if (global._hostData[groupName]) {
            //已经存在
            Print(req, res, -2);
        } else {

            Print(req, res, 100);
        }
    }
}