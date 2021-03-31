import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import pool from "./conifg/connectionPool";
import indexCreateFn from "./lib/fillZero";
import queryConfig from "./conifg/query/configQuery";

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const INFO_VEHICLE: string = "info_vehicle";

router.get("/vehicles", (req: Request, res: Response, next: NextFunction) => {
  const _query = queryConfig.findByAll(INFO_VEHICLE);
  pool.getConnection((err: any, connection: any) => {
    if (err) {
      res.status(404).end();
      throw new Error("Pool getConnection Error!!");
    } else {
      connection.query(_query, (err: any, results: any, field: any) => {
        if (err) {
          res.status(404).end();
          throw new Error("Connection Query Error!!");
        } else {
          res.json(results);
        }
      });
    }
    connection.release();
  });
});

router.get(
  "/vehicles/:index",
  (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const _query = queryConfig.findByField(INFO_VEHICLE, "vh_index");

    pool.getConnection((err: any, connection: any) => {
      if (err) {
        res.status(404).end();
        throw new Error("Pool getConnection Error!!");
      } else {
        connection.query(
          _query,
          index,
          (err: any, results: any, field: any) => {
            if (err) {
              res.status(404).end();
              throw new Error("Connection Query Error!!");
            } else {
              res.json(results);
            }
          }
        );
      }
      connection.release();
    });
  }
);

router.post("/vehicles", (req: Request, res: Response, next: NextFunction) => {
  const { body: reqBody } = req;
  console.log(req.body);
  const { vh_name, vh_number, vh_image_path, co_index, bc_index } = reqBody;

  const _vehicleIndex = indexCreateFn("VH");

  const InsertData = {
    created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
    vh_index: _vehicleIndex,
    vh_name,
    vh_number,
    vh_image_path,
    co_index,
    bc_index,
  };

  const _query = queryConfig.insert(INFO_VEHICLE);

  pool.getConnection((err: any, connection: any) => {
    if (err) {
      res.status(404).end();
      throw new Error("Pool getConnection Error!!");
    } else {
      connection.query(
        _query,
        InsertData,
        (err: any, results: any, field: any) => {
          if (err) {
            res.status(404).end();
            throw new Error("Connection Query Error!!");
          } else {
            const resObj: object = {
              ...reqBody,
              vh_id: results.insertId,
              vh_index: _vehicleIndex,
              created_date: InsertData.created_date,
            };
            res.json(resObj);
          }
        }
      );
    }
    connection.release();
  });
});

router.put(
  "/vehicles/:index",
  (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { vh_name, vh_number, vh_image_path, co_index, bc_index } = reqBody;

    const data: object = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      vh_name,
      vh_number,
      vh_image_path,
      co_index,
      bc_index,
    };

    const UpdataData: (object | string)[] = [];
    UpdataData[0] = data;
    UpdataData[1] = index;

    const _query = queryConfig.update(INFO_VEHICLE, "vh_index");

    pool.getConnection((err: any, connection: any) => {
      if (err) {
        res.status(404).end();
        throw new Error("Pool getConnection Error!!");
      } else {
        connection.query(
          _query,
          UpdataData,
          (err: any, results: any, field: any) => {
            if (err) {
              res.status(404).end();
              throw new Error("Connection Query Error!!");
            } else {
              const resObj = {
                ...reqBody,
                modified_date: data["modified_date"],
              };
              res.json(resObj);
            }
          }
        );
      }
      connection.release();
    });
  }
);

router.delete(
  "/vehicles/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const _query = queryConfig.delete(INFO_VEHICLE, "vh_id");
    pool.getConnection((err: any, connection: any) => {
      if (err) {
        res.status(404).end();
        throw new Error("Pool getConnection Error!!");
      } else {
        connection.query(_query, id, (err: any, results: any, field: any) => {
          if (err) {
            res.status(404).end();
            throw new Error("Connection Query Error!!");
          } else {
            const result: object = {
              ...results,
              id,
            };
            res.json(result);
          }
        });
      }
      connection.release();
    });
  }
);

export default router;
