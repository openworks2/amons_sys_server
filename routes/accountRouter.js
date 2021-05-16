const express = require("express");
const router = express.Router();
const cookieParser = require("cookie-parser");

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");
const CryptoJS = require("crypto-js");

const session = require("express-session");
const MySQLStore = require("express-mysql-session");

const pool = require("./config/connectionPool");
const queryConfig = require("./config/query/configQuery");

const dbconfig = require("./config/database");

const connectionUtile = require("./config/connectionUtile");
const sessionStore = new MySQLStore(dbconfig);
router.use(
  session({
    secret: "secret key",
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
  })
);

const requestIp = require('request-ip');
const useragent = require('express-useragent');

router.use(cookieParser());
router.use(useragent.express());

// interface result {
//   acc_id: number;
//   login_date?: string;
//   created_date: string;
//   modified_date: string | null;
//   acc_name: string;
//   acc_user_id: string;
//   acc_phone: string;
//   acc_tel: string;
//   acc_mail: string;
//   acc_role: number;
// }

// interface ResponseData {
//   status: string;
//   message: string;
//   validated: boolean; // 계정 체크
//   logined: boolean; // 로그인 상태
//   data: result | null;
// }

const TB_ACCOUNT = "tb_account";

// 계정 조회 (method: GET)
router.get(
  "/accounts",
  async (req, res, next) => {
    const _query = queryConfig.findByAll(TB_ACCOUNT);

    try {
      await connectionUtile.getFindAll({
        table: TB_ACCOUNT,
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res
        .status(404)
        .json({ status: 404, message: "CallBack Async Function Error" });
    }
  }
);

// 계정 1개 조회 (method: GET)
router.get(
  "/accounts/:index",
  async (req, res, next) => {
    const { index: param } = req.params;
    try {
      await connectionUtile.getFindByField({
        table: TB_ACCOUNT,
        param,
        field: "acc_id",
        req,
        res,
      })();
      // findByFieldUtile();
    } catch (error) {
      console.error(error);
      res
        .status(404)
        .json({ status: 404, message: "CallBack Async Function Error" });
    }
  }
);
// 계정 등록 (method: POST)
router.post("/accounts", (req, res, next) => {
  const { body: reqBody } = req;
  // console.log(req.body);
  const {
    acc_name,
    acc_user_id,
    acc_password,
    acc_phone,
    acc_tel,
    acc_mail,
    acc_role,
    acc_description
  } = reqBody;

  const hashDigest = CryptoJS.SHA256(acc_password).toString();
  console.log("hashDigest-->", hashDigest);
  var salt = CryptoJS.lib.WordArray.random(128 / 8);
  const key128Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, {
    keySize: 128 / 32,
  }).toString();
  console.log("key128Bits->>", key128Bits);
  const InsertData = {
    created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
    acc_name,
    acc_user_id,
    acc_password: `${hashDigest}${key128Bits}`,
    acc_salt: key128Bits,
    acc_phone,
    acc_tel,
    acc_mail,
    acc_role,
    acc_description
  };

  const _query = queryConfig.insert(TB_ACCOUNT);

  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res
        .status(404)
        .json({ status: 404, message: "Pool getConnection Error" });
    } else {
      connection.query(
        _query,
        InsertData,
        (err, results, field) => {
          if (err) {
            console.error(err);
            res
              .status(404)
              .json({ status: 404, message: "Connection Query Error" });
          } else {
            const resObj = {
              created_date: InsertData.created_date,
              acc_id: results.insertId,
              acc_name: reqBody.acc_name,
              acc_user_id: reqBody.acc_user_id,
              acc_phone: reqBody.acc_phone,
              acc_tel: reqBody.acc_tel,
              acc_mail: reqBody.acc_mail,
              acc_role: reqBody.acc_role,
              acc_description: reqBody.acc_description
            };
            res.json(resObj);
          }
        }
      );
    }
    connection.release();
  });
});
// 계정 수정 (method: PUT)
router.put('/accounts/:index', (req, res, next) => {
  const { index } = req.params;
  const { body: reqBody } = req;
  console.log(index)
  console.log(reqBody)
  const {
    acc_name,
    acc_user_id,
    acc_password,
    acc_phone,
    acc_tel,
    acc_mail,
    acc_role,
    acc_description
  } = reqBody;

  const hashDigest = CryptoJS.SHA256(acc_password).toString();
  console.log("hashDigest-->", hashDigest);
  var salt = CryptoJS.lib.WordArray.random(128 / 8);
  const key128Bits = CryptoJS.PBKDF2("Secret Passphrase", salt, {
    keySize: 128 / 32,
  }).toString();
  console.log("key128Bits->>", key128Bits);

  const data = {
    modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
    acc_name,
    acc_user_id,
    acc_password: `${hashDigest}${key128Bits}`,
    acc_salt: key128Bits,
    acc_phone,
    acc_tel,
    acc_mail,
    acc_role,
    acc_description
  };


  const updateData = [];
  updateData[0] = data;
  updateData[1] = index;


  const _query = queryConfig.update(TB_ACCOUNT, 'acc_id');
  pool.getConnection((err, connection) => {
    if (err) {
      console.error(err);
      res
        .status(404)
        .json({ status: 404, message: "Pool getConnection Error" });
    } else {
      connection.query(
        _query,
        updateData,
        (err, results, field) => {
          if (err) {
            console.error(err);
            res
              .status(404)
              .json({ status: 404, message: "Connection Query Error" });
          } else {
            const resObj = {
              ...reqBody,
              modified_date: data.modified_date,
              acc_name: reqBody.acc_name,
              acc_user_id: reqBody.acc_user_id,
              acc_phone: reqBody.acc_phone,
              acc_tel: reqBody.acc_tel,
              acc_mail: reqBody.acc_mail,
              acc_role: reqBody.acc_role,
              acc_description: reqBody.acc_description,
            };
            res.json(resObj);
          }
        }
      );
    }
    connection.release();
  });

});



