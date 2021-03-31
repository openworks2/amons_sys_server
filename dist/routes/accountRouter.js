"use strict";
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
var cookieParser = require("cookie-parser");
var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");
var crypto_js_1 = __importDefault(require("crypto-js"));
var session = require("express-session");
var MySQLStore = require("express-mysql-session");
var connectionPool_1 = __importDefault(require("./conifg/connectionPool"));
// import indexCreateFn from "./lib/fillZero";
var configQuery_1 = __importDefault(require("./conifg/query/configQuery"));
var database_1 = __importDefault(require("./conifg/database"));
var connectionUtile_1 = require("./conifg/connectionUtile");
var sessionStore = new MySQLStore(database_1.default);
router.use(session({
    secret: "secret key",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
}));
router.use(cookieParser());
var TB_ACCOUNT = "tb_account";
// 계정 조회 (method: GET)
router.get("/accounts", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _query, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _query = configQuery_1.default.findByAll(TB_ACCOUNT);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, connectionUtile_1.getFindALl({
                        table: TB_ACCOUNT,
                        req: req,
                        res: res,
                    })()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_1 = _a.sent();
                console.error(error_1);
                res
                    .status(404)
                    .json({ status: 404, message: "CallBack Async Function Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// 계정 1개 조회 (method: GET)
router.get("/accounts/:index", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var param, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                param = req.params.index;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, connectionUtile_1.getFindByField({
                        table: TB_ACCOUNT,
                        param: param,
                        field: "acc_id",
                        req: req,
                        res: res,
                    })()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_2 = _a.sent();
                console.error(error_2);
                res
                    .status(404)
                    .json({ status: 404, message: "CallBack Async Function Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// 계정 등록 (method: POST)
router.post("/accounts", function (req, res, next) {
    var reqBody = req.body;
    // console.log(req.body);
    var acc_name = reqBody.acc_name, acc_user_id = reqBody.acc_user_id, acc_password = reqBody.acc_password, acc_phone = reqBody.acc_phone, acc_tel = reqBody.acc_tel, acc_mail = reqBody.acc_mail, acc_role = reqBody.acc_role;
    var hashDigest = crypto_js_1.default.SHA256(acc_password).toString();
    console.log("hashDigest-->", hashDigest);
    var salt = crypto_js_1.default.lib.WordArray.random(128 / 8);
    var key128Bits = crypto_js_1.default.PBKDF2("Secret Passphrase", salt, {
        keySize: 128 / 32,
    }).toString();
    console.log("key128Bits->>", key128Bits);
    var InsertData = {
        created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        acc_name: acc_name,
        acc_user_id: acc_user_id,
        acc_password: "" + hashDigest + key128Bits,
        acc_salt: key128Bits,
        acc_phone: acc_phone,
        acc_tel: acc_tel,
        acc_mail: acc_mail,
        acc_role: acc_role,
    };
    var _query = configQuery_1.default.insert(TB_ACCOUNT);
    connectionPool_1.default.getConnection(function (err, connection) {
        if (err) {
            console.error(err);
            res
                .status(404)
                .json({ status: 404, message: "Pool getConnection Error" });
        }
        else {
            connection.query(_query, InsertData, function (err, results, field) {
                if (err) {
                    console.error(err);
                    res
                        .status(404)
                        .json({ status: 404, message: "Connection Query Error" });
                }
                else {
                    var resObj = {
                        created_date: InsertData.created_date,
                        modified_date: results.modified_date,
                        acc_id: results.insertId,
                        acc_name: reqBody.acc_name,
                        acc_user_id: reqBody.acc_user_id,
                        acc_phone: reqBody.acc_phone,
                        acc_tel: reqBody.acc_tel,
                        acc_mail: reqBody.acc_mail,
                        acc_role: reqBody.acc_role,
                    };
                    res.json(resObj);
                }
            });
        }
        connection.release();
    });
});
// 계정 수정 (method: PUT)
// 계정 삭제 (method: DELETE)
router.delete("/accounts/:id", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var param, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                param = req.params.id;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, connectionUtile_1.deleteAction({
                        table: TB_ACCOUNT,
                        field: "acc_id",
                        param: param,
                        req: req,
                        res: res,
                    })()];
            case 2:
                _a.sent();
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                console.error(error_3);
                res
                    .status(404)
                    .json({ status: 404, message: "CallBack Async Function Error" });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
// 로그인 (method: POST)
router.post("/login", function (req, res, next) {
    var reqBody = req.body;
    var acc_user_id = reqBody.acc_user_id, acc_password = reqBody.acc_password;
    var _query = configQuery_1.default.findByField(TB_ACCOUNT, "acc_user_id");
    connectionPool_1.default.getConnection(function (err, connection) {
        if (err) {
        }
        else {
            connection.query(_query, acc_user_id, function (err, results, fields) {
                if (err) {
                }
                else {
                    /**
                     * @response object resData
                     * @property string message '아이디 확인'/'비밀번호 확인'/'로그인 성공'
                     * @property string status 'success' / 'fail'
                     * @property object data results
                     */
                    var isResults = results.length;
                    if (isResults === 0) {
                        // 아이디가 존재 하지 않는다.
                        var resData = {
                            status: "FAIL",
                            message: "사용자 아이디 확인",
                            validated: false,
                            logined: false,
                            data: null,
                        };
                        res.json(resData);
                    }
                    else {
                        // 아이디가 존재 한다.
                        var result = results[0];
                        var _a = results[0], userID = _a.acc_user_id, userPW = _a.acc_password, salt = _a.acc_salt;
                        var hashDigest = crypto_js_1.default.SHA256(acc_password).toString();
                        var diffPW = "" + hashDigest + salt;
                        if (userPW === diffPW) {
                            var resResult = {
                                login_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
                                created_date: moment(result.created_date).format("YYYY-MM-DD HH:mm:ss.SSS"),
                                modified_date: result.modified_date,
                                acc_id: result.insertId,
                                acc_name: result.acc_name,
                                acc_user_id: result.acc_user_id,
                                acc_phone: result.acc_phone,
                                acc_tel: result.acc_tel,
                                acc_mail: result.acc_mail,
                                acc_role: result.acc_role,
                            };
                            var resData_1 = {
                                status: "SUCCESS",
                                message: "로그인 성공",
                                validated: true,
                                logined: true,
                                data: resResult,
                            };
                            // 세션 저장
                            req.session["login"] = resResult;
                            req.session["logined"] = true;
                            req.session.save(function () {
                                console.log("sessionID-->", req.sessionID);
                                res.json(resData_1);
                            });
                        }
                        else {
                            var resData = {
                                status: "FAIL",
                                message: "비밀번호 확인",
                                validated: true,
                                logined: true,
                                data: null,
                            };
                            res.json(resData);
                        }
                    }
                }
            });
        }
        connection.release();
    });
});
// 로그아웃 (method: GET)
router.get("/logout", function (req, res, next) {
    console.log("req.sessionID");
    console.log(req.sessionID);
    req.session.destroy(function () {
        // delete loginedUser['12345678'];
        var resData = {
            status: "SUCCESS",
            message: "로그아웃 성공",
            validated: false,
            logined: false,
            data: null,
        };
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.json(resData);
    });
});
// 중복 확인 (method: POST)
router.post("/doublecheck", function (req, res, next) {
    var reqBody = req.body;
    var userID = reqBody.acc_user_id;
    var query = configQuery_1.default.doubleCheck();
    connectionPool_1.default.getConnection(function (err, connection) {
        if (err) {
            console.error(err);
            res
                .status(404)
                .json({ status: 404, message: "Pool getConnection Error" });
        }
        else {
            connection.query(query, userID, function (err, results, field) {
                if (err) {
                    console.error(err);
                    res
                        .status(404)
                        .json({ status: 404, message: "Connection Query Error" });
                }
                else {
                    var count = results[0].count;
                    var resData = {
                        auth: count === 0 ? true : false, // auth=true->uniNumber 사용 가능
                    };
                    console.log(resData);
                    res.json(resData);
                }
            });
        }
        connection.release();
    });
});
// 로그인 체크
router.get("/check", function (req, res) {
    sessionStore.get(req.sessionID, function (error, session) {
        console.log("session->", session);
        var resObj = {
            validated: req.session.hasOwnProperty("login") ? true : false,
        };
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.json(resObj);
    });
});
exports.default = router;
