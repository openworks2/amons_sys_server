import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import pool from "./conifg/connectionPool";
import indexCreateFn from "./lib/fillZero";
import queryConfig from "./conifg/query/configQuery";

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const LOG_DIG: string = "log_dig";

router.get("/digs", (req: Request, res: Response, next: NextFunction) => {
  const _query = queryConfig.findByAll(LOG_DIG);
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
  "/digs/:index",
  (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const _query = queryConfig.findByField(LOG_DIG, "dig_seq");

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

router.post("/digs", (req: Request, res: Response, next: NextFunction) => {
  const { body: reqBody } = req;
  const { dig_length, local_index } = reqBody;

  const InsertData = {
    created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
    dig_length,
    local_index,
  };

  const _query = queryConfig.insert(LOG_DIG);

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
              dig_seq: results.insertId,
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
  "/digs/:index",
  (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { dig_length, local_index } = reqBody;

    const data: object = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      dig_length,
      local_index,
    };

    const UpdataData: (object | string)[] = [];
    UpdataData[0] = data;
    UpdataData[1] = index;

    const _query = queryConfig.update(LOG_DIG, "dig_seq");

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
              console.log("results->>", results);
              console.log("field-->", field);
              res.json(reqBody);
            }
          }
        );
      }
      connection.release();
    });
  }
);

router.delete(
  "/digs/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const _query = queryConfig.delete(LOG_DIG, "dig_seq");
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
