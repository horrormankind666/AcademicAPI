/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๐๕/๒๕๖๖>
Modify date : <๑๐/๐๕/๒๕๖๖>
Description : <>
=============================================
*/

'use strict';

import dotenv from 'dotenv';
import express, { Response, NextFunction, Router } from 'express';

import { Util } from '../../util';
import { Schema } from '../../models/schema';
import { DigitalTranscriptModel as StudentDigitalTranscriptModel } from '../../models/student/digital-transcript';

const router: Router = express.Router();
const util: Util = new Util();
const student = {
    digitalTranscriptModel: new StudentDigitalTranscriptModel()
};

dotenv.config();

router.get('/(:section)/Get', async(req: Schema.TypeRequest, res: Response, next: NextFunction) => {
    let section: string | undefined = req.params.section;

    if (['Footer'].includes(section) === true) {
        let footerResult: Schema.Result = await student.digitalTranscriptModel.doGetFooter();

        res.send(util.doAPIMessage(footerResult));
    }
    else
        res.send(util.doAPIMessage({
            statusCode: 400,
            data: null,
            message: 'bad request'
        }));
});

export default router;