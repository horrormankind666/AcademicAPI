/*
=============================================
Author      : <ยุทธภูมิ ตวันนา>
Create date : <๒๓/๐๑/๒๕๖๖>
Modify date : <๐๕/๑๐/๒๕๖๗>
Description : <>
=============================================
*/

'use strict';

import { Request } from 'express';

export namespace Schema {
    export type TypeRequest = Request & {
        payload?: any
    }

    export interface Result {
        conn?: any,
        statusCode?: number | null,
        code?: number | null,
        status?: boolean | null,
        success?: boolean | null,
        datas?: any,
        data?: any,
        message?: string | {} | null
    }

    export namespace URLConfig {
        export interface Dic {
            [url: string]: Result
        }

        export interface Result {
            isCheckAuthorized: boolean,
            apiResultKeys?: Array<string>
        }
    }

    export interface Client {
        ID: string,
        secret: string,
        systemKey: string,
        apiKey: string,
        verifyKey: string,
        forSystem: string
    }

    export namespace Student {
        interface FullName {
            title?: {
                code?: string | null,
                fullname?: {
                    th?: string | null,
                    en?: string | null
                },
                initials?: {
                    th?: string | null,
                    en?: string | null
                }
            },
            firstName?: {
                th?: string | null,
                en?: string | null
            },
            middleName?: {
                th?: string | null,
                en?: string | null
            },
            lastName?: {
                th?: string | null,
                en?: string | null
            }
        }

        interface IDCard {
            ID?: string | null,
            issueDate?: {
                th?: string | null,
                en?: string | null
            },
            expiryDate: {
                th?: string | null,
                en?: string | null
            }
        }

        interface Address {
            country?: {
                name?: {
                    th?: string | null,
                    en?: string | null
                }
            },
            province?: {
                name?: {
                    th?: string | null,
                    en?: string | null
                }
            },
            district?: {
                name?: {
                    th?: string | null,
                    en?: string | null
                }
            },
            subdistrict?: {
                name?: {
                    th?: string | null,
                    en?: string | null
                }
            },
            zipCode?: string | null,
            village?: string | null,
            addressNumber?: string | null,
            villageNo?: string | null,
            soi?: string | null,
            road?: string | null,
            phoneNumber?: string | null,
            mobileNumber?: string | null,
            faxNumber?: string | null
        }

        interface Scholarship {
            from?: {
                th?: string | null,
                en?: string | null
            },
            name?: string | null,
            money?: string | null
        }

        interface FamilyPersonal {
            IDCard?: string | null,
            fullname?: FullName,
            alive?: {
                th?: string | null,
                en?: string | null
            }
            educationalBackground?: {
                name?: {
                    th?: string | null,
                    en?: string | null
                }
            }
        }

        interface FamilyWork {
            occupation?: {
                th?: string | null,
                en?: string | null
            },
            salary?: string | null,
            noIncome?: string | null
        }

