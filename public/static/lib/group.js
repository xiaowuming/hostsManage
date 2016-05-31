var dialog = require('./dialog.js'),
    ajax = require('./ajax');
module.exports = {
    /**
     * 创建组
     */
    create: function (groupName, callback) {
        var self = this;
        self.editForm('添加组', '', function (groupName) {
            self.postData(groupName, function (status, data) {
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
    editForm: function (title, groupName, callback) {
        var self = this;
        var form = $('<form>\
                <div class="form-group">\
                <label for="J_newGroupName">组名</label>\
            <input type="text" required class="form-control" name="groupName" value="' + groupName + '" id="J_newGroupName" placeholder="组名">\
                </div>\
            <button type="submit" class="btn btn-info">确定</button>\
            <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
                </form>');
        dialog.init(title, form, 'sm');

        form.on('submit', function () {
            callback && callback($('#J_newGroupName').val().trim());
            dialog.closeDialog();
            return false;
        });
    },
    /**
     * 发送数据
     * @param groupName
     * @param callback
     */
    postData: function (groupName, callback) {
        ajax({
            url: '/addGroup',
            type: 'post',
            data: {
                name: groupName
            },
            success: function (result) {
                if (result.code == 100) {
                    callback && callback(true, result.data);
                } else if (result.code == -10) {
                    dialog.alert('<p class="lh24"><i class="glyphicon glyphicon-info-sign fail"></i>组名重复.</p>');
                } else {
                    callback && callback(false);
                }
            }
        });
    }
};