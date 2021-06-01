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
 * @property {string} name 작업자 이름
 * @property {string}  co_index 작업자 소속사
 */
router.post(
    "/bles/worker/search", (req, res, next) => {
        const { body: reqBody } = req;
        const { local_index = null, from_date, to_date, name = null, co_index = null } = reqBody;
        
        const _query = `SELECT * FROM ${LOG_BLE_WORKER} 
                        WHERE DATE_FORMAT(ble_input_time,"%Y-%m-%d %H:%i:%S") 
                        BETWEEN DATE_FORMAT("${from_date}","%Y-%m-%d %H:%i:%S")
                        AND DATE_FORMAT("${to_date}","%Y-%m-%d %H:%i:%S")
                        ${local_index !== null ? `AND local_index='${local_index}'` : ``}
                        ${name !== null ? `AND name LIKE '%${name}%'` : ``}
                        ${co_index !== null ? `AND co_index = "${co_index}"` : ``}
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
 * @property {string} name 차량 이름
 * @property {string} co_index 차량 소속사
 */
router.post(
    "/bles/vehicle/search", (req, res, next) => {
        const { body: reqBody } = req;
        const { local_index = null, from_date, to_date, name = null, co_index = null } = reqBody;

        const _query = `SELECT * FROM ${LOG_BLE_VEHICLE} 
                        WHERE DATE_FORMAT(ble_input_time,"%Y-%m-%d %H:%i:%S") 
                        BETWEEN DATE_FORMAT("${from_date}","%Y-%m-%d %H:%i:%S")
                        AND DATE_FORMAT("${to_date}","%Y-%m-%d %H:%i:%S")
                        ${local_index !== null ? `AND local_index='${local_index}'` : ``}
                        ${name !== null ? `AND name LIKE '%${name}%'` : ``}
                        ${co_index !== null ? `AND co_index = "${co_index}"` : ``}
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
 * @description 현재 잔류 인원 및 차량 조회
 * @param {string} 타입 'worker' / 'vehicle
 */
router.get("/bles/input/:type", (req, res, next) => {
    const { type } = req.params;
    const _value = type === 'worker' ? 1 : 2;
    const _query = `SELECT * FROM ble_input_beacon_view 
                WHERE bc_used_type = ${_value}
                ORDER BY bc_input_time DESC;`;

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
                    // console.log(test);

                    res.json(results);
                }
            });

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
 * @property {string} name 작업자 이름
 * @property {string}  co_index 작업자 소속사
 */
router.post('/bles/input/worker/search', (req, res, next) => {

    const { body: reqBody } = req;
    const { local_index = null, from_date, to_date, name = null, co_index = null } = reqBody;
        
    const _query = `SELECT * FROM ${LOG_BLE_WORKER} 
                    WHERE DATE_FORMAT(ble_input_time,"%Y-%m-%d %H:%i:%S") 
                    BETWEEN DATE_FORMAT("${from_date}","%Y-%m-%d %H:%i:%S")
                    AND DATE_FORMAT("${to_date}","%Y-%m-%d %H:%i:%S")
                    ${local_index !== null ? `AND local_index='${local_index}'` : ``}
                    ${name !== null ? `AND name LIKE '%${name}%'` : ``}
                    ${co_index !== null ? `AND co_index = "${co_index}"` : ``}
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
 * @property {string} name 작업자 이름
 * @property {string} co_index 작업자 소속사
 */
router.post('/bles/input/vehicle/search', (req, res, next) => {

    const { body: reqBody } = req;
    const { local_index = null, from_date, to_date, name = null, co_index = null } = reqBody;

    const _query = `SELECT * FROM ble_input_beacon_view
                    WHERE DATE_FORMAT(bc_input_time,"%Y-%m-%d %H:%i:%S") 
                    BETWEEN DATE_FORMAT("${from_date}","%Y-%m-%d %H:%i:%S")
                    AND DATE_FORMAT("${to_date}","%Y-%m-%d %H:%i:%S")
                    ${local_index !== null ? `AND local_index='${local_index}'` : ``}
                    ${co_index !== null ? `AND co_index = "${co_index}"` : ``}
                    ${name !== null ? `AND name LIKE '%${name}%'` : ``}
                    ORDER BY bc_input_time DESC;`;
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
 * @description 잔류 작업자 강제 퇴출
 * @param {string} bc_index info_beacon 인덱스
 */
 router.get("/bles/out/:index",
 async (req, res, next) => {
     const { index } = req.params;

     const data = {
         bc_io_state: 'o',
         bc_input_time: null,
         bc_out_time: moment().format('YYYY-MM-DD HH:mm:ss.SSS')
     };

     const updateData = [];
     updateData[0] = data;
     updateData[1] = index;

     const _resData = {
         ...data,
         bc_index: index
     }

     try {
         await connectionUtile.putUpdate({
             table: 'info_beacon',
             field: "bc_index",
             updateData,
             body: _resData,
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


/**
 * @description 작업자 막장 잔류이력 다운로드
 * @body {object} 객체
 * @property {string} local_index 노선 인덱스
 * @property {string} from_date
 * @property {string} to_date
 * @property {string} name 작업자 이름
 * @property {string} co_index 작업자 소속사
 */
router.post('/bles/worker/download', (req, res, next) => {

    const { body: reqBody } = req;
    const { local_index = null, from_date, to_date, name = null, co_index = null } = reqBody;

    const _query = `SELECT * FROM ${LOG_BLE_WORKER} 
                    WHERE DATE_FORMAT(ble_input_time,"%Y-%m-%d %H:%i:%S") 
                    BETWEEN DATE_FORMAT("${from_date}","%Y-%m-%d %H:%i:%S")
                    AND DATE_FORMAT("${to_date}","%Y-%m-%d %H:%i:%S")
                    ${local_index !== null ? `AND local_index='${local_index}'` : ``}
                    ${name !== null ? `AND name LIKE '%${name}%'` : ``}
                    ${co_index !== null ? `AND co_index = "${co_index}"` : ``}
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
                        const wb = workerExcelDownHandler(results);
                        wb.write('잔류이력:작업자(' + from_date + '_' + to_date + ').xls', res);

                    }
                }
            );
        }
        connection.release();
    });
});


