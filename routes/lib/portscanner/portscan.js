const portscanner = require('./portscanner');
const moment = require("moment");
const pool = require('../../config/connectionPool');
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");


const portScanner = {
    items: [],
    intervalId: undefined,
    init(items) {
        const _this = this;

        // _this.items = Object.assign({}, items)

        _this.items = items.reduce((acc, cur, i) => {
            acc[cur.scn_index] = {
                ...cur,
                closed_count: 0
            };
            return acc;
        }, {})
        this.start();

    },
    stop() {
        const _this = this;
        clearInterval(_this.intervalId)
    },
    start() {
        const _this = this;
        if (_this.intervalId) clearInterval(_this.intervalId);

        _this.intervalId = setInterval(() => {
            const _items = _this.items;
            for (let key in _items) {
                this.scanHandler(_items[key]);
            }
        }, 5000);
    },
    scanHandler(item) {
        const _this = this;
        const ip = item.scn_ip;
        const port = Number(item.scn_port);
        const PrevStatus = item.scn_result;
        portscanner.checkPortStatus(port, ip, function (error, status) {
            // Status should be 'open' since the HTTP server is listening on that port

            // if (error) console.error(error)


            const updateObj = {
                ...item,
                scn_id: item.scn_id,
                scn_index: item.scn_index,
                scn_receive_time: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                scn_result: status,
                scn_start_time: (status === 'open' && PrevStatus !== status)
                    ? moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                    : (status === 'closed'
                        ? null
                        : item.scn_start_time),
                scn_stop_time: (status === 'closed' && PrevStatus !== status)
                    ? moment().format('YYYY-MM-DD HH:mm:ss.SSS')
                    : (status === 'open'
                        ? null
                        : item.scn_stop_time),
                closed_count: (status === 'closed') ? item.closed_count + 1 : 0
            }

            const closedCount = updateObj.closed_count;

            if (status === 'open' && PrevStatus !== status) {
                _this.recodeUpdate(updateObj)
            }
            else if (status === 'closed' && closedCount === 5) {
                _this.recodeUpdate(updateObj)
            }

            _this.items = {
                ..._this.items,
                [item.scn_index]: updateObj
            }

        });
    },
    recodeUpdate(item) {

        const _query = `UPDATE info_scanner SET ? WHERE scn_id=?;`;
        const updateData = [];
        updateData[0] = item;
        updateData[1] = item['scn_id'];

        pool.getConnection((err, connection) => {
            if (err) {
                // console.error(err);
            } else {
                connection.query(_query, updateData, (err, results, fields) => {
                    if (err) {
                        console.error(err);
                    } else {
                    }
                });
            }
            connection.release();
        })
    }
};

module.exports = portScanner;