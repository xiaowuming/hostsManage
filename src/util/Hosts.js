var fs = require('fs');
var objectClone = require('./objectClone');
module.exports = {
    /**
     * 初始化Hosts数据
     * @param callback
     */
    init: function (callback) {
        var self = this;
        self._hostsData = {};
        self._hostsDataFinal = {};
        self.getFileContent(function (content) {
            if (content) {
                self.parseToHostsData(content);
            } else {
                callback(undefined);
            }
        });
    },
    /**
     * 获取hosts数据
     */
    getHostsData: function (callback) {
        this.tryCallback(callback, this._hostsDataFinal);
    },
    /**
     * 同步获取hosts数据
     * @returns {module.exports._hostsData|{}}
     */
    getHostsDataSync: function () {
        return this._hostsDataFinal;
    },
    /**
     * 添加组
     * @param groupName
     * @param callback
     */
    addGroup: function (groupName, callback) {
        //成功
        var id = this.getIndex();
        this._hostsData[id] = {
            hosts: {},
            id: id,
            name: groupName
        };
        //更新数据
        this._updateHostsData(callback, {
            name: groupName,
            id: id
        });
    },
    /**
     * 移除组
     * @param groupID
     * @param callback
     */
    removeGroup: function (groupID, callback) {
        if (this._hostsData[groupID]) {
            delete this._hostsData[groupID];
            //更新数据
            this._updateHostsData(callback);
        } else {
            this.tryCallback(callback, -1);
        }
    },
    /**
     * 重命名组
     * @param groupID
     * @param groupName
     * @param callback
     */
    renameGroupByGroupID: function (groupID, groupName, callback) {
        if (this._hostsData[groupID]) {
            this._hostsData[groupID]['name'] = groupName;
            //更新数据
            this._updateHostsData(callback);
        } else {
            this.tryCallback(callback, -1);
        }
    },
    /**
     * 添加Hosts
     * @param hosts
     * @param groupID
     * @param callback
     */
    addHosts: function (hosts, groupID, callback) {
        if (!this._hostsData[groupID]) {
            //不存在的组
            this.tryCallback(callback, -1);
        } else {
            var hostsResult = [];
            for (var i in hosts) {
                var item = hosts[i],
                    id = this.getIndex();
                item.id = id;
                this._hostsData[groupID]['hosts'][id] = item;
                hostsResult.push(item);
            }
            //更新数据
            this._updateHostsData(callback, hostsResult);
        }
    },
    /**
     * 更新Hosts
     * @param hostsID
     * @param ip
     * @param domain
     * @param callback
     */
    updateHosts: function (hostsID, ip, domain, callback) {
        var useUpdate = false;
        for (var i in this._hostsData) {
            for (var n in this._hostsData[i]['hosts']) {
                var item = this._hostsData[i]['hosts'][n];
                if (item.id == hostsID) {
                    item.ip = ip;
                    item.domain = domain;
                    useUpdate = true;
                }
            }
        }
        if (useUpdate === true) {
            //更新数据
            this._updateHostsData(callback);
        } else {
            //没有更新
            this.tryCallback(callback, -1);
        }
    },
    /**
     * 移除Hosts
     * @param hostsIDs
     * @param callback
     */
    removeHostsByHostsIDs: function (hostsIDs, callback) {
        var idsMap = {};
        for (var i in hostsIDs) {
            idsMap[hostsIDs[i]] = true;
        }

        var flag = false;
        for (var i in this._hostsData) {
            for (var n in this._hostsData[i]['hosts']) {
                var item = this._hostsData[i]['hosts'][n];
                if (idsMap[item.id] === true) {
                    delete this._hostsData[i]['hosts'][n];
                    flag = true;
                }
            }
        }
        if (flag === true) {
            this._updateHostsData(callback);
        } else {
            //没有更新
            this.tryCallback(callback, -1);
        }
    },
    /**
     * 变更组ID
     * @param hostsID
     * @param groupID
     * @param callback
     */
    changeGroupByHostsID: function (hostsIDs, groupID, callback) {
        var moveItems = [],
            idsMap = {},
            group = null;

        for (var i in hostsIDs) {
            idsMap[hostsIDs[i]] = true;
        }

        for (var i in this._hostsData) {
            if (this._hostsData[i].id == groupID) {
                group = this._hostsData[i];
            }
            for (var n in this._hostsData[i]['hosts']) {
                var item = this._hostsData[i]['hosts'][n];
                if (idsMap[item.id]) {
                    moveItems.push(item);
                    delete this._hostsData[i]['hosts'][n];
                }
            }
        }

        if (group == null) {
            this.tryCallback(callback, -1);
        } else {
            var hostsResult = [];
            for (var i in moveItems) {
                var item = moveItems[i];
                group['hosts'][item.id] = item;
                hostsResult.push(item);
            }

            this._updateHostsData(callback, hostsResult);
        }
    },
    /**
     * 批量修改Hosts状态
     * @param invalidStatus
     * @param ids
     * @param callback
     */
    changeHostsStatus: function (invalidStatus, ids, callback) {
        var idMap = {},
            flag = false;
        for (var i in ids) {
            idMap[ids[i]] = true;
        }
        for (var i in this._hostsData) {
            for (var n in this._hostsData[i]['hosts']) {
                var hosts = this._hostsData[i]['hosts'][n];
                if (idMap[hosts.id] == true) {
                    flag = true;
                    hosts.isInvalid = invalidStatus;
                }
            }
        }
        if (flag) {
            this._updateHostsData(callback);
        } else {
            this.tryCallback(callback, -1);
        }
    },
    /**
     * 获取索引
     */
    getIndex: function () {
        if (this._i == undefined) {
            this._i = 9999;
        }
        return ++this._i;
    },
    /**
     * 更新hosts数据
     * @private
     */
    _updateHostsData: function (callback, printData) {
        var self = this,
            str = [self._hostsManageKey + '\n'];
        for (var i in self._hostsData) {
            var group = self._hostsData[i];
            str.push('\n## ' + group.name);
            for (var n in group['hosts']) {
                var item = group['hosts'][n];
                var itemStr = [];
                if (item.isInvalid == true) {
                    itemStr.push('#');
                }
                itemStr.push(item.ip);
                itemStr.push(item.domain);
                str.push(itemStr.join(' '));
            }
        }
        var hostsStr = str.join('\n');
        fs.writeFile(self._hostsFilePath, hostsStr, function (err, data) {
            if (err && err.errno == -13) {
                self._hostsData = objectClone(self._hostsDataFinal);
                typeof callback == 'function' && callback(-2, '没有权限操作');
            } else {
                self._hostsDataFinal = objectClone(self._hostsData);
                typeof callback == 'function' && callback(100, printData);
            }
        });
    },
    /**
     * 执行回调
     * @param callback_fun
     * @param status
     */
    tryCallback: function (callback_fun, data) {
        typeof callback_fun == 'function' && callback_fun(data);
    },
    /**
     * 获取文件内容
     */
    getFileContent: function (callback) {
        fs.readFile(this._hostsFilePath, 'utf-8', function (err, content) {
            if (err) {
                callback(null);
            } else {
                callback(content);
            }
        });
    },
    /**
     * 解析到HostsData
     */
    parseToHostsData: function (content) {
        var obj = content.split('\n');
        if (obj[0].indexOf(this._hostsManageKey) == 0) {
            // 本软件管理
            var len = obj.length,
                groupId = '',
                groupName = '';
            for (var i = 1; i < len; i++) {
                var item = obj[i].trim();
                if (item == '#' || item == '') {


                } else if (item.indexOf('## ') == 0) {
                    groupName = item.replace('## ', '').trim();
                    groupId = this.getIndex();
                    this._hostsData[groupId] = {
                        name: groupName,
                        id: groupId,
                        hosts: {}
                    };
                } else {
                    var result = this._parseItem(item);
                    if (result.length > 0) {
                        if (groupId == '' && groupName == '') {
                            groupId = this.getIndex();
                            groupName = '默认';
                            this._hostsData[groupId] = {
                                name: groupName,
                                id: groupId,
                                hosts: {}
                            };
                        }

                        for (var n in result) {
                            var hostsId = this.getIndex();
                            var item = result[n];
                            item.id = hostsId;
                            this._hostsData[groupId]['hosts'][hostsId] = item;
                        }
                    }
                }
            }
        } else {
            // 非本软件管理

            var groupId = this.getIndex();
            this._hostsData[groupId] = {name: '默认', id: groupId, hosts: {}};
            for (var i in obj) {
                var item = obj[i];
                if (item.indexOf('#') == -1) {
                    var result = this._parseItem(item);
                    for (var n in result) {
                        var hostsId = this.getIndex();
                        var item = result[n];
                        item.id = hostsId;
                        this._hostsData[groupId]['hosts'][hostsId] = item;
                    }
                }
            }
        }
        this._hostsDataFinal = objectClone(this._hostsData);
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
        var result = [],
            start = 1;

        if (obj[0].indexOf('#') == 0) {
            isInvalid = true;
            ip = obj[1].trim();
            start = 2;
        } else {
            isInvalid = false;
            ip = obj[0].trim();
        }
        for (var i = start; i < obj.length; i++) {
            if (obj[i].trim()) {
                result.push({
                    ip: ip,
                    domain: obj[i].trim(),
                    isInvalid: isInvalid
                });
            }
        }
        return result;
    },
    // Hosts文件路径
    _hostsFilePath: '/etc/hosts',
    // Hosts 本软件管理的标示
    _hostsManageKey: '### hostsManage',
    // Hosts数据
    _hostsData: {},
    // Hosts数据最终数据
    _hostsDataFinal: {}
};