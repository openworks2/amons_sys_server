const express = require("express");
const router = express.Router();
const indexCreateFn = require("./lib/fillZero");

const connectionUtile = require("./config/connectionUtile");

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const upload = require('./lib/fileupload');
const multer = require('multer');

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


module.exports = router;
