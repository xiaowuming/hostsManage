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
    },
    /**
     * 批量添加Hosts
     * @param req
     * @param res
     * @constructor
     */
    AddMultipleHosts: function (req, res) {
        var groupId = req.body.groupId,
            hosts = JSON.parse(req.body.hosts);

        Hosts.addHosts(hosts, groupId, function (status, hosts) {
            Print.result(req, res, status, hosts);
        });
    },
    /**
     * 删除Hosts
     * @param req
     * @param res
     * @constructor
     */
    RemoveHosts: function (req, res) {
        var ids = JSON.parse(req.body.ids);
        Hosts.removeHostsByHostsIDs(ids, function (status) {
            Print.result(req, res, status);
        });
    },
    /**
     * 修改Hosts状态
     * @param req
     * @param res
     * @constructor
     */
    ChangeHostsStatus: function (req, res) {
        var ids = JSON.parse(req.body.ids),
            status = req.body.status == 'true' ? true : false;
        Hosts.changeHostsStatus(status, ids, function (status) {
            Print.result(req, res, status);
        });
    },
    /**
     * 修改组
     * @param req
     * @param res
     * @constructor
     */
    ChangeGroupIdByIds: function (req, res) {
        var ids = JSON.parse(req.body.ids),
            groupId = req.body.groupId;
        Hosts.changeGroupByHostsID(ids, groupId, function (status, hostsList) {
            Print.result(req, res, status, hostsList);
        })
    },
    /**
     * 修改Hosts
     * @param req
     * @param res
     * @constructor
     */
    EditHosts: function (req, res) {
        var id = req.body.id,
            ip = req.body.ip,
            domain = req.body.domain;
        Hosts.updateHosts(id, ip, domain, function (status) {
            Print.result(req, res, status);
        });
    }
};