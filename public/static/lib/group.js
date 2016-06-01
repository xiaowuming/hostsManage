var dialog = require('./dialog.js'),
    ajax = require('./ajax');
module.exports = {
    /**
     * 创建组
     */
    create: function (groupName, callback) {
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
    editForm: function (title, groupName, callback) {
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
     * 发送新增数据
     * @param groupName
     * @param callback
     */
    postAddData: function (groupName, callback) {
        ajax({
            url: '/addGroup',
            type: 'post',
            data: {
                name: groupName
            },
            success: function (result) {
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
    postEditData: function (id, name, callback) {
        ajax({
            url: '/editGroup',
            data: {
                id: id,
                name: name
            },
            type: 'post',
            success: function (result) {
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
    removeGroup: function (id, callback) {
        ajax({
            url: '/removeGroup',
            data: {
                id: id
            },
            success: function (result) {
                if (result.code == 100) {
                    callback && callback(true);
                }
            }
        });
    }
};