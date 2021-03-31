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
router.get("/accounts", function (req, res, next) {
    var _query = configQuery_1.default.findByAll(TB_ACCOUNT);
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
// 계정 1개 조회 (method: GET)
router.get("/accounts/:index", function (req, res, next) {
    var index = req.params.index;
    var _query = configQuery_1.default.findByField(TB_ACCOUNT, "acc_id");
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
router.delete("/accounts/:id", function (req, res, next) {
    var id = req.params.id;
    var _query = configQuery_1.default.delete(TB_ACCOUNT, "acc_id");
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
// 로그인 (method: POST)
router.post("/login", function (req, res, next) {
    var reqBody = req.body;
    var acc_user_id = reqBody.acc_user_id, acc_password = reqBody.acc_password;
    console.log(reqBody);
    console.log(req.session);
    var _query = configQuery_1.default.findByField(TB_ACCOUNT, "acc_user_id");
    console.log(_query);
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
            res.status(err.status).end();
            throw new Error("Response Error!!");
        }
        else {
            connection.query(query, userID, function (err, results, field) {
                if (err) {
                    res.status(404).end();
                    throw err;
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
            validated: req.session.hasOwnProperty('login') ? true : false,
        };
        res.setHeader("Access-Control-Allow-Credentials", "true");
        res.json(resObj);
    });
});
exports.default = router;
