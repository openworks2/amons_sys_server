"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.putUpdate = exports.postInsert = exports.getFindByField = exports.getFindALl = void 0;
var connectionPool_1 = __importDefault(require("../conifg/connectionPool"));
var configQuery_1 = __importDefault(require("../query/configQuery"));
var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");
var getFindALl = function (_a) {
    var table = _a.table, req = _a.req, res = _a.res;
    var _query = configQuery_1.default.findByAll(table);
    return function () {
        return connectionPool_1.default.getConnection(function (err, connection) {
            if (err) {
                res.status(404).end();
                throw new Error("Pool getConnection Error!!");
            }
            else {
                connection.query(_query, function (err, results, field) {
                    if (err) {
                        res.status(404).end();
                        throw new Error("Connection Query Error!!");
                    }
                    else {
                        res.json(results);
                    }
                });
            }
            connection.release();
        });
    };
};
exports.getFindALl = getFindALl;
var getFindByField = function (_a) {
    var table = _a.table, param = _a.param, field = _a.field, req = _a.req, res = _a.res;
    var _query = configQuery_1.default.findByField(table, field);
    return function () {
        return connectionPool_1.default.getConnection(function (err, connection) {
            if (err) {
                res.status(404).end();
                throw new Error("Pool getConnection Error!!");
            }
            else {
                connection.query(_query, param, function (err, results, field) {
                    if (err) {
                        res.status(404).end();
                        throw new Error("Connection Query Error!!");
                    }
                    else {
                        res.json(results);
                    }
                });
            }
            connection.release();
        });
    };
};
exports.getFindByField = getFindByField;
var postInsert = function (_a) {
    var table = _a.table, insertData = _a.insertData, key = _a.key, req = _a.req, res = _a.res;
    var _query = configQuery_1.default.insert(table);
    return function () {
        return connectionPool_1.default.getConnection(function (err, connection) {
            if (err) {
                res.status(404).end();
                throw new Error("Pool getConnection Error!!");
            }
            else {
                connection.query(_query, insertData, function (err, results, field) {
                    var _a;
                    if (err) {
                        res.status(404).end();
                        throw new Error("Connection Query Error!!");
                    }
                    else {
                        var resObj = __assign(__assign({}, insertData), (_a = {}, _a[key] = results.insertId, _a));
                        res.json(resObj);
                    }
                });
            }
            connection.release();
        });
    };
};
exports.postInsert = postInsert;
var putUpdate = function (_a) {
    var table = _a.table, field = _a.field, updateData = _a.updateData, req = _a.req, res = _a.res;
    var _query = configQuery_1.default.update(table, field);
    return function () {
        return connectionPool_1.default.getConnection(function (err, connection) {
            if (err) {
                res.status(404).end();
                throw new Error("Pool getConnection Error!!");
            }
            else {
                connection.query(_query, updateData, function (err, results, field) {
                    if (err) {
                        res.status(404).end();
                        throw new Error("Connection Query Error!!");
                    }
                    else {
                        var resObj = __assign({}, updateData[0]);
                        res.json(resObj);
                    }
                });
            }
            connection.release();
        });
    };
};
exports.putUpdate = putUpdate;
