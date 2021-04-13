"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");
var request = require('request');
var schedule = require('node-schedule');
var connectionPool_1 = __importDefault(require("../conifg/connectionPool"));
var weather = {
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
    init: function (opt) {
        var _this = this;
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
    requestHandler: function () {
        var _this = this;
        var apiKey = _this.options.apiKey;
        var numOfRows = _this.options.numOfRows;
        var pageNo = _this.options.pageNo;
        var dataType = _this.options.dataType;
        var currentDate = _this.options.currentData;
        var nx = _this.options.nx;
        var ny = _this.options.ny;
        var url = _this.address + "?serviceKey=" + apiKey + "&numOfRows=" + numOfRows + "&pageNo=" + pageNo + "&dataType=" + dataType + "&base_date=" + currentDate + "&base_time=1100&nx=" + nx + "&ny=" + ny;
        console.log(url);
        request(url, function (error, response, body) {
            console.error('error:', error); // Print the error if one occurred
            var statusCode = response && response.statusCode;
            if (error) {
            }
            else {
                var _body = JSON.parse(body);
                console.log(_body);
                _this.body = _body;
            }
        });
    },
    getLocation: function () {
        var _this = this;
        var _query = "SELECT * FROM " + _this.table + " WHERE active=1;";
        connectionPool_1.default.getConnection(function (err, connection) {
            if (err) {
                console.error(err);
            }
            else {
                connection.query(_query, function (err, results, field) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        console.log('results->', results);
                        var _a = results[0], code = _a.code, sido = _a.sido, gun = _a.gun, dong = _a.dong, local_x = _a.local_x, local_y = _a.local_y;
                        _this.location = {
                            code: code,
                            sido: sido,
                            gun: gun,
                            dong: dong,
                            local_x: local_x,
                            local_y: local_y
                        };
                        _this.requestHandler();
                    }
                });
            }
            connection.release();
        });
    },
    changLocation: function (code) {
        var _this = this;
        var _query = "UPDATE " + _this.table + " SET active=1 WHERE code=" + code + ";\n                        UPDATE " + _this.table + " SET active=0 WHERE NOT code=" + code + ";";
        connectionPool_1.default.getConnection(function (err, connection) {
            if (err) {
                console.error(err);
            }
            else {
                connection.query(_query, function (err, results, field) {
                    if (err) {
                        console.error(err);
                    }
                    else {
                        console.log('results->', results);
                        _this.requestHandler();
                    }
                });
            }
            connection.release();
        });
    },
    scheduleAction: function () {
        var _this = this;
        _this.job = schedule.scheduleJob('*/3 * * *', function () {
            _this.requestHandler();
            console.log('hi!');
        });
        console.log(_this.job);
    },
};
exports.default = weather;
