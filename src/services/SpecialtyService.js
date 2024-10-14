import db from '../models/index';
const createSpecialty = async (specialty) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.image || !data.descriptionHTML) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            }
            let specialtyItem = await db.Specialty.create({
                name: specialty.name,
                image: specialty.image,
                descriptionHTML: specialty.descriptionHTML
            });
            resolve({
                errCode: 0,
                message: 'Success',
                data: specialtyItem
            });
        } catch (e) {
            reject(e);
        }
    });
}

const getAllSpecialty = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = await db.Specialty.findAll();
            resolve({
                errCode: 0,
                message: 'Success',
                data: data
            });
        } catch (e) {
            reject(e);
        }
    });
}

const getSpecialtyById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            }
            let data = await db.Specialty.findOne({
                where: { id: id }
            });
            resolve({
                errCode: 0,
                message: 'Success',
                data: data
            });
        } catch (e) {
            reject(e);
        }
    });
}

const updateSpecialty = async (id, specialty) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !specialty.name || !specialty.image || !specialty.descriptionHTML) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            }
            let data = await db.Specialty.findOne({
                where: { id: id }
            });
            if (!data) {
                resolve({
                    errCode: 2,
                    message: 'Cannot find specialty'
                });
            }
            data.name = specialty.name;
            data.image = specialty.image;
            data.descriptionHTML = specialty.descriptionHTML;
            data.save();
            resolve({
                errCode: 0,
                message: 'Success',
                data: data
            });
        } catch (e) {
            reject(e);
        }
    });
}

const deleteSpecialty = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            }
            let data = await db.Specialty.findOne({
                where: { id: id }
            });
            if (!data) {
                resolve({
                    errCode: 2,
                    message: 'Cannot find specialty'
                });
            }
            data.destroy();
            let data1 = await db.Specialty.findAll();
            resolve({
                errCode: 0,
                message: 'Success',
                data: data1
            });
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    createSpecialty: createSpecialty,
    getAllSpecialty: getAllSpecialty,
    getSpecialtyById: getSpecialtyById,
    updateSpecialty: updateSpecialty,
    deleteSpecialty: deleteSpecialty
}