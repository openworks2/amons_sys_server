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
var configQuery_1 = __importDefault(require("./conifg/query/configQuery"));
var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");
var INFO_ANNOUNCE = "info_announce";
router.get("/announces", function (req, res, next) {
    var _query = configQuery_1.default.findByAll(INFO_ANNOUNCE);
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
router.get("/announces/:index", function (req, res, next) {
    var index = req.params.index;
    var _query = configQuery_1.default.findByField(INFO_ANNOUNCE, "ann_id");
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
router.post("/announces", function (req, res, next) {
    var reqBody = req.body;
    console.log(req.body);
    var ann_title = reqBody.ann_title, ann_contents = reqBody.ann_contents, ann_writer = reqBody.ann_writer, ann_preview = reqBody.ann_preview;
    var InsertData = {
        created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        ann_title: ann_title,
        ann_contents: ann_contents,
        ann_writer: ann_writer,
        ann_preview: ann_preview,
    };
    var _query = configQuery_1.default.insert(INFO_ANNOUNCE);
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
                    var resObj = __assign(__assign({}, reqBody), { ann_id: results.insertId, created_date: InsertData.created_date });
                    res.json(resObj);
                }
            });
        }
        connection.release();
    });
});
router.put("/announces/:index", function (req, res, next) {
    var index = req.params.index;
    var reqBody = req.body;
    var ann_title = reqBody.ann_title, ann_contents = reqBody.ann_contents, ann_writer = reqBody.ann_writer, ann_preview = reqBody.ann_preview;
    var data = {
        modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        ann_title: ann_title,
        ann_contents: ann_contents,
        ann_writer: ann_writer,
        ann_preview: ann_preview,
    };
    var UpdataData = [];
    UpdataData[0] = data;
    UpdataData[1] = index;
    var _query = configQuery_1.default.update(INFO_ANNOUNCE, "ann_id");
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
router.delete("/announces/:id", function (req, res, next) {
    var id = req.params.id;
    var _query = configQuery_1.default.delete(INFO_ANNOUNCE, "ann_id");
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
