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

const LOG_DIG = "log_dig";

router.get("/digs", async (req, res, next) => {
  try {
    await connectionUtile.getFindAll({
      table: LOG_DIG,
      req,
      res,
    })();
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ status: 404, message: "CallBack Async Function Error" });
  }
});

router.get(
  "/digs/:index",
  async (req, res, next) => {
    const { index: param } = req.params;
    try {
      await connectionUtile.getFindByField({
        table: LOG_DIG,
        param,
        field: "dig_seq",
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
  "/digs",
  async (req, res, next) => {
    const { body: reqBody } = req;
    const { created_date, dig_length, local_index, description } = reqBody;

    const insertData = {
      created_date,
      dig_length,
      local_index,
      description
    };

    try {
      await connectionUtile.postInsert({
        table: LOG_DIG,
        insertData,
        key: "dig_seq",
        body:reqBody,
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
  "/digs/:index",
  async (req, res, next) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { dig_length, local_index, description } = reqBody;

    const data = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      dig_length,
      local_index,
      description
    };

    const updateData = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await connectionUtile.putUpdate({
        table: LOG_DIG,
        field: "dig_seq",
        updateData,
        body:reqBody,
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
  "/digs/:id",
  async (req, res, next) => {
    const { id: param } = req.params;
    try {
      await connectionUtile.deleteAction({
        table: LOG_DIG,
        field: "dig_seq",
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
