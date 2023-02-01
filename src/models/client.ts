/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๓/๐๑/๒๕๖๖>
Modify date : <๓๐/๐๑/๒๕๖๖>
Description : <>
=============================================
*/

'use strict';

import pg from 'pg';

import { Util } from '../util';
import { Schema } from './schema';

const util: Util = new Util();

export class ClientModel {
    async doGet(
        clientID: string,
        clientSecret: string
    ): Promise<Schema.Result> {
        let conn: pg.Client | null = await util.db.pg.doConnect();
        let query: string = (
            'select * ' +
            'from   public."Client" ' +
            'where  ("ID" = \'' + clientID + '\') and ' +
            '       ("secret" = \'' + clientSecret + '\')'
        );
        let clientResult: Schema.Result = await util.db.pg.doExecuteQuery(conn, query);
        
        if (conn !== null &&
            clientResult.statusCode === 200) {
            if (clientResult.datas.length !== 0) {
                let clientDatas: Array<Schema.Client> = clientResult.datas;
                let clientData: Schema.Client = Object.assign({}, clientDatas[0]);
                
                clientResult.data = <Schema.Client>{
                    ID: clientData.ID,
                    secret: clientData.secret,
                    systemKey: clientData.systemKey,
                    apiKey: clientData.apiKey
                };
            }
        }
        
        util.db.pg.doClose(conn);

        return {
            conn: conn,
            statusCode: clientResult.statusCode,
            data: (clientResult.data !== undefined ? clientResult.data : null),
            message: clientResult.message
        };
    }
}