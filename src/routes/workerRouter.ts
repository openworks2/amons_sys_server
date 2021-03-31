import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import indexCreateFn from "./lib/fillZero";
import {
  deleteAction,
  getFindALl,
  getFindByField,
  postInsert,
  putUpdate,
} from "./conifg/connectionUtile";

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const INFO_WORKER: string = "info_worker";

router.get(
  "/workers",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getFindALl({
        table: INFO_WORKER,
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({status:404, message:"CallBack Async Function Error"});
    }
  }
);

router.get(
  "/workers/:index",
  async (req: Request, res: Response, next: NextFunction) => {
    const { index: param } = req.params;
    try {
      await getFindByField({
        table: INFO_WORKER,
        param,
        field: "wk_index",
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({status:404, message:"CallBack Async Function Error"});    }
  }
);

router.post(
  "/workers",
  async (req: Request, res: Response, next: NextFunction) => {
    const { body: reqBody } = req;
    console.log(req.body);
    const {
      wk_name,
      wk_phone,
      wk_tel,
      wk_position,
      wk_nation,
      wk_blood_type,
      wk_blood_group,
      wk_image_path,
      co_index,
      bc_index,
    } = reqBody;

    const _workerIndex = indexCreateFn("WK");

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      wk_index: _workerIndex,
      wk_name,
      wk_phone,
      wk_tel,
      wk_position,
      wk_nation,
      wk_blood_type,
      wk_blood_group,
      wk_image_path,
      co_index,
      bc_index,
    };
    try {
      await postInsert({
        table: INFO_WORKER,
        insertData,
        key: "wk_id",
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({status:404, message:"CallBack Async Function Error"});    }
  }
);

router.put(
  "/workers/:index",
  async (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const {
      wk_name,
      wk_phone,
      wk_tel,
      wk_position,
      wk_nation,
      wk_blood_type,
      wk_blood_group,
      wk_image_path,
      co_index,
      bc_index,
    } = reqBody;

    const data: object = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      wk_name,
      wk_phone,
      wk_tel,
      wk_position,
      wk_nation,
      wk_blood_type,
      wk_blood_group,
      wk_image_path,
      co_index,
      bc_index,
    };

    const updateData: (object | string)[] = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await putUpdate({
        table: INFO_WORKER,
        field: "wk_index",
        updateData,
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({status:404, message:"CallBack Async Function Error"});    }
  }
);

router.delete(
  "/workers/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: param } = req.params;
    try {
      await deleteAction({
        table: INFO_WORKER,
        field: "wk_id",
        param,
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({status:404, message:"CallBack Async Function Error"});    }
  }
);

export default router;
