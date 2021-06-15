const express = require("express");
const router = express.Router();
// const {
//   deleteAction,
//   getFindAll,
//   getFindByField,
//   postInsert,
//   putUpdate,
// } = require("./config/connectionUtile");

const connectionUtile = require("./config/connectionUtile");


const moment = require("moment");
const pool = require("./config/connectionPool");
const queryConfig = require("./config/query/configQuery");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const LOG_DIG = "log_dig";

// router.get("/digs", async (req, res, next) => {
//   try {
//     await connectionUtile.getFindAll({
//       table: LOG_DIG,
//       req,
//       res,
//     })();
//   } catch (error) {
//     console.error(error);
//     res
//       .status(404)
//       .json({ status: 404, message: "CallBack Async Function Error" });
//   }
// });

router.get("/digs", async (req, res, next) => {
  try {
    await connectionUtile.getFindAllOrderByField({
      table: LOG_DIG,
      field: 'record_date',
      orderby: 'ASC',
      req,
      res,
    })();
  } catch (error) {
    console.error(error);
    res
      .status(404)
      .json({ status: 404, message: "CallBack Async Function Error" });
  }
});

// router.get(
//   "/digs/:index",
//   async (req, res, next) => {
//     const { index: param } = req.params;
//     try {
//       await connectionUtile.getFindByField({
//         table: LOG_DIG,
//         param,
//         field: "dig_seq",
//         req,
//         res,
//       })();
//     } catch (error) {
//       console.error(error);
//       res
//         .status(404)
//         .json({ status: 404, message: "CallBack Async Function Error" });
//     }
//   }
// );

// local array to object
const convertArrayToObject = (array, key) => {
  const initialValue = {};
  return array.reduce((obj, item) => {
    if (obj.hasOwnProperty(item[key])) {
      return {
        ...obj,
        [item[key]]: [
          ...obj[item[key]],
          item
        ]
      }
    } else {
      let itemArray = [];
      itemArray.push(item)
      return {
        ...obj,
        [item[key]]: itemArray,
      };
    }
  }, initialValue);
};

// 노선별 이력 조회
/**
 * @description 한달치 노선별 이력 조회
 */
router.get("/digs/local", (req, res, next) => {
  // const _query = queryConfig.findByAllOrderBy(LOG_DIG, 'record_date', 'DESC');

  const fromDate = moment().subtract(1, 'months').format('YYYY-MM-DD 00:00:00'); //한단전
  const toDate = moment().format('YYYY-MM-DD HH:mm:ss');

  const _query = `SELECT * FROM log_dig 
                WHERE DATE_FORMAT(record_date,"%Y-%m-%d %H:%i:%S") 
                BETWEEN DATE_FORMAT("${fromDate}","%Y-%m-%d %H:%i:%S")
                AND DATE_FORMAT("${toDate}","%Y-%m-%d %H:%i:%S")
                ORDER BY record_date DESC;`;

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
          const responseData = convertArrayToObject(results, 'local_index');
          res.json(responseData);
        }
      });

    }
    connection.release();
  });
});


router.post(
  "/digs",
  async (req, res, next) => {
    const { body: reqBody } = req;
    const { record_date, dig_length, local_index, description } = reqBody;

    const insertData = {
      created_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      record_date,
      dig_length,
      local_index,
      description
    };

    try {
      await connectionUtile.postInsert({
        table: LOG_DIG,
        insertData,
        key: "dig_seq",
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

/**
 * @description 노선 기간별 검색
 * @body {object} 객체
 * @property {string} local_index
 * @property {string} from_date
 * @property {string} to_date
 */
router.post(
  "/digs/search", (req, res, next) => {
    const { body: reqBody } = req;
    const { local_index, from_date, to_date } = reqBody;

    const _query = `SELECT * FROM log_dig 
                    WHERE DATE_FORMAT(record_date,"%Y-%m-%d %H:%i:%S") 
                    BETWEEN DATE_FORMAT("${from_date}","%Y-%m-%d %H:%i:%S")
                    AND DATE_FORMAT("${to_date}","%Y-%m-%d %H:%i:%S")
                    AND local_index="${local_index}"
                    ORDER BY record_date DESC;`;

    pool.getConnection((err, connection) => {
      if (err) {
        console.error(err);
        res
          .status(404)
          .json({ status: 404, message: "Pool getConnection Error" });
      } else {
        connection.query(
          _query,
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
  });




router.put(
  "/digs/:index",
  async (req, res, next) => {
    const { index } = req.params;
    const { body: reqBody } = req;
    const { record_date, dig_length, local_index, description } = reqBody;

    const data = {
      modified_date: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
      record_date: moment(record_date).format("YYYY-MM-DD HH:mm:ss.SSS"),
      dig_length,
      local_index,
      description
    };

    const updateData = [];
    updateData[0] = data;
    updateData[1] = index;

    try {
      await connectionUtile.putUpdate({
        table: LOG_DIG,
        field: "dig_seq",
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
  "/digs/:id",
  async (req, res, next) => {
    const { id: param } = req.params;
    try {
      await connectionUtile.deleteAction({
        table: LOG_DIG,
        field: "dig_seq",
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
