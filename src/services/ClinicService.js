import db from '../models/index';
const fs = require('fs').promises; // Sử dụng fs.promises để có thể dùng với await
const createClinic = async (clinic, pathImage) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinic.name || !clinic.address || !clinic.descriptionHTML || !clinic.provinceId || !clinic.descriptionText ||
                !clinic.email || !clinic.phonenumber
            ) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            } else {
                let listPath = pathImage.split('\\');
                pathImage = listPath.slice(1).join('\\');
                let modifiedPath = "http:\\\\localhost:8080\\" + pathImage
                let clinicItem = await db.Clinic.create({
                    name: clinic.name,
                    provinceId: clinic.provinceId,
                    address: clinic.address,
                    image: modifiedPath,
                    descriptionHTML: clinic.descriptionHTML,
                    descriptionText: clinic.descriptionText,
                    email: clinic.email,
                    phonenumber: clinic.phonenumber,
                    website: clinic.website,
                });
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: clinicItem
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

const getAllClinic = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const listClinics = await db.Clinic.findAll(
                {
                    include: [
                        { model: db.Allcode, as: 'provinceData', attributes: ['value'] }
                    ],
                    raw: false,
                    nest: true
                }
            );
            resolve({
                errCode: 0,
                message: 'Success',
                data: listClinics
            });
        } catch (e) {
            reject(e)
        }
    })
}

const getClinicById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            }
            let data = await db.Clinic.findOne({
                where: { id: id },
                include: [
                    { model: db.Allcode, as: 'provinceData', attributes: ['value'] }
                ],
                raw: false,
                nest: true
            });
            resolve({
                errCode: 0,
                message: 'Success',
                data: data
            });
        } catch (e) {
            reject(e);
        }
    })
}

const updateClinicInfo = async (id, clinic, imagePath) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            }
            const clinicItem = await db.Clinic.findOne({
                where: {
                    id: id
                },
                raw: false
            });
            if (clinicItem) {
                if (clinicItem.image) {
                    const path = clinicItem.image.replace('http:\\\\localhost:8080\\', 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
                let listPath = imagePath.split('\\');
                imagePath = listPath.slice(1).join('\\');
                let modifiedPath = 'http:\\\\localhost:8080\\' + imagePath;
                clinicItem.name = clinic.name;
                clinicItem.address = clinic.address;
                clinicItem.image = modifiedPath;
                clinicItem.descriptionHTML = clinic.descriptionHTML;
                clinicItem.descriptionText = clinic.descriptionText;
                clinicItem.provinceId = clinic.provinceId;
                clinicItem.email = clinic.email;
                clinicItem.phonenumber = clinic.phonenumber;
                clinicItem.website = clinic.website;
                await clinicItem.save();
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: clinicItem
                });
            } else {
                resolve({
                    errCode: 2,
                    message: 'Cannot find clinic'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

const deleteClinic = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            }
            let data = await db.Clinic.findOne({
                where: {
                    id: id
                },
                raw: false
            });
            if (data) {
                if (data.image) {
                    const path = data.image.replace('http:\\\\localhost:8080\\', 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
                await data.destroy();
                resolve({
                    errCode: 0,
                    message: 'Success'
                });
            } else {
                resolve({
                    errCode: 2,
                    message: 'Cannot find clinic'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    createClinic: createClinic,
    getAllClinic: getAllClinic,
    getClinicById: getClinicById,
    updateClinicInfo: updateClinicInfo,
    deleteClinic: deleteClinic
}