        export interface Profile {
            studentCode?: string | null,
            degreeLevel?: {
                name?: {
                    th?: string | null,
                    en?: string | null
                }
            },
            faculty?: {
                name?: {
                    th?: string | null,
                    en?: string | null
                }
            },
            program?: {
                ID?: string | null,
                code?: string | null,
                name?: {
                    th?: string | null,
                    en?: string | null
                }
            },
            yearEntry?: string | null,
            class?: string | null,
            entranceType?: {
                name?: {
                    th?: string | null,
                    en?: string | null
                }
            },
            statusType?: {
                name?: {
                    th?: string | null,
                    en?: string | null
                }
            },
            admissionDate?: string | null,
            graduateDate?: string | null,
            yearGraduate?: string | null,
            statusGroup?: string | null,
            updateReason?: string | null,
            barcode?: string | null,
            personal?: {
                fullname?: FullName,
                IDCard?: IDCard,
                gender?: {
                    name?: {
                        th?: string | null,
                        en?: string | null
                    }
                },
                birthDate?: {
                    th?: string | null,
                    en?: string | null
                },
                nationality?: {
                    name?: {
                        th?: string | null,
                        en?: string | null
                    }
                },
                childhoodNumber?: string | null,
                email?: string | null,
            },
            address?: {
                permanent?: Address,
                current?: Address
            },
            education?: {
                highschool?: {
                    institute?: {
                        name?: string | null,
                        country?: {
                            name?: {
                                th?: string | null,
                                en?: string | null
                            }
                        },
                        province?: {
                            name?: {
                                th?: string | null,
                                en?: string | null
                            }
                        },
                        studentID?: string | null,
                        GPA?: string | null
                    }
                },
                entranceTime?: {
                    th?: string | null,
                    en?: string | null
                },
                studentIs?: {
                    th?: string | null,
                    en?: string | null,
                    university?: string | null,
                    faculty?: string | null,
                    program?: string | null
                }
            },
            activity?: {
                sportsmanDetail?: string | null,
                specialist?: {
                    sportDetail?: string | null,
                    artDetail?: string | null,
                    technicalDetail?: string | null,
                    otherDetail?: string | null
                },
                activityDetail?: string | null
                rewardDetail?: string | null
            },
            healthy?: {
                impairments?: {
                    name?: {
                        th?: string | null,
                        en?: string | null
                    },
                    equipment?: string | null
                },
                IDCardPWD?: IDCard,
            },
            financial?: {
                scholarship?: {
                    firstBachelor?: Scholarship,
                    bachelor?: Scholarship
                },
                workDuringStudy?: {
                    salary?: string | null,
                    workplace?: string | null
                },
                gotMoney?: {
                    from?: {
                        th?: string | null,
                        en?: string | null,
                        other?: string | null
                    },
                    perMonth?: string | null
                },
                cost?: {
                    perMonth?: string | null
                }
            },
            family?: {
                father?: {
                    personal?: FamilyPersonal,
                    work?: FamilyWork
                },
                mother?: {
                    personal?: FamilyPersonal,
                    work?: FamilyWork
                },
                parent?: {
                    relationship?: {
                        name?: {
                            th?: string | null,
                            en?: string | null
                        }
                    },
                    personal?: FamilyPersonal,
                    work?: FamilyWork
                }
            }
        }

        export namespace DigitalTranscript {
            export interface Footer {
                studentCode?: string | null,
                fullname?: FullName,
                IDCard?: string | null,
                gender?: {
                    fullname?: {
                        th?: string | null,
                        en?: string | null
                    },
                    initials?: string | null
                },
                birthDate?: {
                    th?: string | null,
                    en?: string | null
                },
                nationality?: {
                    code?: string | null,
                    name?: {
                        th?: string | null,
                        en?: string | null
                    }
                },
                email?: string | null,
                degree?: {
                    level?: string | null,
                    name?: {
                        th?: string | null,
                        en?: string | null
                    }
                },
                faculty?: {
                    code?: string | null,
                    name?: {
                        th?: string | null,
                        en?: {
                            default?: string | null,
                            other?: string | null
                        }
                    }
                },
                program?: {
                    code?: string | null,
                    name?: {
                        th?: string | null,
                        en?: string | null
                    },
                    year?: string | null,
                    type?: string | null
                },
                major?: {
                    code?: string | null,
                    name?: {
                        th?: string | null,
                        en?: string | null
                    }
                },
                groupNum?: string | null,
                interProgram?: {
                    name?: {
                        th?: string | null,
                        en?: string | null
                    }
                },
                studentStatus?: string | null,
                admissionDate?: {
                    th?: string | null,
                    en?: string | null
                },
                graduateDate?: {
                    th?: string | null,
                    en?: string | null
                },
                currentYear?: string | null,
                lastYear?: string | null,
                distinction?: string | null,
                gradYear?: string | null,
                quotaCode?: string | null,
                BM?: {
                    name?: {
                        th?: {
                            1?: string | null,
                            2?: string | null
                        }
                    }
                },
                passedEnglishExam?: string | null,
                txtStudentPassed?: {
                    th?: string | null,
                    en?: string | null
                },
                praticeHrs?: {
                    th?: string | null,
                    en?: string | null
                }
            }

            export interface AdditionalInformation {
                studentCode?: string | null,
                hons?: string | null,
                thesisTitle?: string | null
            }

            export interface GPAInfo {
                studentID?: string | null,
                semester?: string | null,
                currentYear?: string | null,
                programCode?: string | null,
                majorCode?: string | null,
                groupNum?: string | null,
                subjectCount?: string | null,
                scredit?: {
                    regis?: string | null,
                    earn?: string | null,
                    compute?: string | null
                },
                sproduct?: string | null,
                sgpa?: string | null,
                ccredit?: {
                    regis?: string | null,
                    earn?: string | null,
                    compute?: string | null
                },
                cproduct?: string | null,
                cgpa?: string | null,
                studentStatus?: string | null,
                flag?: string | null,
                gradeFlag?: string | null,
                leaveSts?: string | null,
                probationCode?: string | null
            }

