import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import indexCreateFn from "./lib/fillZero";
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

const INFO_SCANNER: string = "info_scanner";

router.get(
  "/scanners",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await getFindAll({
        table: INFO_SCANNER,
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
  "/scanners/:index",
  async (req: Request, res: Response, next: NextFunction) => {
    const { index: param } = req.params;
    try {
      await getFindByField({
        table: INFO_SCANNER,
        param,
        field: "scn_index",
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
  "/scanners",
  async (req: Request, res: Response, next: NextFunction) => {
    const { body: reqBody } = req;
    const {
      scn_pos_x,
      scn_kind,
      scn_group,
      scn_address,
      scn_name,
      scn_ip,
      scn_port,
      local_index,
    } = reqBody;

    const _scannerIndex = indexCreateFn("SCN");

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      scn_index: _scannerIndex,
      scn_pos_x,
      scn_kind,
      scn_group,
      scn_address,
      scn_name,
      scn_ip,
      scn_port,
      local_index,
    };

    try {
      await postInsert({
        table: INFO_SCANNER,
        insertData,
        key: "scn_id",
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
  "/scanners/:index",
  async (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const {
      scn_pos_x,
      scn_kind,
      scn_group,
      scn_address,
      scn_name,
      scn_ip,
      scn_port,
      local_index,
    } = reqBody;

    const data: object = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      scn_pos_x,
      scn_kind,
      scn_group,
      scn_address,
      scn_name,
      scn_ip,
      scn_port,
      local_index,
    };

    const updateData: (object | string)[] = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await putUpdate({
        table: INFO_SCANNER,
        field: "scn_index",
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
  "/scanners/:id",
  async (req: Request, res: Response, next: NextFunction) => {
    const { id: param } = req.params;
    try {
      await deleteAction({
        table: INFO_SCANNER,
        field: "scn_id",
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
