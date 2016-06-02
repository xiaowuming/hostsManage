module.exports = {
    addMultipleHosts: function (groupId,callback) {
        var tpl = $('<form action="#">\
                    <textarea required class="form-control" name="hosts" id="J_addMultipleHosts" rows="10" placeholder="请输入Hosts,一行一个,不支持正则,不支持#注释符\n正确示例如:\n127.0.0.1 www.abc.com www.efg.com\n192.168.0.1 www.google.com"></textarea>\
                    <div class="btn_area mt10 ar">\
                    <button type="submit" class="btn btn-info">确定</button>\
                    <button type="button" class="btn btn-default" data-dismiss="modal">取消</button>\
                    </div>\
                </form>');
        self.dialog.init('批量添加Hosts', tpl, 'lg', false);

        tpl.on('submit', function () {
            var str = $('#J_addMultipleHosts').val().trim();

            self.dialog.closeDialog();
            return false;
        });

    }
};