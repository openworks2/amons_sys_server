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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
var connectionPool_1 = __importDefault(require("./conifg/connectionPool"));
var ConnectionUtile_1 = require("./lib/ConnectionUtile");
var fillZero_1 = __importDefault(require("./lib/fillZero"));
var configQuery_1 = __importDefault(require("./query/configQuery"));
var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");
var INFO_COMPANY = "info_company";
router.get("/companies", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var findAllUtile, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, ConnectionUtile_1.getFindALl({
                        table: INFO_COMPANY,
                        req: req,
                        res: res,
                    })()];
            case 1:
                findAllUtile = _a.sent();
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                res.status(404).end();
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/companies/:index", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var param, findByFieldUtile, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                param = req.params.index;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, ConnectionUtile_1.getFindByField({
                        table: INFO_COMPANY,
                        param: param,
                        field: "co_index",
                        req: req,
                        res: res,
                    })()];
            case 2:
                findByFieldUtile = _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                res.status(404).end();
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
router.post("/companies", function (req, res, next) {
    var reqBody = req.body;
    console.log(req.body);
    var co_name = reqBody.co_name, co_sectors = reqBody.co_sectors;
    var _companyIndex = fillZero_1.default("CO");
    var InsertData = {
        created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        co_index: _companyIndex,
        co_name: co_name,
        co_sectors: co_sectors,
    };
    var _query = configQuery_1.default.insert(INFO_COMPANY);
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
                    var resObj = __assign(__assign({}, reqBody), { co_id: results.insertId, created_date: InsertData.created_date, co_index: _companyIndex });
                    res.json(resObj);
                }
            });
        }
        connection.release();
    });
});
router.put("/companies/:index", function (req, res, next) {
    var index = req.params.index;
    var reqBody = req.body;
    var co_name = reqBody.co_name, co_sectors = reqBody.co_sectors;
    var data = {
        modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        co_name: co_name,
        co_sectors: co_sectors,
    };
    var UpdataData = [];
    UpdataData[0] = data;
    UpdataData[1] = index;
    var _query = configQuery_1.default.update(INFO_COMPANY, "co_index");
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
router.delete("/companies/:id", function (req, res, next) {
    var id = req.params.id;
    var _query = configQuery_1.default.delete(INFO_COMPANY, "co_id");
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
