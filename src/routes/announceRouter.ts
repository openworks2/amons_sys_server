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

const INFO_ANNOUNCE: string = "info_announce";

router.get(
  "/announces",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getFindAll({
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { index: param } = req.params;
    try {
      await getFindByField({
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
  async (req: Request, res: Response, next: NextFunction) => {
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
      await postInsert({
        table: INFO_ANNOUNCE,
        insertData,
        key: "ann_id",
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { ann_title, ann_contents, ann_writer, ann_preview } = reqBody;

    const data: object = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      ann_title,
      ann_contents,
      ann_writer,
      ann_preview,
    };

    const updateData: (object | string)[] = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await putUpdate({
        table: INFO_ANNOUNCE,
        field: "ann_id",
        updateData,
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
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: param } = req.params;
    try {
      await deleteAction({
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

export default router;
