/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๓/๐๑/๒๕๖๖>
Modify date : <๐๔/๑๐/๒๕๖๗>
Description : <>
=============================================
*/

'use strict';
/*
import pg from 'pg';
*/
import mssql from 'mssql';

import { Util } from '../util';
import { Schema } from './schema';

const util: Util = new Util();

export class ClientModel {
    async doGet(
        clientID: string,
        clientSecret: string
    ): Promise<Schema.Result> {
        /*
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
            if (util.doIsArrayEmpty(clientResult.datas) === false) {
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
        */
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let query: string = (
            'select * ' +
            'from   acaAPIGatewayClient ' +
            'where  (ID = \'' + clientID + '\') and ' +
            '       (secret = \'' + clientSecret + '\')'
        );
        let clientResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, null, 'query', query);
        
        if (conn !== null &&
            clientResult.statusCode === 200) {
            if (util.doIsEmpty(clientResult.datas) === false) {
                let clientDatas: Array<Schema.Client> = { ...clientResult.datas };
                let clientData: Schema.Client = { ...clientDatas[0] };
                
                clientResult.data = <Schema.Client>{
                    ID: clientData.ID,
                    secret: clientData.secret,
                    systemKey: clientData.systemKey,
                    apiKey: clientData.apiKey,
                    verifyKey: clientData.verifyKey,
                    forSystem: clientData.forSystem
                };
            }
        }
        
        util.db.mssql.doClose(conn);

        return {
            conn: conn,
            statusCode: clientResult.statusCode,
            data: (util.doIsEmpty(clientResult.data) === false ? clientResult.data : null),
            message: clientResult.message
        };
    }
}