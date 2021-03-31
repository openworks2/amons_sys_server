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
var configQuery_1 = __importDefault(require("./query/configQuery"));
var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");
var LOG_PROCESS = "log_process";
router.get("/processes", function (req, res, next) {
    var _query = configQuery_1.default.findByAll(LOG_PROCESS);
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
router.get("/processes/:index", function (req, res, next) {
    var index = req.params.index;
    var _query = configQuery_1.default.findByField(LOG_PROCESS, "pcs_seq");
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
router.post("/processes", function (req, res, next) {
    var reqBody = req.body;
    var pcs_state = reqBody.pcs_state, local_index = reqBody.local_index;
    var InsertData = {
        created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        pcs_state: pcs_state,
        local_index: local_index,
    };
    var _query = configQuery_1.default.insert(LOG_PROCESS);
    console.log(InsertData);
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
                    var resObj = __assign(__assign({}, reqBody), { dig_seq: results.insertId, created_date: InsertData.created_date });
                    res.json(resObj);
                }
            });
        }
        connection.release();
    });
});
router.put("/processes/:index", function (req, res, next) {
    var index = req.params.index;
    var reqBody = req.body;
    var pcs_state = reqBody.pcs_state, local_index = reqBody.local_index;
    var data = {
        modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        pcs_state: pcs_state,
        local_index: local_index,
    };
    var UpdataData = [];
    UpdataData[0] = data;
    UpdataData[1] = index;
    console.log(UpdataData);
    var _query = configQuery_1.default.update(LOG_PROCESS, "pcs_seq");
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
                    console.log("results->>", results);
                    console.log("field-->", field);
                    res.json(reqBody);
                }
            });
        }
        connection.release();
    });
});
router.delete("/processes/:id", function (req, res, next) {
    var id = req.params.id;
    var _query = configQuery_1.default.delete(LOG_PROCESS, "pcs_seq");
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
