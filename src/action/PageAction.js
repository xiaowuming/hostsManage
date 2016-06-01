var Hosts = require('./../util/Hosts'),
    IPAdress = require('./../util/IPAdress'),
    DNSServer = require('./../util/DnsServer'),
    Print = require('./../util/print');

module.exports = {
    /**
     * 管理页面
     */
    ManagePage: function (req, res) {
        res.render('page', {
            title: 'hosts-manage',
            data: Hosts.getHostsDataSync(),
            localIP: IPAdress.getLocalIP(),
            dnsStart: global.dnsIsStart
        });
    },
    /**
     * 启动DNS
     */
    StartDnsServer: function (req, res) {
        DNSServer(function (result) {
            if (result) {
                Print.result(req, res, 100);
            } else {
                Print.result(req, res, -2);
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
        var groupName = req.body.name;
        Hosts.addGroup(groupName, function (status, group) {
            Print.result(req, res, status, group);
        });
    },
    /**
     * 编辑组
     * @param req
     * @param res
     * @constructor
     */
    EditGroup: function (req, res) {
        var groupName = req.body.name,
            id = req.body.id;
        Hosts.renameGroupByGroupID(id, groupName, function (status) {
            Print.result(req, res, status);
        });
    },
    /**
     * 删除组
     * @param req
     * @param res
     * @constructor
     */
    RemoveGroup: function (req, res) {
        var id = req.query.id;
        Hosts.removeGroup(id, function (status) {
            Print.result(req, res, status);
        });
    }
}