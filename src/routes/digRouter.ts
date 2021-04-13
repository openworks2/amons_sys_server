import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
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

const LOG_DIG: string = "log_dig";

router.get("/digs", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await getFindAll({
      table: LOG_DIG,
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

router.get(
  "/digs/:index",
  async (req: Request, res: Response, next: NextFunction) => {
    const { index: param } = req.params;
    try {
      await getFindByField({
        table: LOG_DIG,
        param,
        field: "dig_seq",
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
  "/digs",
  async (req: Request, res: Response, next: NextFunction) => {
    const { body: reqBody } = req;
    const { dig_length, local_index } = reqBody;

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      dig_length,
      local_index,
    };

    try {
      await postInsert({
        table: LOG_DIG,
        insertData,
        key: "dig_seq",
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
  "/digs/:index",
  async (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { dig_length, local_index } = reqBody;

    const data: object = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      dig_length,
      local_index,
    };

    const updateData: (object | string)[] = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await putUpdate({
        table: LOG_DIG,
        field: "dig_seq",
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
  "/digs/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: param } = req.params;
    try {
      await deleteAction({
        table: LOG_DIG,
        field: "dig_seq",
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
