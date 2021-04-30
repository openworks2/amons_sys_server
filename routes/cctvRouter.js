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
moment.tz.setDefault("Asiz/Seoul");

const INFO_CCTV = "info_cctv";
const INFO_CCTV_VIEW = "info_cctv_view";

router.get(
  "/cctvs",
  async (req, res, next) => {
    try {
      await connectionUtile.getFindAll({
        table: INFO_CCTV_VIEW,
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

router.get(
  "/cctvs/:index",
  async (req, res, next) => {
    const { index: param } = req.params;
    try {
      await connectionUtile.getFindByField({
        table: INFO_CCTV_VIEW,
        param,
        field: "cctv_index",
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
  "/cctvs",
  async (req, res, next) => {
    const { body: reqBody } = req;
    const {
      cctv_name,
      cctv_pos_x,
      cctv_user_id,
      cctv_pw,
      cctv_ip,
      cctv_port,
      cctv_number, // 탭순서
      description,
      local_index
    } = reqBody;

    const _cctvIndex = indexCreateFn("CCTV");

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      cctv_index: _cctvIndex,
      cctv_name,
      cctv_pos_x,
      cctv_user_id,
      cctv_pw,
      cctv_ip,
      cctv_port,
      cctv_number, // 탭순서
      description,
      local_index
    };

    try {
      await connectionUtile.postInsert({
        table: INFO_CCTV,
        insertData,
        key: "cctv_id",
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
  "/cctvs/:index",
  async (req, res, next) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const {
      cctv_name,
      cctv_pos_x,
      cctv_user_id,
      cctv_pw,
      cctv_ip,
      cctv_port,
      local_index,
      cctv_number, // 탭순서
      description,
    } = reqBody;

    const data = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      cctv_name,
      cctv_pos_x,
      cctv_user_id,
      cctv_pw,
      cctv_ip,
      cctv_port,
      local_index,
      cctv_number, // 탭순서
      description,
    };

    const updateData = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await connectionUtile.putUpdate({
        table: INFO_CCTV,
        field: "cctv_index",
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
  "/cctvs/:id",
  async (req, res, next) => {
    const { id: param } = req.params;
    try {
      await connectionUtile.deleteAction({
        table: INFO_CCTV,
        field: "cctv_id",
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
