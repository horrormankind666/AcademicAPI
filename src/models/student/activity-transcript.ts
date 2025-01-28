/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๙/๐๙/๒๕๖๗>
Modify date : <๒๘/๐๑/๒๕๖๘>
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
            activityID: string | null,
            studentID: string | null,
        ): Promise<Schema.Result> {
            let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
            let connRequest: mssql.Request | null = null;

            if (conn !== null) {
                connRequest = conn.request();
                connRequest.input('activityID', activityID);
                connRequest.input('studentID', studentID);
            }

            let activityResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_actGetActivityByActivityIDRefMUWalletForAT');
            
            if (conn !== null &&
                activityResult.statusCode === 200) {
                if (util.doIsEmpty(activityResult.datas) === false) {
                    let activityDatas: Array<any> = { ...activityResult.datas };
                    let activityData: any = { ...activityDatas[0] };
                    
                    activityResult.data = <Schema.Student.ActivityTranscript.Activity>{
                        ID: util.doGetString(activityData.ID),
                        IDRefMUWalletForAT: util.doGetString(activityData.activityIDRefMUWalletForAT),
                        name: {
                            th: util.doGetString(activityData.nameTH),
                            en: util.doGetString(activityData.nameEN)
                        },
                        acaYear: util.doGetString(activityData.acaYear),
                        semester: util.doGetString(activityData.semester),
                        startDate: util.doGetString(activityData.startDates),
                        endDate: util.doGetString(activityData.endDates),
                        hours: util.doGetString(activityData.hours),
                        place: util.doGetString(activityData.place),
                        amountMax: util.doGetString(activityData.amountMax),
                        registrationFee: util.doGetString(activityData.registrationFee),
                        project: {
                            ID: util.doGetString(activityData.projectID),
                            name: {
                                th: util.doGetString(activityData.projectNameTH),
                                en: util.doGetString(activityData.projectNameEN),
                            },
                            detail: util.doGetString(activityData.projectDetail),
                            institute: {
                                name: {
                                    th: util.doGetString(activityData.projectInstituteNameTH),
                                    en: util.doGetString(activityData.projectInstituteNameEN)
                                }
                            },
                            status: {
                                ID: util.doGetString(activityData.projectStatusId)
                            },
                            type: {
                                name: {
                                    th: util.doGetString(activityData.projectTypeNameTH),
                                    en: util.doGetString(activityData.projectTypeNameEN)
                                }
                            },
                            targetGroup: {
                                name: {
                                    th: util.doGetString(activityData.projectTargetGroupNameTH),
                                    en: util.doGetString(activityData.projectTargetGroupNameEN)
                                }
                            },
                            startDate: util.doGetString(activityData.projectStartDates),
                            endDate: util.doGetString(activityData.projectEndDates),
                        },
                        countRegistered: util.doGetString(activityData.countRegistered),
                        countStudentsRegistered: util.doGetString(activityData.countStudentsRegistered),
                        countStudentsJoined: util.doGetString(activityData.countStudentsJoined),
                        isRegisterByDateNow: util.doGetString(activityData.isRegisterByDateNow),
                        isExpression: {
                            studentCode: util.doGetString(activityData.isExpressionStudentCode),
                            faculty: util.doGetString(activityData.isExpressionFaculty),
                            class: util.doGetString(activityData.isExpressionClass)
                        },
                        invoice: {
                            ID: util.doGetString(activityData.invoiceID),
                            paidStatus: util.doGetString(activityData.paidStatus),
                        },
                        student: {
                            ID: util.doGetString(studentID),
                            code: util.doGetString(activityData.studentCode),
                            class: util.doGetString(activityData.class),
                            faculty: {
                                ID: util.doGetString(activityData.facultyID)
                            }
                        },
                        registeredDate: null
                    };
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
        async doSetRegister(
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
        async doSetRedeem(
            activityID: string | null,
            studentCode: string | null
        ): Promise<Schema.Result> {
            let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
            let connRequest: mssql.Request | null = null;
            let query: string = (
                'declare @tbStudentRedeem [struc3KeyId]\n' +
                'insert into @tbStudentRedeem\n' +
                'select \'' + studentCode + '\', ' +
                '       \'' + activityID + '\', ' +
                '       \'PST-019\'\n\n' +
                'exec sp_actSetListStudentRegist @tbStudentRedeem, \'U0001\', \'' + studentCode + '\''
            );

            if (conn !== null)
                connRequest = conn.request();

            let redeemResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'query', query);
            
            util.db.mssql.doClose(conn);

            return {
                conn: conn,
                statusCode: redeemResult.statusCode,
                data: null,
                datas: redeemResult.datas,
                message: redeemResult.message
            };
        },
        async doSetVoid(
            activityRedeemID: string | null,
            studentID: string | null = 'MUWallet'
        ): Promise<Schema.Result> {
            let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
            let connRequest: mssql.Request | null = null;

            if (conn !== null) {
                connRequest = conn.request();
                connRequest.input('transsectionregistid', activityRedeemID);
                connRequest.input('username', studentID);
            }

            let voidResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_actSetCancelStudentRegist');
            
            util.db.mssql.doClose(conn);

            return {
                conn: conn,
                statusCode: voidResult.statusCode,
                data: null,
                datas: voidResult.datas,
                message: voidResult.message
            };
        }
    }
}