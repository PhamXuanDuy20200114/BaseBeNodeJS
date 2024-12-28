import { raw } from 'body-parser';
import db from '../models/index';
const fs = require('fs').promises; // Sử dụng fs.promises để có thể dùng với await

const createSpecialty = async (data, path) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.name || !data.descriptionHTML || !data.descriptionText) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            } else {
                let modifiedPath = '';
                if (path) {
                    let listPath = path.split('\\');
                    path = listPath.slice(1).join('\\');
                    modifiedPath = process.env.URL_BASE + path;
                }
                let specialtyItem = await db.Specialty.create({
                    name: data.name,
                    image: modifiedPath,
                    descriptionHTML: data.descriptionHTML,
                    descriptionText: data.descriptionText
                });
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: specialtyItem
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

const get6Specialty = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let data = [];
            let res = await db.Specialty.findAll();
            if (res.length > 6) {
                for (let i = 0; i < 6; i++) {
                    data.push(res[i]);
                }
            }
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

const updateSpecialty = async (id, specialty, path) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !specialty.name || !specialty.descriptionHTML || !specialty.descriptionText) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            }
            let data = await db.Specialty.findOne({
                where: { id: id },
                raw: false,
            });
            if (!data) {
                resolve({
                    errCode: 2,
                    message: 'Cannot find specialty'
                });
            } else {
                data.name = specialty.name;
                if (data.image) {
                    const path = data.image.replace(process.env.URL_BASE, 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
                let modifiedPath = '';
                if (path) {
                    let listPath = path.split('\\');
                    path = listPath.slice(1).join('\\');
                    modifiedPath = process.env.URL_BASE + path;
                }
                data.image = modifiedPath;
                data.descriptionHTML = specialty.descriptionHTML;
                data.descriptionText = specialty.descriptionText;
                await data.save();
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: data
                });
            }
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
            } else {
                await db.Specialty.destroy({
                    where: { id: id }
                });
                if (data.image) {
                    const path = data.image.replace(process.env.URL_BASE, 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
                resolve({
                    errCode: 0,
                    message: 'Success',
                });
            }

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
    deleteSpecialty: deleteSpecialty,
    get6Specialty: get6Specialty
}