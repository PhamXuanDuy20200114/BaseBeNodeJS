import bcrypt from 'bcryptjs';
import db from '../models/index';
import jwt from 'jsonwebtoken';
require('dotenv').config();
const salt = bcrypt.genSaltSync(10);
const registerService = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password || !data.username || !data.phonenumber || !data.birthdate || !data.gender) {
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
            } else {
                const hash = hashPassword(data.password);
                const user = await db.User.create({
                    email: data.email,
                    password: hash,
                    username: data.username,
                    phonenumber: data.phonenumber,
                    address: data.address,
                    birthdate: data.birthdate,
                    gender: data.gender,
                    image: data.image,
                    roleId: 'R3'
                });
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: user
                });
            }
        } catch (e) {
            reject(e);
        }

    });
}

const doctorRegisterService = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password || !data.userName || !data.phonenumber || !data.address ||
                !data.priceId || !data.positionId || !data.paymentId || !data.clinicId ||
                !data.introduction || !data.specializations || !data.workProcess || !data.training) {
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
            } else {
                const hash = hashPassword(data.password);
                const user = await db.User.create({
                    email: data.email,
                    password: hash,
                    username: data.userName,
                    phonenumber: data.phonenumber,
                    address: data.address,
                    gender: data.gender,
                    image: data.image,
                    roleId: 'R2'
                });
                const doctorData = await db.DoctorInfo.create({
                    doctorId: user.id,
                    priceId: data.priceId,
                    positionId: data.positionId,
                    paymentId: data.paymentId,
                    clinicId: data.clinicId,
                    introduction: data.introduction,
                    specializations: data.specializations,
                    workProcess: data.workProcess,
                    training: data.training,
                    project: data.project,
                    statusId: 'ST1'
                });
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: {
                        user: user,
                        doctorData: doctorData
                    }
                });
            }
        } catch (e) {
            console.log(e);
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
            } else {
                const userExist = await db.User.findOne({
                    where: {
                        email: data.email
                    },
                    raw: false
                });
                console.log('>>>>>>>>>', userExist);
                if (!userExist) {
                    resolve({
                        errCode: 3,
                        message: 'Account is not exist'
                    });
                } else {
                    if (!checkPassword(data.password, userExist.password)) {
                        resolve({
                            errCode: 4,
                            message: 'Password is incorrect'
                        });
                    } else {
                        const refreshToken = userExist.refreshtoken;
                        if (!refreshToken) {
                            const newRefreshToken = generateRefreshToken(userExist);
                            const newAccessToken = generateAccessToken(userExist);
                            userExist.refreshtoken = newRefreshToken;
                            await userExist.save();
                            const { password, ...another } = userExist.dataValues
                            resolve({
                                errCode: 0,
                                mesage: 'Success',
                                data: another,
                                token: newAccessToken
                            })
                        } else {
                            jwt.verify(refreshToken, process.env.JWT_REFRESH, async (err, user) => {
                                if (err) {
                                    const newRefreshToken = generateRefreshToken(userExist);
                                    const newAccessToken = generateAccessToken(userExist);
                                    userExist.refreshtoken = newRefreshToken;
                                    await userExist.save();
                                    const { password, ...another } = userExist.dataValues
                                    resolve({
                                        errCode: 0,
                                        mesage: 'Success',
                                        data: another,
                                        token: newAccessToken
                                    })

                                } else {
                                    const newAccessToken = generateAccessToken(userExist);
                                    const { password, ...another } = userExist.dataValues
                                    resolve({
                                        errCode: 0,
                                        mesage: 'Success',
                                        data: another,
                                        token: newAccessToken
                                    })
                                }
                            })
                        }
                    }
                }

            }
        } catch (e) {
            reject(e);
        }
    });
}
const refreshAccessToken = async (refreshToken, id, roleId, res) => {
    return new Promise(async (resolve, reject) => {
        try {
            jwt.verify(refreshToken, process.env.JWT_REFRESH, (err, user) => {
                if (err) {
                    return res.status(401).json({
                        errCode: 401,
                        message: 'You are not authenticated'
                    })
                } else {
                    const newAccessToken = generateAccessToken({ id, roleId });
                    resolve({
                        errCode: 0,
                        message: 'Success',
                        accessToken: newAccessToken,
                    });
                }
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
            exp: Math.floor(Date.now() / 1000) + 10
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
            exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 3
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
    doctorRegisterService
}

