const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const request = require('request');
const schedule = require('node-schedule');

const pool = require("../config/connectionPool");


const weather = {
    table: 'tb_kma_xy',
    address: 'http://apis.data.go.kr/1360000/VilageFcstInfoService/getVilageFcst',
    options: {
        apiKey: '1TXTVjV4gePgEweDA90Gn4cYcr1EApnaQGno3jDAb6qRHxrOIP0BAdDwFVn8%2Ft2%2BOxRMMvLXElqcPR918MfMKw%3D%3D',
        numOfRows: 10,
        pageNo: 1,
        dataType: 'JSON',
        currentData: moment().format("YYYYMMDD"),
        nx: 55,
        ny: 127,
    },
    location: {
        code: '4136057000',
        sido: '경기도',
        gun: '남양주시',
        dong: '별내동',
        local_x: 62,
        local_y: 128
    },
    body: undefined,
    job: undefined,
    init(opt) {
        const _this = this;
        _this.options.apiKey = opt.apiKey || _this.options.apiKey;
        _this.options.numOfRows = opt.numOfRows || _this.options.numOfRows;
        _this.options.pageNo = opt.pageNo || _this.options.pageNo;
        _this.options.dataType = opt.dataType || _this.options.dataType;
        _this.options.currentData = opt.currentData || _this.options.currentData;
        _this.options.nx = opt.nx || _this.options.nx;
        _this.options.ny = opt.ny || _this.options.ny;
        // _this.requestHandler();
        _this.getLocation();
        _this.scheduleAction();
    },
    requestHandler() {
        const _this = this;
        const apiKey = _this.options.apiKey;
        const numOfRows = _this.options.numOfRows;
        const pageNo = _this.options.pageNo;
        const dataType = _this.options.dataType;
        const currentDate = _this.options.currentData;
        const nx = _this.options.nx;
        const ny = _this.options.ny;

        const url = `${_this.address}?serviceKey=${apiKey}&numOfRows=${numOfRows}&pageNo=${pageNo}&dataType=${dataType}&base_date=${currentDate}&base_time=1100&nx=${nx}&ny=${ny}`;
        console.log(url)
        request(url, (error, response, body) => {
            console.error('error:', error); // Print the error if one occurred
            const statusCode = response && response.statusCode;
            if (error) {
            } else {
                const _body = JSON.parse(body);
                // console.log(_body);
                _this.body = _body;
            }
        });
    },
    getLocation() {
        const _this = this;
        const _query = `SELECT * FROM ${_this.table} WHERE active=1;`;

        pool.getConnection((err, connection) => { 
            if (err) {
                console.error(err);

            } else {
                connection.query(_query, (err, results, field) => {
                    if (err) {
                        console.error(err);
                    } else {
                        // console.log('results->', results)
                        const { code, sido, gun, dong, local_x, local_y } = results[0]
                        _this.location = {
                            code,
                            sido,
                            gun,
                            dong,
                            local_x,
                            local_y
                        }
                        _this.requestHandler();
                    }
                });
            }
            connection.release();
        });
    },
    changLocation(code) {
        const _this = this;

        const _query = `UPDATE ${_this.table} SET active=1 WHERE code=${code};
                        UPDATE ${_this.table} SET active=0 WHERE NOT code=${code};`;

        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);

            } else {
                connection.query(_query, (err, results, field) => {
                    if (err) {
                        console.error(err);
                    } else {
                        // console.log('results->', results)

                        _this.requestHandler();
                        _this.scheduleAction();
                    }
                });
            }
            connection.release();
        });
    },
    scheduleAction() {
        const _this = this;
        _this.job = schedule.scheduleJob('*/3 * * *', () => {
            _this.requestHandler();
            console.log('hi!')
        })
        // console.log(_this.job)
    },
}
module.exports = weather;