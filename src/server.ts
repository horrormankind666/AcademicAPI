/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๖/๐๑/๒๕๖๖>
Modify date : <๐๒/๐๒/๒๕๖๖>
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
import { RequestModel } from './models/request';
import tokenRoute from './routes/token';
import studentRoute from './routes/student';
import studentGraphql from './graphql/student'

const app = express();
const router: Router = express.Router();
const util: Util = new Util();
const requestModel: RequestModel = new RequestModel();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(async(req: Schema.TypeRequest, res: Response, next: NextFunction) => {
    let urls: Array<string> = (req.url.split('/'));
    let url: string | null = (urls.length !== 0 ? (urls[1].length !== 0 ? urls[1] : null) : null);
    
    if (url !== null) {
        if (['Student'].includes(url) === true) {
            let tokenResult: Schema.Result = await util.authorization.jwtClient.doTokenInfo(req);
            
            await requestModel.doSet(req, (tokenResult.data.clientID));

            if (tokenResult.statusCode === 200 &&
                tokenResult.data.payload !== null) {
                req.payload = tokenResult.data.payload;

                if (['Student'].includes(url) === true) {
                    if (req.payload.SystemKey === process.env.SYSTEM_KEY)
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
                    data: null,
                    message: tokenResult.message
                }));
        }
        else {
            if (url === 'Token') {
                let clientID: any = ((req.headers.clientid !== undefined) && (req.headers.clientid.length !== 0) ? req.headers.clientid : null);

                await requestModel.doSet(req, clientID);
            }

            next();
        }
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