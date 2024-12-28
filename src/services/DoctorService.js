import db from '../models/index';
import { sendConfirmDoctorResult } from './EmailService';
let fs = require('fs').promises; // Sử dụng fs.promises để có thể dùng với await
let getAllDoctorsNotComfirm = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let listDoctorInfo = await db.DoctorInfo.findAll({
                where: {
                    statusId: 'S1'
                },
                include: [
                    {
                        model: db.User, as: 'doctorData',
                        attributes: {
                            exclude: ['password']
                        },
                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ['value'] }
                        ]
                    },
                    { model: db.Allcode, as: 'priceData', attributes: ['value'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['value'] },
                    { model: db.Allcode, as: 'paymentData', attributes: ['value'] },
                    { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                    { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] },
                    {
                        model: db.Specialty,
                        as: 'specialtyData',
                        through: { attributes: [] }, // Không lấy thông tin từ bảng trung gian
                        attributes: ['id', 'name']
                    }
                ],
                raw: false,
                nest: true
            })

            resolve({
                errCode: 0,
                message: 'Success',
                data: listDoctorInfo
            })
        } catch (e) {
            console.log('err: ', e);
            reject(e);
        }
    });
}

let getAllDoctorConfirm = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let listDoctorInfo = await db.DoctorInfo.findAll({
                where: {
                    statusId: 'S2'
                },
                include: [
                    {
                        model: db.User, as: 'doctorData',
                        attributes: {
                            exclude: ['password']
                        },
                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ['value'] }
                        ]
                    },
                    { model: db.Allcode, as: 'priceData', attributes: ['value'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['value'] },
                    { model: db.Allcode, as: 'paymentData', attributes: ['value'] },
                    { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                    { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] },
                    {
                        model: db.Specialty,
                        as: 'specialtyData',
                        through: { attributes: [] }, // Không lấy thông tin từ bảng trung gian
                        attributes: ['id', 'name']
                    },
                ],
                raw: false,
                nest: true
            })

            resolve({
                errCode: 0,
                message: 'Success',
                data: listDoctorInfo
            })
        } catch (e) {
            console.log('err: ', e);
            reject(e);
        }
    });
}

let getDoctorById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.DoctorInfo.findOne({
                where: {
                    doctorId: id,
                    statusId: 'S2'
                },
                attributes: {
                    exclude: ['profile', 'certificate']
                },
                include: [
                    {
                        model: db.User, as: 'doctorData',
                        attributes: {
                            exclude: ['password']
                        },
                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ['value'] }
                        ]
                    },
                    { model: db.Allcode, as: 'priceData', attributes: ['value'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['value'] },
                    { model: db.Allcode, as: 'paymentData', attributes: ['value'] },
                    { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                    {
                        model: db.Clinic, as: 'clinicData',
                        include: [
                            { model: db.Allcode, as: 'provinceData', attributes: ['value'] }
                        ]
                    },
                    {
                        model: db.Specialty,
                        as: 'specialtyData',
                        through: { attributes: [] }, // Không lấy thông tin từ bảng trung gian
                        attributes: ['id', 'name']
                    }
                ],
                raw: false,
                nest: true
            })
            resolve({
                errCode: 0,
                message: 'Success',
                data: doctor
            })
        } catch (e) {
            reject(e);
        }
    })
}

let getMoreDoctorInfo = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.DoctorInfo.findOne({
                where: {
                    doctorId: id
                },
                attributes: {
                    exclude: ['profile', 'certificate']
                },
                include: [
                    { model: db.User, as: 'doctorData', attributes: ['username', 'image'] },
                    { model: db.Allcode, as: 'priceData', attributes: ['value'] },
                    { model: db.Allcode, as: 'paymentData', attributes: ['value'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['value'] },
                    { model: db.Clinic, as: 'clinicData', atrributes: ['id', 'name', 'address'] },
                ],
                raw: false,
                nest: true
            })
            resolve({
                errCode: 0,
                message: 'Success',
                data: doctor
            })
        } catch (e) {
            reject(e);
        }
    });
}

