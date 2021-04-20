const express = require('express');
const { putUpdate } = require('./config/connectionUtile');
const router = express.Router();

const weather = require('./lib/weatherAPI');

const options = {}
weather.init(options);

router.get("/weathers", (req, res, next) => {

    const resBody = {
        location: weather.location,
        body: weather.body
    }
    res.status(202).json(resBody);
});

router.put("/weathers/:code", (req, res, next) => {
    const { code } = req.params;

    weather.changLocation(code);

    res.status(202).end();

})


module.exports = router;
