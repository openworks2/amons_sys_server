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
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var connectionPool_1 = __importDefault(require("./conifg/connectionPool"));
var fillZero_1 = __importDefault(require("./lib/fillZero"));
var configQuery_1 = __importDefault(require("./conifg/query/configQuery"));
var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");
var INFO_LOCAL = "info_local";
router.get("/locals", function (req, res, next) {
    var _query = configQuery_1.default.findByAll(INFO_LOCAL);
    connectionPool_1.default.getConnection(function (err, connection) {
        if (err) {
            res.status(404).end();
            throw new Error("Pool getConnection Error!!");
        }
        else {
            connection.query(_query, function (err, results, field) {
                if (err) {
                    res.status(404).end();
                    throw err;
                }
                else {
                    res.json(results);
                }
            });
        }
        connection.release();
    });
});
router.get("/locals/:index", function (req, res, next) {
    var index = req.params.index;
    var _query = configQuery_1.default.findByField(INFO_LOCAL, "local_index");
    connectionPool_1.default.getConnection(function (err, connection) {
        if (err) {
            res.status(404).end();
            throw new Error("Response Error!!");
        }
        else {
            connection.query(_query, index, function (err, results, field) {
                if (err) {
                    res.status(404).end();
                    throw err;
                }
                else {
                    res.json(results);
                }
            });
        }
        connection.release();
    });
});
router.post("/locals", function (req, res, next) {
    var reqBody = req.body;
    var 
    // local_index,
    local_name = reqBody.local_name, plan_length = reqBody.plan_length, local_process = reqBody.local_process, desciption = reqBody.desciption;
    var _localIndex = fillZero_1.default("LC");
    var insertData = {
        created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        local_index: _localIndex,
        local_name: local_name,
        plan_length: plan_length,
        local_process: local_process,
    };
    var _query = configQuery_1.default.insert(INFO_LOCAL);
    connectionPool_1.default.getConnection(function (err, connection) {
        if (err) {
            res.status(err.status).end();
            throw new Error("Response Error!!");
        }
        else {
            connection.query(_query, insertData, function (err, results) {
                if (err) {
                    res.status(404).end();
                    throw err;
                }
                else {
                    var resObj = __assign(__assign({}, reqBody), { local_id: results.insertId, created_date: insertData.created_date, local_index: _localIndex });
                    res.json(resObj);
                }
            });
        }
        connection.release();
    });
});
router.put("/locals/:index", function (req, res, next) {
    var index = req.params.index;
    var reqBody = req.body;
    var local_name = reqBody.local_name, plan_length = reqBody.plan_length, local_process = reqBody.local_process, desciption = reqBody.desciption;
    var data = {
        modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        local_name: local_name,
        plan_length: plan_length,
        local_process: local_process,
    };
    var updateData = [];
    updateData[0] = data;
    updateData[1] = index;
    var _query = configQuery_1.default.update(INFO_LOCAL, "local_index");
    connectionPool_1.default.getConnection(function (err, connection) {
        if (err) {
            res.status(404).end();
            throw new Error("Response Error!!");
        }
        else {
            connection.query(_query, updateData, function (err, results, field) {
                if (err) {
                    res.status(404).end();
                    throw new Error("Response Error!!");
                }
                else {
                    var resObj = __assign(__assign({}, reqBody), { modified_date: data['modified_date'] });
                    res.json(resObj);
                }
            });
        }
        connection.release();
    });
});
router.delete("/locals/:id", function (req, res, next) {
    var id = req.params.id;
    var _query = configQuery_1.default.delete(INFO_LOCAL, "local_id");
    connectionPool_1.default.getConnection(function (err, connection) {
        if (err) {
            res.status(err.status).end();
            throw new Error("Response Error!!");
        }
        else {
            connection.query(_query, id, function (err, results, field) {
                if (err) {
                    res.status(404).end();
                    throw err;
                }
                else {
                    var result = __assign(__assign({}, results), { id: id });
                    res.json(result);
                }
            });
        }
        connection.release();
    });
});
exports.default = router;
