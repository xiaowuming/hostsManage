var dialog = require('./dialog.js');
module.exports = {
    /**
     * 启动DNS服务
     */
    startDnsServer: function (target, noPermissionTips) {
        $.ajax({
            url: '/startDns',
            data: {},
            success: function (result) {
                if (result.code != 100) {
                    dialog.alert(noPermissionTips, null, 'lg');
                } else {
                    target.remove();
                    dialog.alert('<h4 class="lh24"><i class="glyphicon glyphicon-ok succ"></i>启动成功</h4><p class="lh24">手机上设置DNS为[' + _localIP + ']可以同步本机Hosts.</p>', null, 'lg');
                }
            }
        });
    }
};