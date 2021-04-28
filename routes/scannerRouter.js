const express= require("express");
const router = express.Router();
const indexCreateFn = require("./lib/fillZero");
// const {
//   deleteAction,
//   getFindAll,
//   getFindByField,
//   postInsert,
//   putUpdate,
// } = require("./config/connectionUtile");
const connectionUtile = require("./config/connectionUtile");


const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const INFO_SCANNER = "info_scanner";
const INFO_SCANNER_VIEW = "info_scanner_view";

router.get(
  "/scanners",
  async (req, res, next) => {
    try {
      await connectionUtile.getFindAll({
        table: INFO_SCANNER_VIEW,
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

router.get(
  "/scanners/:index",
  async (req, res, next) => {
    const { index: param } = req.params;
    try {
      await connectionUtile.getFindByField({
        table: INFO_SCANNER_VIEW,
        param,
        field: "scn_index",
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

router.post(
  "/scanners",
  async (req, res, next) => {
    const { body: reqBody } = req;
    const {
      scn_pos_x,
      scn_kind,
      scn_group,
      scn_address,
      scn_name,
      scn_ip,
      scn_port,
      local_index,
    } = reqBody;

    const _scannerIndex = indexCreateFn("SCN");

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      scn_index: _scannerIndex,
      scn_pos_x,
      scn_kind,
      scn_group,
      scn_address,
      scn_name,
      scn_ip,
      scn_port,
      local_index,
    };

    try {
      await connectionUtile.postInsert({
        table: INFO_SCANNER,
        insertData,
        key: "scn_id",
        body: reqBody,
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

router.put(
  "/scanners/:index",
  async (req, res, next) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const {
      scn_id,
      scn_index,
      scn_pos_x,
      scn_kind,
      scn_group,
      scn_address,
      scn_name,
      scn_ip,
      scn_port,
      local_index,
    } = reqBody;

    const data = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      scn_id,
      scn_index,
      scn_pos_x,
      scn_kind,
      scn_group,
      scn_address,
      scn_name,
      scn_ip,
      scn_port,
      local_index,
    };

    const updateData = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await connectionUtile.putUpdate({
        table: INFO_SCANNER,
        field: "scn_index",
        updateData,
        body: reqBody,
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

router.delete(
  "/scanners/:id",
  async (req, res, next) => {
    const { id: param } = req.params;
    try {
      await connectionUtile.deleteAction({
        table: INFO_SCANNER,
        field: "scn_id",
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

module.exports = router;
