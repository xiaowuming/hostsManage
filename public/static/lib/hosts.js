var dialog = require('./dialog.js'),
    ajax = require('./ajax.js');
module.exports = {
    /**
     * 添加多个Hosts
     * @param groupId
     * @param callback
     */
    addMultipleHosts: function (groupId, callback) {
        var self = this;
        var tpl = $('<form action="#">\
                    <textarea required class="form-control" required name="hosts" id="J_addMultipleHosts" rows="10" placeholder="请输入Hosts,一行一个,不支持正则,不支持#注释符\n正确示例如:\n127.0.0.1 www.abc.com www.efg.com\n192.168.0.1 www.google.com"></textarea>\
                    <div class="btn_area mt10 ar">\
                    <button type="submit" class="btn btn-info">确定</button>\
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
                    </div>\
                </form>');
        dialog.init('批量添加Hosts', tpl, 'lg', false);

        tpl.on('submit', function () {
            var str = $('#J_addMultipleHosts').val().trim();
            self.postAddHosts(str, groupId, callback);
            dialog.closeDialog();
            return false;
        });

    },
    /**
     * 解析到对象
     * @param str
     */
    postAddHosts: function (str, groupId, callback) {
        var obj = str.split('\n'),
            result = [];
        for (var i in obj) {
            var item = obj[i].trim();
            if (item.indexOf('#') == -1) {
                var o = item.split(' ');
                for (var n = 1; n < o.length; n++) {
                    if (o[n].trim()) {
                        var ip = o[0],
                            domain = o[n];
                        result.push({
                            groupId: groupId,
                            ip: ip,
                            domain: domain
                        });
                    }
                }
            }
        }

        ajax({
            type: 'post',
            url: '/addMultipleHosts',
            data: {
                hosts: JSON.stringify(result),
                groupId: groupId
            },
            success: function (result) {
                callback(result.data);
            }
        });
    },
    /**
     * 删除Hosts
     * @param ids
     */
    deleteHostsByIds: function (ids, callback) {
        ajax({
            url: '/removeHosts',
            data: {
                ids: JSON.stringify(ids)
            },
            type: 'post',
            success: function () {
                callback();
            }
        });
    },
    /**
     * 修改Hosts状态
     * @param ids
     * @param status
     * @param callback
     */
    changeHostsStatus: function (ids, status, callback) {
        ajax({
            url: '/changeHostsStatus',
            data: {
                ids: JSON.stringify(ids),
                status: status
            },
            type: 'post',
            success: function () {
                callback();
            }
        });
    },
    /**
     * 修改组
     * @param ids
     * @param groupId
     * @param callback
     */
    changeGroupIdByIds: function (ids, groupId, callback) {
        ajax({
            url: '/changeHostsStatus',
            type: 'post',
            data: {
                ids: JSON.stringify(ids),
                groupId: groupId
            },
            success: function (result) {
                callback(result.data);
            }
        });
    }
};