            export interface GPAStatus {
                year?: string | null,
                semester?: {
                    name?: string | null,
                    credit?: {
                        earned?: string | null,
                        value?: string | null,
                        calculated?: string | null
                    },
                    pointEarned?: string | null,
                    gpa?: string | null,
                    gpax?: string | null
                },
                remark?: string | null,
                line?: {
                    one?: string | null
                }
            }

            export interface SubjectRegistration {
                course?: {
                    number?: string | null,
                    title?: {
                        default?: string | null,
                        th?: string | null,
                        en?: string | null
                    },
                    credit?: {
                        earned?: string | null,
                        value?: string | null
                    },
                    academic?: {
                        grade?: {
                            number?: string | null,
                            text?: string | null
                        }
                    },
                    pointEarned?: string | null,
                    transferCode?: string | null,
                },
                typeCode?: string | null,
                educationTypeSystem?: string | null,
                semester?: {
                    name?: string | null
                }
                year?: string | null,
                organization?: {
                    name?: string | null
                },
                program?: {
                    name?: string | null
                }
            }

            export interface Registrar {
                ID?: string | null,
                fullname?: string | null,
                name?: string | null,
                rposition?: string | null,
                title?: string | null,
                dlevel?: string | null,
                active?: string | null
            }

            export interface SemesterStudent {
                semester?: {
                    code?: string | null,
                    name?: {
                        th?: string | null
                    }
                }
            }

            export interface ProfileStudent {
                dataSubjectID?: {
                    studentID?: string | null,
                    nidn?: string | null,
                    ccpt?: string | null,
                },
                namePrefix?: {
                    th?: string | null,
                    en?: string | null
                },
                givenName?: {
                    default?: string | null,
                    th?: string | null,
                    en?: string | null
                },
                middleName?: {
                    th?: string | null,
                    en?: string | null
                },
                familyName?: {
                    th?: string | null,
                    en?: string | null
                },
                gender?: string | null,
                birthDate?: string | null,
                nationality?: string | null,
                countryCode?: string | null,
                personImage?: string | null,
                faculty?: {
                    name?: string | null
                },
                program?: {
                    ID?: string | null,
                    name?: string | null
                },
                major?: string | null,
                minor?: string | null,
                degree?: string | null,
                dateOfAdmission?: string | null,
                dateOfGraduation?: string | null,
                creditsTranferred?: string | null,
                organization?: {
                    ID?: string | null,
                    name?: string | null
                },
                building?: {
                    number?: string | null,
                    name?: string | null
                },
                street?: {
                    name?: string | null,
                    additional?: string | null
                }
                city?: {
                    ID?: string | null,
                    name?: string | null,
                    subDivision?: {
                        ID?: string | null,
                        name?: string | null
                    }
                },
                country?: {
                    code?: string | null,
                    subDivision?: {
                        code?: string | null,
                        name?: string | null
                    }
                }
                postcode?: string | null,
                schoolLevel?: string | null
            }
        }

        export namespace ActivityTranscript {
            export interface Activity {
                ID: string | null,
                IDRefMUWalletForAT: string | null,
                name: {
                    th: string | null,
                    en: string | null
                }
                acaYear: string | null,
                semester: string | null,
                startDate: string | null,
                endDate: string | null,
                hours: string | null,
                place: string | null,
                amountMax: string | null,
                registrationFee: string | null,
                project: {
                    ID: string | null,
                    name: {
                        th: string | null,
                        en: string | null,
                    },
                    detail: string | null,
                    institute: {
                        name: {
                            th: string | null,
                            en: string | null
                        }
                    },
                    status: {
                        ID: string | null
                    },
                    type: {
                        name: {
                            th: string | null
                            en: string | null
                        }
                    },
                    targetGroup: {
                        name: {
                            th: string | null,
                            en: string | null
                        }
                    },
                    startDate: string | null,
                    endDate: string | null,
                },
                countRegistered: string | null,
                countStudentsRegistered: string | null,
                countStudentsJoined: string | null,
                isRegisterByDateNow: string | null,
                isExpression: {
                    studentCode: string | null,
                    faculty: string | null,
                    class: string | null
                }
                invoice: {
                    ID: string | null,
                    paidStatus: string | null
                },
                student: {
                    ID: string | null,
                    code: string | null,
                    class: string | null,
                    faculty: {
                        ID: string | null
                    }
                },
                registeredDate: string | null
            }
        }
    }
}