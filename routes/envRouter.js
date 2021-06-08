const express = require("express");
const router = express.Router();

const connectionUtile = require("./config/connectionUtile");
const weather = require("./lib/weatherAPI");

const TB_ENV = `tb_env`;

router.get(
    "/environments",
    async (req, res, next) => {
        try {
            await connectionUtile.getFindAll({
                table: TB_ENV,
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

router.put(
    "/environments/:index",
    async (req, res, next) => {
        const { index } = req.params;
        const { body: reqBody } = req;
        const { announce_rolling, process_disabled, kma_sido, kma_gun, kma_dong } = reqBody;
        const data = {
            announce_rolling,
            process_disabled,
            kma_sido,
            kma_gun,
            kma_dong
        };
        const updateData = [];
        updateData[0] = data;
        updateData[1] = index;
        weather.changLocation({
            kma_sido,
            kma_gun,
            kma_dong
        });

        try {
            await connectionUtile.putUpdate({
                table: TB_ENV,
                field: "env_index",
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
    }
);


module.exports = router;