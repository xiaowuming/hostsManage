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
    }
}