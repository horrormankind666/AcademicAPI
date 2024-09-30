/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๘/๐๑/๒๕๖๖>
Modify date : <๒๙/๐๙/๒๕๖๗>
Description : <>
=============================================
*/

'use strict';

import btoa from 'btoa';
import express, { Response, NextFunction, Router } from 'express';

import { Util } from '../util';
import { Schema } from '../models/schema';
import { ClientModel } from '../models/client';

const router: Router = express.Router();
const util: Util = new Util();
const clientModel: ClientModel = new ClientModel();

router.post('/Get', async(req: Schema.TypeRequest, res: Response, next: NextFunction) => {
    let client: any = {
        ID: util.doGetString(req.headers.clientid),
        secret: util.doGetString(req.headers.clientsecret)
    };

    if (util.doIsEmpty(client.ID) === false &&
        util.doIsEmpty(client.secret) === false) {
        let CUIDs: Array<string> | null = util.doParseCUID(client.secret);
        let clientID: string | null = null;
        
        if (util.doIsEmpty(CUIDs) === false) {
            CUIDs = Object.assign(new Array<string>(), CUIDs);
            clientID = CUIDs[0];
        }
        
        if (client.ID === clientID) {
            let clientResult: Schema.Result = await clientModel.doGet(client.ID, client.secret);

            if (clientResult.conn !== null &&
                clientResult.statusCode === 200) {
                if (util.doIsEmpty(clientResult.data) === false) {
                    let clientData: Schema.Client = Object.assign({}, clientResult.data);
                    let tokenAccessResult: Schema.Result = await util.authorization.jwtClient.doGetTokenAccess(req, clientData.apiKey);
                    
                    if (tokenAccessResult.status === true &&
                        util.doIsEmpty(tokenAccessResult.data) === false) {
                        res.send(util.doAPIMessage({
                            statusCode: 200,
                            data: (tokenAccessResult.data + '|' + btoa(client.ID).split('').reverse().join('')),
                            message: 'ok'
                        }));
                    }
                    else
                        res.send(util.doAPIMessage({
                            statusCode: 204,
                            data: null,
                            message: 'not authorized ( apiKey or ip or expire )'
                        }));
                }
                else
                    res.send(util.doAPIMessage({
                        statusCode: 204,
                        data: null,
                        message: 'not authorized ( apiKey or ip or expire )'
                    }));
            }
            else
                res.send(util.doAPIMessage({
                    statusCode: clientResult.statusCode,
                    data: clientResult.data,
                    message: (util.doIsEmpty(clientResult.message) === false ? clientResult.message : null)
                }));
        }
        else
            res.send(util.doAPIMessage({
                statusCode: 204,
                data: null,
                message: 'get package fail'
            }));
    }
    else
        res.send(util.doAPIMessage({
            statusCode: 204,
            data: null,
            message: 'get package fail'
        }));
});

router.post('/Verify', async(req: Schema.TypeRequest, res: Response, next: NextFunction) => {
    let client: any = {
        ID: util.doGetString(req.headers.clientid),
        secret: util.doGetString(req.headers.clientsecret)
    };
    let clientResult: Schema.Result = await clientModel.doGet(client.ID, client.secret);
    let clientData: Schema.Client = Object.assign({}, clientResult.data);
    let tokenVerifiedResult: Schema.Result = await util.authorization.jwtClient.doTokenVerify(req, clientData);

    res.send(util.doAPIMessage(tokenVerifiedResult));
});

export default router;