var dialog = require('./lib/dialog.js'),
    group = require('./lib/group.js'),
    hosts = require('./lib/hosts.js'),
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
                })
                .on('click', '.J_add_hosts', function () {
                    //添加Hosts
                    self.addMultipleHosts($(this).parents('.J_pane').attr('data-id'));
                })
                .on('change', '.J_all_select', function () {
                    //全选
                    $(this).parents('.J_pane').find('input[name=item]').prop('checked', $(this).prop('checked'));
                })
                .on('change', 'input[name=item]', function () {
                    //单选
                    var _this = $(this);
                    if (_this.prop('checked')) {
                        var maxSize = _this.parents('.J_pane').find('input[name=item]').size(),
                            selectSize = _this.parents('.J_pane').find('input[name=item]:checked').size();
                        if (maxSize == selectSize) {
                            _this.parents('.J_pane').find('.J_all_select').prop('checked', true);
                        }
                    } else {
                        _this.parents('.J_pane').find('.J_all_select').prop('checked', false);
                    }
                })
                .on('click', '.J_delete_item', function () {
                    //删除单个
                    $('input[type=checkbox]').prop('checked', false);
                    self.deleteHosts([$(this).parents('li').find('input[name=item]').attr('data-id')]);
                })
                .on('click', '.invalidAction', function () {
                    //禁用单个
                    var _this = $(this),
                        id = _this.parents('li').find('input[name=item]').attr('data-id');
                    if (_this.parents('.item').hasClass('invalid')) {
                        self.changeHostsStatus([id], false);
                    } else {
                        self.changeHostsStatus([id], true);
                    }
                })
                .on('click', '.ip,.domain', function () {
                    //修改Hosts
                    var target = $(this).parents('.J_item').find('input[name=item]');
                    var ip = target.attr('data-ip'),
                        domain = target.attr('data-domain'),
                        id = target.attr('data-id');

                    self.editHosts(ip, domain, id, target);
                })

            //批量启动hosts状态
            $('#J_start_all_btn').on('click', function () {
                self.changeMultipleHostsStatus(false);
            });

            //批量暂停Hosts状态
            $('#J_pause_all_btn').on('click', function () {
                self.changeMultipleHostsStatus(true);
            });

            //批量删除
            $('#J_delete_all_btn').on('click', function () {
                dialog.confirm('确定删除?', function () {
                    self.deleteMultipleHosts();
                });
            });

            //移动到...
            $('#J_start_move_btn').on('click', function () {
                self.hostsMoveGroup($('#J_tab_content .active').attr('data-id'));
            });


        },
        /**
         * 修改Hosts
         * @param ip
         * @param domain
         * @param id
         */
        editHosts: function (ip, domain, id, target) {
            hosts.editHostsForm('修改Hosts', ip, domain, function (ip, domain) {
                hosts.postEditHostsById(ip, domain, id, function () {
                    target.attr('data-ip', ip);
                    target.attr('data-domain', domain);
                    $('#J_item_' + id).find('.ip').text(ip).parent().find('.domain').text(domain);
                });
            });
        },
        /**
         * Hosts移动到组
         */
        hostsMoveGroup: function (groupId) {
            var self = this;
            var ids = [];
            $('input[name=item]:checked').each(function () {
                var id = $(this).attr('data-id');
                ids.push(id);
            });
            if (ids.length == 0) {
                return false;
            }
            var tpl = ['<div class="move_group">'];
            $('.J_pane').each(function () {
                var _this = $(this);
                if (groupId != _this.attr('data-id')) {
                    tpl.push('<label><input type="radio" name="group" value="' + _this.attr('data-id') + '"/>' + _this.attr('data-label') + '</label>');
                }

            });

            if (tpl.length > 1) {
                tpl.push('<hr/>');
                tpl.push('<label><input type="radio" name="group" value="0"/>新建组...</label>');
            } else {
                tpl.push('<label><input type="radio" checked name="group" value="0"/>新建组...</label>');
            }

            tpl.push('</div>');

            tpl.push('<div style="padding-top:10px;" class="ar"><button type="button" class="btn btn-info" id="J_move_group_confirm_btn">确定</button>\
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button></div>');

            dialog.init('移动到...', tpl.join(''), 'lg');

            $('#J_move_group_confirm_btn').on('click', function () {
                var groupId = $('input[name=group]:checked').val();
                if (groupId == '0') {
                    setTimeout(function () {
                        group.create('', function (group) {
                            self.insertNewGroup(group);
                            hosts.changeGroupIdByIds(ids, group.id, function (hosts) {
                                move(ids, hosts, group.id);
                            });
                        });
                    }, 500);
                } else {
                    hosts.changeGroupIdByIds(ids, groupId, function (hosts) {
                        move(ids, hosts, groupId);
                    });
                }

                dialog.closeDialog();
            });

            function move(ids, hosts, groupId) {
                for (var i = 0; i < ids.length; i++) {
                    var id = ids[i];
                    $('#J_item_' + id).remove();
                }

                var tpl = [];
                for (var i in hosts) {
                    var item = hosts[i];
                    tpl.push('<li class="J_item item"  id="J_item_' + item.id + '">\
                        <div class="select"><input name="item" type="checkbox" data-id="' + item.id + '" data-ip="' + item.ip + '" data-domain="' + item.domain + '" data-isinvalid="false">\
                        </div>\
                        <div class="invalidAction">#</div>\
                        <div class="ip">' + item.ip + '</div>\
                        <div class="domain">' + item.domain + '</div>\
                            <div class="delete J_delete_item">x</div>\
                            </li>');
                }
                $('#J_nav_tabs .active').removeClass('active');
                $('#J_tab_content .active').removeClass('active');

                $('#J_content' + groupId).find('.hosts_items li').eq(0).after(tpl.join(''));

                $('#J_content' + groupId).addClass('active');
                $('#J_tab_' + groupId).parent().addClass('active');
            }

        },
        /**
         * 删除多个Hosts
         */
        deleteMultipleHosts: function () {
            var ids = [];
            $('input[name=item]:checked').each(function () {
                var id = $(this).attr('data-id');
                ids.push(id);
            });
            if (ids.length > 0) {
                this.deleteHosts(ids);
            }
        },
        /**
         * 修改多个Hosts状态
         * @param target
         */
        changeMultipleHostsStatus: function (isInvalid) {
            var ids = [];
            $('input[name=item]:checked').each(function () {
                var id = $(this).attr('data-id');
                ids.push(id);
            });
            if (ids.length > 0) {
                this.changeHostsStatus(ids, isInvalid);
            }
        },
        /**
         * 启动/状态Hosts
         * @param ids
         */
        changeHostsStatus: function (ids, isInvalid) {
            hosts.changeHostsStatus(ids, status, function () {
                for (var i in ids) {
                    var id = ids[i];
                    if (isInvalid) {
                        $('#J_item_' + id).addClass('invalid');
                    } else {
                        $('#J_item_' + id).removeClass('invalid');
                    }
                }
                $('input[type=checkbox]').removeAttr('checked');
            });
        },
        /**
         * 删除Hosts
         * @param id
         */
        deleteHosts: function (ids) {
            hosts.deleteHostsByIds(ids, function () {
                for (var i in ids) {
                    var id = ids[i];
                    $('#J_item_' + id).remove();
                }
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
         * 添加多Hosts
         */
        addMultipleHosts: function (groupId) {
            hosts.addMultipleHosts(groupId, function (data) {
                var tpl = [];
                for (var i in data) {
                    var item = data[i];
                    tpl.push('<li class="J_item item"  id="J_item_' + item.id + '">\
                        <div class="select"><input name="item" type="checkbox" data-id="' + item.id + '" data-ip="' + item.ip + '" data-domain="' + item.domain + '" data-isinvalid="false">\
                        </div>\
                        <div class="invalidAction">#</div>\
                        <div class="ip">' + item.ip + '</div>\
                        <div class="domain">' + item.domain + '</div>\
                            <div class="delete J_delete_item">x</div>\
                            </li>');
                }
                $('#J_content' + groupId).find('.hosts_items li').eq(0).after(tpl.join(''));
            });
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