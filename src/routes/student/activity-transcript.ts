/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๐๙/๒๕๖๗>
Modify date : <๐๘/๑๐/๒๕๖๗>
Description : <>
=============================================
*/

'use strict';

import dotenv from 'dotenv';
import express, { Response, NextFunction, Router } from 'express';

import { Util } from '../../util';
import { Schema } from '../../models/schema';
import { ActivityTranscriptModel as StudentActivityTranscriptModel } from '../../models/student/activity-transcript';

const router: Router = express.Router();
const util: Util = new Util();
const student = {
    activityTranscriptModel: new StudentActivityTranscriptModel()
};

dotenv.config();

class Activity {
    async doGet(
        activityID: string | null,
        studentID: string | null
    ): Promise<Schema.Result> {
        let activityResult: Schema.Result = await student.activityTranscriptModel.activity.doGet(activityID, studentID);
        let activityDataResult: {
            status: boolean | null,
            message: {
                th: string | null,
                en: string | null
            } | null,
            data: Schema.Student.ActivityTranscript.Activity | null
        } | null = null;

        if (activityResult.statusCode === 200) {
            if (util.doIsEmpty(activityResult.data) === false) {
                let activityData: Schema.Student.ActivityTranscript.Activity = { ...activityResult.data };

                if (util.doIsEmpty(activityData.student.ID) === true ||
                    util.doIsEmpty(activityData.student.code) === true ||
                    util.doIsEmpty(activityData.student.class) === true ||
                    util.doIsEmpty(activityData.student.faculty.ID) === true)
                    activityDataResult = {
                        status: false,
                        message: {
                            th: 'ไม่พบนักศึกษา',
                            en: 'no student found'
                        },
                        data: activityData
                    };
                else
                    activityDataResult = {
                        status: null,
                        message: null,
                        data: activityData
                    };
            }
            else
                activityDataResult = {
                    status: false,
                    message: {
                        th: 'ไม่พบกิจกรรม',
                        en: 'no activity found'
                    },
                    data: null
                };
        }

        return (<Schema.Result> {
            statusCode: activityResult.statusCode,
            data: activityDataResult,
            message: activityResult.message
        });
    }
}

