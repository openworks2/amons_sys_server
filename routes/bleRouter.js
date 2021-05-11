const express = require("express");
const router = express.Router();

const connectionUtile = require("./config/connectionUtile");

const moment = require("moment");
const pool = require("./config/connectionPool");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const LOG_BLE_WORKER = "log_ble_worker";
const LOG_BLE_VEHICLE = "log_ble_vehicle";


const xl = require('excel4node');

/**
 * @description 잔류 이력 작업자 조회
 */
router.get(
    "/bles/worker",
    async (req, res, next) => {
        try {
            await connectionUtile.getFindAllOrderByField({
                table: LOG_BLE_WORKER,
                field: 'ble_input_time',
                orderby: 'DESC',
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
 * @description 잔류 이력 차량 조회
 */
router.get(
    "/bles/vehicle",
    async (req, res, next) => {
        try {
            await connectionUtile.getFindAllOrderByField({
                table: LOG_BLE_VEHICLE,
                field: 'ble_input_time',
                orderby: 'DESC',
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
 * @description 잔류 이력 차량 조회
 */
router.get(
    "/bles/vehicle",
    async (req, res, next) => {
        try {
            await connectionUtile.getFindAllOrderByField({
                table: LOG_BLE_VEHICLE,
                field: 'ble_input_time',
                orderby: 'DESC',
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
 * @description 작업자 막장 잔류이력 검색
 * @body {object} 객체
 * @property {string} local_index 노선 인덱스
 * @property {string} from_date
 * @property {string} to_date
 * @property {string} wk_name 작업자 이름
 * @property {string} wk_co_index 작업자 소속사
 */
router.post(
    "/bles/worker/search", (req, res, next) => {
        const { body: reqBody } = req;
        const { local_index = null, from_date, to_date, wk_name = null, wk_co_index = null } = reqBody;

        const _query = `SELECT * FROM ${LOG_BLE_WORKER} 
                        WHERE DATE_FORMAT(ble_input_time,"%Y-%m-%d %H:%i:%S") 
                        BETWEEN DATE_FORMAT("${from_date}","%Y-%m-%d %H:%i:%S")
                        AND DATE_FORMAT("${to_date}","%Y-%m-%d %H:%i:%S")
                        ${local_index !== null ? `AND local_index='${local_index}'` : ``}
                        ${wk_name !== null ? `AND wk_name LIKE '%${wk_name}%'` : ``}
                        ${wk_co_index !== null ? `AND wk_co_index = "${wk_co_index}"` : ``}
                        ORDER BY ble_input_time DESC;`;
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
 * @description 작업자 막장 잔류이력 검색
 * @body {object} 객체
 * @property {string} local_index 노선 인덱스
 * @property {string} from_date 
 * @property {string} to_date
 * @property {string} vh_name 차량 이름
 * @property {string} vh_co_index 차량 소속사
 */
router.post(
    "/bles/vehicle/search", (req, res, next) => {
        const { body: reqBody } = req;
        const { local_index = null, from_date, to_date, vh_name = null, vh_co_index = null } = reqBody;

        const _query = `SELECT * FROM ${LOG_BLE_VEHICLE} 
                        WHERE DATE_FORMAT(ble_input_time,"%Y-%m-%d %H:%i:%S") 
                        BETWEEN DATE_FORMAT("${from_date}","%Y-%m-%d %H:%i:%S")
                        AND DATE_FORMAT("${to_date}","%Y-%m-%d %H:%i:%S")
                        ${local_index !== null ? `AND local_index='${local_index}'` : ``}
                        ${vh_name !== null ? `AND vh_name LIKE '%${vh_name}%'` : ``}
                        ${vh_co_index !== null ? `AND vh_co_index = "${vh_co_index}"` : ``}
                        ORDER BY ble_input_time DESC;`;
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
 * @description 작업자 막장 잔류이력 검색
 * @body {object} 객체
 * @property {string} local_index 노선 인덱스
 * @property {string} from_date
 * @property {string} to_date
 * @property {string} wk_name 작업자 이름
 * @property {string} wk_co_index 작업자 소속사
 */
router.post('/bles/worker/download', function (req, res, next) {

    const { body: reqBody } = req;
    const { local_index = null, from_date, to_date, wk_name = null, wk_co_index = null } = reqBody;

    const _query = `SELECT * FROM ${LOG_BLE_WORKER} 
                    WHERE DATE_FORMAT(ble_input_time,"%Y-%m-%d %H:%i:%S") 
                    BETWEEN DATE_FORMAT("${from_date}","%Y-%m-%d %H:%i:%S")
                    AND DATE_FORMAT("${to_date}","%Y-%m-%d %H:%i:%S")
                    ${local_index !== null ? `AND local_index='${local_index}'` : ``}
                    ${wk_name !== null ? `AND wk_name LIKE '%${wk_name}%'` : ``}
                    ${wk_co_index !== null ? `AND wk_co_index = "${wk_co_index}"` : ``}
                    ORDER BY ble_input_time DESC;`;
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
                        const wb = excelDownHandler(results);
                        wb.write('잔류이력:작업자(' + from_date + '_' + to_date + ').xlsx', res);

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

    ws.cell(1, 1).string('노선').style(style1);
    ws.cell(1, 2).string('이름').style(style1);
    ws.cell(1, 3).string('소속사').style(style1);
    ws.cell(1, 4).string('직위').style(style1);
    ws.cell(1, 5).string('국적').style(style1);
    ws.cell(1, 6).string('진입일시').style(style1);
    ws.cell(1, 7).string('퇴출일시').style(style1);
    ws.cell(1, 8).string('막장체류시간').style(style1);

    for (let i = 0; i < data.length; i++) {
        let index = i + 2;
        for (let j = 1; j < 9; j++) {
            if (j == 1) {
                // 노선
                const localName = '시점함양';
                ws.cell(index, j).string(localName).style(style1);
            }
            else if (j == 2) {
                // 이름
                const workerName = '김공사';
                ws.cell(index, j).string(workerName).style(style1);
            }
            else if (j == 3) {
                // 소속사
                const company = '오픈웍스';
                ws.cell(index, j).string(company).style(style1);
            }
            else if (j == 4) {
                // 직위
                let position = `공사차장`;
                // let age = `${today.getFullYear() - birthDate.getFullYear() + 1}세`;
                ws.cell(index, j).string(position).style(style1);
            }
            else if (j == 5) {
                // 국적
                const nation = '한국';
                ws.cell(index, j).string(nation).style(style1);
            }
            else if (j == 6) {
                //진입일시
                const inputDate = '2021-04-09 08:59:30';
                ws.cell(index, j).string(inputDate).style(style1);
            }
            else if (j == 7) {
                //퇴출일시
                const inputDate = '2021-04-09 08:59:30';
                ws.cell(index, j).string(inputDate).style(style1);
            }
            else if (j == 8) {
                //막장 체류시간
                const inputDate = '2021-04-09 08:59:30';
                ws.cell(index, j).string(inputDate).style(style1);
            }
        }
    }
    return wb;
}


module.exports = router;
