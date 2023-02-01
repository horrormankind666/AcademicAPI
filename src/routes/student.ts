/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๓/๐๑/๒๕๖๖>
Modify date : <๐๑/๐๒/๒๕๖๖>
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
    let studentResult: Schema.Result = {
        statusCode: 200,
        data: null,
        message: null
    };

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
            let profileResult: any = JSON.parse(result.body);

            studentResult = {
                statusCode: result.statusCode,
                data: (profileResult.data !== undefined ? profileResult.data.profile : null),
                message: (profileResult.data !== undefined ? 'ok' : profileResult.errors)
            }

            res.json(util.doAPIMessage(studentResult));
        });
    }
    else {
        studentResult = {
            statusCode: 400,
            data: null,
            message: 'bad request'
        }

        res.json(util.doAPIMessage(studentResult));
    }
});

export default router;