import db from '../models/index';
const getAllDoctorsNotComfirm = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const listDoctor = await db.User.findAll({
                where: {
                    roleId: 'R2',
                },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: db.DoctorInfo, as: 'doctorData',
                        where: {
                            statusId: 'S1'  // Điều kiện lọc statusId trong DoctorInfo
                        },
                        attributes: ['introduction', 'specializations', 'workProcess', 'training'],
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['value'] },
                            { model: db.Allcode, as: 'positionData', attributes: ['value'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['value'] },
                            { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                            { model: db.Clinic, as: 'clinicData', attributes: ['name', 'address', 'image'] }
                        ]
                    },
                    { model: db.Allcode, as: 'genderData', attributes: ['value'] },
                ],
                raw: false,
                nest: true
            });
            resolve({
                errCode: 0,
                message: 'Success',
                data: listDoctor
            })
        } catch (e) {
            console.log('err: ', e);
            reject(e);
        }
    });
}

const getAllDoctorConfirm = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const listDoctor = await db.User.findAll({
                where: {
                    roleId: 'R2',
                },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: db.DoctorInfo, as: 'doctorData',
                        where: {
                            statusId: 'S2'  // Điều kiện lọc statusId trong DoctorInfo
                        },
                        attributes: ['introduction', 'specializations', 'workProcess', 'training'],
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['value'] },
                            { model: db.Allcode, as: 'positionData', attributes: ['value'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['value'] },
                            { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                            { model: db.Clinic, as: 'clinicData', attributes: ['name', 'address', 'image'] }
                        ]
                    },
                    { model: db.Allcode, as: 'genderData', attributes: ['value'] },
                ],
                raw: false,
                nest: true
            });
            resolve({
                errCode: 0,
                message: 'Success',
                data: listDoctor
            })
        } catch (e) {
            reject(e);
        }
    });
}

const getDocyorById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctor = await db.User.findOne({
                where: {
                    id: id,
                    roleId: 'R2'
                },
                attributes: {
                    exclude: ['password']
                },
                include: [
                    {
                        model: db.DoctorInfo, as: 'doctorData',
                        attributes: ['introduction', 'specializations', 'workProcess', 'training'],
                        include: [
                            { model: db.Allcode, as: 'priceData', attributes: ['value'] },
                            { model: db.Allcode, as: 'positionData', attributes: ['value'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['value'] },
                            { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                            { model: db.Clinic, as: 'clinicData', attributes: ['name', 'address', 'image'] }
                        ]
                    },
                    { model: db.Allcode, as: 'genderData', attributes: ['value'] },
                ],
                raw: false,
                nest: true
            });
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

const confirmDoctor = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const doctor = await db.DoctorInfo.findOne({
                where: {
                    doctorId: id,
                    statusId: 'S1'
                },
                raw: false
            })
            doctor.statusId = 'S2';
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

const updateDoctorInfo = async (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            }
            const doctor = await db.DoctorInfo.findOne({
                where: {
                    doctorId: id
                },
                raw: false
            });
            if (doctor) {
                doctor.priceId = data.priceId;
                doctor.positionId = data.positionId;
                doctor.paymentId = data.paymentId;
                doctor.clinicId = data.clinicId;
                doctor.introduction = data.introduction;
                doctor.specializations = data.specializations;
                doctor.workProcess = data.workProcess;
                doctor.training = data.training;
                doctor.project = data.project;
                await doctor.save();
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: doctor
                });
            } else {
                resolve({
                    errCode: 2,
                    message: 'Doctor not found'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

const deleteDoctor = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await db.User.findOne({
                where: {
                    id: id,
                    roleId: 'R2'
                },
                raw: false
            });
            const doctor = await db.DoctorInfo.findOne({
                where: {
                    doctorId: id
                },
                raw: false
            });
            if (doctor && user) {
                await user.destroy();
                await doctor.destroy();
                const listDoctor = await db.User.findAll({
                    where: {
                        roleId: 'R2',
                    },
                    attributes: {
                        exclude: ['password']
                    },
                    include: [
                        {
                            model: db.DoctorInfo, as: 'doctorData',
                            where: {
                                statusId: 'S2'  // Điều kiện lọc statusId trong DoctorInfo
                            },
                            attributes: ['introduction', 'specializations', 'workProcess', 'training'],
                            include: [
                                { model: db.Allcode, as: 'priceData', attributes: ['value'] },
                                { model: db.Allcode, as: 'positionData', attributes: ['value'] },
                                { model: db.Allcode, as: 'paymentData', attributes: ['value'] },
                                { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                                { model: db.Clinic, as: 'clinicData', attributes: ['name', 'address', 'image'] }
                            ]
                        },
                        { model: db.Allcode, as: 'genderData', attributes: ['value'] },
                    ],
                    raw: false,
                    nest: true
                });
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: listDoctor
                });
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
    getDocyorById,
    updateDoctorInfo,
    deleteDoctor
}