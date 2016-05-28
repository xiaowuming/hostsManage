var HostsFileAction = require('./HostsFileAction');
module.exports = {
    /**
     * 管理页面
     */
    ManagePage: function (req, res) {
        HostsFileAction.getHostsFileContent(function (data) {
            res.render('index', {title: 'HostsManage', data: data});
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

    }
}