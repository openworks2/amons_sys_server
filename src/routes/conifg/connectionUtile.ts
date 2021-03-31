import pool from "./connectionPool";
import queryConfig from "./query/configQuery";
import { FindAll, FindField, Post, Put, Delete } from "./connectionInterface";

export const getFindALl = ({ table, req, res }: FindAll): Function => {
  // const _query: string = queryConfig.findByAll(table);
  const _query: string = queryConfig.findByAll(table);
  return () =>
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
};

export const getFindByField = ({
  table,
  param,
  field,
  req,
  res,
}: FindField): Function => {
  const _query: string = queryConfig.findByField(table, field);
  return () =>
    pool.getConnection((err: any, connection: any) => {
      if (err) {
        res.status(404).end();
        throw new Error("Pool getConnection Error!!");
      } else {
        connection.query(
          _query,
          param,
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
};

export const postInsert = ({
  table,
  insertData,
  key,
  req,
  res,
}: Post): Function => {
  const _query: string = queryConfig.insert(table);
  return () =>
    pool.getConnection((err: any, connection: any) => {
      if (err) {
        res.status(404).end();
        throw new Error("Pool getConnection Error!!");
      } else {
        connection.query(
          _query,
          insertData,
          (err: any, results: any, field: any) => {
            if (err) {
              res.status(404).end();
              throw new Error("Connection Query Error!!");
            } else {
              const resObj: object = {
                ...insertData,
                [key]: results.insertId,
              };
              res.json(resObj);
            }
          }
        );
      }
      connection.release();
    });
};

export const putUpdate = ({
  table,
  field,
  updateData,
  req,
  res,
}: Put): Function => {
  const _query: string = queryConfig.update(table, field);
  return () =>
    pool.getConnection((err: any, connection: any) => {
      if (err) {
        res.status(404).end();
        throw new Error("Pool getConnection Error!!");
      } else {
        connection.query(
          _query,
          updateData,
          (err: any, results: any, field: any) => {
            if (err) {
              res.status(404).end();
              throw new Error("Connection Query Error!!");
            } else {
              const resObj = {
                ...updateData[0],
              };
              res.json(resObj);
            }
          }
        );
      }
      connection.release();
    });
};

export const deleteAction = ({
  table,
  field,
  param,
  req,
  res,
}: Delete): Function => {
  const _query = queryConfig.delete(table, field);
  return () =>
    pool.getConnection((err: any, connection: any) => {
      if (err) {
        res.status(404).end();
        throw new Error("Pool getConnection Error!!");
      } else {
        connection.query(
          _query,
          param,
          (err: any, results: any, field: any) => {
            if (err) {
              res.status(404).end();
              throw new Error("Connection Query Error!!");
            } else {
              const result: object = {
                ...results,
                param,
              };
              res.json(result);
            }
          }
        );
      }
      connection.release();
    });
};
