import db from '../models/index';

const getAllUser = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            let listUser = await db.User.findAll({
                where: {
                    roleId: 'R3'
                }
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

const editUser = async (id, data) => {
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
                raw: false
            })
            user.username = data.username;
            user.address = data.address;
            user.phonenumber = data.phonenumber;
            user.image = data.image;
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
                where: { id: id }
            })
            if (!user) {
                resolve({ errCode: 2, message: 'The user isn\'t exist' });
            }
            await db.User.destroy({ where: { id: id } });
            resolve({
                errCode: 0,
                message: 'Success'
            })
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