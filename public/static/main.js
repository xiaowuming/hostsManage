var dialog = require('./lib/dialog.js'),
    group = require('./lib/group'),
    dns = require('./lib/dns.js');
$(function () {
    /**
     * 肖武明
     * xiaowuming@gmail.com
     */
    var _ = {
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
                group.create('', self.insertNewGroup.bind(self));
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
        },
        /**
         * 插入新组
         * @param group
         */
        insertNewGroup: function (group) {
            $('.J_hosts .active').removeClass('active');
            console.log(group);

        }
    };
    _['init']();
});