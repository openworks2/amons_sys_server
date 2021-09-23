const pool = require('../../config/connectionPool');
const connectionUtile = require('../../config/connectionUtile');
const request = require('request');
const schedule = require('node-schedule');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault('Asiz/Seoul');

const weatherAPI = {
    table: 'tb_kma_xy',
    key: process.env.WEATHER_KEY,
    ultraSrtNcst: `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtNcst`, // 초단기 실황 조회
    ultraSrtFcst: `http://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getUltraSrtFcst`, // 초단기 예보 조회
    wthrWrnList: `http://apis.data.go.kr/1360000/WthrWrnInfoService/getWthrWrnList`, // 기상특보목록 조회
    job: undefined,
    kmaOptions: {
        // '4136000000': {
        //     base_date: '20210825',
        //     base_time: '1500',
        //     sido: '경기도',
        //     gun: '남양주시',
        //     dong: '별내동',
        //     nx: 64,
        //     ny: 128,
        //     stnId: 109,
        //     ts_index: null,
        //     code: '4136000000'
        //   }
    },
    init() {
        const _this = this;
        _this.getKMAoption();
    },
    getUltraSrtFcst(options) {
        // 기상 예보
        const _this = this;
        const _authKey = process.env.WEATHER_KEY;
        const { base_date, base_time, nx, ny, code, ts_index } = options;
        const _vilageFcst = `${_this.ultraSrtFcst}?serviceKey=${_authKey}&numOfRows=100&pageNo=1&base_date=${base_date}&base_time=${base_time}&nx=${nx}&ny=${ny}&dataType=JSON`;
        console.log('초단기 예보 조회:->', _vilageFcst);

        request(_vilageFcst, (error, response, body) => {
            console.error('error:', error); // Print the error if one occurred
            if (error) {
            } else {
                let _body;
                try {
                    _body = JSON.parse(body);
                } catch (error) {
                    return;
                }

                const { response: resData } = _body;

                const { header, body: bodyData } = resData;
                // console.log(resData);
                const { resultCode, resultMsg } = header;
                if (resultCode === '00') {
                    const { items } = bodyData;
                    const { item: itemArr } = items;
                    // console.log(itemArr);
                    const initialValue = {};

                    try {
                        const insertData = itemArr.reduce(
                            (acc, item, index) => {
                                const {
                                    fcstDate,
                                    fcstTime,
                                    category,
                                    fcstValue,
                                } = item;
                                if (initialValue.hasOwnProperty(fcstTime)) {
                                    if (
                                        initialValue[fcstTime].hasOwnProperty(
                                            category,
                                        )
                                    ) {
                                        return;
                                    }
                                    // initialValue[fcstTime][category] = fcstValue;
                                    initialValue[fcstTime] = {
                                        ...initialValue[fcstTime],
                                        fcst_date:
                                            initialValue[fcstTime].fcst_date ===
                                            fcstDate
                                                ? initialValue[fcstTime]
                                                      .fcst_date
                                                : fcstDate,
                                        fcst_time:
                                            initialValue[fcstTime].fcst_time ===
                                            fcstDate
                                                ? initialValue[fcstTime]
                                                      .fcst_time
                                                : fcstTime,
                                        [category]: fcstValue,
                                    };
                                } else {
                                    initialValue[fcstTime] = {
                                        kl_seq: index + 1,
                                        update_date: moment().format(
                                            'YYYY-MM-DD HH:mm:ss.SSS',
                                        ),
                                        fcst_date: fcstDate,
                                        fcst_time: fcstTime,
                                        ts_index,
                                        code,
                                        [category]: fcstValue,
                                    };
                                }
                                return item;
                            },
                            initialValue,
                        );
                        console.log(initialValue);
                    } catch (error) {}
                    _this.wthrLogUpdate(initialValue);
                    // _this.getWthrWrnList(initialValue);
                }
            }
        });
    },
    getWthrWrnList(options) {
        // 기상 특보
        const _this = this;
        const _authKey = process.env.WEATHER_KEY;
        const { stnId, ts_index } = options;
        const _wthrWrnList = `${_this.wthrWrnList}?serviceKey=${_authKey}&numOfRows=1&pageNo=1&stnId=${stnId}&dataType=JSON`;
        console.log('기상특보목록 조회:->', _wthrWrnList);
        let wthrWrnMsg = '';
        let wthrWrnTime = '';
        request(_wthrWrnList, (error, response, body) => {
            console.error('error:', error); // Print the error if one occurred
            if (error) {
            } else {
                let _body;
                try {
                    _body = JSON.parse(body);
                } catch (error) {
                    return;
                }

                const { response: resData } = _body;
                const { header, body: bodyData } = resData;
                const { resultCode, resultMsg } = header;
                if (resultCode === '00') {
                    const { items } = bodyData;
                    const { item: itemArr } = items;
                    // console.log('--->', itemArr[0]);
                    const { stnId, title, tmFc, tmSeq } = itemArr[0];
                    wthrWrnMsg = title;
                    wthrWrnTime = tmFc;
                } else if (resultCode === '03') {
                    // console.log(resultMsg);
                }
                const WthrWarnData = {
                    ts_index,
                    resultCode,
                    wthrWrnTime,
                    wthrWrnMsg,
                };
                _this.WthrWrnListUpdate(WthrWarnData);
            }
        });
    },
    optionsAdd() {},
    optionsUpdate(index) {
        const _this = this;

        const _query = `SELECT
                            env_seq, env_index, kma_sido, kma_gun, kma_dong, ts_index,
                            code, local_x, local_y, stn_id, ts_index
                        FROM tb_env_view WHERE ts_index="${index}";`;
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
            } else {
                connection.query(_query, (err, results, field) => {
                    if (err) {
                        console.error(err);
                    } else {
                        const resultLeng = results.length;
                        if (resultLeng > 0) {
                            const result = results[0];
                            const {
                                code,
                                kma_sido: sido,
                                kma_gun: gun,
                                kma_dong: dong,
                                local_x: nx,
                                local_y: ny,
                                stn_id: stnId,
                                ts_index,
                            } = result;
                            _this.kmaOptions[ts_index] = {
                                ..._this.kmaOptions[ts_index],
                                base_date: moment().format('YYYYMMDD'),
                                base_time: _this.getBaseTime(),
                                sido,
                                gun,
                                dong,
                                nx,
                                ny,
                                stnId,
                                ts_index,
                                code,
                            };

                            const options = _this.kmaOptions[ts_index];
                            _this.getUltraSrtFcst(options);
                            _this.getWthrWrnList(options);
                        }
                    }
                });
            }
            connection.release();
        });
    },
    optionsRemove(index) {
        const _this = this;
        delete _this.kmaOptions[index];
    },
    getKMAoption() {
        // 옵션 데이터 가져오기
        const _this = this;
        const _query = `SELECT env_seq, env_index, kma_sido, kma_gun, kma_dong, ts_index, code, local_x, local_y, stn_id, ts_index FROM tb_env_view;`;
        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
            } else {
                connection.query(_query, (err, results, field) => {
                    if (err) {
                        console.error(err);
                    } else {
                        results.map((item) => {
                            const {
                                code,
                                kma_sido: sido,
                                kma_gun: gun,
                                kma_dong: dong,
                                local_x: nx,
                                local_y: ny,
                                stn_id: stnId,
                                ts_index,
                            } = item;
                            const hasPropCode =
                                _this.kmaOptions.hasOwnProperty(ts_index);
                            if (hasPropCode) {
                                //코드 존재
                                // return;
                            } else {
                                // 코드 존재 안함
                                _this.kmaOptions = {
                                    ..._this.kmaOptions,
                                    [ts_index]: {
                                        base_date: moment().format('YYYYMMDD'),
                                        base_time: _this.getBaseTime(),
                                        sido,
                                        gun,
                                        dong,
                                        nx,
                                        ny,
                                        stnId,
                                        ts_index,
                                        code,
                                    },
                                };
                            }
                            const options = _this.kmaOptions[ts_index];
                            console.log('>>options=>', options);
                            _this.getUltraSrtFcst(options);
                            _this.getWthrWrnList(options);
                        });
                        if (_this.job) {
                            return;
                        }
                        _this.scheduleAction();
                    }
                });
            }
            connection.release();
        });
    },
    wthrLogUpdate(items) {
        // tb_kma_log 데이터 업데이트
        const _this = this;
        let _query = ``;
        for (const key in items) {
            const item = items[key];
            const {
                kl_seq,
                update_date,
                fcst_date,
                fcst_time,
                LGT,
                PTY,
                RN1,
                SKY,
                T1H,
                REH,
                UUU,
                VVV,
                VEC,
                WSD,
                ts_index,
            } = item;
            const _queryState = `UPDATE tb_kma_log 
                                SET 
                                update_date="${update_date}", 
                                fcst_date="${fcst_date}", fcst_time="${fcst_time}", LGT="${LGT}", PTY="${PTY}", RN1="${RN1}",
                                SKY="${SKY}", T1H="${T1H}", REH="${REH}", UUU="${UUU}", VVV="${VVV}", VEC="${VEC}", WSD="${WSD}"
                                WHERE kl_seq=${kl_seq} and ts_index="${ts_index}";`;
            _query += _queryState;
        }

        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
            } else {
                connection.query(_query, (err, results, field) => {
                    if (err) {
                        console.error(err);
                    } else {
                    }
                });
            }
            connection.release();
        });
    },
    WthrWrnListUpdate(items) {
        // tb_env 데이터 업데이트
        const { ts_index, resultCode, wthrWrnTime, wthrWrnMsg } = items;
        const _query = `UPDATE tb_env 
                        SET 
                        kma_warn_code="${resultCode}", kma_warn_msg="${wthrWrnMsg}", kma_warn_date="${wthrWrnTime}" 
                        WHERE ts_index="${ts_index}";`;

        pool.getConnection((err, connection) => {
            if (err) {
                console.error(err);
            } else {
                connection.query(_query, (err, results, field) => {
                    if (err) {
                        console.error(err);
                    } else {
                        // console.log('results--->', results);
                    }
                });
            }
            connection.release();
        });
    },
    getBaseTime() {
        const curr = Number(moment().format('HHmm'));
        let _baseTime = '';
        if (curr >= 0030 && curr < 0130) {
            _baseTime = '0000';
        } else if (curr >= 0130 && curr < 0230) {
            _baseTime = '0100';
        } else if (curr >= 0230 && curr < 0330) {
            _baseTime = '0200';
        } else if (curr >= 0330 && curr < 0430) {
            _baseTime = '0300';
        } else if (curr >= 0430 && curr < 0530) {
            _baseTime = '0400';
        } else if (curr >= 0530 && curr < 0630) {
            _baseTime = '0500';
        } else if (curr >= 0630 && curr < 0730) {
            _baseTime = '0600';
        } else if (curr >= 0730 && curr < 0830) {
            _baseTime = '0700';
        } else if (curr >= 0830 && curr < 0930) {
            _baseTime = '0800';
        } else if (curr >= 0930 && curr < 1030) {
            _baseTime = '0900';
        } else if (curr >= 1030 && curr < 1130) {
            _baseTime = '1000';
        } else if (curr >= 1130 && curr < 1230) {
            _baseTime = '1100';
        } else if (curr >= 1230 && curr < 1330) {
            _baseTime = '1200';
        } else if (curr >= 1330 && curr < 1430) {
            _baseTime = '1300';
        } else if (curr >= 1430 && curr < 1530) {
            _baseTime = '1400';
        } else if (curr >= 1530 && curr < 1630) {
            _baseTime = '1500';
        } else if (curr >= 1630 && curr < 1730) {
            _baseTime = '1600';
        } else if (curr >= 1730 && curr < 1830) {
            _baseTime = '1700';
        } else if (curr >= 1830 && curr < 1930) {
            _baseTime = '1800';
        } else if (curr >= 1930 && curr < 2030) {
            _baseTime = '1900';
        } else if (curr >= 2030 && curr < 2130) {
            _baseTime = '2000';
        } else if (curr >= 2130 && curr < 2230) {
            _baseTime = '2100';
        } else if (curr >= 2230 && curr < 2330) {
            _baseTime = '2200';
        } else if (curr >= 2330 && curr < 0030) {
            _baseTime = '2300';
        }
        return _baseTime;
    },
    scheduleAction() {
        const _this = this;
        if (_this.job) {
            _this.job.cancel();
        }
        _this.job = schedule.scheduleJob('0 0 */1 * * *', () => {
            _this.init();
        });
    },
};

module.exports = weatherAPI;
