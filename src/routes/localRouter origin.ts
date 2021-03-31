import express, { Request, Response, NextFunction } from "express";
const router = express.Router();
import pool from "./conifg/connectionPool";
import indexCreateFn from "./lib/fillZero";
import queryConfig from "./conifg/query/configQuery";

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asia/Seoul");

const INFO_LOCAL: string = "info_local";

router.get("/locals", (req: Request, res: Response, next: NextFunction) => {
  const _query = queryConfig.findByAll(INFO_LOCAL);
  pool.getConnection((err: any, connection: any) => {
    if (err) {
      res.status(404).end();
      throw new Error("Pool getConnection Error!!");
    } else {
      connection.query(_query, (err: any, results: any, field: any) => {
        if (err) {
          res.status(404).end();
          throw err;
        } else {
          res.json(results);
        }
      });
    }
    connection.release();
  });
});

router.get(
  "/locals/:index",
  (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const _query = queryConfig.findByField(INFO_LOCAL, "local_index");
    pool.getConnection((err: any, connection: any) => {
      if (err) {
        res.status(404).end();
        throw new Error("Response Error!!");
      } else {
        connection.query(
          _query,
          index,
          (err: any, results: any, field: any) => {
            if (err) {
              res.status(404).end();
              throw err;
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

router.post("/locals", (req: Request, res: Response, next: NextFunction) => {
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

  const _query = queryConfig.insert(INFO_LOCAL);

  pool.getConnection((err: any, connection: any) => {
    if (err) {
      res.status(err.status).end();
      throw new Error("Response Error!!");
    } else {
      connection.query(_query, insertData, (err: any, results: any) => {
        if (err) {
          res.status(404).end();
          throw err;
        } else {
          const resObj: object = {
            ...reqBody,
            local_id: results.insertId,
            created_date: insertData.created_date,
            local_index: _localIndex,
          };
          res.json(resObj);
        }
      });
    }
    connection.release();
  });
});

router.put(
  "/locals/:index",
  (req: Request, res: Response, next: NextFunction) => {
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

    const _query = queryConfig.update(INFO_LOCAL, "local_index");

    pool.getConnection((err: any, connection: any) => {
      if (err) {
        res.status(404).end();
        throw new Error("Response Error!!");
      } else {
        connection.query(
          _query,
          updateData,
          (err: any, results: any, field: any) => {
            if (err) {
              res.status(404).end();
              throw new Error("Response Error!!");
            } else {
              const resObj = {
                ...reqBody,
                modified_date: data['modified_date'],
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
  "/locals/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const _query = queryConfig.delete(INFO_LOCAL, "local_id");
    pool.getConnection((err: any, connection: any) => {
      if (err) {
        res.status(err.status).end();
        throw new Error("Response Error!!");
      } else {
        connection.query(_query, id, (err: any, results: any, field: any) => {
          if (err) {
            res.status(404).end();
            throw err;
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
