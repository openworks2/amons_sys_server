import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import pool from "./conifg/connectionPool";
import indexCreateFn from "./lib/fillZero";
import queryConfig from "./conifg/query/configQuery";

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const INFO_BEACON: string = "info_beacon";

router.get("/beacons", (req: Request, res: Response, next: NextFunction) => {
  const _query = queryConfig.findByAll(INFO_BEACON);
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
  "/beacons/:index",
  (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const _query = queryConfig.findByField(INFO_BEACON, "bc_index");

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

router.post("/beacons", (req: Request, res: Response, next: NextFunction) => {
  const { body: reqBody } = req;
  const { bc_address } = reqBody;

  const _beaconIndex = indexCreateFn("BC");

  const InsertData = {
    created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
    bc_index: _beaconIndex,
    bc_address
  };

  const _query = queryConfig.insert(INFO_BEACON);
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
              bc_id: results.insertId,
              bc_index: _beaconIndex,
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
  "/beacons/:index",
  (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { bc_address } = reqBody;

    const data: object = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      bc_address,
    };

    const UpdataData: (object | string)[] = [];
    UpdataData[0] = data;
    UpdataData[1] = index;

    const _query = queryConfig.update(INFO_BEACON, "bc_index");

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
                console.log('results->>',results)
                console.log('field-->',field)
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
  "/beacons/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const _query = queryConfig.delete(INFO_BEACON, "bc_id");
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
