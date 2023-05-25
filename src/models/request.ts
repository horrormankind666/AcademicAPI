/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๒/๐๒/๒๕๖๖>
Modify date : <๐๘/๐๕/๒๕๖๖>
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

export class RequestModel {
    async doSet(
        req: Schema.TypeRequest,
        clientID: string | null
    ): Promise<null> {
        /*
        let conn: pg.Client | null = await util.db.pg.doConnect();
        let query: string = (
            'insert into public."Request"' +
            'select replace(concat(gen_random_uuid(), to_char(now()::timestamp, \'YYYYMMDDHHMISS\')), \'-\', \'\'), ' +
            '       \'' + req.method + '\', ' +
            '       \'' + (req.headers['host'] + req.url) + '\', ' +
            '       \'' + JSON.stringify(req.headers) + '\', ' +
            '       \'' + (typeof req.body === "object" ? JSON.stringify(req.body) : req.body) + '\', ' +
            '       \'' + req.headers['user-agent'] + '\', ' +
            '       now()::timestamp, ' +
            '       \'' + clientID + '\', ' +
            '       inet_client_addr()'
        );

        await util.db.pg.doExecuteQuery(conn, query);
        
        util.db.pg.doClose(conn);
        */
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let query: string = (
            'insert into acaAPIGatewayRequest ' +
            'select replace(replace(replace((lower(newid()) + convert(varchar, getdate(), 20)), \'-\', \'\'), \':\', \'\'), \' \', \'\'), ' +
            '       \'' + req.method + '\', ' +
            '       \'' + (req.headers['host'] + req.url) + '\', ' +
            '       \'' + JSON.stringify(req.headers) + '\', ' +
            '       replace(\'' + (typeof req.body === "object" ? JSON.stringify(req.body) : req.body) + '\', \' \', \'\'), ' +
            '       \'' + req.headers['user-agent'] + '\', ' +
            '       getdate(), ' +
            '       ' + (clientID !== null ? ('\'' + clientID + '\'') : null) + ', ' +
            '       \'' + util.doGetIPAddress(req) + '\''
        );
        
        await util.db.mssql.doExecuteQuery(conn, null, 'query', query);

        util.db.mssql.doClose(conn);

        return null;
    }
}