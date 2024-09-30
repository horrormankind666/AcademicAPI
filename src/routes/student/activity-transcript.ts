/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๐๙/๒๕๖๗>
Modify date : <๓๐/๐๙/๒๕๖๗>
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
        projectID: string | null,
        activityID: string | null,
        activityIDRefMUWalletForAT: string | null,
        studentID: string | null
    ): Promise<Schema.Result> {
        let activityResult: Schema.Result = await student.activityTranscriptModel.activity.doGet(projectID, activityID, activityIDRefMUWalletForAT, studentID);
        let activityDataResult: {
            status: boolean | null,
            full: Schema.Student.ActivityTranscript.Activity | null,
            short: Schema.Student.ActivityTranscript.Activity | null,
            message: {
                th: string | null,
                en: string | null
            } | null
        } | null = null;

        if (activityResult.statusCode === 200) {
            if (util.doIsEmpty(activityResult.data) === false) {
                let activityDataFull: Schema.Student.ActivityTranscript.Activity = Object.assign({}, activityResult.data);
                let activityDataShort: Schema.Student.ActivityTranscript.Activity = {
                    ID: activityDataFull.ID,
                    IDRefMUWalletForAT: activityDataFull.IDRefMUWalletForAT,
                    acaYear: activityDataFull.acaYear,
                    semester: activityDataFull.semester,
                    name: {
                        th: activityDataFull.name.th,
                        en: activityDataFull.name.en
                    },
                    startDate: activityDataFull.startDate,
                    endDate: activityDataFull.endDate,
                    hours: activityDataFull.hours,
                    place: activityDataFull.place,
                    amountMax: activityDataFull.amountMax,
                    project: {
                        ID: activityDataFull.project.ID,
                        name: {
                            th: activityDataFull.project.name.th,
                            en: activityDataFull.project.name.en
                        },
                        application: {
                            startDate: activityDataFull.project.application.startDate,
                            endDate: activityDataFull.project.application.endDate
                        },
                        type: {
                            name: {
                                th: activityDataFull.project.type.name.th,
                                en: activityDataFull.project.type.name.en
                            }
                        },
                        institute: {
                            name: {
                                th: activityDataFull.project.institute.name.th,
                                en: activityDataFull.project.institute.name.en
                            }
                        }
                    },
                    student: {
                        ID: activityDataFull.student.ID,
                        code: activityDataFull.student.code,
                        class: activityDataFull.student.class,
                        faculty: {
                            ID: activityDataFull.student.faculty.ID
                        }
                    }
                };

                if (util.doIsEmpty(activityDataFull.student.ID) === true ||
                    util.doIsEmpty(activityDataFull.student.code) === true ||
                    util.doIsEmpty(activityDataFull.student.class) === true ||
                    util.doIsEmpty(activityDataFull.student.faculty.ID) === true)
                    activityDataResult = {
                        status: false,
                        full: activityDataFull,
                        short: activityDataShort,
                        message: {
                            th: 'ไม่พบนักศึกษา',
                            en: 'no student found'
                        }
                    };
                else
                    activityDataResult = {
                        status: null,
                        full: activityDataFull,
                        short: activityDataShort,
                        message: null
                    };
            }
            else
                activityDataResult = {
                    status: false,
                    full: null,
                    short: null,
                    message: {
                        th: 'ไม่พบกิจกรรม',
                        en: 'no activity found'
                    }
                };
        }

        return (<Schema.Result> {
            statusCode: activityResult.statusCode,
            data: activityDataResult,
            message: activityResult.message
        });
    }
}

router.get('/Test', async(req: Schema.TypeRequest, res: Response, next: NextFunction) => {
    let activityTranscriptResult: Schema.Result;

    activityTranscriptResult = {
        statusCode: 200,
        data: 'Hello Activity Transcript',
        message: 'ok'
    };

    res.send(util.doAPIMessage(activityTranscriptResult));
});

