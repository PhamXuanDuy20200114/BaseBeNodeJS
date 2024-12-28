import { create } from 'domain';
import db from '../models/index';
const fs = require('fs').promises; // Sử dụng fs.promises để có thể dùng với await
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const createUser = async (data, path) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.username || !data.address || !data.phonenumber || !data.birthdate || !data.gender || !data.password) {
                resolve({
                    errCode: 1,
                    message: 'Missing require parameter'
                });
            } else {
                let modifiedPath = '';
                if (path) {
                    let listPath = path.split('\\');
                    path = listPath.slice(1).join('\\');
                    modifiedPath = process.env.URL_BASE + path;
                }
                const user = await db.User.create({
                    email: data.email,
                    password: bcrypt.hashSync(data.password, salt),
                    username: data.username,
                    address: data.address,
                    image: modifiedPath,
                    gender: data.gender,
                    phonenumber: data.phonenumber,
                    birthdate: data.birthdate,
                    roleId: 'R3'
                })
                let userInfo = await db.User.findOne({
                    where: {
                        id: user.id,
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
                    data: userInfo
                })
            }
        } catch (e) {
            reject(e);
        }
    })
}

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

const getAllDoctorAndUser = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let listUser = await db.User.findAll({
                where: {
                    roleId: {
                        [db.Sequelize.Op.or]: ['R2', 'R3']
                    }
                },
                attributes: {
                    exclude: ['password'],
                },
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
            if (!id || !data.email || !data.username || !data.address || !data.phonenumber || !data.birthdate || !data.gender) {
                resolve({
                    errCode: 1,
                    message: 'Missing require parameter'
                });
            } else {
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
                } else {
                    user.username = data.username;
                    user.address = data.address;
                    user.phonenumber = data.phonenumber;
                    user.birthdate = data.birthdate;
                    user.gender = data.gender;
                    if (user.image) {
                        const path = user.image.replace(process.env.URL_BASE, 'src\\'); // delete old image
                        await fs.unlink(path); // delete old image
                    }
                    let modifiedPath = '';
                    if (path) {
                        let listPath = path.split('\\');
                        path = listPath.slice(1).join('\\');
                        modifiedPath = process.env.URL_BASE + path;
                    }
                    user.image = modifiedPath;
                    const updateUser = await user.save();
                    resolve({
                        errCode: 0,
                        message: 'Success',
                        data: updateUser
                    })
                }
            }
        } catch (e) {
            reject(e);
        }
    })
}

const deleteUser = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing require parameter'
                });
            } else {
                let user = await db.User.findOne({
                    where: { id: id },
                    raw: false
                })
                if (!user) {
                    resolve({ errCode: 2, message: 'The user isn\'t exist' });
                } else {
                    await db.User.destroy({ where: { id: id } });
                    if (user.image) {
                        const path = user.image.replace(process.env.URL_BASE, 'src\\'); // delete old image
                        await fs.unlink(path); // delete old image
                    }
                    resolve({
                        errCode: 0,
                        message: 'Success',
                    })
                }
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
            } else {
                let userInfo = await db.User.findOne({
                    where: {
                        id: id,
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
                    data: userInfo
                })
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    createUser,
    getAllUser,
    getAllDoctorAndUser,
    editUser,
    deleteUser,
    getUserById
}