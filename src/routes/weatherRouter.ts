import express, { Request, Response, NextFunction } from 'express';
import { putUpdate } from './conifg/connectionUtile';
const router = express.Router();

import weather from './lib/weatherAPI';

const options = {}
weather.init(options);

router.get("/weathers", (req: Request, res: Response, next: NextFunction) => {

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


export default router;