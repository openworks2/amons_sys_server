const express = require("express");
const router = express.Router();
const indexCreateFn = require("./lib/fillZero");

const connectionUtile = require("./config/connectionUtile");

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const pool = require("./config/connectionPool");

const bleConfig = require('./lib/bleConfig');

setInterval(()=>{
  bleConfig.setData();
}, 5000);

const INFO_MONITOR_VIEW = "info_monitor_view";
router.get(
  "/monitors",
  async (req, res, next) => {
    try {
      await connectionUtile.getFindAllOrderByField({
        table: INFO_MONITOR_VIEW,
        field:'local_id',
        orderby: 'ASC',
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({ status: 404, message: "CallBack Async Function Error" });
    }
  }
);

router.get(
  "/scanners", (req, res, next) => {
    const _query = `SELECT * FROM info_scanner_view;`;
    pool.getConnection((err, connection) => {
      if (err) {
        res
          .status(404)
          .json({ status: 404, message: "Pool getConnection Error" });
      } else {
        connection.query(_query, (err, results, field) => {
          if (err) {
            res
              .status(404)
              .json({ status: 404, message: "Connection Query Error" });
          } else {
            res.json(results);
          }
        })
      }
      connection.release();
    });
  }
);

router.get("/beacons", (req, res, next) => {

  const _query = `SELECT * FROM ble_input_beacon_view;`;

  pool.getConnection((err, connection) => {
    if (err) {
      res
        .status(404)
        .json({ status: 404, message: "Pool getConnection Error" });
    } else {
      connection.query(_query, (err, results, field) => {
        if (err) {
          res
            .status(404)
            .json({ status: 404, message: "Connection Query Error" });
        } else {
          res.json(results);
        }
      })
    }
    connection.release();
  });
});

/**
 * @description router 내에서 socket 통신 예제
 */
// router.get(
//   "/monitors", (req, res, next) => {
//     const _query = `select * from info_monitor_view;`;

//     pool.getConnection((err, connection) => {
//       if (err) {

//       } else {
//         connection.query(_query, (err, results, field) => {
//           if (err) {

//           } else {
//             console.log(req.app.get('io'));
//             res.json(results);
//             const io = req.app.get('io');
//             // io.emit('project', 'project emit');
//             io.emit('receive', results);  
//           }
//         })
//         connection.release();
//       }
//     });
//   }
// );



module.exports = router;
