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
            if (userExist && userExist.RoleId) {
                resolve({
                    errCode: 2,
                    message: 'User has already existed'
                });
            } else {
                let user = {};
                if (userExist && !userExist.RoleId) {
                    const hash = hashPassword(data.password);
                    userExist.password = hash;
                    userExist.username = data.username;
                    userExist.phonenumber = data.phonenumber;
                    userExist.address = data.address;
                    userExist.birthdate = data.birthdate;
                    userExist.gender = data.gender;
                    userExist.image = data.image;
                    user = await userExist.save();
                } else {
                    const hash = hashPassword(data.password);
                    user = await db.User.create({
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
                }
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

const doctorRegisterService = async (data, imagePath, profilePath, certificatePath) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.email || !data.password || !data.username || !data.phonenumber || !data.address || !data.birthdate || !data.statusId ||
                !data.gender || !data.clinicId || !data.listSpecialtyId || !data.priceId || !data.paymentId || !data.positionId ||
                !profilePath || !certificatePath) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameters'
                });
            } else {
                const userExist = await findUserByEmail(data.email);
                if (userExist) {
                    resolve({
                        errCode: 2,
                        message: 'User has already existed'
                    });
                } else {
                    const hash = hashPassword(data.password);
                    let listPath = imagePath.split('\\');
                    imagePath = listPath.slice(1).join('\\');
                    let modifiedImgPath = process.env.URL_BASE + imagePath;
                    const user = await db.User.create({
                        email: data.email,
                        password: hash,
                        username: data.username,
                        phonenumber: data.phonenumber,
                        address: data.address,
                        birthdate: data.birthdate,
                        gender: data.gender,
                        image: modifiedImgPath,
                        roleId: 'R2'
                    });
                    let listProfilePath = profilePath.split('\\');
                    profilePath = listProfilePath.slice(1).join('\\');
                    let modifiedProfilePath = process.env.URL_BASE + profilePath;
                    let listCertificatePath = certificatePath.split('\\');
                    certificatePath = listCertificatePath.slice(1).join('\\');
                    let modifiedCertificatePath = process.env.URL_BASE + certificatePath;
                    const doctorData = await db.DoctorInfo.create({
                        doctorId: user.id,
                        clinicId: data.clinicId,
                        priceId: data.priceId,
                        paymentId: data.paymentId,
                        positionId: data.positionId,
                        profile: modifiedProfilePath,
                        certificate: modifiedCertificatePath,
                        descriptionHTML: data.descriptionHTML,
                        descriptionText: data.descriptionText,
                        statusId: data.statusId
                    });

                    if (data.listSpecialtyId && data.listSpecialtyId.length > 0) {
                        for (let i = 0; i < data.listSpecialtyId.length; i++) {
                            await db.DoctorSpecialty.create({
                                doctorId: user.id,
                                specialtyId: data.listSpecialtyId[i]
                            });
                        }
                    }
                    const doctor = await db.DoctorInfo.findOne({
                        where: {
                            doctorId: user.id,
                        },
                        include: [
                            {
                                model: db.User, as: 'doctorData',
                                attributes: {
                                    exclude: ['password']
                                },
                                include: [
                                    { model: db.Allcode, as: 'genderData', attributes: ['value'] }
                                ]
                            },
                            { model: db.Allcode, as: 'priceData', attributes: ['value'] },
                            { model: db.Allcode, as: 'positionData', attributes: ['value'] },
                            { model: db.Allcode, as: 'paymentData', attributes: ['value'] },
                            { model: db.Allcode, as: 'statusData', attributes: ['value'] },
                            { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name'] },
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
                    resolve({
                        errCode: 0,
                        message: 'Success',
                        data: doctor
                    });
                }
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
                if (!userExist) {
                    resolve({
                        errCode: 3,
                        message: 'Account is not exist'
                    });
                } else {
                    if (userExist.roleId === 'R2') {
                        let doctorInfo = await db.DoctorInfo.findOne({
                            where: {
                                doctorId: userExist.id
                            },
                            attributes: ['statusId']
                        })
                        if (doctorInfo.statusId === 'S1') {
                            resolve({
                                errCode: 5,
                                message: 'Doctor is not active'
                            });
                        }
                    }
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
            exp: Math.floor(Date.now() / 1000) + 10 * 60
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

