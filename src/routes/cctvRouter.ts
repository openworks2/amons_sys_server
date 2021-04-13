import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import pool from "./conifg/connectionPool";
import indexCreateFn from "./lib/fillZero";
import queryConfig from "./conifg/query/configQuery";
import {
  deleteAction,
  getFindAll,
  getFindByField,
  postInsert,
  putUpdate,
} from "./conifg/connectionUtile";

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const INFO_CCTV: string = "info_cctv";

router.get(
  "/cctvs",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getFindAll({
        table: INFO_CCTV,
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { index: param } = req.params;
    try {
      await getFindByField({
        table: INFO_CCTV,
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { body: reqBody } = req;
    const {
      cctv_name,
      cctv_pos_x,
      cctv_user_id,
      cctv_pw,
      cctv_ip,
      cctv_port,
      local_index,
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
      local_index,
    };

    try {
      await postInsert({
        table: INFO_CCTV,
        insertData,
        key: "cctv_id",
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
  async (req: Request, res: Response, next: NextFunction) => {
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
    } = reqBody;

    const data: object = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      cctv_name,
      cctv_pos_x,
      cctv_user_id,
      cctv_pw,
      cctv_ip,
      cctv_port,
      local_index,
    };

    const updateData: (object | string)[] = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await putUpdate({
        table: INFO_CCTV,
        field: "cctv_index",
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
  "/cctvs/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: param } = req.params;
    try {
      await deleteAction({
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

export default router;
