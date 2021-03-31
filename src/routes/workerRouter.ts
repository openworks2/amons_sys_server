import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import pool from "./conifg/connectionPool";
import indexCreateFn from "./lib/fillZero";
import queryConfig from "./conifg/query/configQuery";

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const INFO_WORKER: string = "info_worker";

router.get("/workers", (req: Request, res: Response, next: NextFunction) => {
  const _query = queryConfig.findByAll(INFO_WORKER);
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
  "/workers/:index",
  (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const _query = queryConfig.findByField(INFO_WORKER, "wk_index");

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

router.post("/workers", (req: Request, res: Response, next: NextFunction) => {
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

  const InsertData = {
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

  const _query = queryConfig.insert(INFO_WORKER);

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
              wk_id: results.insertId,
              wk_index: _workerIndex,
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
  "/workers/:index",
  (req: Request, res: Response, next: NextFunction) => {
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

    const UpdataData: (object | string)[] = [];
    UpdataData[0] = data;
    UpdataData[1] = index;

    const _query = queryConfig.update(INFO_WORKER, "wk_index");

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
  "/workers/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const _query = queryConfig.delete(INFO_WORKER, "wk_id");
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