router.post('/Project/Activity/Register', async(req: Schema.TypeRequest, res: Response, next: NextFunction) => {
    let activity: Activity = new Activity();
    let projectID: string | null = util.doGetString(req.body.projectID);
    let activityID: string | null = util.doGetString(req.body.activityID);
    let activityIDRefMUWalletForAT: string | null = util.doGetString(req.body.activityIDRefMUWalletForAT);
    let studentID: string | null = util.doGetString(req.body.studentID);
    
    let activityResult: Schema.Result = await activity.doGet(projectID, activityID, activityIDRefMUWalletForAT, studentID);
    let registerDataResult: {
        status: boolean | null,
        message: {
            th: string | null,
            en: string | null
        },
        activity: Schema.Student.ActivityTranscript.Activity | null,
    } | null = null;

    if (util.doIsEmpty(activityResult.data) === false) {
        registerDataResult = {
            status: activityResult.data.status,
            message: activityResult.data.message,
            activity: (util.doIsEmpty(activityResult.data.short) === false ? activityResult.data.short : null)
        };

        let activityData: Schema.Student.ActivityTranscript.Activity = Object.assign({}, activityResult.data.full);

        if (util.doIsEmpty(registerDataResult.status) === true) {
            let countRegistered: number = (util.doIsEmpty(activityData.countRegistered) === false ? parseInt(String(activityData.countRegistered)) : 0);
            
            if (countRegistered !== 0)
                registerDataResult = {
                    status: false,
                    message: {
                        th: 'สมัครกิจกรรมนี้แล้ว',
                        en: 'this activity has been registered'
                    },
                    activity: registerDataResult.activity
                };
        }
        
        if (util.doIsEmpty(registerDataResult.status) === true) {
            let countStudentsRegistered: number = (util.doIsEmpty(activityData.countStudentsRegistered) === false ? parseInt(String(activityData.countStudentsRegistered)) : 0);
            let amountMax: number = (util.doIsEmpty(activityData.amountMax) === false ? parseInt(String(activityData.amountMax)) : 0);
            
            if (countStudentsRegistered >= amountMax)
                registerDataResult = {
                    status: false,
                    message: {
                        th: 'กิจกรรมนี้จำนวนที่รับสมัครเต็มแล้ว',
                        en: 'this activity is full'
                    },
                    activity: registerDataResult.activity
                };
        }

        if (util.doIsEmpty(registerDataResult.status) === true) {
            let projectStatusID: string | null = (util.doIsEmpty(activityData.project.status) === false ? Object.assign({}, activityData.project.status).ID : null);
            projectStatusID = 'PSS-001';
            if (projectStatusID !== 'PSS-001')
                registerDataResult = {
                    status: false,
                    message: {
                        th: 'สมัครได้เฉพาะกิจกรรมที่สถานะเปิดรับสมัครเท่านั้น',
                        en: 'you can only apply for activities that are open for applications'
                    },
                    activity: registerDataResult.activity
                };
        }

        if (util.doIsEmpty(registerDataResult.status) === true) {
            let datenowRegistrationStatus: number = (util.doIsEmpty(activityData.datenowRegistrationStatus) === false ? parseInt(String(activityData.datenowRegistrationStatus)) : 1);
            datenowRegistrationStatus = 1;
            if (datenowRegistrationStatus === 0)
                registerDataResult = {
                    status: false,
                    message: {
                        th: 'ไม่สามารถสมัครกิจกรรมนี้ได้ เนื่องจากไม่อยู่ในช่วงวันที่รับสมัคร',
                        en: 'unable to apply for this activity because it is not within the application period'
                    },
                    activity: registerDataResult.activity
                };
        }

        if (util.doIsEmpty(registerDataResult.status) === true) {
            let projectApplicationStartDate: string | null = util.doGetString(activityData.project.application.startDate);
            
            if (projectApplicationStartDate === null) 
                registerDataResult = {
                    status: false,
                    message: {
                        th: 'ไม่มีวันที่รับสมัคร กรุณาติดต่อเจ้าหน้าที่ที่จัดตั้งกิจกรรมเพื่อเปิดช่วงเวลาเข้าร่วมกิจกรรม',
                        en: 'application date not found, please contact the organizer to open the event time'
                    },
                    activity: registerDataResult.activity
                };
        }

        if (util.doIsEmpty(registerDataResult.status) === true) {
            let isExpressionStudentCode: number = (util.doIsEmpty(activityData.project.isExpression) === false ? parseInt(String(Object.assign({}, activityData.project.isExpression).studentCode)) : 1);

            if (isExpressionStudentCode === 0)
                registerDataResult = {
                    status: false,
                    message: {
                        th: 'ไม่สามารถสมัครกิจกรรมนี้ได้ เนื่องจากรหัสนักศึกษานี้ไม่ได้อยู่ในเงื่อนไขการรับสมัคร',
                        en: 'unable to apply for this activity because this student code is not included in the application conditions'
                    },
                    activity: registerDataResult.activity
                };
        }

        if (util.doIsEmpty(registerDataResult.status) === true) {
            let isExpressionFaculty: number = (util.doIsEmpty(activityData.project.isExpression) === false ? parseInt(String(Object.assign({}, activityData.project.isExpression).faculty)) : 1);
            
            if (isExpressionFaculty === 0)
                registerDataResult = {
                    status: false,
                    message: {
                        th: 'ไม่สามารถสมัครกิจกรรมนี้ได้ เนื่องจากคณะนี้ไม่ได้อยู่ในเงื่อนไขการรับสมัคร',
                        en: 'unable to apply for this activity because this faculty is not included in the application conditions'
                    },
                    activity: registerDataResult.activity
                };
        }

        if (util.doIsEmpty(registerDataResult.status) === true) {
            let isExpressionClass: number = (util.doIsEmpty(activityData.project.isExpression) === false ? parseInt(String(Object.assign({}, activityData.project.isExpression).class)) : 1);

            if (isExpressionClass === 0)
                registerDataResult = {
                    status: false,
                    message: {
                        th: 'ไม่สามารถสมัครกิจกรรมนี้ได้ เนื่องจากชั้นปีนี้ไม่ได้อยู่ในเงื่อนไขการรับสมัคร',
                        en: 'unable to apply for this activity because this class year is not included in the application conditions'
                    },
                    activity: registerDataResult.activity
                };
        }

        if (util.doIsEmpty(registerDataResult.status) === true) {
            let registerResult: Schema.Result = await student.activityTranscriptModel.activity.doRegister(activityID, studentID);
            
            if (registerResult.statusCode === 200)
                registerDataResult = {
                    status: true,
                    message: {
                        th: 'สมัครกิจกรรมนี้เรียบร้อย',
                        en: 'successfully applied for this activity'
                    },
                    activity: registerDataResult.activity
                }
            else
                registerDataResult = {
                    status: false,
                    message: {
                        th: 'สมัครกิจกรรมนี้ไม่สำเร็จ',
                        en: util.doGetString(String(registerResult.message).toLowerCase())
                    },
                    activity: registerDataResult.activity
                }
        }
    }

    res.send(util.doAPIMessage(<Schema.Result> {
        statusCode: activityResult.statusCode,
        data: registerDataResult,
        message: activityResult.message
    }));
});

