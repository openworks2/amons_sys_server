import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import pool from "./conifg/connectionPool";
import indexCreateFn from "./lib/fillZero";
import queryConfig from "./conifg/query/configQuery";
import {
  deleteAction,
  getFindALl,
  getFindByField,
  postInsert,
  putUpdate,
} from "./conifg/connectionUtile";

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

const INFO_LOCAL: string = "info_local";

router.get(
  "/locals",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getFindALl({
        table: INFO_LOCAL,
        req,
        res,
      })();
      // findByFieldUtile();
    } catch (error) {
      res.status(404).end();
    }
  }
);

router.get(
  "/locals/:index",
  async (req: Request, res: Response, next: NextFunction) => {
    const { index: param } = req.params;
    try {
      await getFindByField({
        table: INFO_LOCAL,
        param,
        field: "local_index",
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
  "/locals",
  async (req: Request, res: Response, next: NextFunction) => {
    const { body: reqBody } = req;
    const {
      // local_index,
      local_name,
      plan_length,
      local_process,
      desciption,
    } = reqBody;

    const _localIndex = indexCreateFn("LC");

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      local_index: _localIndex,
      local_name,
      plan_length,
      local_process,
    };

    try {
      await postInsert({
        table: INFO_LOCAL,
        insertData,
        key: "local_id",
        req,
        res,
      })();
    } catch (error) {
      res.status(404).end();
    }
  }
);

router.put(
  "/locals/:index",
  async (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { local_name, plan_length, local_process, desciption } = reqBody;

    const data: object = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      local_name,
      plan_length,
      local_process,
    };
    const updateData: (object | string)[] = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await putUpdate({
        table: INFO_LOCAL,
        field: "local_index",
        updateData,
        req,
        res,
      })();
    } catch (error) {
      res.status(404).end();
    }
  }
);

router.delete(
  "/locals/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: param } = req.params;
    try {
      await deleteAction({
        table: INFO_LOCAL,
        field: "local_id",
        param,
        req,
        res,
      })();
    } catch (error) {
      res.status(404).end();
    }
  }
);

export default router;
