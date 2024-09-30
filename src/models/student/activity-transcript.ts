/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๙/๐๙/๒๕๖๗>
Modify date : <๓๐/๐๙/๒๕๖๗>
Description : <>
=============================================
*/

'use strict';

import mssql from 'mssql';

import { Util } from '../../util';
import { Schema } from '../schema';

const util: Util = new Util();

export class ActivityTranscriptModel {
    activity = {
        async doGet(
            projectID: string | null,
            activityID: string | null,
            activityIDRefMUWalletForAT: string | null,
            studentID: string | null,
        ): Promise<Schema.Result> {
            let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
            let connRequest: mssql.Request | null = null;

            if (conn !== null) {
                connRequest = conn.request();
                connRequest.input('projectId', projectID);
                connRequest.input('username', studentID);
            }

            let activityResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_actGetListSectionByProjectId');
            
            if (conn !== null &&
                activityResult.statusCode === 200) {
                if (util.doIsEmpty(activityResult.datas) === false) {
                    let activityDatas: Array<any> = activityResult.datas.filter((activity: any) => 
                        (activity.projectId !== null) &&
                        (activity.projectId === projectID) &&
                        (activity.id !== null) &&
                        (activity.id === activityID) &&
                        (activity.activityIDRefMUWalletForAT !== null) &&
                        (activity.activityIDRefMUWalletForAT === activityIDRefMUWalletForAT)
                    );

                    if (util.doIsEmpty(activityDatas) === false) {
                        let activityData: any = Object.assign({}, activityDatas[0]);
                    
                        activityResult.data = <Schema.Student.ActivityTranscript.Activity>{
                            ID: util.doGetString(activityData.id),
                            IDRefMUWalletForAT: util.doGetString(activityData.activityIDRefMUWalletForAT),
                            acaYear: util.doGetString(activityData.acaYear),
                            semester: util.doGetString(activityData.semester),
                            name: {
                                th: util.doGetString(activityData.sectionNameTh),
                                en: util.doGetString(activityData.sectionNameEn)
                            },
                            startDate: util.doGetString(activityData.startDateTh),
                            endDate: util.doGetString(activityData.endDateTh),
                            hours: util.doGetString(activityData.hours),
                            place: util.doGetString(activityData.place),
                            amountMax: util.doGetString(activityData.amountMax),
                            project: {
                                ID: util.doGetString(activityData.projectId),
                                name: {
                                    th: util.doGetString(activityData.projectNameTh),
                                    en: util.doGetString(activityData.projectNameEn),
                                },
                                detail: util.doGetString(activityData.projectDetail),
                                status: {
                                    ID: util.doGetString(activityData.projectStatusId)
                                },
                                application: {
                                    startDate: util.doGetString(activityData.projectStartDateTH),
                                    endDate: util.doGetString(activityData.projectEndDateTH)
                                },
                                type: {
                                    name: {
                                        th: util.doGetString(activityData.projectTypeNameTh),
                                        en: null
                                    }
                                },
                                institute: {
                                    name: {
                                        th: util.doGetString(activityData.instituteNameTh),
                                        en: null
                                    }
                                },
                                pictureFileName: util.doGetString(activityData.picName),
                                targetGroup: {
                                    name: {
                                        th: util.doGetString(activityData.targetGroupNameTh),
                                        en: null
                                    }
                                },
                                expression: {
                                    studentCode: util.doGetString(activityData.expressionStudentCode),
                                    faculty: util.doGetString(activityData.expressionFaculty),
                                    class: util.doGetString(activityData.expressionClassYear)
                                },
                                isExpression: {
                                    studentCode: util.doGetString(activityData.isExpressionStudentCode),
                                    faculty: util.doGetString(activityData.isExpressionFaculty),
                                    class: util.doGetString(activityData.isExpressionClass)
                                }
                            },
                            registrationFee: util.doGetString(activityData.registrationFee),
                            indicator: util.doGetString(activityData.dataStrIndicator),
                            character: util.doGetString(activityData.dataStrCharacter),
                            countRegistered: util.doGetString(activityData.stsJoinSection),
                            countRegisteredAll: util.doGetString(activityData.stsJoinSectionAll),
                            registrationStatusDetail: util.doGetString(activityData.stsJoinDetail),
                            countStudentsRegistered: util.doGetString(activityData.countStudentSection),
                            countStudentsJoin: util.doGetString(activityData.countStdRegist),
                            datenowRegistrationStatus: util.doGetString(activityData.stsDateNowJoinAct),
                            student: {
                                ID: util.doGetString(studentID),
                                code: util.doGetString(activityData.studentCodeStd),
                                class: util.doGetString(activityData.classStd),
                                faculty: {
                                    ID: util.doGetString(activityData.facultyIdStd)
                                }
                            },
                            isEntrance: util.doGetString(activityData.isEntranceAct),
                            paidStatus: util.doGetString(activityData.paidStatus),
                            invoice: {
                                ID: util.doGetString(activityData.invoiceId)
                            },
                            cancelledStatus: util.doGetString(activityData.cancelStatus)
                        }
                    }
                }
            }
            
            util.db.mssql.doClose(conn);

            return {
                conn: conn,
                statusCode: activityResult.statusCode,
                data: (util.doIsEmpty(activityResult.data) === false ? activityResult.data : null),
                message: activityResult.message
            };
        },
        async doRegister(
            activityID: string | null,
            studentID: string | null
        ): Promise<Schema.Result> {
            let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
            let connRequest: mssql.Request | null = null;

            if (conn !== null) {
                connRequest = conn.request();
                connRequest.input('sectionId', activityID);
                connRequest.input('username', studentID);
            }

            let registerResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_actSetJoinProjectSection');

            util.db.mssql.doClose(conn);

            return {
                conn: conn,
                statusCode: registerResult.statusCode,
                data: null,
                message: registerResult.message
            };
        },
        async doRegisterCancel(
            activityID: string | null,
            invoiceID: string | null,
            studentID: string | null
        ): Promise<Schema.Result> {
            let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
            let connRequest: mssql.Request | null = null;

            if (conn !== null) {
                connRequest = conn.request();
                connRequest.input('sectionId', activityID);
                connRequest.input('username', studentID);
                connRequest.input('invoiceId', invoiceID);
            }

            let registerResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_actSetCancelJoinProjectSection');

            util.db.mssql.doClose(conn);

            return {
                conn: conn,
                statusCode: registerResult.statusCode,
                data: null,
                message: registerResult.message
            };
        }
    }
}