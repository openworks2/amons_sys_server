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
var configQuery_1 = __importDefault(require("./query/configQuery"));
var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");
var INFO_CCTV = "info_cctv";
router.get("/cctvs", function (req, res, next) {
    var _query = configQuery_1.default.findByAll(INFO_CCTV);
    connectionPool_1.default.getConnection(function (err, connection) {
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
});
router.get("/cctvs/:index", function (req, res, next) {
    var index = req.params.index;
    var _query = configQuery_1.default.findByField(INFO_CCTV, "cctv_index");
    connectionPool_1.default.getConnection(function (err, connection) {
        if (err) {
            res.status(404).end();
            throw new Error("Pool getConnection Error!!");
        }
        else {
            connection.query(_query, index, function (err, results, field) {
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
});
router.post("/cctvs", function (req, res, next) {
    var reqBody = req.body;
    var cctv_name = reqBody.cctv_name, cctv_pos_x = reqBody.cctv_pos_x, cctv_user_id = reqBody.cctv_user_id, cctv_pw = reqBody.cctv_pw, cctv_ip = reqBody.cctv_ip, cctv_port = reqBody.cctv_port, local_index = reqBody.local_index;
    var _cctvIndex = fillZero_1.default("CCTV");
    var InsertData = {
        created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        cctv_index: _cctvIndex,
        cctv_name: cctv_name,
        cctv_pos_x: cctv_pos_x,
        cctv_user_id: cctv_user_id,
        cctv_pw: cctv_pw,
        cctv_ip: cctv_ip,
        cctv_port: cctv_port,
        local_index: local_index,
    };
    var _query = configQuery_1.default.insert(INFO_CCTV);
    connectionPool_1.default.getConnection(function (err, connection) {
        if (err) {
            res.status(404).end();
            throw new Error("Pool getConnection Error!!");
        }
        else {
            connection.query(_query, InsertData, function (err, results, field) {
                if (err) {
                    res.status(404).end();
                    throw new Error("Connection Query Error!!");
                }
                else {
                    var resObj = __assign(__assign({}, reqBody), { cctv_id: results.insertId, cctv_index: _cctvIndex, created_date: InsertData.created_date });
                    res.json(resObj);
                }
            });
        }
        connection.release();
    });
});
router.put("/cctvs/:index", function (req, res, next) {
    var index = req.params.index;
    var reqBody = req.body;
    var cctv_name = reqBody.cctv_name, cctv_pos_x = reqBody.cctv_pos_x, cctv_user_id = reqBody.cctv_user_id, cctv_pw = reqBody.cctv_pw, cctv_ip = reqBody.cctv_ip, cctv_port = reqBody.cctv_port, local_index = reqBody.local_index;
    var data = {
        modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        cctv_name: cctv_name,
        cctv_pos_x: cctv_pos_x,
        cctv_user_id: cctv_user_id,
        cctv_pw: cctv_pw,
        cctv_ip: cctv_ip,
        cctv_port: cctv_port,
        local_index: local_index,
    };
    var UpdataData = [];
    UpdataData[0] = data;
    UpdataData[1] = index;
    var _query = configQuery_1.default.update(INFO_CCTV, "cctv_index");
    connectionPool_1.default.getConnection(function (err, connection) {
        if (err) {
            res.status(404).end();
            throw new Error("Pool getConnection Error!!");
        }
        else {
            connection.query(_query, UpdataData, function (err, results, field) {
                if (err) {
                    res.status(404).end();
                    throw new Error("Connection Query Error!!");
                }
                else {
                    var resObj = __assign(__assign({}, reqBody), { modified_date: data["modified_date"] });
                }
            });
        }
        connection.release();
    });
});
router.delete("/cctvs/:id", function (req, res, next) {
    var id = req.params.id;
    var _query = configQuery_1.default.delete(INFO_CCTV, "cctv_id");
    connectionPool_1.default.getConnection(function (err, connection) {
        if (err) {
            res.status(404).end();
            throw new Error("Pool getConnection Error!!");
        }
        else {
            connection.query(_query, id, function (err, results, field) {
                if (err) {
                    res.status(404).end();
                    throw new Error("Connection Query Error!!");
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
