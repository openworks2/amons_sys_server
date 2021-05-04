const express = require("express");
const router = express.Router();
const indexCreateFn = require("./lib/fillZero");

const connectionUtile = require("./config/connectionUtile");

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const upload = require('./lib/fileupload');
const multer = require('multer');
const pool = require("./config/connectionPool");

const INFO_MONITOR_VIEW = "info_monitor_view";

router.get(
  "/monitors",
  async (req, res, next) => {
    try {
      await connectionUtile.getFindAll({
        table: INFO_MONITOR_VIEW,
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({ status: 404, message: "CallBack Async Function Error" });
    }
  }
);


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
