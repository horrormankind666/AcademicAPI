/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๐๕/๒๕๖๖>
Modify date : <๐๙/๐๕/๒๕๖๖>
Description : <>
=============================================
*/

'use strict';

import mssql from 'mssql';

import { Util } from '../../util';
import { Schema } from '../schema';

const util: Util = new Util();

export class DigitalTranscriptModel {
    async doGetFooter(): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let footerResult: Schema.Result = {
            statusCode: 200,
            data: null
        };
        /*
        let footerResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, (conn !== null ? conn.request() : null), 'procedure', 'sp_perGetListPersonStudentInfo');;
               
        if (conn !== null &&
            footerResult.statusCode === 200) {
            if (footerResult.datas.length !== 0) {
                let footerDatas: Array<any> = footerResult.datas;
                let footerData: any = Object.assign({}, footerDatas[0]);

                footerResult.data = <Schema.Student.DigitalTranscript.Footer> {
                    studentCode: '5721005',
                    studentStatus: '11',
                    line: {
                        one: 'ได้สอบผ่านการสอบประมวลความรอบรู้เรียบร้อยแล้ว',
                        two: 'สำเร็จการศึกษาหลักสูตร เทคโนโลยีบัณฑิต (เทคโนโลยีการศึกษาแพทยศาสตร์)',
                        three: 'วันที่ 19 มิถุนายน 2561'
                    },
                    hons: 'เกียรตินิยมอันดับ 1',
                    thesisTitle: null
                }
            }
        }
        else
            footerResult = {
                statusCode: footerResult.statusCode,
                data: null,
                message: footerResult.message
            };

        util.db.mssql.doClose(conn);
        */
               
        footerResult.data = <Schema.Student.DigitalTranscript.Footer> {
            studentCode: '5721005',
            studentStatus: '11',
            line: {
                one: 'ได้สอบผ่านการสอบประมวลความรอบรู้เรียบร้อยแล้ว',
                two: 'สำเร็จการศึกษาหลักสูตร เทคโนโลยีบัณฑิต (เทคโนโลยีการศึกษาแพทยศาสตร์)',
                three: 'วันที่ 19 มิถุนายน 2561'
            },
            hons: 'เกียรตินิยมอันดับ 1',
            thesisTitle: null
        }

        return {
            conn: conn,
            statusCode: footerResult.statusCode,
            data: (footerResult.data !== undefined ? footerResult.data : null),
            message: footerResult.message
        };
    }
    /*
    async doGetGPAInfo: Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let footerResult: Schema.Result = {
            statusCode: 200,
            data: null
        };

        footerResult.data = <Schema.Student.DigitalTranscript.Footer> {
            studentCode: '5721005',
            studentStatus: '11',
            line: {
                one: 'ได้สอบผ่านการสอบประมวลความรอบรู้เรียบร้อยแล้ว',
                two: 'สำเร็จการศึกษาหลักสูตร เทคโนโลยีบัณฑิต (เทคโนโลยีการศึกษาแพทยศาสตร์)',
                three: 'วันที่ 19 มิถุนายน 2561'
            },
            hons: 'เกียรตินิยมอันดับ 1',
            thesisTitle: null
        }

        return {
            conn: conn,
            statusCode: footerResult.statusCode,
            data: (footerResult.data !== undefined ? footerResult.data : null),
            message: footerResult.message
        };
    }
    */
}