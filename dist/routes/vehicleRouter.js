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
moment.tz.setDefault("Asiz/Seoul");
var INFO_VEHICLE = "info_vehicle";
router.get("/vehicles", function (req, res, next) {
    var _query = configQuery_1.default.findByAll(INFO_VEHICLE);
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
router.get("/vehicles/:index", function (req, res, next) {
    var index = req.params.index;
    var _query = configQuery_1.default.findByField(INFO_VEHICLE, "vh_index");
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
router.post("/vehicles", function (req, res, next) {
    var reqBody = req.body;
    console.log(req.body);
    var vh_name = reqBody.vh_name, vh_number = reqBody.vh_number, vh_image_path = reqBody.vh_image_path, co_index = reqBody.co_index, bc_index = reqBody.bc_index;
    var _vehicleIndex = fillZero_1.default("VH");
    var InsertData = {
        created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        vh_index: _vehicleIndex,
        vh_name: vh_name,
        vh_number: vh_number,
        vh_image_path: vh_image_path,
        co_index: co_index,
        bc_index: bc_index,
    };
    var _query = configQuery_1.default.insert(INFO_VEHICLE);
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
                    var resObj = __assign(__assign({}, reqBody), { vh_id: results.insertId, vh_index: _vehicleIndex, created_date: InsertData.created_date });
                    res.json(resObj);
                }
            });
        }
        connection.release();
    });
});
router.put("/vehicles/:index", function (req, res, next) {
    var index = req.params.index;
    var reqBody = req.body;
    var vh_name = reqBody.vh_name, vh_number = reqBody.vh_number, vh_image_path = reqBody.vh_image_path, co_index = reqBody.co_index, bc_index = reqBody.bc_index;
    var data = {
        modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        vh_name: vh_name,
        vh_number: vh_number,
        vh_image_path: vh_image_path,
        co_index: co_index,
        bc_index: bc_index,
    };
    var UpdataData = [];
    UpdataData[0] = data;
    UpdataData[1] = index;
    var _query = configQuery_1.default.update(INFO_VEHICLE, "vh_index");
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
router.delete("/vehicles/:id", function (req, res, next) {
    var id = req.params.id;
    var _query = configQuery_1.default.delete(INFO_VEHICLE, "vh_id");
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
