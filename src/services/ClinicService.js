import db from '../models/index';
const fs = require('fs').promises; // Sử dụng fs.promises để có thể dùng với await
const createClinic = async (clinic, pathImage, pathBackground) => {
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
                let modifiedPath = '';
                if (pathImage) {
                    let listPath = pathImage.split('\\');
                    pathImage = listPath.slice(1).join('\\');
                    modifiedPath = process.env.URL_BASE + pathImage
                }
                let modifiedBackgroundPath = '';
                if (pathBackground) {
                    let listPath = pathBackground.split('\\');
                    pathBackground = listPath.slice(1).join('\\');
                    modifiedBackgroundPath = process.env.URL_BASE + pathBackground
                }
                let clinicItem = await db.Clinic.create({
                    name: clinic.name,
                    provinceId: clinic.provinceId,
                    address: clinic.address,
                    image: modifiedPath,
                    background: modifiedBackgroundPath,
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

const getClinicByAlphabet = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const EXCLUDED_WORDS = ['Trung tâm', 'Y tế', 'Bệnh viện', 'Hệ thống', 'Phòng khám', 'Khám sức khỏe', 'định kỳ', ',', '.'];
            // Lấy tất cả các bệnh viện từ database
            const hospitals = await db.Clinic.findAll();
            // Nhóm bệnh viện theo chữ cái đầu tiên
            const groupedHospitals = {};

            hospitals.forEach(hospital => {
                // Loại bỏ các từ không cần thiết
                let name = hospital.name;
                EXCLUDED_WORDS.forEach(word => {
                    name = name.replace(word, '').trim();
                });
                name = name.charAt(0).toUpperCase();
                if (!groupedHospitals[name]) {
                    groupedHospitals[name] = [];
                }
                groupedHospitals[name].push(hospital);
            });

            // Sắp xếp các nhóm theo thứ tự A, B, C, ...
            const sortedGroupedHospitals = Object.keys(groupedHospitals)
                .sort() // Sắp xếp các chữ cái theo thứ tự bảng chữ cái
                .reduce((acc, key) => {
                    acc[key] = groupedHospitals[key];
                    return acc;
                }, {});

            resolve({
                errCode: 0,
                message: 'Success',
                data: sortedGroupedHospitals
            });

        } catch (e) {
            reject(e);
        }
    });
}


const updateClinicInfo = async (id, clinic, imagePath, backgroundPath) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !clinic.name || !clinic.address || !clinic.descriptionHTML || !clinic.provinceId || !clinic.descriptionText ||
                !clinic.email || !clinic.phonenumber || !imagePath || !backgroundPath) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            } else {
                const clinicItem = await db.Clinic.findOne({
                    where: {
                        id: id
                    },
                    raw: false
                });
                if (clinicItem) {
                    if (clinicItem.image) {
                        const path = clinicItem.image.replace(process.env.URL_BASE, 'src\\'); // delete old image
                        await fs.unlink(path); // delete old image
                    }
                    if (clinicItem.background) {
                        const path = clinicItem.background.replace(process.env.URL_BASE, 'src\\'); // delete old image
                        await fs.unlink(path); // delete old image
                    }
                    let modifiedPath = '';
                    if (imagePath) {
                        let listPath = imagePath.split('\\');
                        imagePath = listPath.slice(1).join('\\');
                        modifiedPath = process.env.URL_BASE + imagePath;
                    }
                    let modifiedBackgroundPath = '';
                    if (backgroundPath) {
                        let listPath = backgroundPath.split('\\');
                        backgroundPath = listPath.slice(1).join('\\');
                        modifiedBackgroundPath = process.env.URL_BASE + backgroundPath;
                    }
                    clinicItem.name = clinic.name;
                    clinicItem.address = clinic.address;
                    clinicItem.image = modifiedPath;
                    clinicItem.background = modifiedBackgroundPath;
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
                await db.Clinic.destroy({
                    where: {
                        id: id
                    }
                });
                if (data.image) {
                    const path = data.image.replace(process.env.URL_BASE, 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
                if (data.background) {
                    const path = data.background.replace(process.env.URL_BASE, 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
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
    deleteClinic: deleteClinic,
    getClinicByAlphabet: getClinicByAlphabet
}