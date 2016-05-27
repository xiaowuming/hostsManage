var fs = require('fs');
module.exports = {
    _hostsManageKey: '## hostsManage',
    _items: null,
    /**
     * 获取hosts文件内容
     */
    getHostsFileContent: function (callback) {
        var self = this;
        self._items = {};
        fs.readFile('/etc/hosts', 'utf-8', function (err, content) {
            if (err) {
                callback(self._items);
            } else {
                self.toArray(content);
                callback(self._items);
            }
        });
    },
    /**
     * 解析到数组
     */
    toArray: function (content) {
        var obj = content.split('\n');
        if (obj[0].indexOf(this._hostsManageKey) == 0) {
            //本软件已经在管理

            var len = obj.length,
                key = '';
            for (var i = 1; i < len; i++) {
                var item = obj[i].trim();
                if (item == '#' || item == '') {


                } else if (item.indexOf('##') == 0) {
                    key = item.replace('##', '').trim();
                    this._items[key] = [];
                } else {
                    var result = this._parseItem(item);
                    if (result.length > 0) {
                        if (key == '') {
                            key = '默认';
                            this._items[key] = [];
                        }
                        this._items[key] = this._items[key].concat(result);
                    }
                }
            }

        } else {
            //非本软件管理

            this._items['默认'] = [];
            for (var i in obj) {
                var item = obj[i];
                if (item.indexOf('#') == -1) {
                    var result = this._parseItem(item);
                    if (result.length > 0) {
                        this._items['默认'] = this._items['默认'].concat(result);
                    }
                }
            }
        }
    },
    /**
     * 解析每一行
     */
    _parseItem: function (item) {
        var obj = item.replace('\t', ' ').split(' ');
        // 是否无效
        var isInvalid = false;
        //IP地址
        var ip = null;
        // 结果
        var result = [];
        if (obj[0].trim().indexOf('#') == 0) {
            isInvalid = true;
            ip = obj[0].trim().substring(1, obj[0].length);
        } else {
            isInvalid = false;
            ip = obj[0].trim();
        }
        for (var i = 1; i < obj.length; i++) {
            if (obj[i].trim()) {
                result.push({
                    ip: ip,
                    domain: obj[i].trim(),
                    isInvalid: isInvalid
                });
            }
        }
        return result;
    }
};