module.exports = {
    /**
     * 初始化
     * @param title
     * @param content
     * @param sizeType
     * @param autoRemove
     */
    init: function (title, content, sizeType, autoRemove) {
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
    insertHTML: function () {
        var tpl = '<div id="J_dialog_modal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" class="modal fade">\
            <div id="J_dialog_type" rel="document" class="modal-dialog">\
            <div class="modal-content">\
            <div class="modal-header">\
            <button type="button" data-dismiss="modal" aria-label="Close" class="close"><span aria-hidden="true">×</span></button>\
        <h4 id="mySmallModalLabel" class="modal-title"><span id="J_dialog_title" class="fn12">kocm.com</span>\
            <a  href="#mySmallModalLabel" class="anchorjs-link"><span class="anchorjs-icon"></span></a></h4>\
            </div>\
            <div id="J_dialog_content" class="modal-body"></div>\
            </div>\
            </div>\
            </div>';
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
    alert: function (msg, callback, sizeType) {
        var self = this;
        var tpl = '<div></div><div class="fn14"> ' + msg +
            '</div><div class="ac mt10 bt1 pt10">' +
            '<button type="button" id="J_confirm_btn" class="btn btn-success">确定</button></div></div>';
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
    confirm: function (msg, confirmCallBack) {
        var self = this;
        var tpl = '<div></div><div class="fn14"><i class="glyphicon glyphicon-question-sign orange"></i> ' + msg +
            '</div><div class="ar mt10 bt1 pt10">' +
            '<button type="button" id="J_confirm_btn" class="btn btn-success">确定</button>' +
            '<button type="button" id="J_cancel_btn" class="btn btn-default ml10">取消</button></div></div>';

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
    closeDialog: function (callback) {
        $('#J_dialog_modal').modal('hide');
        if (typeof callback == 'function') {
            setTimeout(function () {
                callback();
            }, 600);
        }
    }
};