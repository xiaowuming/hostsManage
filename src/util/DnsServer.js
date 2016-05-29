module.exports = function (callback) {
    var dns = require('node-dns'),
        tcpserver = dns.createTCPServer(),
        dnsBase = require('dns'),
        server = dns.createServer();


    var onMessage = function (request, response) {
        var domain = request.question[0].name;
        lookup(response, domain);
    };

    var onError = function (err, buff, req, res) {
        console.log(err.stack);
    };

    var onListening = function () {
        console.log('DNS服务启动成功.');
        global.dnsIsStart = true;
        if (callback) {
            callback(true);
            callback = null;
        }
        // console.log('server listening on', this.address());
        //this.close();
    };

    var onSocketError = function (err, socket) {
        console.log('DNS服务启动失败.');
        if (callback) {
            callback(false);
            callback = null;
        }
        console.log(err);
    };

    var onClose = function () {
        console.log('server closed', this.address());
    };

    server.on('request', onMessage);
    server.on('error', onError);
    server.on('listening', onListening);
    server.on('socketError', onSocketError);
    server.on('close', onClose);

    tcpserver.on('request', onMessage);
    tcpserver.on('error', onError);
    tcpserver.on('listening', onListening);
    tcpserver.on('socketError', onSocketError);
    tcpserver.on('close', onClose);


    module.exports = {
        server: server,
        tcpserver: tcpserver
    };

    server.serve(53);
    tcpserver.serve(53);


    /**
     * 获取线上DNS
     * @return {[type]} [description]
     */
    function lookup(response, domain) {
        //设备没有绑定
        dnsBase.lookup(domain, function (err, addresses) {
            if (addresses) {
                printDns(response, addresses, domain);
            } else {
                printDns(response, '127.0.0.1', domain);
            }
        });
    }

    /**
     * 打印DNS
     */
    function printDns(response, dnsIp, domain) {
        response.answer.push(dns.A({
            name: domain,
            address: dnsIp, //输出IP
            ttl: 0.0001,
        }));
        response.answer.push(dns.A({
            name: domain,
            address: '127.0.0.2',
            ttl: 0.0001,
        }));
        response.additional.push(dns.AAAA({
            name: 'hostA.example.org',
            address: '::1',
            ttl: 0.0001,
        }));
        response.send();
    };
};