router.post('/register', async(req: Schema.TypeRequest, res: Response, next: NextFunction) => {
    let activity: Activity = new Activity();
    let activityID: string | null = util.doGetString(req.body.activityId);
    let studentID: string | null = util.doGetString(req.body.studentId);
    
    let activityResult: Schema.Result = await activity.doGet(activityID, studentID);
    let registerResult: Schema.Result = {
        success: (activityResult.statusCode === 200 ? true : false),
        message: activityResult.message,
        code: activityResult.statusCode
    };
    
    if (util.doIsEmpty(activityResult.data) === false) {
        let activityData: Schema.Student.ActivityTranscript.Activity = { ...activityResult.data.data };
        let isValidated: boolean = (util.doIsEmpty(activityResult.data.status) === true ? true : activityResult.data.status);

        registerResult.message = activityResult.data.message;
        
        if (isValidated === true) {
            let countRegistered: number = (util.doIsEmpty(activityData.countRegistered) === false ? parseInt(String(activityData.countRegistered)) : 0);
            // countRegistered = 1;
            if (countRegistered !== 0) {
                isValidated = false;
                registerResult.message = {
                    th: 'สมัครกิจกรรมนี้แล้ว',
                    en: 'this activity has been registered'
                };
            }
        }
        
        if (isValidated === true) {
            let countStudentsRegistered: number = (util.doIsEmpty(activityData.countStudentsRegistered) === false ? parseInt(String(activityData.countStudentsRegistered)) : 0);
            let amountMax: number = (util.doIsEmpty(activityData.amountMax) === false ? parseInt(String(activityData.amountMax)) : 0);
            // countStudentsRegistered = 25;
            // amountMax = 25
            if (countStudentsRegistered >= amountMax) {
                isValidated = false;
                registerResult.message = {
                    th: 'กิจกรรมนี้จำนวนที่รับสมัครเต็มแล้ว',
                    en: 'this activity is full'
                };
            }
        }

        if (isValidated === true) {
            let projectStatusID: string | null = util.doGetString(activityData.project.status.ID);
            projectStatusID = 'PSS-001';
            if (util.doIsEmpty(projectStatusID) === true ||
                projectStatusID !== 'PSS-001') {
                isValidated = false;
                registerResult.message = {
                    th: 'สมัครได้เฉพาะกิจกรรมที่สถานะเปิดรับสมัครเท่านั้น',
                    en: 'you can only apply for activities that are open for applications'
                };
            }
        }

        if (isValidated === true) {
            let projectStartDate: string | null = util.doGetString(activityData.project.startDate);
            // projectStartDate = null;
            if (util.doIsEmpty(projectStartDate) === true) {
                isValidated = false;
                registerResult.message = {
                    th: 'ไม่มีวันที่รับสมัคร กรุณาติดต่อเจ้าหน้าที่ที่จัดตั้งกิจกรรมเพื่อเปิดช่วงเวลาเข้าร่วมกิจกรรม',
                    en: 'application date not found, please contact the organizer to open the event time'
                };
            }
        }

        if (isValidated === true) {
            let isRegisterByDateNow: string | null = util.doGetString(activityData.isRegisterByDateNow);
            isRegisterByDateNow = 'Y';
            if (util.doIsEmpty(isRegisterByDateNow) === true ||
                isRegisterByDateNow === 'N') {
                isValidated = false;
                registerResult.message = {
                    th: 'ไม่สามารถสมัครกิจกรรมนี้ได้ เนื่องจากไม่อยู่ในช่วงวันที่รับสมัคร',
                    en: 'unable to apply for this activity because it is not within the application period'
                };
            }
        }

        if (isValidated === true) {
            let isExpressionStudentCode: string | null = util.doGetString(activityData.isExpression.studentCode);
            // isExpressionStudentCode = null
            if (util.doIsEmpty(isExpressionStudentCode) === true ||
                isExpressionStudentCode === 'N') {
                isValidated = false;
                registerResult.message = {
                    th: 'ไม่สามารถสมัครกิจกรรมนี้ได้ เนื่องจากรหัสนักศึกษานี้ไม่ได้อยู่ในเงื่อนไขการรับสมัคร',
                    en: 'unable to apply for this activity because this student code is not included in the application conditions'                    
                };
            }
        }

        if (isValidated === true) {
            let isExpressionFaculty: string | null = util.doGetString(activityData.isExpression.faculty);
            // isExpressionFaculty = null
            if (util.doIsEmpty(isExpressionFaculty) === true ||
                isExpressionFaculty === 'N') {
                isValidated = false;
                registerResult.message = {
                    th: 'ไม่สามารถสมัครกิจกรรมนี้ได้ เนื่องจากคณะนี้ไม่ได้อยู่ในเงื่อนไขการรับสมัคร',
                    en: 'unable to apply for this activity because this faculty is not included in the application conditions'
                };
            }
        }

        if (isValidated === true) {
            let isExpressionClass: string | null = util.doGetString(activityData.isExpression.class);
            // isExpressionClass = null
            if (util.doIsEmpty(isExpressionClass) === true ||
                isExpressionClass === 'N') {
                isValidated = false;
                registerResult.message = {
                    th: 'ไม่สามารถสมัครกิจกรรมนี้ได้ เนื่องจากชั้นปีนี้ไม่ได้อยู่ในเงื่อนไขการรับสมัคร',
                    en: 'unable to apply for this activity because this class year is not included in the application conditions'
                };
                }
        }

        if (isValidated === true) {
            let setRegisterResult: Schema.Result = await student.activityTranscriptModel.activity.doSetRegister(activityData.ID, activityData.student.ID);
            
            if (setRegisterResult.statusCode === 200) 
                registerResult.message = {
                    th: 'สมัครกิจกรรมนี้เรียบร้อย',
                    en: 'successfully applied for this activity'
                }
            else {
                isValidated = false;
                registerResult = {
                    message: setRegisterResult.message,
                    code: setRegisterResult.statusCode
                }
            }
        }

        registerResult = {
            success: isValidated ,
            message: registerResult.message,
            code: registerResult.code
        };
    }
  
    res.send(util.doAPIMessage(registerResult));
});

export default router;