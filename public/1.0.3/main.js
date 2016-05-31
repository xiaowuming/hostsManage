/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(1);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	$(function () {
	    /**
	     * 肖武明
	     * xiaowuming@gmail.com
	     */
	    var _ = {
	        _noAuthText: '<p>无权限操作,请用如下命令启动服务:<p><code>sudo hosts-manage start</code>',
	        init: function init() {
	            this.bindTab();
	            this.bindBtn();
	        },
	        bindBtn: function bindBtn() {
	            var self = this;
	            //批量删除
	            $('#J_delete_all_btn').on('click', function () {
	                self.dialog.confirm('确定批量删除?', function () {
	                    self.deleteHosts();
	                });
	            });
	            //批量暂停
	            $('#J_pause_all_btn').on('click', function () {
	                self.pauseHosts();
	            });
	            //批量启动
	            $('#J_start_all_btn').on('click', function () {
	                self.startHosts();
	            });

	            //添加组
	            $('#J_add_group_btn').on('click', function () {
	                self.addGroup();
	            });

	            $('#J_tab_content').on('click', '.J_delete_item', function () {
	                //删除单个
	                $('input[type=checkbox]').prop('checked', false);
	                $(this).parents('li').find('input[name=item]').attr('data-select', true);
	                self.deleteHosts();
	            }).on('click', '.invalidAction', function () {
	                //禁用单个
	                var _this = $(this);
	                $('input[type=checkbox]').prop('checked', false);
	                _this.parents('li').find('input[name=item]').attr('data-select', true);
	                if (_this.parents('.item').hasClass('invalid')) {
	                    self.startHosts();
	                } else {
	                    self.pauseHosts();
	                }
	            }).on('click', '.J_delete_group', function () {
	                //删除组
	                self.dialog.confirm('确定删除该组?', function () {
	                    self.deleteGroup();
	                });
	            }).on('click', '.J_edit_group', function () {
	                //修改组名
	                var name = $(this).parents('.J_pane').attr('data-label');
	                self.editGroup($(this).parents('.J_pane'), name);
	            }).on('click', '.J_add_hosts', function () {
	                //添加Hosts
	                var _this = $(this);
	                self.addMultipleHosts(_this);
	            }).on('click', '.ip,.domain', function () {
	                //修改Hosts
	                var target = $(this).parents('.J_item').find('input[name=item]');
	                var ip = target.attr('data-ip'),
	                    domain = target.attr('data-domain');

	                self.editHostsForm('修改Hosts', ip, domain, function (ip, domain) {
	                    target.attr('data-ip', ip).attr('data-domain', domain);
	                    target.parents('.J_item').find('.ip').text(ip);
	                    target.parents('.J_item').find('.domain').text(domain);
	                    self.startHosts();
	                });
	            }).on('change', '.J_all_select', function () {
	                //全选
	                $(this).parents('.J_pane').find('input[name=item]').prop('checked', $(this).prop('checked'));
	            }).on('change', 'input[name=item]', function () {
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
	            });

	            //DNS
	            $('#J_start_dns').on('click', function () {
	                self.startDnsServer($(this));
	            });
	        },
	        /**
	         *
	         * 添加多个Hosts
	         */
	        addMultipleHosts: function addMultipleHosts(target) {
	            var self = this;
	            var tpl = $('<form action="#">                    <textarea required class="form-control" name="hosts" id="J_addMultipleHosts" rows="10" placeholder="请输入Hosts,一行一个,不支持正则,不支持#注释符\n正确示例如:\n127.0.0.1 www.abc.com www.efg.com\n192.168.0.1 www.google.com"></textarea>                    <div class="btn_area mt10 ar">                    <button type="submit" class="btn btn-info">确定</button>                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>                    </div>                </form>');
	            self.dialog.init('批量添加Hosts', tpl, 'lg', false);

	            tpl.on('submit', function () {
	                var str = $('#J_addMultipleHosts').val().trim();
	                installNewHosts(str);
	                self.dialog.closeDialog();
	                return false;
	            });

	            function installNewHosts(str) {
	                var obj = str.split('\n'),
	                    tpl = [];
	                for (var i in obj) {
	                    var item = obj[i].trim();
	                    if (item.indexOf('#') == -1) {
	                        var o = item.split(' ');
	                        for (var n = 1; n < o.length; n++) {
	                            if (o[n].trim()) {
	                                var ip = o[0],
	                                    domain = o[n];
	                                tpl.push('<li class="J_item item">                        <div class="select"><input name="item" type="checkbox" data-ip="' + ip + '" data-domain="' + domain + '" data-isinvalid="false">                        </div>                        <div class="invalidAction">#</div>                        <div class="ip">' + ip + '</div>                        <div class="domain">' + domain + '</div>                            <div class="delete J_delete_item">x</div>                            </li>');
	                            }
	                        }
	                    }
	                }
	                var tmp = $(tpl.join(''));
	                target.parents('.head').after(tmp);
	                self.startHosts(function (status) {
	                    if (!status) {
	                        tmp.remove();
	                    }
	                });
	            }
	        },
	        /**
	         * 启动DNS服务
	         */
	        startDnsServer: function startDnsServer(target) {
	            var self = this;
	            $.ajax({
	                url: '/start_dns',
	                data: {},
	                success: function success(result) {
	                    if (result.code != 100) {
	                        self.dialog.alert(self._noAuthText);
	                    } else {
	                        target.remove();
	                        self.dialog.alert('<h3>启动成功</h3><p>手机上设置DNS为[' + _localIP + ']可以同步本机Hosts.</p>');
	                    }
	                }
	            });
	        },
	        /**
	         * 编辑Hosts表单
	         */
	        editHostsForm: function editHostsForm(title, ip, domain, callback) {
	            var self = this;
	            var form = $('<form>                <div class="form-group">                <label for="J_newGroupName">IP:</label>            <input type="text" required class="form-control" name="ip" value="' + ip + '" id="J_new_ip" placeholder="IP">                </div>                 <div class="form-group">                <label for="J_newGroupName">Domamin:</label>            <input type="text" required class="form-control" name="domain" value="' + domain + '" id="J_new_domain" placeholder="Domain">                </div>            <button type="submit" class="btn btn-info">确定</button>            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>                </form>');
	            this.dialog.init(title, form);

	            form.on('submit', function () {
	                callback && callback($('#J_new_ip').val().trim(), $('#J_new_domain').val().trim());
	                self.dialog.closeDialog();
	                return false;
	            });
	        },
	        /**
	         * 删除组
	         */
	        deleteGroup: function deleteGroup() {
	            $('#J_nav_tabs').find('li.active').remove();
	            $('#J_tab_content').find('.J_pane.active').remove();
	            $('#J_nav_tabs').find('li').eq(1).addClass('active');
	            $('#J_tab_content').find('.J_pane').eq(0).addClass('active');
	            this.startHosts();
	        },
	        /**
	         * 添加组
	         */
	        addGroup: function addGroup() {
	            if ($('.J_pane').size() > 8) {
	                this.dialog.alert('不能多于8个组哦.');
	                return false;
	            }
	            var self = this;
	            self.groupEditForm('添加组', '', function (groupName) {
	                $('.hosts .active').removeClass('active');
	                var key = new Date().getTime();
	                var tpl = '<li role="presentation" class="active"><a href="#_' + key + '" aria-controls="home" role="tab" data-toggle="tab">' + groupName + '</a></li>';
	                $('#J_nav_tabs').append(tpl);
	                var content_tpl = '<div role="tabpanel" data-label="' + groupName + '" class="J_pane tab-pane active" id="_' + key + '">                    <ul class="hosts_items"><li class="item head">                    <div class="allSelect">                    <label><input type="checkbox" class="J_all_select"> 全选</label>                    </div>                    <div class="action">                    <button class="btn btn-default btn-xs J_add_hosts" type="submit">添加Hosts</button>                    <button class="btn btn-default btn-xs J_edit_group" type="submit">修改组名</button>                    <button class="btn btn-default btn-xs J_delete_group" type="submit">删除组</button>                    </div>                    </li></ul></div>';
	                $('#J_tab_content').append(content_tpl);
	                self.startHosts();
	            });
	        },
	        /**
	         * 编辑组
	         */
	        editGroup: function editGroup(target, name) {
	            var self = this;
	            self.groupEditForm('修改组', name, function (groupName) {
	                target.attr('data-label', groupName);
	                $('#J_nav_tabs .active a').text(groupName);
	                self.startHosts();
	            });
	        },
	        /**
	         * 组编辑表单
	         * @param title
	         * @param groupName
	         * @param callback
	         */
	        groupEditForm: function groupEditForm(title, groupName, callback) {
	            var self = this;
	            var form = $('<form>                <div class="form-group">                <label for="J_newGroupName">组名</label>            <input type="text" required class="form-control" name="groupName" value="' + groupName + '" id="J_newGroupName" placeholder="组名">                </div>            <button type="submit" class="btn btn-info">确定</button>            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>                </form>');
	            this.dialog.init(title, form);

	            form.on('submit', function () {
	                callback && callback($('#J_newGroupName').val().trim());
	                self.dialog.closeDialog();
	                return false;
	            });
	        },
	        /**
	         * 绑定Tab
	         */
	        bindTab: function bindTab() {
	            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
	                $('input[type=checkbox]').prop('checked', false);
	            });
	        },
	        /**
	         * 获取所有Hosts
	         */
	        getAllHosts: function getAllHosts() {
	            var result = {};
	            $('.J_pane').each(function () {
	                var items = [];
	                result[$(this).attr('data-label')] = items;
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
	        startHosts: function startHosts(callback) {
	            var self = this;
	            var data = self.getAllHosts();
	            for (var i in data) {
	                var group = data[i];
	                for (var n in group) {
	                    var item = group[n];
	                    if (item.selected) {
	                        item.isInvalid = false;
	                    }
	                    delete item.selected;
	                }
	            }
	            this.postHosts(data, function (status) {
	                $('input[name=item]:checked,input[data-select=true]').parents('.item').removeClass('invalid');
	                $('input[type=checkbox],input[data-select=true]').prop('checked', false).removeAttr('data-select');
	                callback && callback(status);
	            });
	        },
	        /**
	         * 暂停hosts
	         */
	        pauseHosts: function pauseHosts() {
	            var self = this;
	            var data = self.getAllHosts();
	            for (var i in data) {
	                var group = data[i];
	                for (var n in group) {
	                    var item = group[n];
	                    if (item.selected) {
	                        item.isInvalid = true;
	                    }
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
	        deleteHosts: function deleteHosts() {
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
	        postHosts: function postHosts(hosts, callback) {
	            var self = this;
	            $.ajax({
	                url: '/update',
	                type: 'post',
	                data: { content: JSON.stringify(hosts) },
	                success: function success(data) {
	                    if (data.result === false) {
	                        setTimeout(function () {
	                            self.dialog.alert(self._noAuthText);
	                            callback && callback(false);
	                        }, 500);
	                    } else {
	                        callback && callback(true);
	                    }
	                }
	            });
	        },
	        /**
	         * dialog
	         */
	        dialog: {
	            /**
	             * 初始化Dialog
	             * @param title
	             * @param content
	             * @param sizeType
	             * @param autoRemove
	             */
	            init: function init(title, content, sizeType, autoRemove) {
	                if (sizeType) {
	                    if (sizeType == 'sm') {
	                        $('#J_dialog_modal').removeClass('bs-example-modal-lg').addClass('bs-example-modal-sm');
	                        $('#J_dialog_type').removeClass('modal-lg').addClass('modal-sm');
	                    } else if (sizeType == null) {
	                        $('#J_dialog_modal').removeClass('bs-example-modal-lg');
	                        $('#J_dialog_type').removeClass('bs-example-modal-lg');
	                    } else {
	                        $('#J_dialog_modal').addClass('bs-example-modal-lg').removeClass('bs-example-modal-sm');
	                        $('#J_dialog_type').addClass('modal-lg').removeClass('modal-sm');
	                    }
	                }
	                if (autoRemove == true) {
	                    $('#J_dialog_modal').modal('show');
	                } else {
	                    $('#J_dialog_modal').modal({
	                        backdrop: 'static',
	                        keyboard: false
	                    });
	                }
	                $('#J_dialog_title').html(title);
	                if (typeof content == 'string') {
	                    $('#J_dialog_content').html(content);
	                } else {
	                    $('#J_dialog_content').empty().append(content);
	                }
	            },
	            /**
	             * alert
	             * @param msg
	             * @param callback
	             * @param sizeType
	             */
	            alert: function alert(msg, callback, sizeType) {
	                var self = this;
	                var tpl = '<div></div><div class="fn14"> ' + msg + '</div><div class="ac mt10 bt1 pt10">' + '<button type="button" id="J_confirm_btn" class="btn btn-success">确定</button></div></div>';
	                $('#J_dialog_modal').modal('show');
	                self.init('提示', tpl, sizeType || 'sm');
	                $('#J_confirm_btn').on('click', function () {
	                    self.closeDialog();
	                    callback && callback();
	                });
	            },
	            /**
	             * 确认
	             * @param msg
	             * @param confirmCallBack
	             */
	            confirm: function confirm(msg, confirmCallBack) {
	                var self = this;
	                var tpl = '<div></div><div class="fn14"><i class="glyphicon glyphicon-question-sign orange"></i> ' + msg + '</div><div class="ar mt10 bt1 pt10">' + '<button type="button" id="J_confirm_btn" class="btn btn-success">确定</button>' + '<button type="button" id="J_cancel_btn" class="btn btn-default ml10">取消</button></div></div>';

	                $('#J_dialog_modal').modal('show');
	                self.init('请确认', tpl, 'sm');
	                $('#J_cancel_btn').on('click', self.closeDialog);

	                $('#J_confirm_btn').on('click', function () {
	                    self.closeDialog();
	                    setTimeout(function () {
	                        confirmCallBack();
	                    }, 500);
	                });
	            },
	            /**
	             * 关闭
	             * @param callback
	             */
	            closeDialog: function closeDialog(callback) {
	                $('#J_dialog_modal').modal('hide');
	                if (typeof callback == 'function') {
	                    setTimeout(function () {
	                        callback();
	                    }, 600);
	                }
	            }
	        }

	    };
	    _['init']();
	});

/***/ }
/******/ ]);