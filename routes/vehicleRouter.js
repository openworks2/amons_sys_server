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

const upload = require('./lib/fileupload');
const multer = require('multer');

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
  (req, res, next) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return next(err);
      } else if (err) {
        return next(err);
      }
      // console.log('원본파일명 : ' + req.file.originalname)
      // console.log('저장파일명 : ' + req.file.filename)
      // console.log('크기 : ' + req.file.size)
      console.log(req);
      console.log(req.body.reqBody);
      console.log(JSON.parse(req.body.reqBody));
      const reqBody = JSON.parse(req.body.reqBody);
      console.log('reqBody-->', reqBody)
      const {
        vh_name,
        vh_number,
        vh_image,
        co_index,
        bc_index,
        description,
        bc_address
      } = reqBody;

      const _vehicleIndex = indexCreateFn("VH");

      const insertData = {
        created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        vh_index: _vehicleIndex,
        vh_name,
        vh_number,
        vh_image: req.file ? req.file.filename : null,
        co_index,
        bc_index,
        description
      };
      try {
        await connectionUtile.postInsert({
          table: INFO_VEHICLE,
          insertData,
          key: "vh_id",
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
      // console.log('경로 : ' + req.file.location) s3 업로드시 업로드 url을 가져옴
    });
  }
);

router.put(
  "/vehicles/:index",
  (req, res, next) => {
    upload(req, res, async (err) => {
      if (err instanceof multer.MulterError) {
        return next(err);
      } else if (err) {
        return next(err);
      }
      // console.log('원본파일명 : ' + req.file.originalname)
      // console.log('저장파일명 : ' + req.file.filename)
      // console.log('크기 : ' + req.file.size)
      console.log(req.body);
      console.log(JSON.parse(req.body.reqBody));
      const reqBody = JSON.parse(req.body.reqBody);
      console.log('reqBody-->', reqBody);
      const { index } = req.params;
      const {
        vh_id,
        vh_index,
        vh_name,
        vh_number,
        vh_image,
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
        vh_image: req.file ? req.file.filename : null,
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

    });
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