router.put('/Project/Activity/Register/Cancel', async(req: Schema.TypeRequest, res: Response, next: NextFunction) => {
    let activity: Activity = new Activity();
    let projectID: string | null = util.doGetString(req.body.projectID);
    let activityID: string | null = util.doGetString(req.body.activityID);
    let activityIDRefMUWalletForAT: string | null = util.doGetString(req.body.activityIDRefMUWalletForAT);
    let studentID: string | null = util.doGetString(req.body.studentID);
    
    let activityResult: Schema.Result = await activity.doGet(projectID, activityID, activityIDRefMUWalletForAT, studentID);
    let registerDataResult: {
        status: boolean | null,
        message: {
            th: string | null,
            en: string | null
        },
        activity: Schema.Student.ActivityTranscript.Activity | null
    } | null = null;

    if (util.doIsEmpty(activityResult.data) === false) {
        registerDataResult = {
            status: activityResult.data.status,
            message: activityResult.data.message,
            activity: (util.doIsEmpty(activityResult.data.short) === false ? activityResult.data.short : null)
        };

        let activityData: Schema.Student.ActivityTranscript.Activity = Object.assign({}, activityResult.data.full);

        if (util.doIsEmpty(registerDataResult.status) === true) {
            let countRegistered: number = (util.doIsEmpty(activityData.countRegistered) === false ? parseInt(String(activityData.countRegistered)) : 0);
            
            if (countRegistered !== 0) {
                let invoiceID: string | null = (util.doIsEmpty(activityData.invoice) === false ? Object.assign({}, activityData.invoice).ID : null);
                let registerResult: Schema.Result = await student.activityTranscriptModel.activity.doRegisterCancel(activityID, invoiceID, studentID);
            
                if (registerResult.statusCode === 200)
                    registerDataResult = {
                        status: true,
                        message: {
                            th: 'ยกเลิกการสมัครกิจกรรมนี้เรียบร้อย',
                            en: 'cancelled successfully applied for this activity'
                        },
                        activity: registerDataResult.activity
                    }
                else
                    registerDataResult = {
                        status: false,
                        message: {
                            th: 'ยกเลิกการสมัครกิจกรรมนี้ไม่สำเร็จ',
                            en: util.doGetString(String(registerResult.message).toLowerCase())
                        },
                        activity: registerDataResult.activity
                    }
            }
            else
                registerDataResult = {
                    status: false,
                    message: {
                        th: 'ไม่ได้สมัครกิจกรรมนี้',
                        en: 'no application for this activity was found'
                    },
                    activity: registerDataResult.activity
                };
        }
    }

    res.send(util.doAPIMessage(<Schema.Result> {
        statusCode: activityResult.statusCode,
        data: registerDataResult,
        message: activityResult.message
    }));
});

export default router;