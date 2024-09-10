/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๑๖/๐๑/๒๕๖๖>
Modify date : <๐๖/๐๙/๒๕๖๗>
Description : <>
=============================================
*/

'use strict';

import atob from 'atob';
import btoa from 'btoa';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import mssql from 'mssql';
import pg from 'pg';
import request from 'request';
import ticksToDate from 'ticks-to-date';

import { Schema } from './models/schema';

const { Client } = pg;

dotenv.config();

class DB {
    pg = {
        config: {
            user: process.env.PG_USER,
            password: process.env.PG_PASSWORD,
            host: process.env.PG_HOST,
            database: process.env.PG_DATABASE,
            port: 5432
        },
        async doConnect(): Promise<pg.Client | null> {
            let conn: pg.Client | null = null;
            
            try {
                conn = new Client(this.config);
                await conn.connect();
            }
            catch (error) {
                console.log(error);
                conn = null;
            }
    
            return conn;
        },
        async doExecuteQuery(
            conn: pg.Client | null,
            query: string
        ): Promise<Schema.Result> {
            try {
                if (conn !== null) {
                    let ds: pg.QueryResult<any> = await conn.query(query);
                    let rows: Array<any> = ds.rows;
                    
                    return {
                        conn: conn,
                        statusCode: 200,
                        datas: rows,
                        message: 'ok'
                    };
                }

                return {
                    conn: conn,
                    statusCode: 503,
                    datas: [],
                    message: 'database connection fail'
                };
            } catch (error) {
                return {
                    conn: conn,
                    statusCode: 503,
                    datas: [],
                    message: 'database connection fail'
                };
            }
        },
        doClose(conn: pg.Client | null) {
            if (conn !== null)
                conn.end();
        }
    };
    mssql = {
        config: {
            user: process.env.MSSQL_USER,
            password: process.env.MSSQL_PASSWORD,
            database: process.env.MSSQL_DATABASE,
            server: (process.env.MSSQL_SERVER + ''),
            pool: {
                idleTimeoutMillis: 1000
            },
            options: {
                encrypt: true,
                trustServerCertificate: true
            } 
        },
        async doConnect(database?: string | undefined): Promise<mssql.ConnectionPool | null> {
            let conn: mssql.ConnectionPool | null = null;
            
            try {
                process.env.MSSQL_DATABASE = (database !== undefined ? database : process.env.DATABASE_INFINITY);
                this.config.database = process.env.MSSQL_DATABASE;

                conn = await mssql.connect(this.config);
            }
            catch (error) {
                conn = null;
            }
    
            return conn;
        },
        async doExecuteQuery(
            conn: mssql.ConnectionPool | null,
            connRequest: mssql.Request | null,
            type: string,
            query: string
        ): Promise<Schema.Result> {
            try {
                if (conn !== null) {
                    let ds: mssql.IResult<any> | mssql.IProcedureResult<any> | null = null;
                    let recordset: mssql.IRecordSet<any>[] | { [x: string]: mssql.IRecordSet<any> } | mssql.IProcedureResult<any> = [];
        
                    if (type === 'query') {
                        ds = await conn.request().query(query);
                        recordset = ds.recordset;
                    }

                    if (type === 'procedure') {
                        if (connRequest !== null) {
                            ds = await connRequest.execute(query);
                            recordset = ds.recordset;
                        }
                        else {
                            return {
                                conn: conn,
                                statusCode: 503,
                                datas: [],
                                message: 'database connection fail'
                            }
                        }
                    }
        
                    return {
                        conn: conn,
                        statusCode: 200,
                        datas: recordset,
                        message: 'ok'
                    };
                }

                return {
                    conn: conn,
                    statusCode: 503,
                    datas: [],
                    message: 'database connection fail'
                };    
            } catch (error) {
                return {
                    conn: conn,
                    statusCode: 503,
                    datas: [],
                    message: JSON.stringify(error)
                };
            }
        },
        doClose(conn: mssql.ConnectionPool | null) {
            if (conn !== null)
                conn.close();
        }
    };
}

