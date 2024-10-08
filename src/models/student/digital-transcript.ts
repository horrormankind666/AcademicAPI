/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๐๕/๒๕๖๖>
Modify date : <๐๔/๑๐/๒๕๖๗>
Description : <>
=============================================
*/

'use strict';

import mssql from 'mssql';

import { Util } from '../../util';
import { Schema } from '../schema';

const util: Util = new Util();

export class DigitalTranscriptModel {
    async doGetFooter(studentCode: string | undefined): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let connRequest: mssql.Request | null = null;

        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
        }

        let footerResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_grdGetFooter');

        if (conn !== null &&
            footerResult.statusCode === 200) {
            if (util.doIsEmpty(footerResult.datas) === false) {
                let footerDatas: Array<any> = { ...footerResult.datas };
                let footerData: any = { ...footerDatas[0] };

                footerResult.data = <Schema.Student.DigitalTranscript.Footer>{
                    studentCode: util.doGetString(footerData.studentCode),
                    fullname: {
                        title: {
                            code: util.doGetString(footerData.titleCode),
                            fullname: {
                                th: util.doGetString(footerData.titleNameTH),
                                en: util.doGetString(footerData.titleNameEN)
                            }
                        },
                        firstName: {
                            th: util.doGetString(footerData.firstNameTH),
                            en: util.doGetString(footerData.firstNameEN)
                        },
                        lastName: {
                            th: util.doGetString(footerData.lastNameTH),
                            en: util.doGetString(footerData.lastNameEN)
                        }
                    },
                    IDCard: util.doGetString(footerData.IDCard),
                    gender: {
                        fullname: {
                            th: util.doGetString(footerData.genderNameTH),
                            en: util.doGetString(footerData.genderNameEN)
                        },
                        initials: util.doGetString(footerData.gender)
                    },
                    birthDate: {
                        th: util.doGetString(footerData.birthDateTH),
                        en: util.doGetString(footerData.birthDateEN)
                    },
                    nationality: {
                        code: util.doGetString(footerData.nationalityCode),
                        name: {
                            th: util.doGetString(footerData.nationalityNameTH),
                            en: util.doGetString(footerData.nationalityNameEN)
                        }
                    },
                    email: footerData.email,
                    degree: {
                        level: util.doGetString(footerData.degree),
                        name: {
                            th: util.doGetString(footerData.degreeNameTH),
                            en: util.doGetString(footerData.degreeNameEN)
                        }
                    },
                    faculty: {
                        code: util.doGetString(footerData.facultyCode),
                        name: {
                            th: util.doGetString(footerData.FacultyNameTH),
                            en: {
                                default: util.doGetString(footerData.facultyNameEN),
                                other: util.doGetString(footerData.facultyNameEN1)
                            }
                        }
                    },
                    program: {
                        code: util.doGetString(footerData.programCode),
                        name: {
                            th: util.doGetString(footerData.programNameTH),
                            en: util.doGetString(footerData.programNameEN)
                        },
                        year: util.doGetString(footerData.programYear),
                        type: util.doGetString(footerData.programType)
                    },
                    major: {
                        code: util.doGetString(footerData.majorCode),
                        name: {
                            th: util.doGetString(footerData.majorNameTH),
                            en: util.doGetString(footerData.majorNameEN)
                        }
                    },
                    groupNum: util.doGetString(footerData.groupNum),
                    interProgram: {
                        name: {
                            th: util.doGetString(footerData.interProgramTH),
                            en: util.doGetString(footerData.interProgramEN)
                        }
                    },
                    studentStatus: util.doGetString(footerData.studentStatus),
                    admissionDate: {
                        th: util.doGetString(footerData.admissionDateTH),
                        en: util.doGetString(footerData.admissionDateEN)
                    },
                    graduateDate: {
                        th: util.doGetString(footerData.graduateDateTH),
                        en: util.doGetString(footerData.graduateDateEN)
                    },
                    graduateYear: util.doGetString(footerData.graduateYear),
                    currentYear: util.doGetString(footerData.currentYear),
                    lastYear: util.doGetString(footerData.lastYear),
                    distinction: util.doGetString(footerData.distinction),
                    quotaCode: util.doGetString(footerData.quotaCode),
                    BM: {
                        name: {
                            th: {
                                1: util.doGetString(footerData.bmNameTH),
                                2: util.doGetString(footerData.bmNameTH2)
                            }
                        }
                    },
                    passedEnglishExam: util.doGetString(footerData.passedEnglishExam),
                    txtStudentPassed: {
                        th: util.doGetString(footerData.txtStudentPassedTH),
                        en: util.doGetString(footerData.txtStudentPassedEN)
                    },
                    praticeHrs: {
                        th: util.doGetString(footerData.praticeHrsTH),
                        en: null
                    }
                };
            }
        }

        util.db.mssql.doClose(conn);

        return {
            conn: conn,
            statusCode: footerResult.statusCode,
            data: (util.doIsEmpty(footerResult.data) === false ? footerResult.data : null),
            message: footerResult.message
        };
    }

    async doGetAdditionalInformation(
        lang: string | undefined,
        studentCode: string | undefined
    ): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let connRequest: mssql.Request | null = null;

        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
        }

        let additionalInformationResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', ('sp_grdGetAdditionalInformation' + lang?.toUpperCase()));

        if (conn !== null &&
            additionalInformationResult.statusCode === 200) {
            if (util.doIsEmpty(additionalInformationResult.datas) === false) {
                let additionalInformationDatas: Array<any> = { ...additionalInformationResult.datas };
                let additionalInformationData: any = { ...additionalInformationDatas[0] };

                additionalInformationResult.data = <Schema.Student.DigitalTranscript.AdditionalInformation>{
                    studentCode: util.doGetString(additionalInformationData.studentCode),
                    hons: util.doGetString(additionalInformationData.hons),
                    thesisTitle: null
                };
            }
        }

        util.db.mssql.doClose(conn);

        return {
            conn: conn,
            statusCode: additionalInformationResult.statusCode,
            data: (util.doIsEmpty(additionalInformationResult.data) === false ? additionalInformationResult.data : null),
            message: additionalInformationResult.message
        };
    }

    async doGetGPAInfo(
        studentCode: string | undefined,
        quarter: string | undefined
    ): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let connRequest: mssql.Request | null = null;

        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
            connRequest.input('quarter', quarter);
        }

        let gpaInfoResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_grdGetGPAInfo');

        if (conn !== null &&
            gpaInfoResult.statusCode === 200) {
            if (util.doIsEmpty(gpaInfoResult.datas) === false) {
                let gpaInfoDatas: Array<any> = { ...gpaInfoResult.datas };
                let gpaInfoData: any = { ...gpaInfoDatas[0] };

                gpaInfoResult.data = <Schema.Student.DigitalTranscript.GPAInfo>{
                    studentCode: util.doGetString(gpaInfoData.studentCode),
                    semester: util.doGetString(gpaInfoData.semester),
                    currentYear: util.doGetString(gpaInfoData.currentYear),
                    programCode: util.doGetString(gpaInfoData.programCode),
                    majorCode: util.doGetString(gpaInfoData.majorCode),
                    groupNum: util.doGetString(gpaInfoData.groupNum),
                    subjectCount: util.doGetString(gpaInfoData.subjectCount),
                    sCredit: {
                        regis: util.doGetString(gpaInfoData.sCreditRegis),
                        earn: util.doGetString(gpaInfoData.sCreditEarn),
                        compute: util.doGetString(gpaInfoData.sCreditCompute),
                        product: util.doGetStringNumber(gpaInfoData.sProduct, 2),
                        gpa: util.doGetStringNumber(gpaInfoData.sGPA, 2),
                    },
                    cCredit: {
                        regis: util.doGetString(gpaInfoData.cCreditRegis),
                        earn: util.doGetString(gpaInfoData.cCreditEarn),
                        compute: util.doGetString(gpaInfoData.cCreditCompute),
                        product: util.doGetStringNumber(gpaInfoData.cProduct, 2),
                        gpa: util.doGetStringNumber(gpaInfoData.cGPA, 2),
                    },
                    studentStatus: util.doGetString(gpaInfoData.studentStatus),
                    flag: util.doGetString(gpaInfoData.flag),
                    gradeFlag: util.doGetString(gpaInfoData.gradeFlag),
                    leaveSts: util.doGetString(gpaInfoData.leaveStatus),
                    probationCode: util.doGetString(gpaInfoData.probationCode)
                }
            }
        }

        util.db.mssql.doClose(conn);

        return {
            conn: conn,
            statusCode: gpaInfoResult.statusCode,
            data: (util.doIsEmpty(gpaInfoResult.data) === false ? gpaInfoResult.data : null),
            message: gpaInfoResult.message
        };
    }

    async doGetListGPAStatus(studentCode: string | undefined): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let connRequest: mssql.Request | null = null;

        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
        }

        let gpaStatusResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_grdGetListGPAStatus');

        if (conn !== null &&
            gpaStatusResult.statusCode === 200) {
            if (util.doIsEmpty(gpaStatusResult.datas) === false) {
                let gpaStatusDatas: Array<any> = { ...gpaStatusResult.datas };

                gpaStatusResult.data = new Array<Schema.Student.DigitalTranscript.GPAStatus>;

                gpaStatusDatas.forEach((gpaStatusData) => {
                    gpaStatusResult.data.push(<Schema.Student.DigitalTranscript.GPAStatus>{
                        educationTypeSystem: util.doGetString(gpaStatusData.educationTypeSystem),
                        year: util.doGetString(gpaStatusData.year),
                        semester: {
                            name: util.doGetString(gpaStatusData.semesterName),
                            credit: {
                                earned: util.doGetString(gpaStatusData.semesterCreditEarned),
                                value: util.doGetString(gpaStatusData.semesterCreditValue),
                                calculated: util.doGetString(gpaStatusData.semesterCreditCalculated)
                            },
                            pointEarned: util.doGetString(gpaStatusData.semesterPointEarned),
                            gpa: util.doGetStringNumber(gpaStatusData.semesterGPA, 2),
                            gpax: util.doGetStringNumber(gpaStatusData.semesterGPAX, 2),
                            status: util.doGetString(gpaStatusData.semesterStatus)
                        },
                        remark: util.doGetString(gpaStatusData.remark),
                        line: {
                            one: util.doGetString(gpaStatusData.lineOne)
                        }
                    });
                });
            }
        }

        util.db.mssql.doClose(conn);

        return {
            conn: conn,
            statusCode: gpaStatusResult.statusCode,
            data: (util.doIsEmpty(gpaStatusResult.data) === false ? gpaStatusResult.data : null),
            message: gpaStatusResult.message
        };
    }

    async doGetListSubjectRegistration(
        lang: string | undefined,
        studentCode: string | undefined,
        quarter: string | undefined
    ): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let connRequest: mssql.Request | null = null;

        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
            connRequest.input('quarter', quarter);
        }

        let subjectRegistrationResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', ('sp_grdGetListSubjectRegistration' + lang?.toUpperCase()));

        if (conn !== null &&
            subjectRegistrationResult.statusCode === 200) {
            if (util.doIsEmpty(subjectRegistrationResult.datas) === false) {
                let subjectRegistrationDatas: Array<any> = { ...subjectRegistrationResult.datas };

                subjectRegistrationResult.data = new Array<Schema.Student.DigitalTranscript.SubjectRegistration>;

                subjectRegistrationDatas.forEach((subjectRegistrationData) => {
                    subjectRegistrationResult.data.push(<Schema.Student.DigitalTranscript.SubjectRegistration>{
                        course: {
                            number: util.doGetString(subjectRegistrationData.courseNumber),
                            title: {
                                default: util.doGetString(subjectRegistrationData.courseTitle),
                                th: util.doGetString(subjectRegistrationData.courseTitleTH),
                                en: util.doGetString(subjectRegistrationData.courseTitleEN)
                            },
                            credit: {
                                earned: util.doGetString(subjectRegistrationData.courseCreditEarned),
                                value: util.doGetString(subjectRegistrationData.courseCreditValue)
                            },
                            academic: {
                                grade: {
                                    number: util.doGetStringNumber(subjectRegistrationData.courseAcademicGrade, 2),
                                    text: util.doGetString(subjectRegistrationData.courseAcademicGradeText)
                                }
                            },
                            pointEarned: util.doGetStringNumber(subjectRegistrationData.coursePointEarned, 2),
                            transferCode: null,
                        },
                        typeCode: util.doGetString(subjectRegistrationData.typeCode),
                        educationTypeSystem: util.doGetString(subjectRegistrationData.educationTypeSystem),
                        semester: {
                            name: util.doGetString(subjectRegistrationData.semesterName)
                        },
                        year: util.doGetString(subjectRegistrationData.year),
                        organization: {
                            name: null
                        },
                        program: {
                            name: null
                        }
                    });
                });
            }
        }

        util.db.mssql.doClose(conn);

        return {
            conn: conn,
            statusCode: subjectRegistrationResult.statusCode,
            data: (util.doIsEmpty(subjectRegistrationResult.data) === false ? subjectRegistrationResult.data : null),
            message: subjectRegistrationResult.message
        };
    }

    async doGetListSubjectTransfer(studentCode: string | undefined): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let connRequest: mssql.Request | null = null;

        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
        }

        let subjectTransferResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_grdGetListSubjectTransfer');

        if (conn !== null &&
            subjectTransferResult.statusCode === 200) {
            if (util.doIsEmpty(subjectTransferResult.datas) === false) {
                let subjectTransferDatas: Array<any> = { ...subjectTransferResult.datas };

                subjectTransferResult.data = new Array<Schema.Student.DigitalTranscript.SubjectRegistration>;

                subjectTransferDatas.forEach((subjectTransferData) => {
                    subjectTransferResult.data.push(<Schema.Student.DigitalTranscript.SubjectRegistration>{
                        course: {
                            number: util.doGetString(subjectTransferData.courseNumber),
                            title: {
                                default: util.doGetString(subjectTransferData.courseTitle),
                                th: util.doGetString(subjectTransferData.courseTitleTH),
                                en: util.doGetString(subjectTransferData.courseTitleEN)
                            },
                            credit: {
                                earned: util.doGetString(subjectTransferData.courseCreditEarned),
                                value: util.doGetString(subjectTransferData.courseCreditValue)
                            },
                            academic: {
                                grade: {
                                    number: util.doGetStringNumber(subjectTransferData.courseAcademicGrade, 2),
                                    text: util.doGetString(subjectTransferData.courseAcademicGradeText)
                                }
                            },
                            pointEarned: util.doGetStringNumber(subjectTransferData.coursePointEarned, 2),
                            transferCode: util.doGetString(subjectTransferData.courseTransferCode),
                        },
                        typeCode: util.doGetString(subjectTransferData.typeCode),
                        educationTypeSystem: util.doGetString(subjectTransferData.educationTypeSystem),
                        semester: {
                            name: util.doGetString(subjectTransferData.semesterName)
                        },
                        year: util.doGetString(subjectTransferData.year),
                        organization: {
                            name: util.doGetString(subjectTransferData.organizationName)
                        },
                        program: {
                            name: util.doGetString(subjectTransferData.programName)
                        }
                    });
                });
            }
        }

        util.db.mssql.doClose(conn);

        return {
            conn: conn,
            statusCode: subjectTransferResult.statusCode,
            data: (util.doIsEmpty(subjectTransferResult.data) === false ? subjectTransferResult.data : null),
            message: subjectTransferResult.message
        };
    }

    async doGetRegistrar(): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let connRequest: mssql.Request | null = null;

        if (conn !== null)
            connRequest = conn.request();

        let registrarResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_grdGetRegistrar');

        if (conn !== null &&
            registrarResult.statusCode === 200) {
            if (util.doIsEmpty(registrarResult.datas) === false) {
                let registrarDatas: Array<any> = { ...registrarResult.datas };
                let registrarData: any = { ...registrarDatas[0] };

                registrarResult.data = <Schema.Student.DigitalTranscript.Registrar>{
                    ID: util.doGetString(registrarData.ID),
                    fullname: util.doGetString(registrarData.fullNameEN),
                    name: util.doGetString(registrarData.fullNameTH),
                    rposition: util.doGetString(registrarData.rPosition),
                    title: util.doGetString(registrarData.title),
                    dlevel: util.doGetString(registrarData.dLevel),
                    active: util.doGetString(registrarData.active)
                };
            }
        }

        util.db.mssql.doClose(conn);

        return {
            conn: conn,
            statusCode: registrarResult.statusCode,
            data: (util.doIsEmpty(registrarResult.data) === false ? registrarResult.data : null),
            message: registrarResult.message
        };
    }

    async doGetListSemesterStudent(studentCode: string | undefined): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let connRequest: mssql.Request | null = null;

        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
        }

        let semesterStudentResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_grdGetSemesterStudent');

        if (conn !== null &&
            semesterStudentResult.statusCode === 200) {
            if (util.doIsEmpty(semesterStudentResult.datas) === false) {
                let semesterStudentDatas: Array<any> = { ...semesterStudentResult.datas };

                semesterStudentResult.data = new Array<Schema.Student.DigitalTranscript.SemesterStudent>;

                semesterStudentDatas.forEach((semesterStudentData) => {
                    semesterStudentResult.data.push(<Schema.Student.DigitalTranscript.SemesterStudent>{
                        semester: {
                            code: util.doGetString(semesterStudentData.semester),
                            name: {
                                th: util.doGetString(semesterStudentData.semesterTH)
                            }
                        }
                    });
                });
            }
        }

        util.db.mssql.doClose(conn);
        
        return {
            conn: conn,
            statusCode: semesterStudentResult.statusCode,
            data: (util.doIsEmpty(semesterStudentResult.data) === false ? semesterStudentResult.data : null),
            message: semesterStudentResult.message
        };
    }

    async doGetProfileStudent(
        lang: string | undefined,
        studentCode: string | undefined
    ): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let connRequest: mssql.Request | null = null;

        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
        }

        let profileStudentResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', ('sp_grdGetProfileStudent' + lang?.toUpperCase()));

        if (conn !== null &&
            profileStudentResult.statusCode === 200) {
            if (util.doIsEmpty(profileStudentResult.datas) === false) {
                let profileStudentDatas: Array<any> = { ...profileStudentResult.datas };
                let profileStudentData: any = { ...profileStudentDatas[0] };

                profileStudentResult.data = <Schema.Student.DigitalTranscript.ProfileStudent>{
                    dataSubjectID: {
                        studentID: util.doGetString(profileStudentData.dataSubjectIDStudentID),
                        nidn: util.doGetString(profileStudentData.dataSubjectIDNIDN),
                        ccpt: util.doGetString(profileStudentData.dataSubjectIDCCPT),
                    },
                    namePrefix: {
                        th: util.doGetString(profileStudentData.namePrefixTH),
                        en: util.doGetString(profileStudentData.namePrefixEN)
                    },
                    givenName: {
                        default: util.doGetString(profileStudentData.givenName),
                        th: util.doGetString(profileStudentData.givenNameTH),
                        en: util.doGetString(profileStudentData.givenNameEN)
                    },
                    middleName: {
                        th: util.doGetString(profileStudentData.middleNameTH),
                        en: util.doGetString(profileStudentData.middleNameEN)
                    },
                    familyName: {
                        th: util.doGetString(profileStudentData.familyNameTH),
                        en: util.doGetString(profileStudentData.familyNameEN)
                    },
                    gender: util.doGetString(profileStudentData.gender),
                    birthDate: util.doGetStringDate(profileStudentData.birthDate, 'en-GB'),
                    nationality: util.doGetString(profileStudentData.nationality),
                    countryCode: util.doGetString(profileStudentData.residentCountryOrTerritoryCode),
                    personImage: util.doGetString(profileStudentData.personImage),
                    faculty: {
                        name: util.doGetString(profileStudentData.facultyName)
                    },
                    program: {
                        ID: util.doGetString(profileStudentData.programID),
                        name: util.doGetString(profileStudentData.programName)
                    },
                    major: util.doGetString(profileStudentData.major),
                    minor: util.doGetString(profileStudentData.minor),
                    degree: util.doGetString(profileStudentData.degree),
                    dateOfAdmission: util.doGetStringDate(profileStudentData.dateOfAdmission, 'en-GB'),
                    dateOfGraduation: util.doGetStringDate(profileStudentData.dateOfGraduation, 'en-GB'),
                    creditsTranferred: util.doGetString(profileStudentData.creditsTranferred),
                    organization: {
                        ID: util.doGetString(profileStudentData.organizationID),
                        name: util.doGetString(profileStudentData.organizationName)
                    },
                    building: {
                        number: util.doGetString(profileStudentData.buildingNumber),
                        name: util.doGetString(profileStudentData.buildingName)
                    },
                    street: {
                        name: util.doGetString(profileStudentData.streetName),
                        additional: util.doGetString(profileStudentData.additionalStreetName)
                    },
                    city: {
                        ID: null,
                        name: util.doGetString(profileStudentData.cityName),
                        subDivision: {
                            ID: null,
                            name: util.doGetString(profileStudentData.citySubDivisionName)
                        }
                    },
                    country: {
                        code: util.doGetString(profileStudentData.countryCode),
                        subDivision: {
                            code: util.doGetString(profileStudentData.countrySubDivisionCode),
                            name: util.doGetString(profileStudentData.countrySubDivisionName)
                        }
                    },
                    postcode: util.doGetString(profileStudentData.postcode),
                    schoolLevel: util.doGetString(profileStudentData.schoolLevel),
                    status: {
                        code: util.doGetString(profileStudentData.statusCode),
                        name: {
                            th: util.doGetString(profileStudentData.statusNameTH),
                            en: util.doGetString(profileStudentData.statusNameEN),
                            group: util.doGetString(profileStudentData.statusGroup)
                        }
                    }
                };
            }
        }

        util.db.mssql.doClose(conn);

        return {
            conn: conn,
            statusCode: profileStudentResult.statusCode,
            data: (util.doIsEmpty(profileStudentResult.data) === false ? profileStudentResult.data : null),
            message: profileStudentResult.message
        };
    }

}