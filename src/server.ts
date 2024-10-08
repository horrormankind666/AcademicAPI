/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๖/๐๑/๒๕๖๖>
Modify date : <๐๒/๑๐/๒๕๖๗>
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
import { ClientModel } from './models/client';

import tokenRoute from './routes/token';
import studentProfileRoute from './routes/student/profile';
import studentDigitalTranscriptRoute from './routes/student/digital-transcript';
import studentActivityTranscriptRoute from './routes/student/activity-transcript';

import studentProfileGraphql from './graphql/student/profile';
import { map } from 'mssql';

const app = express();
const router: Router = express.Router();
const util: Util = new Util();
const requestModel: RequestModel = new RequestModel();
const clientModel: ClientModel = new ClientModel();

dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.text());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(async (req: Schema.TypeRequest, res: Response, next: NextFunction) => {
    let urls: Array<string> = (req.url.split('/'));
    let url: string | null = (util.doIsEmpty(urls) === false ? util.doGetString(urls[1]) : null);
    let client: any = {
        ID: util.doGetString(req.headers.clientid),
        secret: util.doGetString(req.headers.clientsecret)
    };
    
    if (util.doIsEmpty(url) === false) {
        url = String(url);

        let urlConfigResult: Schema.URLConfig.Result = Object.assign(new Object, util.urlConfig[url.toLowerCase()]);
        
        if (util.doIsEmpty(urlConfigResult) === false) {
            if (urlConfigResult.isCheckAuthorized === true) {
                await requestModel.doSet(req, client.ID);

                if (util.doIsEmpty(client.ID) === false &&
                    util.doIsEmpty(client.secret) === false) {
                    let CUIDs: Array<string> | null = util.doParseCUID(client.secret);
                    let clientID: string | null = null;
                    let systemKey: string | null = null;

                    if (util.doIsEmpty(CUIDs) === false) {
                        CUIDs = Object.assign(new Array<string>(), CUIDs);

                        if (CUIDs.length === 2) {
                            clientID = util.doGetString(CUIDs[0]);
                            systemKey = util.doGetString(CUIDs[1]);
                        }
                    }

                    if (clientID === client.ID &&
                        util.doIsEmpty(systemKey) === false) {
                        let clientResult: Schema.Result = await clientModel.doGet(client.ID, client.secret);
                        
                        if (clientResult.conn !== null &&
                            clientResult.statusCode === 200) {
                            if (util.doIsEmpty(clientResult.data) === false) {
                                let clientData: Schema.Client = clientResult.data;

                                if (clientID === clientData.ID &&
                                    client.ID === clientData.ID &&
                                    systemKey === clientData.systemKey) {
                                    let tokenResult: Schema.Result = await util.authorization.jwtClient.doTokenInfo(req, clientData);
                                    
                                    if (tokenResult.statusCode === 200 &&
                                        util.doIsEmpty(tokenResult.data.payload) === false) {
                                        req.payload = tokenResult.data.payload;

                                        if (tokenResult.data.clientID === client.ID &&
                                            req.payload.SystemKey === clientData.systemKey)
                                            next();
                                        else
                                            res.send(util.doAPIMessage(
                                                util.doSetAPIResult({
                                                    statusCode: 401,
                                                    code: 401,
                                                    success: false,
                                                    data: null,
                                                    message: 'unauthorized'
                                                },
                                                urlConfigResult.apiResultKeys)
                                            ));
                                    }
                                    else
                                        res.send(util.doAPIMessage(
                                            util.doSetAPIResult({
                                                statusCode: tokenResult.statusCode,
                                                code: tokenResult.statusCode,
                                                success: false,
                                                data: null,
                                                message: tokenResult.message
                                            },
                                            urlConfigResult.apiResultKeys)
                                        ));
                                }
                                else
                                    res.send(util.doAPIMessage(
                                        util.doSetAPIResult({
                                            statusCode: 401,
                                            code: 401,
                                            success: false,
                                            data: null,
                                            message: 'unauthorized'
                                        },
                                        urlConfigResult.apiResultKeys)
                                    ));
                            }
                            else
                                res.send(util.doAPIMessage(
                                    util.doSetAPIResult({
                                        statusCode: 401,
                                        code: 401,
                                        success: false,
                                        data: null,
                                        message: 'unauthorized'
                                    },
                                    urlConfigResult.apiResultKeys)
                                ));
                        }
                        else
                            res.send(util.doAPIMessage(
                                util.doSetAPIResult({
                                    statusCode: clientResult.statusCode,
                                    code: clientResult.statusCode,
                                    success: false,
                                    data: clientResult.data,
                                    message: (util.doIsEmpty(clientResult.message) === false ? clientResult.message : null)
                                },
                                urlConfigResult.apiResultKeys)
                            ));
                    }
                    else
                        res.send(util.doAPIMessage(
                            util.doSetAPIResult({
                                statusCode: 401,
                                code: 401,
                                success: false,
                                data: null,
                                message: 'unauthorized'
                            },
                            urlConfigResult.apiResultKeys)
                        ));
                }
                else
                    res.send(util.doAPIMessage(
                        util.doSetAPIResult({
                            statusCode: 401,
                            code: 401,
                            success: false,
                            data: null,
                            message: 'unauthorized'
                        },
                        urlConfigResult.apiResultKeys)
                    ));
            }
            else {
                if (url === 'Token') {
                    let clientID: string | null = util.doGetString(req.headers.clientid);

                    await requestModel.doSet(req, clientID);
                }

                next();
            }
        }
        else 
            res.send(util.doAPIMessage({
                statusCode: 400,
                data: null,
                message: 'bad request'
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
app.enable('trust proxy');
app.get('/Test', (req: Schema.TypeRequest, res: Response) => {
    res.send(util.doGetIPAddress(req));
});
/*
สำหรับสร้าง client secret โดยใช้ clientID, systemKey
*/
app.get('/ClientSecret/Get/(:clientID)/(:systemKey)', (req: Schema.TypeRequest, res: Response) => {
    res.send(util.doSetCUID([req.params.clientID, req.params.systemKey]));
});

router.use('/Token', tokenRoute);
router.use('/Student/Profile', studentProfileRoute);
router.use('/Student/DigitalTranscript', studentDigitalTranscriptRoute);
router.use('/activities', studentActivityTranscriptRoute);
router.use('/Graphql/Student/Profile', studentProfileGraphql);

app.listen(process.env.PORT, () => {
    console.log('Server is running at port %s', process.env.PORT);
});