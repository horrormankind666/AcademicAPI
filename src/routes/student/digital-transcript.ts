/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๐๕/๒๕๖๖>
Modify date : <๑๕/๐๕/๒๕๖๖>
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

router.get('/(:section)/Get/', async(req: Schema.TypeRequest, res: Response, next: NextFunction) => {
    let section: string | undefined = req.params.section;
    let query = require('url').parse(req.url, true).query;
    let studentCode: string | undefined = query.studentCode;
    let quarter: string | undefined = query.quarter;
    let digitalTranscriptResult: Schema.Result;
    
    switch(section) {
        case 'Footer':
            digitalTranscriptResult = await student.digitalTranscriptModel.doGetFooter(studentCode);
            break;
        case 'AdditionalInformationTH':
            digitalTranscriptResult = await student.digitalTranscriptModel.doGetAdditionalInformation('Th', studentCode);
            break;
        case 'AdditionalInformationEN':
            digitalTranscriptResult = await student.digitalTranscriptModel.doGetAdditionalInformation('En', studentCode);
            break;
        case 'GPAInfo':
            digitalTranscriptResult = await student.digitalTranscriptModel.doGetGPAInfo(studentCode, quarter);
            break;
        case 'GPAStatus':
            digitalTranscriptResult = await student.digitalTranscriptModel.doGetListGPAStatus(studentCode);
            break;
        case 'SubjectRegistrationTH':
            digitalTranscriptResult = await student.digitalTranscriptModel.doGetListSubjectRegistration('Th', studentCode, quarter);
            break;
        case 'SubjectRegistrationEN':
            digitalTranscriptResult = await student.digitalTranscriptModel.doGetListSubjectRegistration('En', studentCode, quarter);
            break;
        case 'SubjectTransfer':
            digitalTranscriptResult = await student.digitalTranscriptModel.doGetListSubjectTransfer(studentCode);
            break;
        case 'Registrar':
            digitalTranscriptResult = await student.digitalTranscriptModel.doGetRegistrar();
            break;
        case 'SemesterStudent':
            digitalTranscriptResult = await student.digitalTranscriptModel.doGetListSemesterStudent(studentCode);
            break;
        case 'ProfileStudentTH':
            digitalTranscriptResult = await student.digitalTranscriptModel.doGetProfileStudent('Th', studentCode);
            break;
        case 'ProfileStudentEN':
            digitalTranscriptResult = await student.digitalTranscriptModel.doGetProfileStudent('En', studentCode);
            break;            
        default:
            digitalTranscriptResult = {
                statusCode: 400,
                data: null,
                message: 'bad request'
            };
            break;
    }

    res.send(util.doAPIMessage(digitalTranscriptResult));
});

export default router;