let getRandomDoctor = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let listDoctorInfo = await db.DoctorInfo.findAll({
                where: {
                    statusId: 'S2'
                },
                attributes: {
                    exclude: ['profile', 'certificate']
                },
                include: [
                    {
                        model: db.User, as: 'doctorData',
                        attributes: {
                            exclude: ['password']
                        },
                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ['value'] }
                        ]
                    },
                    { model: db.Allcode, as: 'priceData', attributes: ['value'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['value'] },
                    { model: db.Allcode, as: 'paymentData', attributes: ['value'] },
                    { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                    { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] },
                    {
                        model: db.Specialty,
                        as: 'specialtyData',
                        through: { attributes: [] }, // Không lấy thông tin từ bảng trung gian
                        attributes: ['id', 'name']
                    }
                ],
                raw: false,
                nest: true
            })
            let listRandom = [];
            if (listDoctorInfo.length > 3) {
                for (let i = 0; i < 6; i++) {
                    let randomIndex = Math.floor(Math.random() * listDoctorInfo.length);
                    listRandom.push(listDoctorInfo[randomIndex]);
                    listDoctorInfo.splice(randomIndex, 1);
                }
            } else {
                listRandom = listDoctorInfo;
            }
            resolve({
                errCode: 0,
                message: 'Success',
                data: listRandom
            })
        } catch (e) {
            console.log('err: ', e);
            reject(e);
        }
    });
}

let getDoctorBySpecialty = async (specialtyId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let listDoctorInfo = await db.DoctorInfo.findAll({
                where: {
                    statusId: 'S2'
                },
                attributes: {
                    exclude: ['profile', 'certificate']
                },
                include: [
                    {
                        model: db.User, as: 'doctorData',
                        attributes: {
                            exclude: ['password']
                        },
                    },
                    {
                        model: db.Clinic, as: 'clinicData', attributes: ['id', 'name'],
                        include: [
                            { model: db.Allcode, as: 'provinceData', attributes: ['value'] }
                        ]
                    },
                    {
                        model: db.Specialty,
                        as: 'specialtyData',
                        through: { attributes: [] },
                        attributes: ['id', 'name']
                    }
                ],
                raw: false,
                nest: true
            });

            let listDoctor = listDoctorInfo.filter(doctor =>
                doctor.specialtyData.some(specialty => {
                    return specialty.id == specialtyId
                })
            );

            if (listDoctor.length > 0) {
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: listDoctor
                });
            } else {
                resolve({
                    errCode: 0,
                    message: 'No doctor found',
                    data: []
                });
            }
        } catch (e) {
            console.log('err: ', e);
            throw e;
        }
    });
};

let getDoctorBySpecialtyAndProvince = async (specialtyId, provinceId) => {
    return new Promise(async (resolve, reject) => {
        try {
            let listDoctorInfo = await db.DoctorInfo.findAll({
                where: {
                    statusId: 'S2'
                },
                attributes: {
                    exclude: ['profile', 'certificate']
                },
                include: [
                    {
                        model: db.User, as: 'doctorData',
                        attributes: {
                            exclude: ['password']
                        },
                    },
                    {
                        model: db.Clinic, as: 'clinicData', attributes: ['id', 'name'],
                        include: [
                            { model: db.Allcode, as: 'provinceData', attributes: ['keyMap', 'value'] }
                        ]
                    },
                    {
                        model: db.Specialty,
                        as: 'specialtyData',
                        through: { attributes: [] },
                        attributes: ['id', 'name']
                    }
                ],
                raw: false,
                nest: true
            });

            let listDoctor = listDoctorInfo.filter(doctor =>
                doctor.specialtyData.some(specialty => {
                    return specialty.id == specialtyId
                })
            );
            listDoctor = listDoctor.filter(doctor => doctor.clinicData.provinceData.keyMap == provinceId);
            if (listDoctor.length > 0) {
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: listDoctor
                });
            } else {
                resolve({
                    errCode: 0,
                    message: 'No doctor found',
                    data: []
                });
            }
        } catch (e) {
            console.log('err: ', e);
            throw e;
        }
    });
};

