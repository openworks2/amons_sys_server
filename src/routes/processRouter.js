const express = require("express");
const router = express.Router();
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

const LOG_PROCESS = "log_process";

router.get(
  "/processes",
  async (req, res, next) => {
    try {
      await connectionUtile.getFindAll({
        table: LOG_PROCESS,
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
  "/processes/:index",
  async (req, res, next) => {
    const { index: param } = req.params;
    try {
      await connectionUtile.getFindByField({
        table: LOG_PROCESS,
        param,
        field: "pcs_seq",
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
  "/processes",
  async (req, res, next) => {
    const { body: reqBody } = req;
    const { pcs_state, local_index } = reqBody;

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      pcs_state,
      local_index,
    };

    try {
      await connectionUtile.postInsert({
        table: LOG_PROCESS,
        insertData,
        key: "pcs_seq",
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
  "/processes/:index",
  async (req, res, next) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { pcs_state, local_index } = reqBody;

    const data = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      pcs_state,
      local_index,
    };
    console.log("update-->", data);
    const updateData = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await connectionUtile.putUpdate({
        table: LOG_PROCESS,
        field: "pcs_seq",
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
  "/processes/:id",
  async (req, res, next) => {
    const { id: param } = req.params;
    try {
      await connectionUtile.deleteAction({
        table: LOG_PROCESS,
        field: "pcs_seq",
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
