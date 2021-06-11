const express = require("express");
const router = express.Router();
const connectionUtile = require("./config/connectionUtile");

const moment = require("moment");
const pool = require("./config/connectionPool");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const LOG_ALARM_VIEW = `log_alarm_view`;
const LOG_EMERGENCY = `log_emergency`;

const xl = require('excel4node');

/**
 * @description 알람 이력 조회
 */
router.get(
    "/alarms",
    async (req, res, next) => {
        try {
            await connectionUtile.getFindAll({
                table: LOG_EMERGENCY,
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
 * @description SOS알람 최근 발생 시간부터 20개 조회
 * @params {Number} count 
 */
 router.get('/alarms/limit/:count', (req, res, next) => {

    const { count } = req.params;

    const _query = `SELECT * FROM ${LOG_EMERGENCY} ORDER BY emg_start_time DESC LIMIT ${count}`;

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
                        console.log(results)
                        res.json(results);
                    }
                }
            );
        }
        connection.release();
    });
});

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

    const _query = `SELECT * FROM ${LOG_EMERGENCY} 
                    WHERE DATE_FORMAT(emg_start_time,"%Y-%m-%d %H:%i:%S") 
                    BETWEEN DATE_FORMAT("${from_date}","%Y-%m-%d %H:%i:%S")
                    AND DATE_FORMAT("${to_date}","%Y-%m-%d %H:%i:%S")
                    ${local_index || local_index !== null ? `AND local_index="${local_index}"` : ``}
                    ORDER BY emg_start_time DESC;`;

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

router.post('/alarms/download', function (req, res, next) {

    const { body: reqBody } = req;
    const { local_index, from_date, to_date } = reqBody;
    const _query = `SELECT * FROM ${LOG_EMERGENCY} 
                    WHERE DATE_FORMAT(emg_start_time,"%Y-%m-%d %H:%i:%S") 
                    BETWEEN DATE_FORMAT("${from_date}","%Y-%m-%d %H:%i:%S")
                    AND DATE_FORMAT("${to_date}","%Y-%m-%d %H:%i:%S")
                    ${local_index ? `AND local_index="${local_index}"` : ``}
                    ORDER BY emg_start_time DESC;`;
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
                        const wb = excelDownHandler(results);
                        wb.write('알람이력조회(' + from_date + '_' + to_date + ').xls', res);

                    }
                }
            );
        }
        connection.release();
    });
});



const excelDownHandler = (data) => {
    let wb = new xl.Workbook();
    let ws = wb.addWorksheet('sheet1');
    let style1 = wb.createStyle({
        alignment: {
            vertical: ['center']
        },
        font: {
            size: 10,
            bold: false
        },
        border: {
            left: {
                style: 'thin',
                color: '#000000'
            },
            right: {
                style: 'thin',
                color: '#000000'
            },
            top: {
                style: 'thin',
                color: '#000000'
            },
            bottom: {
                style: 'thin',
                color: '#000000'
            }
        }
    });

    ws.column(1).setWidth(15);
    ws.column(2).setWidth(10);
    ws.column(3).setWidth(10);
    ws.column(4).setWidth(10);
    ws.column(5).setWidth(20);
    ws.column(6).setWidth(25);
    ws.column(7).setWidth(10);
    ws.column(8).setWidth(25);
    ws.column(9).setWidth(35);

    ws.cell(1, 1).string('노선').style(style1);
    ws.cell(1, 2).string('이름').style(style1);
    ws.cell(1, 3).string('소속사').style(style1);
    ws.cell(1, 4).string('나이').style(style1);
    ws.cell(1, 5).string('핸드폰').style(style1);
    ws.cell(1, 6).string('수신일시').style(style1);
    ws.cell(1, 7).string('작성자').style(style1);
    ws.cell(1, 8).string('조치일시').style(style1);
    ws.cell(1, 9).string('내용').style(style1);

    for (let i = 0; i < data.length; i++) {
        let index = i + 2;
        for (let j = 1; j < 10; j++) {
            if (j == 1) {
                // 노선
                const localName = data[i].local_name;
                ws.cell(index, j).string(localName).style(style1);
            }
            else if (j == 2) {
                // 이름
                const workerName = data[i].wk_name;
                ws.cell(index, j).string(workerName).style(style1);
            }
            else if (j == 3) {
                // 소속사
                const company = data[i].wk_co_name;
                ws.cell(index, j).string(company).style(style1);
            }
            else if (j == 4) {
                // 나이
                const birth = data[i].wk_birth;
                const splitBirth = birth ? birth.split("-") : null;
                let age;
                if(splitBirth){
                    const Years =
                        Number(splitBirth[0]) >= 30 ? splitBirth[0] : "20" + splitBirth[0];
                    const Months = splitBirth[1];
                    const Days = splitBirth[2];
                    const today = new Date();
                    const birthDate = new Date(Years, Months, Days); // 2000년 8월 10일
    
                    age = `${today.getFullYear() - birthDate.getFullYear() + 1}세`;
                    
                } else {
                    age ='-'
                }
                ws.cell(index, j).string(age).style(style1);
            }
            else if (j == 5) {
                // 핸드폰
                const phone = data[i].wk_phone
                ws.cell(index, j).string(phone).style(style1);
            }
            else if (j == 6) {
                //수신일시
                const receiveDate = moment(data[i].emg_start_time).format('YYYY-MM-DD HH:mm:ss');
                ws.cell(index, j).string(receiveDate).style(style1);
            }
            else if (j == 7) {
                //작성자
                const writer = data[i].emg_writer ? data[i].emg_writer: '-';
                ws.cell(index, j).string(writer).style(style1);
            }
            else if (j == 8) {
                //조치 일시
                const resultDate = data[i].emg_end_time ? moment(data[i].emg_end_time).format('YYYY-MM-DD HH:mm:ss') : '-';
                ws.cell(index, j).string(resultDate).style(style1);
            }
            else if (j == 9) {
                //내용
                const resultDate = data[i].emg_result ? data[i].emg_result : '-';
                ws.cell(index, j).string(resultDate).style(style1);
            }
        }
    }
    return wb;
}



module.exports = router;