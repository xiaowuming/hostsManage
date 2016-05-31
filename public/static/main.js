var dialog = require('./dialog.js'),
    group = require('./group'),
    dns = require('./dns.js');
$(function () {
    /**
     * 肖武明
     * xiaowuming@gmail.com
     */
    var _ = {
        _noPermissionTips: '<p class="lh24"><i class="glyphicon glyphicon-info-sign fail"></i>无权限操作,请用sudo命令启动服务:<code>sudo hosts-manage start</code></p>',
        init: function () {
            this.bindTab();
            this.bindBtn();
        },
        /**
         * 绑定按钮
         */
        bindBtn: function () {
            var self = this;
            //启动DNS
            $('#J_start_dns').on('click', function () {
                dns.startDnsServer($(this), self._noPermissionTips);
            });

            //添加组
            $('#J_add_group_btn').on('click', function () {
                group.create('', null);
            });

        },
        /**
         * 绑定Tab
         */
        bindTab: function () {
            $('a[data-toggle="tab"]').on('shown.bs.tab', function () {
                $('input[type=checkbox]')
                    .prop('checked', false)
                    .removeAttr('data-select');
            })
        }
    };
    _['init']();
});