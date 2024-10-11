/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๖/๐๑/๒๕๖๖>
Modify date : <๑๑/๑๐/๒๕๖๗>
Description : <>
=============================================
*/

'use strict';

import mssql from 'mssql';

import { Util } from '../../util';
import { Schema } from '../schema';

const util: Util = new Util();

export class ProfileModel {
    async doGet(studentCode: string | undefined): Promise<Schema.Result> {
        let conn: mssql.ConnectionPool | null = await util.db.mssql.doConnect();
        let connRequest: mssql.Request | null = null;

        if (conn !== null) {
            connRequest = conn.request();
            connRequest.input('studentCode', studentCode);
        }

        let personIDResult: Schema.Result = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_stdStudentInfoByCode');
        let personID: string | null = null;
        let profileResult: Schema.Result
        
        if (conn !== null &&
            personIDResult.statusCode === 200) {
            if (util.doIsEmpty(personIDResult.datas) === false)
                personID = personIDResult.datas[0].id;
            
            if (util.doIsEmpty(personID) === false) {
                let studentCodeTable: mssql.Table = new mssql.Table();

                studentCodeTable.columns.add('id', mssql.NVarChar(20));
                studentCodeTable.rows.add(personID);

                connRequest = conn.request();
                connRequest.input('tb_personId', studentCodeTable);
                
                profileResult = await util.db.mssql.doExecuteQuery(conn, connRequest, 'procedure', 'sp_perGetListPersonStudentInfo');
                
                if (profileResult.statusCode === 200) {
                    if (util.doIsEmpty(profileResult.datas) === false) {
                        let profileDatas: Array<any> = { ...profileResult.datas };
                        let profileData: any = { ...profileDatas[0] };

                        profileResult.data = <Schema.Student.Profile> {
                            studentCode: profileData.studentCode,
                            degreeLevel: {
                                name: {
                                    th: profileData.degreeLevelNameTH,
                                    en: profileData.degreeLevelNameEN
                                }
                            },
                            faculty: {
                                name: {
                                    th: profileData.facultyNameTH,
                                    en: profileData.facultyNameEN,
                                }
                            },
                            program: {
                                ID: profileData.programId,
                                code: profileData.programCodeNew,
                                name: {
                                    th: profileData.programNameTH,
                                    en: profileData.programNameEN
                                }
                            },
                            yearEntry: profileData.yearEntry,
                            class: profileData.class,
                            entranceType: {
                                name: {
                                    th: profileData.stdEntranceTypeNameTH,
                                    en: profileData.stdEntranceTypeNameEN
                                }
                            },
                            statusType: {
                                name: {
                                    th: profileData.statusTypeNameTH,
                                    en: profileData.statusTypeNameEN
                                }
                            },
                            admissionDate: profileData.admissionDate,
                            graduateDate: profileData.graduateDate,
                            yearGraduate: profileData.yearGraduate,
                            statusGroup: profileData.statusGroup,
                            updateReason: profileData.updateReason,
                            barcode: profileData.barcode,
                            personal: {
                                fullname: {
                                    title: {
                                        fullname: {
                                            th: profileData.titleFullNameTH,
                                            en: profileData.titleFullNameEN
                                        },
                                        initials: {
                                            th: profileData.titleInitialsTH,
                                            en: profileData.titleInitialsEN
                                        }
                                    },
                                    firstName: {
                                        th: profileData.firstNameTH,
                                        en: profileData.firstNameEN
                                    },
                                    middleName: {
                                        th: profileData.middleNameTH,
                                        en: profileData.middleNameEN
                                    },
                                    lastName: {
                                        th: profileData.lastNameTH,
                                        en: profileData.lastNameEN
                                    }
                                },
                                IDCard: {
                                    ID: profileData.idCard,
                                    issueDate: {
                                        th: profileData.idCardIssueDateTH,
                                        en: profileData.idCardIssueDateEN
                                    },
                                    expiryDate: {
                                        th: profileData.idCardExpiryDateTH,
                                        en: profileData.idCardExpiryDateEN
                                    }
                                },
                                gender: {
                                    name: {
                                        th: profileData.genderFullNameTH,
                                        en: profileData.genderFullNameEN
                                    }
                                },
                                birthDate: {
                                    th: profileData.birthDateTH,
                                    en: profileData.birthDateEN
                                },
                                nationality: {
                                    name: {
                                        th: profileData.nationalityNameTH,
                                        en: profileData.nationalityNameEN
                                    }
                                },
                                childhoodNumber: profileData.childhoodNumber,
                                email: profileData.email
                            },
                            address: {
                                permanent: {
                                    country: {
                                        name: {
                                            th: profileData.countryNameTHPermanentAddress,
                                            en: profileData.countryNameENPermanentAddress
                                        }
                                    },
                                    province: {
                                        name: {
                                            th: profileData.provinceNameTHPermanentAddress,
                                            en: profileData.provinceNameENPermanentAddress
                                        }
                                    },
                                    district: {
                                        name: {
                                            th: profileData.districtNameTHPermanentAddress,
                                            en: profileData.districtNameENPermanentAddress
                                        }
                                    },
                                    subdistrict: {
                                        name: {
                                            th: profileData.subdistrictNameTHPermanentAddress,
                                            en: profileData.subdistrictNameENPermanentAddress
                                        }
                                    },
                                    zipCode: profileData.zipCodePermanentAddress,
                                    village: profileData.villagePermanentAddress,
                                    addressNumber: profileData.addressNumberPermanentAddress,
                                    villageNo: profileData.villageNoPermanentAddress,
                                    soi: profileData.soiPermanentAddress,
                                    road: profileData.roadPermanentAddress,
                                    phoneNumber: profileData.phoneNumberPermanentAddress,
                                    mobileNumber: profileData.mobileNumberPermanentAddress,
                                    faxNumber: profileData.faxNumberPermanentAddress
                                },
                                current: {
                                    country: {
                                        name: {
                                            th: profileData.countryNameTHCurrentAddress,
                                            en: profileData.countryNameENCurrentAddress
                                        }
                                    },
                                    province: {
                                        name: {
                                            th: profileData.provinceNameTHCurrentAddress,
                                            en: profileData.provinceNameENCurrentAddress
                                        }
                                    },
                                    district: {
                                        name: {
                                            th: profileData.districtNameTHCurrentAddress,
                                            en: profileData.districtNameENCurrentAddress
                                        }
                                    },
                                    subdistrict: {
                                        name: {
                                            th: profileData.subdistrictNameTHCurrentAddress,
                                            en: profileData.subdistrictNameENCurrentAddress
                                        }
                                    },
                                    zipCode: profileData.zipCodeCurrentAddress,
                                    village: profileData.villageCurrentAddress,
                                    addressNumber: profileData.addressNumberCurrentAddress,
                                    villageNo: profileData.villageNoCurrentAddress,
                                    soi: profileData.soiCurrentAddress,
                                    road: profileData.roadCurrentAddress,
                                    phoneNumber: profileData.phoneNumberCurrentAddress,
                                    mobileNumber: profileData.mobileNumberCurrentAddress,
                                    faxNumber: profileData.faxNumberCurrentAddress
                                }
                            },
                            education: {
                                highschool: {
                                    institute: {
                                        name: profileData.instituteNameHighSchool,
                                        country: {
                                            name: {
                                                th: profileData.instituteCountryNameTHHighSchool,
                                                en: profileData.instituteCountryNameTHHighSchool
                                            }
                                        },
                                        province: {
                                            name: {
                                                th: profileData.instituteProvinceNameTHHighSchool,
                                                en: profileData.instituteProvinceNameENHighSchool
                                            }
                                        },
                                        studentID: profileData.studentIDHighSchool,
                                        GPA: profileData.GPAHighSchool
                                    }
                                },
                                entranceTime: {
                                    th: profileData.entranceTimeTH,
                                    en: profileData.entranceTimeEN
                                },
                                studentIs: {
                                    th: profileData.studentIsTH,
                                    en: profileData.studentIsEN,
                                    university: profileData.studentIsUniversity,
                                    faculty: profileData.studentIsFaculty,
                                    program: profileData.studentIsProgram
                                }
                            },
                            activity: {
                                sportsmanDetail: profileData.sportsmanDetail,
                                specialist: {
                                    sportDetail: profileData.specialistSportDetail,
                                    artDetail: profileData.specialistArtDetail,
                                    technicalDetail: profileData.specialistTechnicalDetail,
                                    otherDetail: profileData.specialistOtherDetail
                                },
                                activityDetail: profileData.activityDetail,
                                rewardDetail: profileData.rewardDetail
                            },
                            healthy: {
                                impairments: {
                                    name: {
                                        th: profileData.impairmentsNameTH,
                                        en: profileData.impairmentsNameEN
                                    },
                                    equipment: profileData.impairmentsEquipment
                                },
                                IDCardPWD: {
                                    ID: profileData.idCardPWD,
                                    issueDate: {
                                        th: profileData.idCardPWDIssueDateTH,
                                        en: profileData.idCardPWDIssueDateEN
                                    },
                                    expiryDate: {
                                        th: profileData.idCardPWDExpiryDateTH,
                                        en: profileData.idCardPWDExpiryDateEN
                                    }
                                },
                            },
                            financial: {
                                scholarship: {
                                    firstBachelor: {
                                        from: {
                                            th: profileData.scholarshipFirstBachelorFromTH,
                                            en: profileData.scholarshipFirstBachelorFromEN
                                        },
                                        name: profileData.scholarshipFirstBachelorName,
                                        money: profileData.scholarshipFirstBachelorMoney
                                    },
                                    bachelor: {
                                        from: {
                                            th: profileData.scholarshipBachelorFromTH,
                                            en: profileData.scholarshipBachelorFromEN
                                        },
                                        name: profileData.scholarshipBachelorName,
                                        money: profileData.scholarshipBachelorMoney
                                    }
                                },
                                workDuringStudy: {
                                    salary: profileData.workDuringStudySalary,
                                    workplace: profileData.workDuringStudyWorkplace
                                },
                                gotMoney: {
                                    from: {
                                        th: profileData.gotMoneyFromTH,
                                        en: profileData.gotMoneyFromEN,
                                        other: profileData.gotMoneyFromOther
                                    },
                                    perMonth: profileData.gotMoneyPerMonth
                                },
                                cost: {
                                    perMonth: profileData.costPerMonth
                                }
                            },
                            family: {
                                father: {
                                    personal: {
                                        IDCard: profileData.idCardFather,
                                        fullname: {
                                            title: {
                                                fullname: {
                                                    th: profileData.titleFullNameTHFather,
                                                    en: profileData.titleFullNameENFather
                                                },
                                                initials: {
                                                    th: profileData.titleInitialsTHFather,
                                                    en: profileData.titleInitialsENFather
                                                }
                                            },
                                            firstName: {
                                                th: profileData.firstNameTHFather,
                                                en: profileData.firstNameENFather
                                            },
                                            middleName: {
                                                th: profileData.middleNameTHFather,
                                                en: profileData.middleNameENFather
                                            },
                                            lastName: {
                                                th: profileData.lastNameTHFather,
                                                en: profileData.lastNameENFather
                                            }
                                        },
                                        alive: {
                                            th: profileData.aliveTHFather,
                                            en: profileData.aliveENFather
                                        },
                                        educationalBackground: {
                                            name: {
                                                th: profileData.educationalBackgroundNameTHFather,
                                                en: profileData.educationalBackgroundNameENFather
                                            }
                                        }
                                    },
                                    work: {
                                        occupation: {
                                            th: profileData.occupationTHFather,
                                            en: profileData.occupationENFather
                                        },
                                        salary: profileData.salaryFather,
                                        noIncome: profileData.noIncomeFather
                                    }
                                },
                                mother: {
                                    personal: {
                                        IDCard: profileData.idCardMother,
                                        fullname: {
                                            title: {
                                                fullname: {
                                                    th: profileData.titleFullNameTHMother,
                                                    en: profileData.titleFullNameENMother
                                                },
                                                initials: {
                                                    th: profileData.titleInitialsTHMother,
                                                    en: profileData.titleInitialsENMother
                                                }
                                            },
                                            firstName: {
                                                th: profileData.firstNameTHMother,
                                                en: profileData.firstNameENMother
                                            },
                                            middleName: {
                                                th: profileData.middleNameTHMother,
                                                en: profileData.middleNameENMother
                                            },
                                            lastName: {
                                                th: profileData.lastNameTHMother,
                                                en: profileData.lastNameENMother
                                            }
                                        },
                                        alive: {
                                            th: profileData.aliveTHMother,
                                            en: profileData.aliveENMother
                                        },
                                        educationalBackground: {
                                            name: {
                                                th: profileData.educationalBackgroundNameTHMother,
                                                en: profileData.educationalBackgroundNameENMother
                                            }
                                        }
                                    },
                                    work: {
                                        occupation: {
                                            th: profileData.occupationTHMother,
                                            en: profileData.occupationENMother
                                        },
                                        salary: profileData.salaryMother,
                                        noIncome: profileData.noIncomeMother
                                    }
                                },
                                parent: {
                                    relationship: {
                                        name: {
                                            th: profileData.relationshipNameTH,
                                            en: profileData.relationshipNameEN
                                        }
                                    },
                                    personal: {
                                        IDCard: profileData.idCardParent,
                                        fullname: {
                                            title: {
                                                fullname: {
                                                    th: profileData.titleFullNameTHParent,
                                                    en: profileData.titleFullNameENParent
                                                },
                                                initials: {
                                                    th: profileData.titleInitialsTHParent,
                                                    en: profileData.titleInitialsENParent
                                                }
                                            },
                                            firstName: {
                                                th: profileData.firstNameTHParent,
                                                en: profileData.firstNameENParent
                                            },
                                            middleName: {
                                                th: profileData.middleNameTHParent,
                                                en: profileData.middleNameENParent
                                            },
                                            lastName: {
                                                th: profileData.lastNameTHParent,
                                                en: profileData.lastNameENParent
                                            }
                                        },
                                        alive: {
                                            th: profileData.aliveTHParent,
                                            en: profileData.aliveENParent
                                        },
                                        educationalBackground: {
                                            name: {
                                                th: profileData.educationalBackgroundNameTHParent,
                                                en: profileData.educationalBackgroundNameENParent
                                            }
                                        }
                                    },
                                    work: {
                                        occupation: {
                                            th: profileData.occupationTHParent,
                                            en: profileData.occupationENParent
                                        },
                                        salary: profileData.salaryParent,
                                        noIncome: profileData.noIncomeParent
                                    }
                                }
                            }
                        };
                    }
                }
            }
            else
                profileResult = {
                    statusCode: personIDResult.statusCode,
                    data: null,
                    message: personIDResult.message
                };
        }
        else
            profileResult = {
                statusCode: personIDResult.statusCode,
                data: null,
                message: personIDResult.message
            };
    
        util.db.mssql.doClose(conn);

        return {
            conn: conn,
            statusCode: profileResult.statusCode,
            data: (util.doIsEmpty(profileResult.data) === false ? profileResult.data : null),
            message: profileResult.message
        };
    }
}