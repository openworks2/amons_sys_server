const express = require("express");
const router = express.Router();
const indexCreateFn = require("./lib/fillZero");
// const {
//   deleteAction,
//   getFindAll,
//   getFindByField,
//   postInsert,
//   putUpdate,
// } = require("./config/connectionUtile");

const connectionUtile = require("./config/connectionUtile");


const moment = require("moment");
const queryConfig = require("./config/query/configQuery");
const pool = require("./config/connectionPool");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const INFO_BEACON = "info_beacon";
const INFO_BEACON_VIEW = "info_beacon_view";

router.get(
  "/beacons",
  async (req, res, next) => {
    try {
      await connectionUtile.getFindAll({
        table: INFO_BEACON_VIEW,
        // table: INFO_BEACON,
        req,
        res,
      })();
    } catch (error) {
      console.error(error);
      res.status(404).json({ status: 404, message: "CallBack Function Error" });
    }
  }
);

router.get(
  "/beacons/:index",
  async (req, res, next) => {
    const { index: param } = req.params;
    try {
      await connectionUtile.getFindByField({
        table: INFO_BEACON_VIEW,
        // table: INFO_BEACON,
        param,
        field: "bc_index",
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

// 할당 되지 않은 비콘 조회
router.get(
  "/unused",
  (req, res, next) => {
    const _query = `SELECT 
                      bc_id, bc_index, bc_address
                    FROM info_beacon_view
                    WHERE wk_id IS NULL AND vh_id IS NULL;`;
    pool.getConnection((err, connection) => {
      if (err) {
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
        }
        );
      }
      connection.release();

    });
  });


router.post(
  "/beacons",
  async (req, res, next) => {
    const { body: reqBody } = req;
    const { bc_address, description } = reqBody;

    const _beaconIndex = indexCreateFn("BC");

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      bc_index: _beaconIndex,
      bc_address,
      description: description || null
    };

    try {
      await connectionUtile.postInsert({
        table: INFO_BEACON,
        insertData,
        key: "bc_id",
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
  "/beacons/:index",
  async (req, res, next) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { bc_id, bc_index, bc_address, description } = reqBody;
    const data = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      bc_id,
      bc_index,
      bc_address,
      description: description || null
    };

    const updateData = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await connectionUtile.putUpdate({
        table: INFO_BEACON,
        field: "bc_index",
        updateData,
        body: reqBody,
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
  "/beacons/:id",
  async (req, res, next) => {
    const { id: param } = req.params;
    try {
      await connectionUtile.deleteAction({
        table: INFO_BEACON,
        field: "bc_id",
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

module.exports = router;