// 계정 삭제 (method: DELETE)
router.delete(
  "/accounts/:id",
  async (req, res, next) => {
    const { id: param } = req.params;
    try {
      await connectionUtile.deleteAction({
        table: TB_ACCOUNT,
        field: "acc_id",
        param,
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res
        .status(404)
        .json({ status: 404, message: "CallBack Async Function Error" });
    }
  }
);

// 로그인 (method: POST)
router.post("/login", (req, res, next) => {
  const { body: reqBody } = req;
  const { acc_user_id, acc_password, screen } = reqBody;
  const _query = queryConfig.findByField(TB_ACCOUNT, "acc_user_id");
  pool.getConnection((err, connection) => {
    if (err) {
    } else {
      connection.query(_query, acc_user_id, (err, results, fields) => {
        if (err) {
        } else {
          /**
           * @response object resData
           * @property string message '아이디 확인'/'비밀번호 확인'/'로그인 성공'
           * @property string status 'success' / 'fail'
           * @property object data results
           */
          const isResults = results.length;
          if (isResults === 0) {
            // 아이디가 존재 하지 않는다.
            const resData = {
              status: "FAIL",
              message: "사용자 아이디 확인를 확인해주세요.",
              validated: false, // 계정 체크
              logined: false, // 로그인 상태
              data: null,
            };

            res.json(resData);
          } else {
            // 아이디가 존재 한다.
            const result = results[0];
            const {
              acc_user_id: userID,
              acc_password: userPW,
              acc_salt: salt,
            } = results[0];
            const hashDigest = CryptoJS.SHA256(acc_password).toString();
            const diffPW = `${hashDigest}${salt}`;

            if (userPW === diffPW) {
              const resResult = {
                login_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
                created_date: moment(result.created_date).format(
                  "YYYY-MM-DD HH:mm:ss.SSS"
                ),
                modified_date: result.modified_date,
                acc_id: result.insertId,
                acc_name: result.acc_name,
                acc_user_id: result.acc_user_id,
                acc_phone: result.acc_phone,
                acc_tel: result.acc_tel,
                acc_mail: result.acc_mail,
                acc_role: result.acc_role,
              };

              const resData = {
                status: "SUCCESS",
                message: "로그인 성공",
                validated: true, // 계정 체크
                logined: true, // 로그인 상태
                data: resResult,
              };

              // 세션 저장
              req.session["login"] = resResult;
              req.session["logined"] = true;
              res.setHeader('Access-Control-Allow-Credentials', 'true');
              req.session.save(() => {
                console.log("sessionID-->", req.sessionID);

                console.log("client IP: " + requestIp.getClientIp(req));
                console.log("client INFO: ", req.useragent)

                res.json(resData);

                /**로그인 로그 등록 */
                const logData = {
                  ip: requestIp.getClientIp(req),
                  user_id: acc_user_id,
                  os: req.useragent.os,
                  browser: req.useragent.browser,
                  screen: screen
                }
                loginLogHandler(logData)
              });
            } else {
              const resData = {
                status: "FAIL",
                message: "비밀번호를 확인해주세요.",
                validated: false, // 계정 체크
                logined: false, // 로그인 상태
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
router.get("/logout", (req, res, next) => {
  console.log("req.sessionID");
  console.log(req.sessionID);
  req.session.destroy(() => {
    // delete loginedUser['12345678'];
    const resData = {
      status: "SUCCESS",
      message: "로그아웃 성공",
      validated: false, // 계정 체크
      logined: false, // 로그인 상태
      data: null,
    };
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.json(resData);
  });
});

// 중복 확인 (method: POST)
router.post(
  "/doublecheck",
  (req, res, next) => {
    const reqBody = req.body;
    const { acc_user_id: userID } = reqBody;
    const query = queryConfig.doubleCheck();
    pool.getConnection((err, connection) => {
      if (err) {
        console.error(err);
        res
          .status(404)
          .json({ status: 404, message: "Pool getConnection Error" });
      } else {
        connection.query(
          query,
          userID,
          (err, results, field) => {
            if (err) {
              console.error(err);
              res
                .status(404)
                .json({ status: 404, message: "Connection Query Error" });
            } else {
              const { count } = results[0];
              const resData = {
                auth: count === 0 ? true : false, // auth=true->uniNumber 사용 가능
              };
              console.log(resData);
              res.json(resData);
            }
          }
        );
      }
      connection.release();
    });
  }
);

// 로그인 체크
router.get("/check", (req, res) => {
  sessionStore.get(req.sessionID, (error, session) => {
    console.log("session->", session);
    const resObj = {
      validated: req.session.hasOwnProperty("login") ? true : false,
    };
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.json(resObj);
  });
});

/**
 * 
 * @param {object} data
 * @property {string} ip
 * @property {string} user_id
 * @property {string} os
 * @property {string} browser
 * @property {string} screen
 */

const loginLogHandler = (data) => {
  const { ip, user_id, os, browser, screen } = data;
  const logData = {
    ll_logined_date: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
    ll_ip: ip,
    ll_user_id: user_id,
    ll_os: os,
    ll_browser: browser,
    ll_screen: screen,
  }

  const _query = queryConfig.insert('log_login');

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Pool getConnection Error");
    } else {
      connection.query(_query, logData, (err, results, field) => {
        if (err) {
          console.error("Connection Query Error");
        } else {
          console.log(results);
        }
      }
      );
    }
    connection.release();
  });

}

router.get('/main', function (req, res) {
  console.log("client IP: " + requestIp.getClientIp(req));
  console.log("client INFO: ", req.useragent)
  res.json(req.useragent);
})


module.exports = router;
