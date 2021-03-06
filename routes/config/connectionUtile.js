const pool = require("./connectionPool");
const queryConfig = require("./query/configQuery");
// import { FindAll, FindField, Post, Put, Delete } from "./connectionInterface";


const connectionUtile = {
  getFindAll({ table, req, res }) {
    const _query = queryConfig.findByAll(table);
    return () =>
      pool.getConnection((err, connection) => {
        if (err) {
          console.error(err);
          res
            .status(404)
            .json({ status: 404, message: "Pool getConnection Error" });
        } else {
          connection.query(_query, (err, results, field) => {
            if (err) {
              console.error(err);
              res
                .status(404)
                .json({ status: 404, message: "Connection Query Error" });
            } else {
              res.json(results);
            }
          });
        }
        connection.release();
      });
  },
  getFindAllOrderByField({ table, field, orderby, req, res }) {
    const _query = queryConfig.findByAllOrderBy(table, field, orderby);
    return () =>
      pool.getConnection((err, connection) => {
        if (err) {
          console.error(err);
          res
            .status(404)
            .json({ status: 404, message: "Pool getConnection Error" });
        } else {
          connection.query(_query, (err, results, field) => {
            if (err) {
              console.error(err);
              res
                .status(404)
                .json({ status: 404, message: "Connection Query Error" });
            } else {
              res.json(results);
            }
          });
        }
        connection.release();
      });
  },
  getFindByField({
    table,
    param,
    field,
    req,
    res,
  }) {
    const _query = queryConfig.findByField(table, field);
    return () =>
      pool.getConnection((err, connection) => {
        if (err) {
          console.error(err);
          res
            .status(404)
            .json({ status: 404, message: "Pool getConnection Error" });
        } else {
          connection.query(
            _query,
            param,
            (err, results, field) => {
              if (err) {
                console.error(err);
                res
                  .status(404)
                  .json({ status: 404, message: "Connection Query Error" });
              } else {
                res.json(results);
              }
            }
          );
        }
        connection.release();
      });
  },
  postInsert({
    table,
    insertData,
    key,
    body = {},
    req,
    res,
  }) {
    const _query = queryConfig.insert(table);
    return () =>
      pool.getConnection((err, connection) => {
        if (err) {
          console.error(err);
          res
            .status(404)
            .json({ status: 404, message: "Pool getConnection Error" });
        } else {
          connection.query(
            _query,
            insertData,
            (err, results, field) => {
              if (err) {
                console.error(err);
                res
                  .status(404)
                  .json({ status: 404, message: "Connection Query Error" });
              } else {
                const resObj = {
                  ...body,
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
  },
  putUpdate({
    table,
    field,
    updateData,
    body = {},
    req,
    res,
  }) {
    const _query = queryConfig.update(table, field);
    return () =>
      pool.getConnection((err, connection) => {
        if (err) {
          console.error(err);
          res
            .status(404)
            .json({ status: 404, message: "Pool getConnection Error" });
        } else {
          connection.query(
            _query,
            updateData,
            (err, results, field) => {
              if (err) {
                console.error(err);
                res
                  .status(404)
                  .json({ status: 404, message: "Connection Query Error" });
              } else {
                const resObj = {
                  ...body,
                  ...updateData[0],
                };
                res.json(resObj);
              }
            }
          );
        }
        connection.release();
      });
  },
  deleteAction({
    table,
    field,
    param,
    req,
    res,
  }) {
    const _query = queryConfig.delete(table, field);
    return () =>
      pool.getConnection((err, connection) => {
        if (err) {
          res
            .status(404)
            .json({ status: 404, message: "Pool getConnection Error" });
        } else {
          connection.query(
            _query,
            param,
            (err, results, field) => {
              if (err) {
                console.error(err);
                res
                  .status(404)
                  .json({ status: 404, message: "Connection Query Error" });
              } else {
                const result = {
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
  }
}

module.exports = connectionUtile;