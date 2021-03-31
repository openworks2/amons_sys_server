import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import pool from "./conifg/connectionPool";
import indexCreateFn from "./lib/fillZero";
import queryConfig from "./conifg/query/configQuery";

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const INFO_CCTV: string = "info_cctv";

router.get("/cctvs", (req: Request, res: Response, next: NextFunction) => {
  const _query = queryConfig.findByAll(INFO_CCTV);
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
  "/cctvs/:index",
  (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const _query = queryConfig.findByField(INFO_CCTV, "cctv_index");

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

router.post("/cctvs", (req: Request, res: Response, next: NextFunction) => {
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

  const InsertData = {
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

  const _query = queryConfig.insert(INFO_CCTV);
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
              cctv_id: results.insertId,
              cctv_index: _cctvIndex,
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
  "/cctvs/:index",
  (req: Request, res: Response, next: NextFunction) => {
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

    const UpdataData: (object | string)[] = [];
    UpdataData[0] = data;
    UpdataData[1] = index;

    const _query = queryConfig.update(INFO_CCTV, "cctv_index");

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
            }
          }
        );
      }
      connection.release();
    });
  }
);

router.delete(
  "/cctvs/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const _query = queryConfig.delete(INFO_CCTV, "cctv_id");
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
