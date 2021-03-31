import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import {
  deleteAction,
  getFindALl,
  getFindByField,
  postInsert,
  putUpdate,
} from "./conifg/connectionUtile";
import indexCreateFn from "./lib/fillZero";

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const INFO_COMPANY: string = "info_company";

router.get(
  "/companies",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getFindALl({
        table: INFO_COMPANY,
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
  "/companies/:index",
  async (req: Request, res: Response, next: NextFunction) => {
    const { index: param } = req.params;
    try {
      await getFindByField({
        table: INFO_COMPANY,
        param,
        field: "co_index",
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
  "/companies",
  async (req: Request, res: Response, next: NextFunction) => {
    const { body: reqBody } = req;
    console.log(req.body);
    const { co_name, co_sectors } = reqBody;
    const _companyIndex = indexCreateFn("CO");

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      co_index: _companyIndex,
      co_name,
      co_sectors,
    };

    try {
      await postInsert({
        table: INFO_COMPANY,
        insertData,
        key: "co_id",
        req,
        res,
      })();
    } catch (error) {
      res.status(404).end();
    }
  }
);

router.put(
  "/companies/:index",
  async (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { co_name, co_sectors } = reqBody;

    const data: object = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      co_name,
      co_sectors,
    };

    const updateData: (object | string)[] = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await putUpdate({
        table: INFO_COMPANY,
        field: "co_index",
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
  "/companies/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: param } = req.params;
    try {
      await deleteAction({
        table: INFO_COMPANY,
        field: "co_id",
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
