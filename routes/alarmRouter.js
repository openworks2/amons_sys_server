const express = require("express");
const router = express.Router();
const connectionUtile = require("./config/connectionUtile");

const moment = require("moment");
const pool = require("./config/connectionPool");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const LOG_ALARM_VIEW = `log_alarm_view`;
const LOG_EMERGENCY = `log_emergency`;


/**
 * @description 알람 이력 조회
 */
router.get(
    "/alarms",
    async (req, res, next) => {
        try {
            await connectionUtile.getFindAll({
                table: LOG_ALARM_VIEW,
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
 * @description SOS알람 노선 및 기간별 조회
 * @body {object} 객체
 * @property {string} local_index
 * @property {string} from_date
 * @property {string} to_date
 */
router.post('/alarms/search', (req, res, next) => {
    const { body: reqBody } = req;
    const { local_index, from_date, to_date } = reqBody;
    const _query = `SELECT * FROM ${LOG_ALARM_VIEW} 
                    WHERE DATE_FORMAT(emg_start_time,"%Y-%m-%d %H:%i:%S") 
                    BETWEEN DATE_FORMAT("${from_date}","%Y-%m-%d %H:%i:%S")
                    AND DATE_FORMAT("${to_date}","%Y-%m-%d %H:%i:%S")
                    ${local_index !== null ? `AND local_index="${local_index}"` : ``}
                    ORDER BY emg_start_time DESC;`;
    console.log(_query)

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


/**
 * @description SOS알람 후속 조치 등록 
 * @body {object} 객체
 * @property {string} emg_writer 작성자  
 * @property {MEDIUMTEXT} emg_result 조치 내용
 */
router.put('/alarms/:index',
    async (req, res, next) => {
        const { index } = req.params;
        const { body: reqBody } = req;
        const { emg_writer, emg_result } = reqBody;
        const data = {
            emg_end_time: moment().format("YYYY-MM-DD HH:mm:ss.SSS"),
            emg_writer,
            emg_result
        };

        const updateData = [];
        updateData[0] = data;
        updateData[1] = index;

        try {
            await connectionUtile.putUpdate({
                table: LOG_EMERGENCY,
                field: "emg_seq",
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
    });


module.exports = router;