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

const INFO_VEHICLE = "info_vehicle";
const INFO_VEHICLE_VIEW = "info_vehicle_view";

router.get(
  "/vehicles",
  async (req, res, next) => {
    try {
      await connectionUtile.getFindAll({
        table: INFO_VEHICLE_VIEW,
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
  "/vehicles/:index",
  async (req, res, next) => {
    const { index: param } = req.params;

    try {
      await connectionUtile.getFindByField({
        table: INFO_VEHICLE_VIEW,
        param,
        field: "vh_index",
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
  "/vehicles",
  async (req, res, next) => {
    const { body: reqBody } = req;
    console.log(req.body);
    const { vh_name, vh_number, vh_image_path, co_index, bc_index, description } = reqBody;


    const _vehicleIndex = indexCreateFn("VH");

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      vh_index: _vehicleIndex,
      vh_name,
      vh_number,
      vh_image_path,
      co_index,
      bc_index,
      description
    };

    try {
      await connectionUtile.postInsert({
        table: INFO_VEHICLE,
        insertData,
        key: "vh_id",
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
  "/vehicles/:index",
  async (req, res, next) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const {
      vh_id,
      vh_index,
      vh_name,
      vh_number,
      vh_image_path,
      description,
      co_index,
      bc_index,
      bc_address
    } = reqBody;
    const data = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      vh_id,
      vh_index,
      vh_name,
      vh_number,
      vh_image_path,
      co_index,
      bc_index,
      description
    };

    const updateData = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await connectionUtile.putUpdate({
        table: INFO_VEHICLE,
        field: "vh_index",
        updateData,
        body: {
          ...reqBody,
          bc_address: bc_index !== null ? bc_address : null
        },
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
  "/vehicles/:id",
  async (req, res, next) => {
    const { id: param } = req.params;
    try {
      await connectionUtile.deleteAction({
        table: INFO_VEHICLE,
        field: "vh_id",
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