let confirmDoctor = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let doctor = await db.DoctorInfo.findOne({
                where: {
                    id: id,
                    statusId: 'S1'
                },
                include: [
                    {
                        model: db.User, as: 'doctorData',
                        attributes: {
                            exclude: ['password']
                        },
                        include: [
                            { model: db.Allcode, as: 'genderData', attributes: ['value'] }
                        ]
                    },
                    { model: db.Allcode, as: 'priceData', attributes: ['value'] },
                    { model: db.Allcode, as: 'positionData', attributes: ['value'] },
                    { model: db.Allcode, as: 'paymentData', attributes: ['value'] },
                    { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                    { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] },
                    {
                        model: db.Specialty,
                        as: 'specialtyData',
                        through: { attributes: [] }, // Không lấy thông tin từ bảng trung gian
                        attributes: ['id', 'name']
                    }
                ],
                raw: false,
                nest: true
            })
            doctor.statusId = 'S2';
            await sendConfirmDoctorResult({ email: doctor.doctorData.email, status: 'CONFIRM' });
            await doctor.save();
            resolve({
                errCode: 0,
                message: 'Success',
                data: doctor
            })
        } catch (e) {
            reject(e);
        }
    })
}

let updateDoctorInfo = async (id, data, imagePath, profilePath, certificatePath) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !data.email || !data.username || !data.phonenumber || !data.address || !data.birthdate ||
                !data.gender || !data.clinicId || !data.listSpecialtyId || !data.priceId || !data.paymentId || !data.positionId ||
                !profilePath || !certificatePath) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            } else {
                let user = await db.User.findOne({
                    where: {
                        id: id,
                    },
                    raw: false
                });
                let doctor = await db.DoctorInfo.findOne({
                    where: {
                        doctorId: id
                    },
                    raw: false
                });
                if (user && doctor) {
                    user.email = data.email;
                    user.username = data.username;
                    user.phonenumber = data.phonenumber;
                    user.address = data.address;
                    user.birthdate = data.birthdate;
                    user.gender = data.gender;
                    if (user.image) {
                        let path = user.image.replace(process.env.URL_BASE, 'src\\'); // delete old image
                        await fs.unlink(path); // delete old image
                    }
                    let modifiedImgPath = '';
                    if (imagePath) {
                        let listPath = imagePath.split('\\');
                        imagePath = listPath.slice(1).join('\\');
                        modifiedImgPath = process.env.URL_BASE + imagePath;
                    }
                    user.image = modifiedImgPath;
                    doctor.priceId = data.priceId;
                    doctor.paymentId = data.paymentId;
                    doctor.positionId = data.positionId;
                    doctor.clinicId = data.clinicId;
                    if (doctor.profile) {
                        let path = doctor.profile.replace(process.env.URL_BASE, 'src\\'); // delete old image
                        await fs.unlink(path); // delete old image
                    }
                    let modifiedProfilePath = '';
                    if (profilePath) {
                        let listPath = profilePath.split('\\');
                        profilePath = listPath.slice(1).join('\\');
                        modifiedProfilePath = process.env.URL_BASE + profilePath;
                    }
                    if (doctor.certificate) {
                        let path = doctor.certificate.replace(process.env.URL_BASE, 'src\\'); // delete old image
                        await fs.unlink(path); // delete old image
                    }
                    let modifiedCertificatePath = '';
                    if (certificatePath) {
                        let listPath = certificatePath.split('\\');
                        certificatePath = listPath.slice(1).join('\\');
                        modifiedCertificatePath = process.env.URL_BASE + certificatePath;
                    }
                    doctor.profile = modifiedProfilePath;
                    doctor.certificate = modifiedCertificatePath;
                    doctor.descriptionHTML = data.descriptionHTML;
                    doctor.descriptionText = data.descriptionText;
                    await user.save();
                    await doctor.save();
                    await db.DoctorSpecialty.destroy({
                        where: {
                            doctorId: id
                        }
                    }); // Xóa tất cả dữ liệu trong bảng trung gian
                    for (let i = 0; i < data.listSpecialtyId.length; i++) {
                        await db.DoctorSpecialty.create({
                            doctorId: id,
                            specialtyId: data.listSpecialtyId[i]
                        });
                    }
                    let doctorInfo = await db.DoctorInfo.findOne({
                        where: {
                            doctorId: id,
                        },
                        include: [
                            {
                                model: db.User, as: 'doctorData',
                                attributes: {
                                    exclude: ['password']
                                },
                                include: [
                                    { model: db.Allcode, as: 'genderData', attributes: ['value'] }
                                ]
                            },
                            { model: db.Allcode, as: 'priceData', attributes: ['value'] },
                            { model: db.Allcode, as: 'positionData', attributes: ['value'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['value'] },
                            { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                            { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] },
                            {
                                model: db.Specialty,
                                as: 'specialtyData',
                                through: { attributes: [] }, // Không lấy thông tin từ bảng trung gian
                                attributes: ['id', 'name']
                            }
                        ],
                        raw: false,
                        nest: true
                    })
                    resolve({
                        errCode: 0,
                        message: 'Success',
                        data: doctorInfo
                    });
                } else {
                    resolve({
                        errCode: 2,
                        message: 'Doctor not found'
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
}

let rejectDoctor = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            } else {
                let user = await db.User.findOne({
                    where: {
                        id: id
                    },
                    raw: false
                });
                await sendConfirmDoctorResult({ email: user.email, status: 'REJECT' });
                await user.destroy();
                let doctor = await db.DoctorInfo.findOne({
                    where: {
                        doctorId: id
                    },
                    raw: false
                });
                await doctor.destroy();
                if (user.image) {
                    let path = user.image.replace(process.env.URL_BASE, 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
                if (doctor.profile) {
                    let path = doctor.profile.replace(process.env.URL_BASE, 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
                if (doctor.certificate) {
                    let path = doctor.certificate.replace(process.env.URL_BASE, 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
                await db.DoctorSpecialty.destroy({
                    where: {
                        doctorId: id
                    }
                });
                resolve({
                    errCode: 0,
                    message: 'Success'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let deleteDoctor = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            } else {
                let user = await db.User.findOne({
                    where: {
                        id: id
                    },
                    raw: false
                });
                await user.destroy();
                let doctor = await db.DoctorInfo.findOne({
                    where: {
                        doctorId: id
                    },
                    raw: false
                });
                await doctor.destroy();
                if (user.image) {
                    let path = user.image.replace(process.env.URL_BASE, 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
                if (doctor.profile) {
                    let path = doctor.profile.replace(process.env.URL_BASE, 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
                if (doctor.certificate) {
                    let path = doctor.certificate.replace(process.env.URL_BASE, 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
                await db.DoctorSpecialty.destroy({
                    where: {
                        doctorId: id
                    }
                });
                resolve({
                    errCode: 0,
                    message: 'Success'
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let getScheduleDoctorByDate = async (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('>>>>>id: ', id);
            console.log('>>>>>date: ', date);
            if (!id || !date) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            } else {
                let schedule = await db.Schedule.findAll({
                    where: {
                        doctorId: 27
                    },
                    raw: false
                });

                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: schedule
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

let saveDoctorSchedule = async (id, date, listTimes) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !date || !listTimes) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            } else {
                let doctor = await db.DoctorInfo.findOne({
                    where: {
                        doctorId: id
                    }
                });
                if (doctor) {
                    await db.Schedule.destroy({
                        where: {
                            doctorId: id,
                            date: date
                        }
                    })
                    for (let i = 0; i < listTimes.length; i++) {
                        await db.Schedule.create({
                            doctorId: id,
                            date: date,
                            timeId: listTimes[i],
                            status: 'active'
                        });
                    }
                    resolve({
                        errCode: 0,
                        message: 'Success',
                    });
                } else {
                    resolve({
                        errCode: 2,
                        message: 'Doctor not found'
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

module.exports = {
    getAllDoctorsNotComfirm,
    confirmDoctor,
    getAllDoctorConfirm,
    getRandomDoctor,
    getDoctorById,
    updateDoctorInfo,
    deleteDoctor,
    getScheduleDoctorByDate,
    saveDoctorSchedule,
    getMoreDoctorInfo,
    getDoctorBySpecialty,
    getDoctorBySpecialtyAndProvince,
    rejectDoctor
}