const express = require("express");
const router = express.Router();
const indexCreateFn = require("./lib/fillZero");

const connectionUtile = require("./config/connectionUtile");

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const upload = require('./lib/fileupload');
const multer = require('multer');

const INFO_WORKER = "info_worker";
const INFO_WORKER_VIEW = "info_worker_view";

router.get(
  "/workers",
  async (req, res, next) => {
    try {
      await connectionUtile.getFindAll({
        table: INFO_WORKER_VIEW,
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({ status: 404, message: "CallBack Async Function Error" });
    }
  }
);

router.get(
  "/workers/:index",
  async (req, res, next) => {
    const { index: param } = req.params;
    try {
      await connectionUtile.getFindByField({
        table: INFO_WORKER_VIEW,
        param,
        field: "wk_index",
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({ status: 404, message: "CallBack Async Function Error" });
    }
  }
);

router.post(
  "/workers",
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
        wk_name,
        wk_phone,
        wk_tel,
        wk_birth,
        wk_position,
        wk_nation,
        wk_blood_type,
        wk_blood_group,
        wk_sms_yn,
        co_index,
        bc_index,
        bc_address,
      } = reqBody;
      const _workerIndex = indexCreateFn("WK");
      const insertData = {
        created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        wk_index: _workerIndex,
        wk_name,
        wk_phone,
        wk_tel,
        wk_birth,
        wk_position,
        wk_nation,
        wk_blood_type,
        wk_blood_group,
        wk_sms_yn,
        wk_image: req.file ? req.file.filename : null,
        co_index,
        bc_index
      };
      try {
        await connectionUtile.postInsert({
          table: INFO_WORKER,
          insertData,
          key: "wk_id",
          body: {
            ...reqBody,
            bc_address: bc_index !== null ? bc_address : null
          },
          req,
          res,
        })();
      } catch (error) {
        console.error(error);
        res.status(404).json({ status: 404, message: "CallBack Async Function Error" });
      }
    });
  }
);

router.put(
  "/workers/:index",
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
      const { index } = req.params;
      const {
        wk_id,
        wk_index,
        wk_name,
        wk_phone,
        wk_tel,
        wk_birth,
        wk_position,
        wk_nation,
        wk_blood_type,
        wk_blood_group,
        wk_sms_yn,
        wk_image,
        co_index,
        bc_index,
        bc_address
      } = reqBody;

      const data = {
        modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
        wk_id,
        wk_index,
        wk_name,
        wk_phone,
        wk_tel,
        wk_birth,
        wk_position,
        wk_nation,
        wk_blood_type,
        wk_blood_group,
        wk_sms_yn,
        wk_image: req.file ? req.file.filename : null,
        co_index,
        bc_index,
      };
      console.log('data--->',data);
      const updateData = [];
      updateData[0] = data;
      updateData[1] = index;
      try {
        await connectionUtile.putUpdate({
          table: INFO_WORKER,
          field: "wk_index",
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
        res.status(404).json({ status: 404, message: "CallBack Async Function Error" });
      }
    });
  }
);

router.delete(
  "/workers/:id",
  async (req, res, next) => {
    const { id: param } = req.params;
    try {
      await connectionUtile.deleteAction({
        table: INFO_WORKER,
        field: "wk_id",
        param,
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({ status: 404, message: "CallBack Async Function Error" });
    }
  }
);

module.exports = router;
