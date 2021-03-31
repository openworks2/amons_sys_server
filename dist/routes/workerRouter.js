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
var INFO_WORKER = "info_worker";
router.get("/workers", function (req, res, next) {
    var _query = configQuery_1.default.findByAll(INFO_WORKER);
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
router.get("/workers/:index", function (req, res, next) {
    var index = req.params.index;
    var _query = configQuery_1.default.findByField(INFO_WORKER, "wk_index");
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
router.post("/workers", function (req, res, next) {
    var reqBody = req.body;
    console.log(req.body);
    var wk_name = reqBody.wk_name, wk_phone = reqBody.wk_phone, wk_tel = reqBody.wk_tel, wk_position = reqBody.wk_position, wk_nation = reqBody.wk_nation, wk_blood_type = reqBody.wk_blood_type, wk_blood_group = reqBody.wk_blood_group, wk_image_path = reqBody.wk_image_path, co_index = reqBody.co_index, bc_index = reqBody.bc_index;
    var _workerIndex = fillZero_1.default("WK");
    var InsertData = {
        created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        wk_index: _workerIndex,
        wk_name: wk_name,
        wk_phone: wk_phone,
        wk_tel: wk_tel,
        wk_position: wk_position,
        wk_nation: wk_nation,
        wk_blood_type: wk_blood_type,
        wk_blood_group: wk_blood_group,
        wk_image_path: wk_image_path,
        co_index: co_index,
        bc_index: bc_index,
    };
    var _query = configQuery_1.default.insert(INFO_WORKER);
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
                    var resObj = __assign(__assign({}, reqBody), { wk_id: results.insertId, wk_index: _workerIndex, created_date: InsertData.created_date });
                    res.json(resObj);
                }
            });
        }
        connection.release();
    });
});
router.put("/workers/:index", function (req, res, next) {
    var index = req.params.index;
    var reqBody = req.body;
    var wk_name = reqBody.wk_name, wk_phone = reqBody.wk_phone, wk_tel = reqBody.wk_tel, wk_position = reqBody.wk_position, wk_nation = reqBody.wk_nation, wk_blood_type = reqBody.wk_blood_type, wk_blood_group = reqBody.wk_blood_group, wk_image_path = reqBody.wk_image_path, co_index = reqBody.co_index, bc_index = reqBody.bc_index;
    var data = {
        modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        wk_name: wk_name,
        wk_phone: wk_phone,
        wk_tel: wk_tel,
        wk_position: wk_position,
        wk_nation: wk_nation,
        wk_blood_type: wk_blood_type,
        wk_blood_group: wk_blood_group,
        wk_image_path: wk_image_path,
        co_index: co_index,
        bc_index: bc_index,
    };
    var UpdataData = [];
    UpdataData[0] = data;
    UpdataData[1] = index;
    var _query = configQuery_1.default.update(INFO_WORKER, "wk_index");
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
                    res.json(resObj);
                }
            });
        }
        connection.release();
    });
});
router.delete("/workers/:id", function (req, res, next) {
    var id = req.params.id;
    var _query = configQuery_1.default.delete(INFO_WORKER, "wk_id");
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
