/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๒/๐๒/๒๕๖๖>
Modify date : <๐๒/๐๒/๒๕๖๖>
Description : <>
=============================================
*/

'use strict';

import pg from 'pg';

import { Util } from '../util';
import { Schema } from './schema';

const util: Util = new Util();

export class RequestModel {
    async doSet(
        req: Schema.TypeRequest,
        clientID: string | null
    ): Promise<null> {
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

        return null;
    }
}