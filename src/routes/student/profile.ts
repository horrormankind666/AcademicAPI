/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๐๕/๒๕๖๖>
Modify date : <๑๐/๐๕/๒๕๖๖>
Description : <>
=============================================
*/

'use strict';

import dotenv from 'dotenv';
import express, { Response, NextFunction, Router } from 'express';

import { Util } from '../../util';
import { Schema } from '../../models/schema';

const router: Router = express.Router();
const util: Util = new Util();

dotenv.config();

router.get('/Get', async(req: Schema.TypeRequest, res: Response, next: NextFunction) => {
    let profileResult: Schema.Result = await util.doRequestGraphql(req, null, 'Graphql/Student/Profile/Get', 'profile');

    res.send(util.doAPIMessage(profileResult));
});

export default router;