class Authorization {
    jwtClient = {
        doGetTokenAccess(
            req: Schema.TypeRequest,
            apiKey: string
        ): Promise<Schema.Result> {
            let options: request.CoreOptions = {
                method: 'GET',
                headers: {
                    'content-type': 'application/json',
                    'user-agent': req.headers['user-agent'],
                }   
            };
            
            return new Promise((resolve, reject) => {
                request(('https://jwt.mahidol.ac.th/v1/access/' + apiKey), options, (error: any, result: any) => {
                    if (error === null &&
                        result.statusCode === 200) {
                        let tokenAccessResult: any = JSON.parse(result.body);

                        resolve({
                            statusCode: result.statusCode,
                            status: tokenAccessResult.status,
                            data: tokenAccessResult.tokenAccess
                        });
                    }
                    else
                        reject({
                            statusCode: result.statusCode,
                            status: false,
                            data: null
                        });
                });
            });
        },
        doGetPublicKey(
            req: Schema.TypeRequest,
            tokenAccess: string | null,
            verifyKey: string | null
        ): Promise<string | null> {
            let options: request.CoreOptions = {
                method: 'GET',
                headers: {
                    'content-type': 'text/plain',
                    'user-agent': req.headers['user-agent'],
                    'package': btoa(tokenAccess + '.' + verifyKey)
                }
            };
            
            return new Promise((resolve, reject) => {
                request('https://jwt.mahidol.ac.th/v1/publickeypem', options, (error: any, result: any) => {
                    if (error === null &&
                        result.statusCode === 200)
                        resolve(result.body !== 'get package fail!' ? result.body : null);
                    else
                        reject(null);
                });
            });
        },
        doIsTokenExpired(tokenExpiration: null | undefined): boolean {
            if (tokenExpiration !== undefined &&
                tokenExpiration !== null) {
                let timestamp: any = ticksToDate(tokenExpiration)

                if (timestamp.getTime() < Date.now())
                    return true;

                return false;
            }

            return true;
        },
        async doTokenVerify(
            req: Schema.TypeRequest,
            clientData: Schema.Client
        ): Promise<Schema.Result> {
            let token: any = ((req.headers.token !== undefined) && (req.headers.token.length !== 0) ? req.headers.token : null);
            let CUIDs: Array<string> | null = null;
            let status: boolean = true;
            let statusCode: number = 200;
            let payload: any = null;
            let message: string = 'ok';

            if (token !== null) {
                CUIDs = token.trim().split('|');

                if (CUIDs !== null &&
                    CUIDs.length === 2) {
                    let tokenAccess: string = CUIDs[0];
                    let publicKey: string | null = await this.doGetPublicKey(req, tokenAccess, clientData.verifyKey);

                    if (publicKey !== null) {
                        try {
                            payload = jwt.verify(tokenAccess, publicKey, { algorithms: ['RS512'] });

                            if (payload !== null) {
                                let jwtPayload: jwt.JwtPayload = payload;

                                if (jwtPayload.SystemKey !== undefined &&
                                    jwtPayload.SystemKey !== null &&
                                    jwtPayload.Exp !== undefined) {
                                    if (this.doIsTokenExpired(payload.Exp) === true) {
                                        status = false;
                                        statusCode = 401;
                                        payload = null;
                                        message = 'token expired';
                                    }
                                }
                                else {
                                    status = false
                                    statusCode = 401;
                                    payload = null;
                                    message = 'unauthorized';
                                }
                            }
                        }
                        catch (err: any) {
                            status = false;
                            statusCode = 401;
                            message = err.message;
                        }
                    }
                    else {
                        status = false;
                        statusCode = 401;
                        message = 'unauthorized';
                    }
                }
                else {
                    status = false;
                    statusCode = 401;
                    message = 'unauthorized';
                }
            }
            else {
                status = false;
                statusCode = 401;
                message = 'unauthorized';
            }
            
            return {
                status: status,
                statusCode: statusCode,
                message: message
            };
        },
        async doTokenInfo(
            req: Schema.TypeRequest,
            clientData: Schema.Client
        ): Promise<Schema.Result> {
            let authorization: string | undefined = req.headers.authorization;
            let clientID: string | null = null;
            let statusCode: number = 200;
            let payload: any = null;
            let message: string = 'ok';

            if (authorization !== undefined) {
                if (authorization.startsWith("Bearer ")) {
                    let token: string = authorization.substring("Bearer ".length).trim()
                    let tokenVerifiedResult: Schema.Result;

                    req.headers.token = token;
                    tokenVerifiedResult = await this.doTokenVerify(req, clientData);
                    
                    if (tokenVerifiedResult.status === true &&
                        tokenVerifiedResult.statusCode === 200) {
                        let CUIDs: Array<string> | null = authorization.substring("Bearer ".length).trim().split('|');
                        
                        payload = jwt.decode(CUIDs[0]); 
                        clientID = CUIDs[1];
                        clientID = atob(clientID.split('').reverse().join(''));
                    }
                    else {
                        statusCode = tokenVerifiedResult.statusCode;
                        message = (tokenVerifiedResult.message + '');
                    }
                }
                else {
                    statusCode = 401;
                    message = 'unauthorized';
                }
            }
            else {
                statusCode = 401;
                message = 'unauthorized';
            }
            
            return {
                statusCode: statusCode,
                data: {
                    payload: payload,
                    clientID: clientID
                },
                message: message
            };
        }
    }
}

