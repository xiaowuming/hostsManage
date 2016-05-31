var dialog = require('./dialog.js');
module.exports = {
    /**
     * 创建组
     */
    create: function (groupName, noPermissionTips, callback) {
        var self = this;
        self.editForm('添加组', '', function (groupName) {
            self.postData(groupName, noPermissionTips, function (status) {
                if (status && callback) {
                    callback();
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
        dialog.init(title, form);

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
    postData: function (groupName, noPermissionTips, callback) {
        $.ajax({
            url: '/addGroupp',
            data: {
                groupName: groupName
            },
            success: function (result) {
                if (result.code == 100) {
                    callback && callback(true);
                } else {
                    dialog.alert(noPermissionTips, null, '');
                    callback && callback(false);
                }
            }
        });
    }
};