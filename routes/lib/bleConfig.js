const pool = require("../config/connectionPool");

const bleConfig = {
    items: undefined,
    getData() {
        const _this = this;
        return _this.items;
    },
    setData() {
        const _this = this;
        const _query = `SELECT * FROM ble_input_beacon_view;`;
        pool.getConnection((err, connection) => {
            if (err) {
                console.error("Pool getConnection Error")
            } else {
                connection.query(_query, (err, results, field) => {
                    if (err) {
                        console.error("Connection Query Error")

                    } else {
                        _this.items=results;
                    }
                })
            }
            console.log(_this.items)
            connection.release();
        });
    }

};

module.exports = bleConfig;