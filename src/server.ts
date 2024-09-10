/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๖/๐๑/๒๕๖๖>
Modify date : <๐๙/๐๙/๒๕๖๗>
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
    let url: string | null = (urls.length !== 0 ? (urls[1].length !== 0 ? urls[1] : null) : null);
    let client: any = {
        ID: ((req.headers.clientid !== undefined) && (req.headers.clientid.length !== 0) ? req.headers.clientid : null),
        secret: ((req.headers.clientsecret !== undefined) && (req.headers.clientsecret.length !== 0) ? req.headers.clientsecret : null)
    };

    if (url !== null) {
        if (['Student'].includes(url) === true) {
            /*
            await requestModel.doSet(req, client.ID);
            
            if (client.ID !== null &&
                client.secret !== null) {
                let CUIDs: Array<string> | null = util.doParseCUID(client.secret);
                let clientID: string | null = null;
                let systemKey: string | null = null;

                if (CUIDs !== null &&
                    CUIDs.length === 2) {
                    clientID = (CUIDs[0].length !== 0 ? CUIDs[0] : null);
                    systemKey = (CUIDs[1].length !== 0 ? CUIDs[1] : null);
                }

                if (clientID === client.ID) {
                    let clientResult: Schema.Result = await clientModel.doGet(client.ID, client.secret);

                    if (clientResult.conn !== null &&
                        clientResult.statusCode === 200) {
                        if (clientResult.data !== null) {
                            let clientData: Schema.Client = Object.assign({}, clientResult.data);

                            if (clientID === clientData.ID &&
                                client.ID == clientData.ID &&
                                systemKey === clientData.systemKey &&
                                systemKey === process.env.SYSTEM_KEY)
                                next();
                            else
                                res.send(util.doAPIMessage({
                                    statusCode: 401,
                                    data: null,
                                    message: 'unauthorized'
                                }));
                        }
                        else
                            res.send(util.doAPIMessage({
                                statusCode: 401,
                                data: null,
                                message: 'unauthorized'
                            }));
                    }
                    else
                        res.send(util.doAPIMessage({
                            statusCode: clientResult.statusCode,
                            data: clientResult.data,
                            message: (clientResult.message !== undefined ? clientResult.message : null)
                        }));
                }
                else
                    res.send(util.doAPIMessage({
                        statusCode: 401,
                        data: null,
                        message: 'unauthorized'
                    }));

            }
            else
                res.send(util.doAPIMessage({
                    statusCode: 401,
                    data: null,
                    message: 'unauthorized'
                }));
            */

            /*
            if (clientID === client.ID &&
                systemKey === process.env.SYSTEM_KEY) {
                let tokenResult: Schema.Result = await util.authorization.jwtClient.doTokenInfo(req);
                
                if (tokenResult.statusCode === 200 &&
                    tokenResult.data.payload !== null) {
                    req.payload = tokenResult.data.payload;

                    if (tokenResult.data.clientID === client.ID &&
                        req.payload.SystemKey === process.env.SYSTEM_KEY)
                        next();
                    else
                        res.send(util.doAPIMessage({
                            statusCode: 401,
                            data: null,
                            message: 'unauthorized'
                        }));
                }
                else
                    res.send(util.doAPIMessage({
                        statusCode: tokenResult.statusCode,
                        data: null,
                        message: tokenResult.message
                    }));
            }
            else
                res.send(util.doAPIMessage({
                    statusCode: 401,
                    data: null,
                    message: 'unauthorized'
                }));
            */

            await requestModel.doSet(req, client.ID);

            if (client.ID !== null &&
                client.secret !== null) {
                let CUIDs: Array<string> | null = util.doParseCUID(client.secret);
                let clientID: string | null = null;
                let systemKey: string | null = null;

                if (CUIDs !== null &&
                    CUIDs.length === 2) {
                    clientID = (CUIDs[0].length !== 0 ? CUIDs[0] : null);
                    systemKey = (CUIDs[1].length !== 0 ? CUIDs[1] : null);
                }

                if (clientID === client.ID &&
                    systemKey !== null) {
                    let clientResult: Schema.Result = await clientModel.doGet(client.ID, client.secret);

                    if (clientResult.conn !== null &&
                        clientResult.statusCode === 200) {
                        if (clientResult.data !== null) {
                            let clientData: Schema.Client = Object.assign({}, clientResult.data);

                            if (clientID === clientData.ID &&
                                client.ID == clientData.ID &&
                                systemKey === clientData.systemKey) {
                                let tokenResult: Schema.Result = await util.authorization.jwtClient.doTokenInfo(req, clientData);

                                if (tokenResult.statusCode === 200 &&
                                    tokenResult.data.payload !== null) {
                                    req.payload = tokenResult.data.payload;

                                    if (tokenResult.data.clientID === client.ID &&
                                        req.payload.SystemKey === clientData.systemKey)
                                        next();
                                    else
                                        res.send(util.doAPIMessage({
                                            statusCode: 401,
                                            data: null,
                                            message: 'unauthorized'
                                        }));
                                }
                                else
                                    res.send(util.doAPIMessage({
                                        statusCode: tokenResult.statusCode,
                                        data: null,
                                        message: tokenResult.message
                                    }));
                            }
                            else
                                res.send(util.doAPIMessage({
                                    statusCode: 401,
                                    data: null,
                                    message: 'unauthorized'
                                }));
                        }
                        else
                            res.send(util.doAPIMessage({
                                statusCode: 401,
                                data: null,
                                message: 'unauthorized'
                            }));
                    }
                    else
                        res.send(util.doAPIMessage({
                            statusCode: clientResult.statusCode,
                            data: clientResult.data,
                            message: (clientResult.message !== undefined ? clientResult.message : null)
                        }));
                }
                else
                    res.send(util.doAPIMessage({
                        statusCode: 401,
                        data: null,
                        message: 'unauthorized'
                    }));

            }
            else
                res.send(util.doAPIMessage({
                    statusCode: 401,
                    data: null,
                    message: 'unauthorized'
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
router.use('/Student/ActivityTranscript', studentActivityTranscriptRoute);
router.use('/Graphql/Student/Profile', studentProfileGraphql);

app.listen(process.env.PORT, () => {
    console.log('Server is running at port %s', process.env.PORT);
});