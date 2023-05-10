/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๑/๐๒/๒๕๖๖>
Modify date : <๐๙/๐๕/๒๕๖๖>
Description : <>
=============================================
*/

'use strict';

import { buildSchema } from 'graphql';
import express, { Response, NextFunction, Router } from 'express';
import { graphqlHTTP } from 'express-graphql';

import { Schema } from '../../models/schema';
import { ProfileModel as StudentProfileModel } from '../../models/student/profile';

const router: Router = express.Router();
const student = {
    profileModel: new StudentProfileModel()
};

router.get('/Get', (req: Schema.TypeRequest, res: Response, next: NextFunction) => {   
    let schema = buildSchema(`
        type Language {
            th: String
            en: String
        }

        type Name {
            name: Language
        }

        type TitlePrefix {
            fullname: Language
            initials: Language
        }

        type FullName {
            title: TitlePrefix
            firstName: Language
            middleName: Language
            lastName: Language
        }

        type Personal {
            fullname: FullName
            email: String
        }

        type Program {
            ID: String
            code: String
            name: Language
        }

        type Profile {
            studentCode: String!
            faculty: Name
            program: Program
            yearEntry: String
            yearGraduate: String
            entranceType: Name
            statusType: Name
            personal: Personal
        }
    
        type Query {
            profile(studentCode: String): Profile
        }
    `);
    let profile = async(args: { studentCode: string | undefined }): Promise<Schema.Student.Profile | string | undefined> => {
        let profileResult: Schema.Result = await student.profileModel.doGet(args.studentCode);

        if (profileResult.conn !== null &&
            profileResult.statusCode === 200) {
            if (profileResult.data !== null) {
                return JSON.parse(JSON.stringify(profileResult.data, (key: any, value) =>
                    ((value === null || value === undefined)  ? '' : value)
                ));
            }
        }

        throw new Error(JSON.stringify({
            statusCode: profileResult.statusCode,
            data: null,
            message: profileResult.message
        }));
    };

    return graphqlHTTP({
        schema: schema,
        rootValue: {
            profile
        },
        graphiql: true
    })(req, res);
});

export default router;