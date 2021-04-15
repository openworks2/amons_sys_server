const express = require("express");
const router = express.Router();
const indexCreateFn = require("./lib/fillZero");
// const {
//   deleteAction,
//   getFindAll,
//   getFindByField,
//   postInsert,
//   putUpdate,
// } = require("./conifg/connectionUtile");

const connectionUtile = require("./conifg/connectionUtile");


const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const INFO_BEACON = "info_beacon";

router.get(
  "/beacons",
  async (req, res, next) => {
    try {
      await connectionUtile.getFindAll({
        table: INFO_BEACON,
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({ status: 404, message: "CallBack Function Error" });
    }
  }
);

router.get(
  "/beacons/:index",
  async (req, res, next) => {
    const { index: param } = req.params;
    try {
      await connectionUtile.getFindByField({
        table: INFO_BEACON,
        param,
        field: "bc_index",
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
  "/beacons",
  async (req, res, next) => {
    const { body: reqBody } = req;
    const { bc_address } = reqBody;

    const _beaconIndex = indexCreateFn("BC");

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      bc_index: _beaconIndex,
      bc_address,
    };

    try {
      await connectionUtile.postInsert({
        table: INFO_BEACON,
        insertData,
        key: "bc_id",
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
  "/beacons/:index",
  async (req, res, next) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { bc_address } = reqBody;

    const data = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      bc_address,
    };

    const updateData = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await connectionUtile.putUpdate({
        table: INFO_BEACON,
        field: "bc_index",
        updateData,
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
  "/beacons/:id",
  async (req, res, next) => {
    const { id: param } = req.params;
    try {
      await connectionUtile.deleteAction({
        table: INFO_BEACON,
        field: "bc_id",
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
