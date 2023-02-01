/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๖/๐๑/๒๕๖๖>
Modify date : <๐๑/๐๒/๒๕๖๖>
Description : <>
=============================================
*/

'use strict';

import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Response, NextFunction, Router } from 'express';

import { Util } from './util';
import { Schema } from './models/schema';
import tokenRoute from './routes/token';
import studentRoute from './routes/student';
import studentGraphql from './graphql/student'

const app = express();
const router: Router = express.Router();
const util: Util = new Util();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(async(req: Schema.TypeRequest, res: Response, next: NextFunction) => {
    req.url = (req.url + '/');

    let urls = (req.url.split('/'));
    let url = (urls.length !== 0 ? urls[1] : '');
    
    if (['ClientSecret', 'Token', 'Graphql'].includes(url) === false) {
        let tokenResult: Schema.Result = await util.authorization.jwtClient.doTokenInfo(req);

        if (tokenResult.statusCode === 200 &&
            tokenResult.data !== null) {
            req.payload = tokenResult.data;

            if (['Student'].includes(url) === true) {
                if (req.payload.SystemKey === process.env.STUDENT_SYSTEM_KEY)
                    next();
                else
                    res.send(util.doAPIMessage({
                        statusCode: 401,
                        data: null,
                        message: 'unauthorized'
                    }));
            }
        }
        else
            res.send(util.doAPIMessage({
                statusCode: tokenResult.statusCode,
                data: tokenResult.data,
                message: tokenResult.message
            }));
    }
    else
        next();
});
app.use('/', router);
app.get('/', (req: Schema.TypeRequest, res: Response) => {
    res.status(400).json(util.doAPIMessage({
        statusCode: res.statusCode,
        data: null,
        message: 'bad request'
    }));
});
app.get('/ClientSecret/Get/(:clientID)', (req: Schema.TypeRequest, res: Response) => {
    res.send(util.doSetCUID([req.params.clientID]));
});

router.use('/Token', tokenRoute);
router.use('/Student', studentRoute);
router.use('/Graphql/Student', studentGraphql);

app.listen(process.env.PORT, () => {
    console.log('Server is running at port %s', process.env.PORT);
});