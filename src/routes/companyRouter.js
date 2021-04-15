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

const INFO_COMPANY = "info_company";

router.get(
  "/companies",
  async (req, res, next) => {
    try {
      await connectionUtile.getFindAll({
        table: INFO_COMPANY,
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
  "/companies/:index",
  async (req, res, next) => {
    const { index: param } = req.params;
    try {
      await connectionUtile.getFindByField({
        table: INFO_COMPANY,
        param,
        field: "co_index",
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
  "/companies",
  async (req, res, next) => {
    const { body: reqBody } = req;
    console.log(req.body);
    const { co_name, co_sectors, description } = reqBody;
    const _companyIndex = indexCreateFn("CO");

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      co_index: _companyIndex,
      co_name,
      co_sectors,
      description
    };

    try {
      await connectionUtile.postInsert({
        table: INFO_COMPANY,
        insertData,
        key: "co_id",
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
  "/companies/:index",
  async (req, res, next) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { co_name, co_sectors, description } = reqBody;

    const data = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      co_name,
      co_sectors,
      description
    };

    const updateData = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await connectionUtile.putUpdate({
        table: INFO_COMPANY,
        field: "co_index",
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
  "/companies/:id",
  async (req, res, next) => {
    const { id: param } = req.params;
    try {
      await connectionUtile.deleteAction({
        table: INFO_COMPANY,
        field: "co_id",
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