/**
 * @description 작업자 막장 잔류이력 다운로드
 * @body {object} 객체
 * @property {string} local_index 노선 인덱스
 * @property {string} from_date
 * @property {string} to_date
 * @property {string} name 작업자 이름
 * @property {string} co_index 작업자 소속사
 */
 router.post('/bles/vehicle/download', (req, res, next) => {

    const { body: reqBody } = req;
    const { local_index = null, from_date, to_date, name = null, co_index = null } = reqBody;

    const _query = `SELECT * FROM ${LOG_BLE_VEHICLE} 
                    WHERE DATE_FORMAT(ble_input_time,"%Y-%m-%d %H:%i:%S") 
                    BETWEEN DATE_FORMAT("${from_date}","%Y-%m-%d %H:%i:%S")
                    AND DATE_FORMAT("${to_date}","%Y-%m-%d %H:%i:%S")
                    ${local_index !== null ? `AND local_index='${local_index}'` : ``}
                    ${name !== null ? `AND name LIKE '%${name}%'` : ``}
                    ${co_index !== null ? `AND co_index = "${co_index}"` : ``}
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
                        const wb = vehicleExcelDownHandler(results);
                        wb.write('잔류이력:차량(' + from_date + '_' + to_date + ').xls', res);

                    }
                }
            );
        }
        connection.release();
    });
});


const workerExcelDownHandler = (data) => {
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
    ws.column(7).setWidth(25);
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
                const localName = data[i].local_name;
                ws.cell(index, j).string(localName).style(style1);
            }
            else if (j == 2) {
                // 이름
                const workerName = data[i].name;
                ws.cell(index, j).string(workerName).style(style1);
            }
            else if (j == 3) {
                // 소속사
                const company = data[i].name;
                ws.cell(index, j).string(company).style(style1);
            }
            else if (j == 4) {
                // 직위
                let position = data[i].position;
                // let age = `${today.getFullYear() - birthDate.getFullYear() + 1}세`;
                ws.cell(index, j).string(position).style(style1);
            }
            else if (j == 5) {
                // 국적
                const nation = data[i].nation;
                ws.cell(index, j).string(nation).style(style1);
            }
            else if (j == 6) {
                //진입일시
                const inputDate = moment(data[i].ble_input_time).format('YYYY-MM-DD HH:mm:ss')
                ws.cell(index, j).string(inputDate).style(style1);
            }
            else if (j == 7) {
                //퇴출일시
                const outputDate = data[i].ble_out_time ? moment(data[i].ble_out_time).format('YYYY-MM-DD HH:mm:ss') : '-';
                ws.cell(index, j).string(outputDate).style(style1);
            }
            else if (j == 8) {
                //막장 체류시간
                const current = data[i].ble_out_time ? moment(data[i].ble_out_time):moment();
                const inputDate = moment(data[i].ble_input_time);
                const delayDate = moment.duration(current.diff(inputDate));
                const diffTime = {
                    day: delayDate.days(),
                    hour: delayDate.hours(),
                    minute: delayDate.minutes(),
                    second: delayDate.seconds(),
                }
                const result = `${diffTime.day}일 ${diffTime.hour}시간 ${diffTime.minute}분 ${diffTime.second}초`
                ws.cell(index, j).string(result).style(style1);
            }
        }
    }
    return wb;
}


const vehicleExcelDownHandler = (data) => {
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
    ws.column(7).setWidth(25);

    ws.cell(1, 1).string('노선').style(style1);
    ws.cell(1, 2).string('소속사').style(style1);
    ws.cell(1, 3).string('차량종류').style(style1);
    ws.cell(1, 4).string('차량번호').style(style1);
    ws.cell(1, 5).string('진입일시').style(style1);
    ws.cell(1, 6).string('퇴출일시').style(style1);
    ws.cell(1, 7).string('막장체류시간').style(style1);

    for (let i = 0; i < data.length; i++) {
        let index = i + 2;
        for (let j = 1; j < 8; j++) {
            if (j == 1) {
                // 노선
                const localName = data[i].local_name;
                ws.cell(index, j).string(localName).style(style1);
            }
            else if (j == 2) {
                // 소속사
                const compaynName = data[i].co_name;
                ws.cell(index, j).string(compaynName).style(style1);
            }
            else if (j == 3) {
                // 차량종류
                const name = data[i].name;
                ws.cell(index, j).string(name).style(style1);
            }
            else if (j == 4) {
                // 차량번호
                const number = data[i].number;
                ws.cell(index, j).string(number).style(style1);
            }
            else if (j == 5) {
                //진입일시
                const inputDate = moment(data[i].ble_input_time).format('YYYY-MM-DD HH:mm:ss')
                ws.cell(index, j).string(inputDate).style(style1);
            }
            else if (j == 6) {
                //퇴출일시
                const outputDate = data[i].ble_out_time ? moment(data[i].ble_out_time).format('YYYY-MM-DD HH:mm:ss') : '-';
                ws.cell(index, j).string(outputDate).style(style1);
            }
            else if (j == 7) {
                //막장 체류시간
                const current = data[i].ble_out_time ? moment(data[i].ble_out_time):moment();
                const inputDate = moment(data[i].ble_input_time);
                const delayDate = moment.duration(current.diff(inputDate));
                const diffTime = {
                    day: delayDate.days(),
                    hour: delayDate.hours(),
                    minute: delayDate.minutes(),
                    second: delayDate.seconds(),
                }
                const result = `${diffTime.day}일 ${diffTime.hour}시간 ${diffTime.minute}분 ${diffTime.second}초`
                ws.cell(index, j).string(result).style(style1);
            }
        }
    }
    return wb;
}

module.exports = router;
