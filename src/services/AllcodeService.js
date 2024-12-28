import db from '../models/index';
import { Op, where } from 'sequelize';
const getAllProvinces = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let provinces = await db.Allcode.findAll(
                { where: { type: 'PROVINCE' } }
            );
            resolve({
                errCode: 0,
                message: 'Success',
                data: provinces
            });
        } catch (e) {
            reject(e);
        }
    });
}

const getAllPrices = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let prices = await db.Allcode.findAll(
                { where: { type: 'PRICE' } }
            );
            resolve({
                errCode: 0,
                message: 'Success',
                data: prices
            });
        } catch (e) {
            reject(e);
        }
    });
}

const getAllPaymentMethods = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let paymentMethods = await db.Allcode.findAll({
                where: { type: 'PAYMENT' },
                attributes: {
                    exclude: []
                }
            });
            resolve({
                errCode: 0,
                message: 'Success',
                data: paymentMethods
            });
        } catch (e) {
            reject(e);
        }
    });
}

const getAllPositions = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let positions = await db.Allcode.findAll({
                where: { type: 'POSITION' },
                attributes: {
                    exclude: []
                }
            });
            resolve({
                errCode: 0,
                message: 'Success',
                data: positions
            });
        } catch (e) {
            reject(e);
        }
    });
}

const getAllTimes = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let time = await db.Allcode.findAll({
                where: { type: 'TIME' },
                attributes: {
                    exclude: []
                }
            });
            resolve({
                errCode: 0,
                message: 'Success',
                data: time
            });
        } catch (e) {
            reject(e);
        }
    });
}

const getTimeById = async (timeId) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log('>>>>>timeId: ', timeId);
            if (!timeId) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required parameters'
                });
            } else {
                let time = await db.Allcode.findOne({
                    where: { keyMap: timeId },
                    raw: false
                });
                if (!time) {
                    resolve({
                        errCode: -1,
                        errMessage: 'Time not found'
                    });
                } else {
                    resolve({
                        errCode: 0,
                        data: time
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
}

const searchInfo = async (mode, tag) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!mode || !tag) {
                resolve({
                    errCode: -1,
                    errMessage: 'Missing required parameters'
                });
            } else {
                let data = {};
                let doctorData = [];
                let clinicData = [];
                let specialtyData = [];
                let notebookData = [];
                switch (mode) {
                    case 'all':
                        doctorData = await findDoctorByTag(tag);
                        clinicData = await findClinicByTag(tag);
                        specialtyData = await findSpecialtyByTag(tag);
                        notebookData = await findNoteBookByTag(tag);
                        data = {
                            doctorData,
                            clinicData,
                            specialtyData,
                            notebookData
                        }
                        break;
                    case 'doctor':
                        doctorData = await findDoctorByTag(tag);
                        data = {
                            doctorData
                        }
                        break;
                    case 'clinic':
                        clinicData = await findClinicByTag(tag);
                        data = {
                            clinicData
                        }
                        break;
                    case 'specialty':
                        specialtyData = await findSpecialtyByTag(tag);
                        data = {
                            specialtyData
                        }
                        break;
                    case 'notebook':
                        notebookData = await findNoteBookByTag(tag);
                        data = {
                            notebookData
                        }
                        break;
                    default:
                        break;
                }
                if (data) {
                    resolve({
                        errCode: 0,
                        message: 'Success',
                        data
                    });
                } else {
                    resolve({
                        errCode: -1,
                        message: 'No data found',
                        data: []
                    });
                }
            }
        } catch (e) {
            reject(e);
        }
    });
}

const findDoctorByTag = async (tag) => {
    try {
        const doctorData = await db.DoctorInfo.findAll({
            where: {
                statusId: 'S2',
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
                    where: {
                        roleId: 'R2',
                        username: { [Op.like]: `%${tag}%` }
                    },
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
        return doctorData;
    } catch (e) {
        console.log(e);
    }
}

const findClinicByTag = async (tag) => {
    try {
        let clinicData = await db.Clinic.findAll({
            where: { name: { [Op.like]: `%${tag}%` } },
        });
        return clinicData;
    } catch (e) {
        console.log(e);
    }
}

const findSpecialtyByTag = async (tag) => {
    try {
        let specialtyData = await db.Specialty.findAll({
            where: {
                name: { [Op.like]: `%${tag}%` }
            }
        });
        return specialtyData;
    } catch (e) {
        console.log(e);
    }
}

const findNoteBookByTag = async (tag) => {
    try {
        let notebookData = await db.Notebook.findAll({
            where: {
                title: { [Op.like]: `%${tag}%` }
            }
        });
        return notebookData;
    } catch (e) {
        console.log(e);
    }
}

module.exports = {
    getAllProvinces: getAllProvinces,
    getAllPrices: getAllPrices,
    getAllPaymentMethods: getAllPaymentMethods,
    getAllPositions: getAllPositions,
    getAllTimes: getAllTimes,
    getTimeById: getTimeById,
    searchInfo: searchInfo
}