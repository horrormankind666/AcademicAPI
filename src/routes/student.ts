/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๓/๐๑/๒๕๖๖>
Modify date : <๐๖/๐๒/๒๕๖๖>
Description : <>
=============================================
*/

'use strict';

import dotenv from 'dotenv';
import express, { Response, NextFunction, Router } from 'express';
import request from 'request';

import { Util } from '../util';
import { Schema } from '../models/schema';

const router: Router = express.Router();
const util: Util = new Util();

dotenv.config();

router.get('/(:section)/Get', async(req: Schema.TypeRequest, res: Response, next: NextFunction) => {
    let section: string | undefined = req.params.section;

    if (['Profile'].includes(section) === true) {
        let query: {} | null = null;
        let options: request.CoreOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        };

        if (JSON.stringify(req.body) !== '{}')
            query = {
                query: ('query {' + req.body + '}')
            };

        if (query !== null)
            options.body = JSON.stringify(query);

        request(('http://' + process.env.HOST + ':' + process.env.PORT + '/Graphql/Student/' + section + '/Get'), options, (error: any, result: any) => {
            let profileGraphqlResult: any = JSON.parse(result.body);
            let profileReqult: Schema.Result = {
                statusCode: 200,
                data: null,
                message: null
            };
            
            if (profileGraphqlResult.data !== undefined &&
                profileGraphqlResult.data.profile !== null)
                profileReqult.data = profileGraphqlResult.data.profile;
            else {
                try {
                    let errorResult: Schema.Result = JSON.parse(profileGraphqlResult.errors[0].message);

                    profileReqult = {
                        statusCode: errorResult.statusCode,
                        data: errorResult.data,
                        message: errorResult.message
                    };
                }
                catch {
                    profileReqult = {
                        statusCode: 400,
                        data: null,
                        message: profileGraphqlResult.errors
                    };
                }
            }

            res.send(util.doAPIMessage(profileReqult));
        });
    }
    else
        res.send(util.doAPIMessage({
            statusCode: 400,
            data: null,
            message: 'bad request'
        }));
});

export default router;