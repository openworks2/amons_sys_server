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

const INFO_ANNOUNCE = "info_announce";

router.get(
  "/announces",
  async (req, res, next) => {
    try {
      await connectionUtile.getFindAll({
        table: INFO_ANNOUNCE,
        req,
        res,
      })();
      // findByFieldUtile();
    } catch (error) {
      console.error(error);
      res.status(404).json({ status: 404, message: "CallBack Function Error" });
    }
  }
);

router.get(
  "/announces/:index",
  async (req, res, next) => {
    const { index: param } = req.params;
    try {
      await connectionUtile.getFindByField({
        table: INFO_ANNOUNCE,
        param,
        field: "ann_id",
        req,
        res,
      })();
      // findByFieldUtile();
    } catch (error) {
      res.status(404).end();
    }
  }
);

router.post(
  "/announces",
  async (req, res, next) => {
    const { body: reqBody } = req;
    console.log(req.body);
    const { ann_title, ann_contents, ann_writer, ann_preview } = reqBody;

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      ann_title,
      ann_contents,
      ann_writer,
      ann_preview,
    };

    try {
      await connectionUtile.postInsert({
        table: INFO_ANNOUNCE,
        insertData,
        key: "ann_id",
        body: reqBody,
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({ status: 404, message: "CallBack Function Error" });
    }
  }
);

router.put(
  "/announces/:index",
  async (req, res, next) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { ann_title, ann_contents, ann_writer, ann_preview } = reqBody;

    const data = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      ann_title,
      ann_contents,
      ann_writer,
      ann_preview,
    };

    const updateData = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await connectionUtile.putUpdate({
        table: INFO_ANNOUNCE,
        field: "ann_id",
        updateData,
        body: reqBody,
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({ status: 404, message: "CallBack Function Error" });
    }
  }
);

router.delete(
  "/announces/:id",
  async (req, res, next) => {
    const { id: param } = req.params;
    try {
      await connectionUtile.deleteAction({
        table: INFO_ANNOUNCE,
        field: "ann_id",
        param,
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({ status: 404, message: "CallBack Function Error" });
    }
  }
);

module.exports = router;
