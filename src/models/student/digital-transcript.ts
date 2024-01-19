/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๐๙/๐๕/๒๕๖๖>
Modify date : <๑๙/๐๑/๒๕๖๗>
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
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect(process.env.DATABASE_MUGRADING);
        let connRequest: mssql.Request | null = null;
        
        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
        }
        
        let footerResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_grdGetFooter');

        if (conn !== null &&
            footerResult.statusCode === 200) {
            if (footerResult.datas.length !== 0) {
                let footerDatas: Array<any> = footerResult.datas;
                let footerData: any = Object.assign({}, footerDatas[0]);

                footerResult.data = <Schema.Student.DigitalTranscript.Footer> {
                    studentCode: util.doGetString(footerData.StudentCode),
                    fullname: {
                        title: {
                            code: util.doGetString(footerData.TitleCode),
                            fullname: {
                                th: util.doGetString(footerData.TitleTName),
                                en: util.doGetString(footerData.TitleEName)
                            }
                        },
                        firstName: {
                            th: util.doGetString(footerData.ThaiFName),
                            en: util.doGetString(footerData.FirstName)
                        },
                        lastName: {
                            th: util.doGetString(footerData.ThaiLName),
                            en: util.doGetString(footerData.LastName)
                        }
                    },
                    IDCard: util.doGetString(footerData.idCard),
                    gender: {
                        fullname: {
                            th: util.doGetString(footerData.SexNameTh),
                            en: util.doGetString(footerData.SexNameEn)
                        },
                        initials: util.doGetString(footerData.Gender)
                    },
                    birthDate: {
                        th: util.doGetString(footerData.BThaiDate),
                        en: util.doGetString(footerData.BDate)
                    },
                    nationality: {
                        code: util.doGetString(footerData.NationalityCode),
                        name: {
                            th: util.doGetString(footerData.NationalityTname),
                            en: util.doGetString(footerData.NationalityEname)
                        }
                    },
                    email: footerData.Email,
                    degree: {
                        level: util.doGetString(footerData.Degree),
                        name: {
                            th: util.doGetString(footerData.DegreeTName),
                            en: util.doGetString(footerData.DegreeEName)
                        }
                    },
                    faculty: {
                        code: util.doGetString(footerData.facultyCode),
                        name: {
                            th: util.doGetString(footerData.FactTName),
                            en: {
                                default: util.doGetString(footerData.FactEName),
                                other: util.doGetString(footerData.FactEName1)
                            }
                        }
                    },
                    program: {
                        code: util.doGetString(footerData.ProgramCode),
                        name: {
                            th: util.doGetString(footerData.progNameTh),
                            en: util.doGetString(footerData.progNameEn)
                        },
                        year: util.doGetString(footerData.ProgYear),
                        type: util.doGetString(footerData.ProgramType)
                    },
                    major: {
                        code: util.doGetString(footerData.MajorCode),
                        name: {
                            th: util.doGetString(footerData.MajorTName),
                            en: util.doGetString(footerData.MajorEName)
                        }
                    },
                    groupNum: util.doGetString(footerData.GroupNum),
                    interProgram: {
                        name: {
                            th: util.doGetString(footerData.interProgramTh),
                            en: util.doGetString(footerData.interProgram)
                        }
                    },
                    studentStatus: util.doGetString(footerData.StudentStatus),
                    admissionDate: {
                        th: util.doGetString(footerData.admissionDateTh),
                        en: util.doGetString(footerData.admissionDateEn)
                    },
                    graduateDate: {
                        th: util.doGetString(footerData.graduateDateTh),
                        en: util.doGetString(footerData.GDate)
                    },
                    currentYear: util.doGetString(footerData.CurrentYear),
                    lastYear: util.doGetString(footerData.LastYear),
                    distinction: util.doGetString(footerData.Distinction),
                    gradYear: util.doGetString(footerData.GradYear),
                    quotaCode: util.doGetString(footerData.QuotaCode),
                    BM: {
                        name: {
                            th: {
                                1: util.doGetString(footerData.BMTName),
                                2: util.doGetString(footerData.BMTName2)
                            }
                        }
                    },
                    passedEnglishExam: util.doGetString(footerData.passedEnglishExam),
                    txtStudentPassed: {
                        th: util.doGetString(footerData.txtStudentPassedTh),
                        en: util.doGetString(footerData.txtStudentPassedEn)
                    },
                    praticeHrs: {
                        th: util.doGetString(footerData.PraticeHrsTh),
                        en: null
                    }
                };
            }
        }

        util.db.mssql.doClose(conn);
        
         return {
            conn: conn,
            statusCode: footerResult.statusCode,
            data: (footerResult.data !== undefined ? footerResult.data : null),
            message: footerResult.message
        };
    }

    async doGetAdditionalInformation(
        lang: string | undefined,
        studentCode: string | undefined
    ): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect(process.env.DATABASE_MUGRADING);
        let connRequest: mssql.Request | null = null;
        
        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
        }

        let additionalInformationResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', ('sp_grdAdditionalInformation_' + lang));

        if (conn !== null &&
            additionalInformationResult.statusCode === 200) {
            if (additionalInformationResult.datas.length !== 0) {
                let additionalInformationDatas: Array<any> = additionalInformationResult.datas;
                let additionalInformationData: any = Object.assign({}, additionalInformationDatas[0]);

                additionalInformationResult.data = <Schema.Student.DigitalTranscript.AdditionalInformation> {
                    studentCode: util.doGetString(additionalInformationData.studentCode),
                    hons: util.doGetString(additionalInformationData.Hons),
                    thesisTitle: null
                };
            }
        }

        util.db.mssql.doClose(conn);
        
         return {
            conn: conn,
            statusCode: additionalInformationResult.statusCode,
            data: (additionalInformationResult.data !== undefined ? additionalInformationResult.data : null),
            message: additionalInformationResult.message
        };
    }

    async doGetGPAInfo(
        studentCode: string | undefined,
        quarter: string | undefined
    ): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect(process.env.DATABASE_MUGRADING);
        let connRequest: mssql.Request | null = null;
        
        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
            connRequest.input('quarter', quarter);
        }

        let gpaInfoResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_grdGetGPAInfo');

        if (conn !== null &&
            gpaInfoResult.statusCode === 200) {
            if (gpaInfoResult.datas.length !== 0) {
                let gpaInfoDatas: Array<any> = gpaInfoResult.datas;
                let gpaInfoData: any = Object.assign({}, gpaInfoDatas[0]);

                gpaInfoResult.data = <Schema.Student.DigitalTranscript.GPAInfo> {
                    studentID: util.doGetString(gpaInfoData.StudentID),
                    semester: util.doGetString(gpaInfoData.Semester),
                    currentYear: util.doGetString(gpaInfoData.CurrentYear),
                    programCode: util.doGetString(gpaInfoData.ProgramCode),
                    majorCode: util.doGetString(gpaInfoData.MajorCode),
                    groupNum: util.doGetString(gpaInfoData.GroupNum),
                    subjectCount: util.doGetString(gpaInfoData.SubjectCount),
                    scredit: {
                        regis: util.doGetString(gpaInfoData.SCreditRegis),
                        earn: util.doGetString(gpaInfoData.SCreditEarn),
                        compute:util.doGetString( gpaInfoData.SCreditCompute),
                        product: util.doGetStringNumber(gpaInfoData.SProduct, 2),
                        gpa: util.doGetStringNumber(gpaInfoData.SGPA, 2),
                    },
                    /*
                    sproduct: util.doGetStringNumber(gpaInfoData.SProduct, 2),
                    sgpa: util.doGetStringNumber(gpaInfoData.SGPA, 2),
                    */
                    ccredit: {
                        regis: util.doGetString(gpaInfoData.CCreditRegis),
                        earn: util.doGetString(gpaInfoData.CCreditEarn),
                        compute: util.doGetString(gpaInfoData.CCreditCompute),
                        product: util.doGetStringNumber(gpaInfoData.CProduct, 2),
                        gpa: util.doGetStringNumber(gpaInfoData.CGPA, 2),    
                    },
                    /*
                    cproduct: util.doGetStringNumber(gpaInfoData.CProduct, 2),
                    cgpa: util.doGetStringNumber(gpaInfoData.CGPA, 2),
                    */
                    studentStatus: util.doGetString(gpaInfoData.StudentStatus),
                    flag: util.doGetString(gpaInfoData.Flag),
                    gradeFlag: util.doGetString(gpaInfoData.GradeFlag),
                    leaveSts: util.doGetString(gpaInfoData.LeaveSts),
                    probationCode: util.doGetString(gpaInfoData.ProbationCode)
                }
            }
        }

        return {
            conn: conn,
            statusCode: gpaInfoResult.statusCode,
            data: (gpaInfoResult.data !== undefined ? gpaInfoResult.data : null),
            message: gpaInfoResult.message
        };
    }

    async doGetListGPAStatus(studentCode: string | undefined): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect(process.env.DATABASE_MUGRADING);
        let connRequest: mssql.Request | null = null;
        
        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
        }

        let gpaStatusResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_grdGetListGPAStatus');

        if (conn !== null &&
            gpaStatusResult.statusCode === 200) {
            if (gpaStatusResult.datas.length !== 0) {
                let gpaStatusDatas: Array<any> = gpaStatusResult.datas;

                gpaStatusResult.data = [];

                gpaStatusDatas.forEach((gpaStatusData) => {
                    gpaStatusResult.data.push(<Schema.Student.DigitalTranscript.GPAStatus> {
                        year: util.doGetString(gpaStatusData.Year),
                        semester: {
                            name: util.doGetString(gpaStatusData.SemesterName),
                            credit: {
                                earned: util.doGetString(gpaStatusData.SemesterCreditEarned),
                                value: util.doGetString(gpaStatusData.SemesterCreditValue),
                                calculated: util.doGetString(gpaStatusData.SemesterCreditCalculated)
                            },
                            pointEarned: util.doGetString(gpaStatusData.SemesterPointEarned),
                            gpa: util.doGetStringNumber(gpaStatusData.SemesterGPA, 2),
                            gpax: util.doGetStringNumber(gpaStatusData.SemesterGPAX, 2)
                        },
                        remark: util.doGetString(gpaStatusData.Remark),
                        line: {
                            one: util.doGetString(gpaStatusData.LineOne)
                        }
                    });
                });
            }
        }

        return {
            conn: conn,
            statusCode: gpaStatusResult.statusCode,
            data: (gpaStatusResult.data !== undefined ? gpaStatusResult.data : null),
            message: gpaStatusResult.message
        };
    }

    async doGetListSubjectRegistration(
        lang: string | undefined,
        studentCode: string | undefined,
        quarter: string | undefined
    ): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect(process.env.DATABASE_MUGRADING);
        let connRequest: mssql.Request | null = null;
        
        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
            connRequest.input('quarter', quarter);
        }

        let subjectRegistrationResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', ('sp_grdGetListSubjectRegistration_' + lang));

        if (conn !== null &&
            subjectRegistrationResult.statusCode === 200) {
            if (subjectRegistrationResult.datas.length !== 0) {
                let subjectRegistrationDatas: Array<any> = subjectRegistrationResult.datas;

                subjectRegistrationResult.data = [];

                subjectRegistrationDatas.forEach((subjectRegistrationData) => {
                    subjectRegistrationResult.data.push(<Schema.Student.DigitalTranscript.SubjectRegistration> {
                        course: {
                            number: util.doGetString(subjectRegistrationData.CourseNumber),
                            title: {
                                default: util.doGetString(subjectRegistrationData.CourseTitle),
                                th: util.doGetString(subjectRegistrationData.CourseTitleTh),
                                en: util.doGetString(subjectRegistrationData.CourseTitleEn)
                            },
                            credit: {
                                earned: util.doGetString(subjectRegistrationData.CourseCreditEarned),
                                value: util.doGetString(subjectRegistrationData.CourseCreditValue)
                            },
                            academic: {
                                grade: {
                                    number: util.doGetStringNumber(subjectRegistrationData.CourseAcademicGrade, 2),
                                    text: util.doGetString(subjectRegistrationData.CourseAcademicGradeText)
                                }
                            },
                            pointEarned: util.doGetStringNumber(subjectRegistrationData.CoursePointEarned, 2),
                            transferCode: null,
                        },
                        typeCode: util.doGetString(subjectRegistrationData.TypeCode),
                        educationTypeSystem: util.doGetString(subjectRegistrationData.EducationTypeSystem),
                        semester: {
                            name: util.doGetString(subjectRegistrationData.SemesterName)
                        },
                        year: util.doGetString(subjectRegistrationData.Year),
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

        return {
            conn: conn,
            statusCode: subjectRegistrationResult.statusCode,
            data: (subjectRegistrationResult.data !== undefined ? subjectRegistrationResult.data : null),
            message: subjectRegistrationResult.message
        };
    }

    async doGetListSubjectTransfer(studentCode: string | undefined): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect(process.env.DATABASE_MUGRADING);
        let connRequest: mssql.Request | null = null;
        
        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
        }

        let subjectTransferResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_grdGetListSubjectTransfer');

        if (conn !== null &&
            subjectTransferResult.statusCode === 200) {
            if (subjectTransferResult.datas.length !== 0) {
                let subjectTransferDatas: Array<any> = subjectTransferResult.datas;

                subjectTransferResult.data = [];

                subjectTransferDatas.forEach((subjectTransferData) => {
                    subjectTransferResult.data.push(<Schema.Student.DigitalTranscript.SubjectRegistration> {
                        course: {
                            number: util.doGetString(subjectTransferData.CourseNumber),
                            title: {
                                default: util.doGetString(subjectTransferData.CourseTitle),
                                th: util.doGetString(subjectTransferData.CourseTitleTh),
                                en: util.doGetString(subjectTransferData.CourseTitleEn)
                            },
                            credit: {
                                earned: util.doGetString(subjectTransferData.CourseCreditEarned),
                                value: util.doGetString(subjectTransferData.CourseCreditValue)
                            },
                            academic: {
                                grade: {
                                    number: util.doGetStringNumber(subjectTransferData.CourseAcademicGrade, 2),
                                    text: util.doGetString(subjectTransferData.CourseAcademicGradeText)
                                }
                            },
                            pointEarned: util.doGetStringNumber(subjectTransferData.CoursePointEarned, 2),
                            transferCode: util.doGetString(subjectTransferData.CourseTransferCode),
                        },
                        typeCode: util.doGetString(subjectTransferData.TypeCode),
                        educationTypeSystem: util.doGetString(subjectTransferData.EducationTypeSystem),
                        semester: {
                            name: util.doGetString(subjectTransferData.SemesterName)
                        },
                        year: util.doGetString(subjectTransferData.Year),
                        organization: {
                            name: util.doGetString(subjectTransferData.OrganizationName)
                        },
                        program: {
                            name: util.doGetString(subjectTransferData.ProgramName)
                        }
                    });
                });
            }
        }

        return {
            conn: conn,
            statusCode: subjectTransferResult.statusCode,
            data: (subjectTransferResult.data !== undefined ? subjectTransferResult.data : null),
            message: subjectTransferResult.message
        };
    }

    async doGetRegistrar(): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect(process.env.DATABASE_MUGRADING);
        let connRequest: mssql.Request | null = null;

        if (conn !== null)
            connRequest = conn.request();

        let registrarResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_grdGetRegistrar');

        if (conn !== null &&
            registrarResult.statusCode === 200) {
            if (registrarResult.datas.length !== 0) {
                let registrarDatas: Array<any> = registrarResult.datas;
                let registrarData: any = Object.assign({}, registrarDatas[0]);
                
                registrarResult.data = <Schema.Student.DigitalTranscript.Registrar> {
                    ID: util.doGetString(registrarData.ID),
                    fullname: util.doGetString(registrarData.FullName),
                    name: util.doGetString(registrarData.Name),
                    rposition: util.doGetString(registrarData.RPosition),
                    title: util.doGetString(registrarData.Title),
                    dlevel: util.doGetString(registrarData.DLevel),
                    active: util.doGetString(registrarData.Active)
                };
            }
        }

        util.db.mssql.doClose(conn);
        
         return {
            conn: conn,
            statusCode: registrarResult.statusCode,
            data: (registrarResult.data !== undefined ? registrarResult.data : null),
            message: registrarResult.message
        };
    }

    async doGetListSemesterStudent(studentCode: string | undefined): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect(process.env.DATABASE_MUGRADING);
        let connRequest: mssql.Request | null = null;
        
        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
        }

        let semesterStudentResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_grdGetSemesterStudent');

        if (conn !== null &&
            semesterStudentResult.statusCode === 200) {
            if (semesterStudentResult.datas.length !== 0) {
                let semesterStudentDatas: Array<any> = semesterStudentResult.datas;

                semesterStudentResult.data = [];

                semesterStudentDatas.forEach((semesterStudentData) => {
                    semesterStudentResult.data.push(<Schema.Student.DigitalTranscript.SemesterStudent> {
                        semester: {
                            code: util.doGetString(semesterStudentData.Semester),
                            name: {
                                th: util.doGetString(semesterStudentData.SemesterThai)
                            }
                        }
                    });
                });
            }
        }

        return {
            conn: conn,
            statusCode: semesterStudentResult.statusCode,
            data: (semesterStudentResult.data !== undefined ? semesterStudentResult.data : null),
            message: semesterStudentResult.message
        };
    }

    async doGetProfileStudent(
        lang: string | undefined,
        studentCode: string | undefined
    ): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect(process.env.DATABASE_MUGRADING);
        let connRequest: mssql.Request | null = null;
        
        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
        }

        let profileStudentResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', ('sp_grdProfileStudent_' + lang));

        if (conn !== null &&
            profileStudentResult.statusCode === 200) {
            if (profileStudentResult.datas.length !== 0) {
                let profileStudentDatas: Array<any> = profileStudentResult.datas;
                let profileStudentData: any = Object.assign({}, profileStudentDatas[0]);

                profileStudentResult.data = <Schema.Student.DigitalTranscript.ProfileStudent> {
                    dataSubjectID: {
                        studentID: util.doGetString(profileStudentData.DataSubjectIDStudentID),
                        nidn: util.doGetString(profileStudentData.DataSubjectIDNIDN),
                        ccpt: util.doGetString(profileStudentData.DataSubjectIDCCPT),
                    },
                    namePrefix: {
                        th: util.doGetString(profileStudentData.NamePrefixTh),
                        en: util.doGetString(profileStudentData.NamePrefixEn)
                    },
                    givenName: {
                        default: util.doGetString(profileStudentData.GivenName),
                        th: util.doGetString(profileStudentData.GivenNameTh),
                        en: util.doGetString(profileStudentData.GivenNameEn)
                    },
                    middleName: {
                        th: util.doGetString(profileStudentData.MiddleNameTh),
                        en: util.doGetString(profileStudentData.MiddleNameEn)
                    },
                    familyName: {
                        th: util.doGetString(profileStudentData.FamilyNameTh),
                        en: util.doGetString(profileStudentData.FamilyNameEn)
                    },
                    gender: util.doGetString(profileStudentData.Gender),
                    birthDate: util.doGetStringDate(profileStudentData.BirthDate, 'en-GB'),
                    nationality: util.doGetString(profileStudentData.Nationality),
                    countryCode: util.doGetString(profileStudentData.ResidentCountryOrTerritoryCode),
                    personImage: util.doGetString(profileStudentData.PersonImage),
                    faculty: {
                        name: util.doGetString(profileStudentData.FacultyName)
                    },
                    program: {
                        ID: util.doGetString(profileStudentData.ProgramID),
                        name: util.doGetString(profileStudentData.ProgramName)
                    },
                    major: util.doGetString(profileStudentData.Major),
                    minor: util.doGetString(profileStudentData.Minor),
                    degree: util.doGetString(profileStudentData.Degree),
                    dateOfAdmission: util.doGetStringDate(profileStudentData.DateOfAdmission, 'en-GB'),
                    dateOfGraduation: util.doGetStringDate(profileStudentData.DateOfGraduation, 'en-GB'),
                    creditsTranferred: util.doGetString(profileStudentData.CreditsTranferred),
                    organization: {
                        ID: util.doGetString(profileStudentData.OrganizationID),
                        name: util.doGetString(profileStudentData.OrganizationName)
                    },
                    building: {
                        number: util.doGetString(profileStudentData.BuildingNumber),
                        name: util.doGetString(profileStudentData.BuildingName)
                    },
                    street: {
                        name: util.doGetString(profileStudentData.StreetName),
                        additional: util.doGetString(profileStudentData.AdditionalStreetName)
                    },
                    city: {
                        ID: null,
                        name: util.doGetString(profileStudentData.CityName),
                        subDivision: {
                            ID: null,
                            name: util.doGetString(profileStudentData.CitySubDivisionName)
                        }
                    },
                    country: {
                        code: util.doGetString(profileStudentData.CountryCode),
                        subDivision: {
                            code: util.doGetString(profileStudentData.CountrySubDivisionCode),
                            name: util.doGetString(profileStudentData.CountrySubDivisionName)
                        }
                    },
                    postcode: util.doGetString(profileStudentData.PostcodeCode),
                    schoolLevel: util.doGetString(profileStudentData.SchoolLevel),
                    status: {
                        code: util.doGetString(profileStudentData.stdStatus),
                        name: {
                            th: util.doGetString(profileStudentData.stsNameTh),
                            en: util.doGetString(profileStudentData.stsNameEn),
                            group: util.doGetString(profileStudentData.stsGroup)
                        }
                    }
                };
            }
        }

        util.db.mssql.doClose(conn);
        
         return {
            conn: conn,
            statusCode: profileStudentResult.statusCode,
            data: (profileStudentResult.data !== undefined ? profileStudentResult.data : null),
            message: profileStudentResult.message
        };
    }

}