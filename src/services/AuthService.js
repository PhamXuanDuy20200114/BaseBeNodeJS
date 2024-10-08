import bcrypt from 'bcryptjs';
import db from '../models/index';
import jwt from 'jsonwebtoken';
import user from '../models/user';
require('dotenv').config();
const salt = bcrypt.genSaltSync(10);
const registerService = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password || !data.userName || !data.phonenumber || !data.gender) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters'
                });
            }
            const userExist = await findUserByEmail(data.email);
            if (userExist) {
                resolve({
                    errCode: 2,
                    message: 'User has already existed'
                });
            }
            const hash = hashPassword(data.password);
            const user = await db.User.create({
                email: data.email,
                password: hash,
                username: data.userName,
                phonenumber: data.phonenumber,
                address: data.address,
                gender: data.gender,
                image: data.image,
                roleId: 'R3'
            });
            resolve({
                errCode: 0,
                message: 'Success',
                data: user
            });
        } catch (e) {
            reject(e);
        }

    });
}
const loginService = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password) {
                resolve({
                    errCode: 1,
                    message: 'Missing require parameter'
                });
            }
            const userExist = await findUserByEmail(data.email);
            if (!userExist) {
                resolve({
                    errCode: 3,
                    message: 'Account is not exist'
                });
            }
            if (!checkPassword(data.password, userExist.password)) {
                resolve({
                    errCode: 4,
                    message: 'Password is incorrect'
                });
            }
            const refreshToken = userExist.refreshtoken;
            if (refreshToken) {
                const haveRefreshToken = jwt.verify(refreshToken, process.env.JWT_REFRESH);
                if (!haveRefreshToken) {
                    userExist.refreshtoken = generateRefreshToken(userExist);
                    updateUser = await userExist.save();
                    const token = generateAccessToken(userExist);
                    const { password, ...another } = userExist.dataValues;
                    resolve({
                        errCode: 0,
                        message: 'Succcess',
                        data: another,
                        token: token,
                    });
                } else {
                    const token = generateAccessToken(userExist);
                    const { password, ...another } = userExist.dataValues;
                    resolve({
                        errCode: 0,
                        message: 'Succcess',
                        data: another,
                        token: token,
                    });
                }
            }
            const token = generateAccessToken(userExist);
            const newRefreshToken = generateRefreshToken(userExist);
            userExist.refreshtoken = newRefreshToken;
            await userExist.save();
            const { password, ...another } = userExist.dataValues;
            resolve({
                errCode: 0,
                message: 'Succcess',
                data: another,
                token: token,
            });
        } catch (e) {
            reject(e);
        }
    });
}
const refreshAccessToken = async (refreshToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            jwt.sign(refreshToken, process.env.JWT_REFRESH, (err, user) => {
                if (err) {
                    return res.status(403).json({
                        errCode: 5,
                        message: 'Token is not valid'
                    })
                }
                const newAccessToken = generateAccessToken(user);
                const newRefreshToken = generateRefreshToken(user);
                resolve({
                    errCode: 0,
                    message: 'Success',
                    accessToken: newAccessToken,
                    refreshToken: newRefreshToken
                });
            })
        } catch (e) {
            reject(e);
        }
    });
}

const logout = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing require parameter'
                })
            }
            const user = await db.User.findOne({
                where: {
                    id: id
                },
                raw: false
            })
            user.refreshtoken = '';
            await user.save();
            resolve({
                errCode: 0,
                message: 'Success'
            })
        } catch (e) {
            reject(e);
        }
    });
}

const findUserByEmail = async (email) => {
    const user = await db.User.findOne({
        where: {
            email: email
        },
        raw: false
    })
    return user;
}

const hashPassword = (password) => {
    const hash = bcrypt.hashSync(password, salt);
    return hash;
}

const checkPassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
}

const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            roleId: user.roleId,
            exp: Math.floor(Date.now() / 1000) + 30 * 60
        },
        process.env.JWT_SECRET,
        {
            algorithm: 'HS256'
        }
    );
}

const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            roleId: user.roleId,
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
        },
        process.env.JWT_REFRESH,
        {
            algorithm: 'HS256'
        }
    );
}
module.exports = {
    registerService,
    loginService,
    refreshAccessToken,
    logout
}

