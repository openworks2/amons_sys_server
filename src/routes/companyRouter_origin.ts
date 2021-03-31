import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

import pool from "./conifg/connectionPool";
import { getFindALl, getFindByField } from "./conifg/connectionUtile";
import indexCreateFn from "./lib/fillZero";
import queryConfig from "./conifg/query/configQuery";

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const INFO_COMPANY: string = "info_company";

router.get(
  "/companies",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const findAllUtile = await getFindALl({
        table: INFO_COMPANY,
        req,
        res,
      })();
      // findByFieldUtile();
    } catch (error) {
      res.status(404).end();
    }

    // const _query = queryConfig.findByAll(INFO_COMPANY);
    // pool.getConnection((err: any, connection: any) => {
    //   if (err) {
    //     res.status(404).end();
    //     throw new Error("Pool getConnection Error!!");
    //   } else {
    //     connection.query(_query, (err: any, results: any, field: any) => {
    //       if (err) {
    //         res.status(404).end();
    //         throw new Error("Connection Query Error!!");
    //       } else {
    //         res.json(results);
    //       }
    //     });
    //   }
    //   connection.release();
    // });
  }
);

router.get(
  "/companies/:index",
  async (req: Request, res: Response, next: NextFunction) => {
    const { index: param } = req.params;
    // const _query = queryConfig.findByField(INFO_COMPANY, "co_index");

    // pool.getConnection((err: any, connection: any) => {
    //   if (err) {
    //     res.status(404).end();
    //     throw new Error("Pool getConnection Error!!");
    //   } else {
    //     connection.query(
    //       _query,
    //       param,
    //       (err: any, results: any, field: any) => {
    //         if (err) {
    //           res.status(404).end();
    //           throw new Error("Connection Query Error!!");
    //         } else {
    //           res.json(results);
    //         }
    //       }
    //     );
    //   }
    //   connection.release();
    // });
    try {
      const findByFieldUtile = await getFindByField({
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

router.post("/companies", (req: Request, res: Response, next: NextFunction) => {
  const { body: reqBody } = req;
  console.log(req.body);
  const { co_name, co_sectors } = reqBody;

  const _companyIndex = indexCreateFn("CO");

  const InsertData = {
    created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
    co_index: _companyIndex,
    co_name,
    co_sectors,
  };

  const _query = queryConfig.insert(INFO_COMPANY);

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
              co_id: results.insertId,
              created_date: InsertData.created_date,
              co_index: _companyIndex,
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
  "/companies/:index",
  (req: Request, res: Response, next: NextFunction) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { co_name, co_sectors } = reqBody;

    const data: object = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      co_name,
      co_sectors,
    };

    const UpdataData: (object | string)[] = [];
    UpdataData[0] = data;
    UpdataData[1] = index;

    const _query = queryConfig.update(INFO_COMPANY, "co_index");

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
  "/companies/:id",
  (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const _query = queryConfig.delete(INFO_COMPANY, "co_id");
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
