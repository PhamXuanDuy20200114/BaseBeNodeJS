import db from '../models/index';
const fs = require('fs').promises; // Sử dụng fs.promises để có thể dùng với await

const getAllUser = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let listUser = await db.User.findAll({
                where: {
                    roleId: 'R3'
                },
                attributes: {
                    exclude: ['password'],
                },
                include: [
                    { model: db.Allcode, as: 'roleData', attributes: ['value'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['value'] }
                ],
                raw: false,
                nest: true
            });
            resolve({
                errCode: 0,
                message: 'Success',
                data: listUser
            });
        } catch (e) {
            reject(e);
        }
    })
}

const editUser = async (id, data, path) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing require parameter'
                });
            }
            const user = await db.User.findOne({
                where: {
                    id: id
                },
                include: [
                    { model: db.Allcode, as: 'roleData', attributes: ['value'] },
                    { model: db.Allcode, as: 'genderData', attributes: ['value'] }
                ],
                raw: false,
                nest: true
            })
            if (!user) {
                resolve({
                    errCode: 2,
                    message: 'The user isn\'t exist'
                });
            }
            user.username = data.username;
            user.address = data.address;
            user.phonenumber = data.phonenumber;
            user.birthdate = data.birthdate;
            if (user.image) {
                const path = user.image.replace('http:\\\\localhost:8080\\', 'src\\'); // delete old image
                await fs.unlink(path); // delete old image
            }
            let listPath = path.split('\\');
            path = listPath.slice(1).join('\\');
            let modifiedPath = 'http:\\\\localhost:8080\\' + path;
            user.image = modifiedPath;
            user.gender = data.gender;
            const updateUser = await user.save();
            resolve({
                errCode: 0,
                message: 'Success',
                data: updateUser
            })
        } catch (e) {
            reject(e);
        }
    })
}

const deleteUser = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            let user = await db.User.findOne({
                where: { id: id },
                raw: false
            })
            if (!user) {
                resolve({ errCode: 2, message: 'The user isn\'t exist' });
            } else {
                if (user.image) {
                    const path = user.image.replace('http:\\\\localhost:8080\\', 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
                await db.User.destroy({ where: { id: id } });
                resolve({
                    errCode: 0,
                    message: 'Success',
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

const getUserById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing require parameter'
                });
            }
            const user = await db.User.findOne({
                where: {
                    id: id
                }
            })
            resolve({
                errCode: 0,
                data: user
            })
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    getAllUser,
    editUser,
    deleteUser,
    getUserById
}