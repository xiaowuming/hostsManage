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

	module.exports = __webpack_require__(5);


/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	module.exports = {
	    /**
	     * 初始化
	     * @param title
	     * @param content
	     * @param sizeType
	     * @param autoRemove
	     */
	    init: function init(title, content, sizeType, autoRemove) {
	        this.insertHTML();
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
	     * 插入HTML
	     */
	    insertHTML: function insertHTML() {
	        var tpl = '<div id="J_dialog_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" class="modal fade">            <div id="J_dialog_type" rel="document" class="modal-dialog">            <div class="modal-content">            <div class="modal-header">            <button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button>        <h4 id="mySmallModalLabel" class="modal-title"><span id="J_dialog_title" class="fn12">kocm.com</span>            <a  href="#mySmallModalLabel" class="anchorjs-link"><span class="anchorjs-icon"></span></a></h4>            </div>            <div id="J_dialog_content" class="modal-body"></div>            </div>            </div>            </div>';
	        if (!this._insertHTML) {
	            this._insertHTML = true;
	            $('body').append(tpl);
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
	};

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = function (option) {
	    var dialog = __webpack_require__(1);
	    $.ajax({
	        url: option.url,
	        type: option.type,
	        data: option.data,
	        success: function success(result) {
	            setTimeout(function () {
	                if (result.code == -2) {
	                    dialog.alert('<p class="lh24"><i class="glyphicon glyphicon-info-sign fail"></i>无权限操作,请用sudo命令启动服务:<code>sudo hosts-manage start</code></p>', null, 'lg');
	                } else if (result.code == -1) {
	                    dialog.alert('<p class="lh24"><i class="glyphicon glyphicon-info-sign fail"></i>操作异常.</p>');
	                } else {
	                    option.success && option.success(result);
	                }
	            }, 500);
	        }
	    });
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var dialog = __webpack_require__(1),
	    ajax = __webpack_require__(2);
	module.exports = {
	    /**
	     * 启动DNS服务
	     */
	    startDnsServer: function startDnsServer(target) {
	        ajax({
	            url: '/startDns',
	            data: {},
	            success: function success() {
	                target.remove();
	                dialog.alert('<h4 class="lh24"><i class="glyphicon glyphicon-ok succ"></i>启动成功</h4><p class="lh24">手机上设置DNS为[' + _localIP + ']可以同步本机Hosts.</p>', null, 'lg');
	            }
	        });
	    }
	};

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var dialog = __webpack_require__(1),
	    ajax = __webpack_require__(2);
	module.exports = {
	    /**
	     * 创建组
	     */
	    create: function create(groupName, callback) {
	        var self = this;
	        self.editForm('添加组', '', function (groupName) {
	            self.postAddData(groupName, function (status, data) {
	                if (status && callback) {
	                    callback(data);
	                }
	            });
	        });
	    },
	    /**
	     * 编辑表单
	     * @param title
	     * @param groupName
	     * @param callback
	     */
	    editForm: function editForm(title, groupName, callback) {
	        var form = $('<form>                <div class="form-group">                <label for="J_newGroupName">组名</label>            <input type="text" required class="form-control" name="groupName" value="' + groupName + '" id="J_newGroupName" placeholder="组名">                </div>            <button type="submit" class="btn btn-info">确定</button>            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>                </form>');
	        dialog.init(title, form, 'sm');

	        form.on('submit', function () {
	            callback && callback($('#J_newGroupName').val().trim());
	            dialog.closeDialog();
	            return false;
	        });
	    },
	    /**
	     * 发送新增数据
	     * @param groupName
	     * @param callback
	     */
	    postAddData: function postAddData(groupName, callback) {
	        ajax({
	            url: '/addGroup',
	            type: 'post',
	            data: {
	                name: groupName
	            },
	            success: function success(result) {
	                if (result.code == 100) {
	                    callback && callback(true, result.data);
	                }
	            }
	        });
	    },
	    /**
	     * 提交编辑数据
	     * @param id
	     * @param name
	     * @param callback
	     */
	    postEditData: function postEditData(id, name, callback) {
	        ajax({
	            url: '/editGroup',
	            data: {
	                id: id,
	                name: name
	            },
	            type: 'post',
	            success: function success(result) {
	                if (result.code == 100) {
	                    callback && callback(true);
	                }
	            }
	        });
	    },
	    /**
	     * 删除组
	     * @param id
	     * @param callback
	     */
	    removeGroup: function removeGroup(id, callback) {
	        ajax({
	            url: '/removeGroup',
	            data: {
	                id: id
	            },
	            success: function success(result) {
	                if (result.code == 100) {
	                    callback && callback(true);
	                }
	            }
	        });
	    }
	};

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var dialog = __webpack_require__(1),
	    group = __webpack_require__(4),
	    dns = __webpack_require__(3);
	$(function () {
	    /**
	     * 肖武明
	     * xiaowuming@gmail.com
	     */
	    var _ = {
	        init: function init() {
	            this.bindTab();
	            this.bindBtn();
	        },
	        /**
	         * 绑定按钮
	         */
	        bindBtn: function bindBtn() {
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
	                self.removeGroup($(this).parents('.J_pane').attr('data-id'));
	            });
	        },
	        /**
	         * 绑定Tab
	         */
	        bindTab: function bindTab() {
	            $('a[data-toggle="tab"]').on('shown.bs.tab', function () {
	                $('input[type=checkbox]').prop('checked', false).removeAttr('data-select');
	            });
	        },
	        /**
	         * 删除组
	         * @param id
	         */
	        removeGroup: function removeGroup(id) {
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
	        editGroup: function editGroup(target) {
	            var name = target.attr('data-label'),
	                id = target.attr('data-id');
	            group.editForm('修改组', name, function (newName) {
	                group.postEditData(id, newName, function (status) {
	                    target.attr('data-label', newName).attr('data-id', id);
	                    $('#J_tab_' + id).text(newName);
	                });
	            });
	        },
	        /**
	         * 插入新组
	         * @param group
	         */
	        insertNewGroup: function insertNewGroup(group) {
	            $('.J_hosts .active').removeClass('active');

	            var tpl = '<li role="presentation" class="active"><a href="#J_content' + group.id + '" aria-controls="home" role="tab" data-toggle="tab" id="J_tab_' + group.id + '">' + group.name + '</a></li>';
	            $('#J_nav_tabs').append(tpl);

	            var content_tpl = '<div role="tabpanel" data-label="' + group.name + '" data-id="' + group.id + '" class="J_pane tab-pane active" id="J_content' + group.id + '">                    <ul class="hosts_items"><li class="item head">                    <div class="allSelect">                    <label><input type="checkbox" class="J_all_select"> 全选</label>                    </div>                    <div class="action">                    <button class="btn btn-default btn-xs J_add_hosts" type="submit">添加Hosts</button>                    <button class="btn btn-default btn-xs J_edit_group" type="submit">修改组名</button>                    <button class="btn btn-default btn-xs J_delete_group" type="submit">删除组</button>                    </div>                    </li></ul></div>';
	            $('#J_tab_content').append(content_tpl);
	        }
	    };
	    _['init']();
	});

/***/ }
/******/ ]);