export class Util {
    db: DB = new DB();
    authorization: Authorization = new Authorization();

    doAPIMessage(result: Schema.Result): Schema.Result {
        return {
            status: result.status,
            statusCode: result.statusCode,
            data: result.data,
            message: (result.message !== null ? result.message : (result.statusCode === 200 ? 'ok' : null))
        };
    }
    
    doGenerateRandAlphaNumStr(len: number = 10): string {
        let chars: string = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz';
        let result: string = '';
        let i: number = 0;
        let rnum: number = 0;

        for (i = 0; i < len; i++) {
            rnum = Math.floor(Math.random() * chars.length);
            result += chars.substring(rnum, rnum + 1);
        }

        return result;
    }
    
    doSetCUID(datas: Array<string>): string {
        let randAlphaNumStr: string = this.doGenerateRandAlphaNumStr(20);

        return (
            btoa(
                (btoa(randAlphaNumStr).split('').reverse().join('')) + '.' +
                (randAlphaNumStr.split('').reverse().join('')) + '.' +
                (btoa(datas.join('.')).split('').reverse().join(''))
            )
        );
    }
    
    doParseCUID(str: string): Array<string> | null {
        try {
            let strDecode: string = atob(str);
            let strDecodes: Array<string> = strDecode.split('.');
            let data: string = strDecodes[2];
            let dataReverse: string = data.split('').reverse().join('');
            let dataReverseDecode: string = atob(dataReverse);
            let dataReverseDecodes: Array<string> = dataReverseDecode.split('.');

            return dataReverseDecodes;
        }
        catch {
            return null;
        }
    }

    doRequestGraphql(
        req: Schema.TypeRequest,
        url: string | null,
        route: string | null,
        rootValue: string
    ): Promise<Schema.Result> {
        let query: {} | null = null;
        let options: request.CoreOptions = {
            method: "GET",
            headers: { "Content-Type": "application/json" }
        };

        if (JSON.stringify(req.body) !== '{}')
            query = {
                query: ('query {' + req.body + '}')
            };

        if (query !== null)
            options.body = JSON.stringify(query);

        if (url === null &&
            route !== null)
            url = ('http://' + process.env.HOST + ':' + process.env.PORT + '/' + route);

        return new Promise((resolve, reject) => {
            request((url !== null ? url : ''), options, (error: any, result: any) => {
                if (error === null &&
                    result.statusCode === 200) {
                    let graphqlResult: any = JSON.parse(result.body);
                    let requestResult: Schema.Result = {
                        statusCode: 200,
                        data: null,
                        message: null
                    };

                    if (graphqlResult.data !== undefined &&
                        graphqlResult.data[rootValue] !== null)
                        requestResult.data = graphqlResult.data[rootValue];
                    else {
                        try {
                            let errorResult: Schema.Result = JSON.parse(graphqlResult.errors[0].message);

                            requestResult = {
                                statusCode: errorResult.statusCode,
                                data: errorResult.data,
                                message: errorResult.message
                            };
                        }
                        catch {
                            requestResult = {
                                statusCode: 400,
                                data: null,
                                message: graphqlResult.errors
                            };
                        }
                    }

                    resolve(requestResult);
                }
                else
                    reject({
                        statusCode: result.statusCode,
                        data: null,
                        message: result.statusMessage
                    });
            });
        });
    }

    doIsStringEmpty(val: string | undefined | null): boolean {
        if (val !== undefined &&
            val !== null)
            return (val.length === 0)
           
        return true;
    }

    doGetString(val: string | undefined | null): string | null {
        return (this.doIsStringEmpty(val) === false ? String(val) : null)
    }

    doGetStringNumber(
        val: any,
        fixed: number
    ): string | null {
        return (this.doIsStringEmpty(val) === false ? String(val.toFixed(fixed)) : null);
    }

    doGetStringDate(
        val: any,
        locale: string
    ): string | null {
        return (this.doIsStringEmpty(val) === false ? String(val.toLocaleDateString(locale)) : null);
    }

    doGetIPAddress(req: Schema.TypeRequest): string {
        let ip: string | undefined = (req.headers['x-forwarded-for'] as string || '').split(',')[0] || req.socket.remoteAddress?.toString().split(':').pop();

        if (ip === '1' ||
            ip == undefined)
            ip = '127.0.0.1';
        
        return ip;
    }
}