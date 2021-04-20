const express = require("express");
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
moment.tz.setDefault("Asia/Seoul");

const INFO_LOCAL = "info_local";

router.get(
  "/locals",
  async (req, res, nextn) => {
    try {
      await connectionUtile.getFindAll({
        table: INFO_LOCAL,
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
  "/locals/:index",
  async (req, res, nextn) => {
    const { index: param } = req.params;
    try {
      await connectionUtile.getFindByField({
        table: INFO_LOCAL,
        param,
        field: "local_index",
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

router.post(
  "/locals",
  async (req, res, nextn) => {
    const { body: reqBody } = req;
    const { local_name, plan_length, local_process } = reqBody;

    const _localIndex = indexCreateFn("LC");

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      local_index: _localIndex,
      local_name,
      plan_length,
      local_process,
    };

    try {
      await connectionUtile.postInsert({
        table: INFO_LOCAL,
        insertData,
        key: "local_id",
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
  "/locals/:index",
  async (req, res, nextn) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { local_name, plan_length, local_process } = reqBody;

    const data = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      local_name,
      plan_length,
      local_process,
    };
    const updateData = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await connectionUtile.putUpdate({
        table: INFO_LOCAL,
        field: "local_index",
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
  "/locals/:id",
  async (req, res, nextn) => {
    const { id: param } = req.params;
    try {
      await connectionUtile.deleteAction({
        table: INFO_LOCAL,
        field: "local_id",
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
