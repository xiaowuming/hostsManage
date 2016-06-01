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
                if ($('.J_pane').size() <= 8) {
                    group.create('', self.insertNewGroup.bind(self));
                } else {
                    dialog.alert('组的数量不要多于8个哦~~~');
                }
            });

            $('#J_tab_content')
            //修改组名
                .on('click', '.J_edit_group', function () {
                    self.editGroup($(this).parents('.J_pane'));
                })
                //删除组
                .on('click', '.J_delete_group', function () {
                    self.removeGroup($(this).parents('.J_pane').attr('data-id'))
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
         * 删除组
         * @param id
         */
        removeGroup: function (id) {
            dialog.confirm('确定删除?', function () {
                group.removeGroup(id, function () {
                    $('#J_tab_' + id).remove();
                    $('#J_content' + id).remove();
                    $('#J_nav_tabs li').eq(1).addClass('active');
                    $('#J_tab_content .J_pane').eq(0).addClass('active');
                });
            });
        },
        /**
         * 修改组
         * @param target
         */
        editGroup: function (target) {
            var name = target.attr('data-label'),
                id = target.attr('data-id');
            group.editForm('修改组', name, function (newName) {
                group.postEditData(id, newName, function (status) {
                    target
                        .attr('data-label', newName)
                        .attr('data-id', id);
                    $('#J_tab_' + id).text(newName);
                });
            });
        },
        /**
         * 插入新组
         * @param group
         */
        insertNewGroup: function (group) {
            $('.J_hosts .active').removeClass('active');

            var tpl = '<li role="presentation" class="active"><a href="#J_content' + group.id + '" aria-controls="home" role="tab" data-toggle="tab" id="J_tab_' + group.id + '">' + group.name + '</a></li>';
            $('#J_nav_tabs').append(tpl);

            var content_tpl = '<div role="tabpanel" data-label="' + group.name + '" data-id="' + group.id + '" class="J_pane tab-pane active" id="J_content' + group.id + '">\
                    <ul class="hosts_items"><li class="item head">\
                    <div class="allSelect">\
                    <label><input type="checkbox" class="J_all_select"> 全选</label>\
                    </div>\
                    <div class="action">\
                    <button class="btn btn-default btn-xs J_add_hosts" type="submit">添加Hosts</button>\
                    <button class="btn btn-default btn-xs J_edit_group" type="submit">修改组名</button>\
                    <button class="btn btn-default btn-xs J_delete_group" type="submit">删除组</button>\
                    </div>\
                    </li></ul></div>';
            $('#J_tab_content').append(content_tpl);

        }
    };
    _['init']();
});