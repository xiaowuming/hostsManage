module.exports = {
    /**
     * 输出结果
     * @param req
     * @param res
     * @param code
     * @param data
     */
    result: function (req, res, code, data) {
        var result = {
            code: code,
            data: data
        };
        res.send(result);
    }
};