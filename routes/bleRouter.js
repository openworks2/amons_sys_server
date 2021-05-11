const express = require("express");
const router = express.Router();

const connectionUtile = require("./config/connectionUtile");

const moment = require("moment");
require("moment-timezone");
moment.tz.setDefault("Asiz/Seoul");

const LOG_BLE_WORKER = "log_ble_worker";
const LOG_BLE_VEHICLE = "log_ble_vehicle";

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


module.exports = router;
