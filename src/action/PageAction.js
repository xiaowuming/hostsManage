var HostsFileAction = require('./HostsFileAction'),
    IPAdress = require('./../util/IPAdress'),
    DNSServer = require('./../util/DnsServer');

module.exports = {
    /**
     * 管理页面
     */
    ManagePage: function (req, res) {
        HostsFileAction.getHostsFileContent(function (data) {
            res.render('index', {
                title: 'hosts-manage',
                data: data,
                localIP: IPAdress.getLocalIP(),
                dnsStart: global.dnsIsStart
            });
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
                res.send({result: true});
            } else {
                res.send({result: false});
            }
        });
    },
    /**
     * 启动DNS服务
     */
    StartDnsServer: function (req, res) {
        DNSServer(function (result) {
            if (result) {
                res.send({code: 100});
            } else {
                res.send({code: 0});
            }
        });

    }
}