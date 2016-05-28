$(function () {
    var _ = {
        init: function () {
            this.bindAllSelect();
            this.bindTab();
            this.bindBtn();
        },
        bindBtn: function () {
            var self = this;
            $('#J_delete_all_btn').on('click', function () {
                self.deleteHosts();
            });
            $('#J_pause_all_btn').on('click', function () {
                self.pauseHosts();
            });
            $('#J_start_all_btn').on('click', function () {
                self.startHosts();
            });

            //删除单个
            $('.J_item').on('click', '.J_delete_item', function () {
                $('input[type=checkbox]').prop('checked', false);
                $(this).parents('li').find('input[name=item]').attr('data-select', true);
                self.deleteHosts();
            });

            //禁用单个
            $('.J_item').on('click', '.invalidAction', function () {
                var _this = $(this);
                $('input[type=checkbox]').prop('checked', false);
                _this.parents('li').find('input[name=item]').attr('data-select', true);
                if (_this.parents('.item').hasClass('invalid')) {
                    self.startHosts();
                } else {
                    self.pauseHosts();
                }
            });

        },
        /**
         * 绑定Tab
         */
        bindTab: function () {
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                $('input[type=checkbox]').prop('checked', false);
            })
        },
        /**
         * 绑定全选
         */
        bindAllSelect: function () {
            var itemPane = $('.J_pane');
            //全选
            itemPane.find('.J_all_select').on('change', function () {
                var _this = $(this);
                if (_this.prop('checked')) {
                    _this.parents('.J_pane').find('input[name=item]').prop('checked', true);
                } else {
                    _this.parents('.J_pane').find('input[name=item]').prop('checked', false);
                }
            });

            itemPane.find('input[name=item]').on('change', function () {
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
            });
        },
        /**
         * 获取所有Hosts
         */
        getAllHosts: function () {
            var result = {};
            $('.J_pane').each(function () {
                var items = [];
                result[$(this).attr('data-lable')] = items;
                $(this).find('input[name=item]').each(function () {
                    var _this = $(this);
                    var item = {};
                    item.selected = _this.prop('checked');
                    if (_this.attr('data-select') == 'true') {
                        item.selected = true;
                    }
                    item.ip = _this.attr('data-ip');
                    item.domain = _this.attr('data-domain');
                    item.isInvalid = _this.attr('data-isinvalid') == 'true' ? true : false;
                    items.push(item);
                });
            });
            return result;
        },
        /**
         * 启动Hosts
         */
        startHosts: function () {
            var self = this;
            var data = self.getAllHosts();
            for (var i in data) {
                var group = data[i];
                for (var n in group) {
                    var item = group[n];
                    if (item.selected) {
                        item.isInvalid = false;
                    } else {
                        item.isInvalid = true;
                    }
                    delete item.selected;
                }
            }
            this.postHosts(data, function () {
                $('input[name=item]:checked,input[data-select=true]').parents('.item').removeClass('invalid');
                $('input[type=checkbox],input[data-select=true]').prop('checked', false).removeAttr('data-select');
            });
        },
        /**
         * 暂停hosts
         */
        pauseHosts: function () {
            var self = this;
            var data = self.getAllHosts();
            for (var i in data) {
                var group = data[i];
                for (var n in group) {
                    var item = group[n];
                    item.isInvalid = item.selected;
                    delete item.selected;
                }
            }
            this.postHosts(data, function () {
                $('input[name=item]:checked,input[data-select=true]').parents('.item').addClass('invalid');
                $('input[type=checkbox],input[data-select=true]').prop('checked', false).removeAttr('data-select');
            });
        },
        /**
         * 删除hosts
         */
        deleteHosts: function () {
            var self = this;
            var data = self.getAllHosts();
            var newData = {};
            for (var i in data) {
                newData[i] = [];
                var group = data[i],
                    newGroup = [];
                for (var n in group) {
                    var item = group[n];
                    if (!item.selected) {
                        newGroup.push(item);
                    }
                    delete item.selected;

                }
                newData[i] = newGroup;
            }
            this.postHosts(newData, function () {
                $('input[name=item]:checked,input[data-select=true]').parents('.item').remove();
                $('input[type=checkbox],input[data-select=true]').prop('checked', false).removeAttr('data-select');
            });
        },
        /**
         * 提交数据
         */
        postHosts: function (hosts, callback) {
            $.ajax({
                url: '/update',
                type: 'post',
                data: {content: JSON.stringify(hosts)},
                success: function (result) {
                    console.log(result);
                    callback && callback();
                }
            });
        }
    };
    _['init']();
});