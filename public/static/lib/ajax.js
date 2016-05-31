module.exports = function (option) {
    var dialog = require('./dialog.js');
    $.ajax({
        url: option.url,
        type: option.type,
        data: option.data,
        success: function (result) {
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