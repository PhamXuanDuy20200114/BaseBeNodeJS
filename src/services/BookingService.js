import db from '../models/index';
import { Sequelize } from 'sequelize';
import { sendSimpleEmail, sendBookingConfirmResult } from './EmailService';
import bcrypt from 'bcryptjs';
const salt = bcrypt.genSaltSync(10);
const moment = require('moment');

const createNewBooking = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.doctorId || !data.doctorName || !data.clinicName || !data.clinicAddress ||
                !data.email || !data.name || !data.phone || !data.address || !data.reason ||
                !data.date || !data.timeId || !data.timeString
            ) {
                resolve({
                    errCode: -1,
                    message: 'Thiếu thông tin bắt buộc!'
                });
            } else {
                let schedule = await db.Schedule.findOne({
                    where: { doctorId: data.doctorId, date: data.date, timeId: data.timeId },
                    raw: false
                })
                if (!schedule) {
                    resolve({
                        errCode: 0,
                        message: 'Lịch khám không tồn tại!',
                        data: []
                    });
                } else {
                    if (schedule.maxPatient === schedule.currentPatient) {
                        resolve({
                            errCode: -1,
                            message: 'Lịch này đã đầy, vui lòng chọn lịch khác!'
                        });
                    } else {
                        let patient = await db.User.findOne({
                            where: { email: data.email },
                            raw: false
                        });
                        if (!patient) {
                            patient = await db.User.create({
                                email: data.email,
                                username: data.name,
                                gender: data.gender,
                                password: bcrypt.hashSync('123456', salt),
                                phone: data.phone,
                                roleId: 'R3'
                            });
                        }
                        let booking = await db.Booking.findOne({
                            where: {
                                doctorId: data.doctorId,
                                patientId: patient.id,
                                date: data.date,
                            },
                            raw: false
                        })
                        if (booking) {
                            resolve({
                                errCode: -1,
                                message: 'Bạn đã đặt lịch khám cho hôm nay rồi!'
                            });
                        } else {
                            const book = await db.Booking.create({
                                patientId: patient.id,
                                doctorId: data.doctorId,
                                relativeName: data.relativeName,
                                relativePhone: data.relativePhone,
                                address: data.address,
                                phone: data.phone,
                                reason: data.reason,
                                date: data.date,
                                timeId: data.timeId,
                                status: 'NEW'
                            });
                            // Send email to patient
                            let sendEmailResponse = await sendSimpleEmail({
                                bookingId: book.id,
                                reciverEmail: patient.email,
                                patientName: data.name,
                                address: data.address,
                                phone: data.phone,
                                relativeName: data.relativeName,
                                relativePhone: data.relativePhone,
                                timeString: data.timeString,
                                doctorName: data.doctorName,
                                clinicName: data.clinicName,
                                clinicAddress: data.clinicAddress,
                                reason: data.reason
                            });
                            resolve({
                                errCode: 0,
                                message: 'Đặt lịch thành công!'
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error', error);
            reject(error);
        }
    })
}

const userConfirmBooking = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: -1,
                    message: 'Thiếu thông tin bắt buộc!'
                });
            } else {
                let booking = await db.Booking.findOne({
                    where: { id: id },
                    raw: false
                })
                if (!booking) {
                    resolve({
                        errCode: 0,
                        message: 'Lịch khám không tồn tại!',
                        data: []
                    });
                } else {
                    if (booking.status === 'PENDING' || booking.status === 'CONFIRMED') {
                        resolve({
                            errCode: -1,
                            message: 'Lịch khám này đã được xác nhận!'
                        });
                    } else {
                        booking.status = 'PENDING';
                        await booking.save();
                        resolve({
                            errCode: 0,
                            message: 'Xác nhận người đặt lịch!'
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error', error);
            reject(error);
        }
    })
}

const doctorConfirmBooking = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: -1,
                    message: 'Thiếu thông tin bắt buộc!'
                });
            } else {
                let booking = await db.Booking.findOne({
                    where: { id: id },
                    include: [
                        {
                            model: db.User,
                            as: 'patient',
                            attributes: {
                                exclude: ['password']
                            }
                        },
                        {
                            model: db.DoctorInfo,
                            as: 'doctor',
                            include: [
                                { model: db.User, as: 'doctorData', attributes: ['email', 'username', 'image'] },
                                { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] }
                            ],
                            attributes: {
                                exclude: ['profile', 'certificate', 'descriptionHTML', 'descriptionText', 'statusId']
                            }
                        },
                        { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (!booking) {
                    resolve({
                        errCode: 0,
                        message: 'Lịch khám không tồn tại!',
                        data: []
                    });
                } else {
                    let schedule = await db.Schedule.findOne({
                        where: { doctorId: booking.doctorId, date: booking.date, timeId: booking.timeId },
                        raw: false
                    })
                    if (booking.status === 'CONFIRMED') {
                        resolve({
                            errCode: -1,
                            message: 'Lịch khám này đã được xác nhận!'
                        });
                    } else {
                        booking.status = 'CONFIRMED';
                        await booking.save();
                        schedule.currentPatient += 1;
                        await schedule.save();
                        let sendEmailResponse = await sendBookingConfirmResult({
                            status: booking.status,
                            email: booking.patient.email,
                            patientName: booking.patient.username,
                            timeString: booking.timeData.value,
                            doctorName: booking.doctor.doctorData.username,
                            clinicName: booking.doctor.clinicData.name,
                            clinicAddress: booking.doctor.clinicData.address,
                            reason: booking.reason
                        });
                        resolve({
                            errCode: 0,
                            message: 'Bác sĩ đã xác nhận'
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error', error);
            reject(error);
        }
    })
}

const getAllBookingByUserId = async (id, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            let bookings = [];
            let listBookings = [];
            let currentHours = moment().utcOffset(420).get('hours');
            let currentDate = moment().utcOffset(420).format('YYYY-MM-DD');
            switch (status) {
                case 'ALL':
                    bookings = await db.Booking.findAll({
                        where: {
                            patientId: id,
                        },
                        include: [
                            {
                                model: db.User,
                                as: 'patient',
                                attributes: {
                                    exclude: ['password']
                                }
                            },
                            {
                                model: db.DoctorInfo,
                                as: 'doctor',
                                include: [
                                    { model: db.User, as: 'doctorData', attributes: ['email', 'username', 'image'] },
                                    { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] }
                                ],
                                attributes: {
                                    exclude: ['profile', 'certificate', 'descriptionHTML', 'descriptionText', 'statusId']
                                }
                            },
                            { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                        ],
                        raw: true,
                        nest: true
                    });
                    listBookings = bookings;
                    break;
                case 'PENDING':
                    bookings = await db.Booking.findAll({
                        where: {
                            patientId: id,
                            status: status,
                            date: { [db.Sequelize.Op.gte]: currentDate }
                        },
                        include: [
                            {
                                model: db.User,
                                as: 'patient',
                                attributes: {
                                    exclude: ['password']
                                }
                            },
                            {
                                model: db.DoctorInfo,
                                as: 'doctor',
                                include: [
                                    { model: db.User, as: 'doctorData', attributes: ['email', 'username', 'image'] },
                                    { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] }
                                ],
                                attributes: {
                                    exclude: ['profile', 'certificate', 'descriptionHTML', 'descriptionText', 'statusId']
                                }
                            },
                            { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                        ],
                        raw: true,
                        nest: true
                    });
                    bookings.forEach(element => {
                        if (element.date == currentDate && element.timeData.value.split('-')[0].split(':')[0] - 2 >= currentHours || element.date > currentDate) {
                            listBookings.push(element);
                        }
                    });
                    break;
                case 'CONFIRMED':
                    bookings = await db.Booking.findAll({
                        where: {
                            patientId: id,
                            status: status,
                            date: { [db.Sequelize.Op.gte]: currentDate },
                        },
                        include: [
                            {
                                model: db.User,
                                as: 'patient',
                                attributes: {
                                    exclude: ['password']
                                }
                            },
                            {
                                model: db.DoctorInfo,
                                as: 'doctor',
                                include: [
                                    { model: db.User, as: 'doctorData', attributes: ['email', 'username', 'image'] },
                                    { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] }
                                ],
                                attributes: {
                                    exclude: ['profile', 'certificate', 'descriptionHTML', 'descriptionText', 'statusId']
                                }
                            },
                            { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                        ],
                        raw: true,
                        nest: true
                    });
                    listBookings = bookings;
                    break;
                case 'CANCELLED':
                    bookings = await db.Booking.findAll({
                        where: {
                            patientId: id,
                            status: status,
                        },
                        include: [
                            {
                                model: db.User,
                                as: 'patient',
                                attributes: {
                                    exclude: ['password']
                                }
                            },
                            {
                                model: db.DoctorInfo,
                                as: 'doctor',
                                include: [
                                    { model: db.User, as: 'doctorData', attributes: ['email', 'username', 'image'] },
                                    { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] }
                                ],
                                attributes: {
                                    exclude: ['profile', 'certificate', 'descriptionHTML', 'descriptionText', 'statusId']
                                }
                            },
                            { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                        ],
                        raw: true,
                        nest: true
                    });
                    listBookings = bookings;
                    break;
                case 'DONE':
                    bookings = await db.Booking.findAll({
                        where: {
                            patientId: id,
                            status: status,
                        },
                        include: [
                            {
                                model: db.User,
                                as: 'patient',
                                attributes: {
                                    exclude: ['password']
                                }
                            },
                            {
                                model: db.DoctorInfo,
                                as: 'doctor',
                                include: [
                                    { model: db.User, as: 'doctorData', attributes: ['email', 'username', 'image'] },
                                    { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] }
                                ],
                                attributes: {
                                    exclude: ['profile', 'certificate', 'descriptionHTML', 'descriptionText', 'statusId']
                                }
                            },
                            { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                        ],
                        raw: true,
                        nest: true
                    });
                    bookings.forEach(element => {
                        if (((element.date == currentDate && element.timeData.value.split('-')[0].split(':')[1] < currentHours) || element.date < currentDate) && element.status === 'CONFIRMED') {
                            listBookings.push(element);
                        }
                    });
                    listBookings = [...listBookings, ...bookings.filter(booking => booking.status === 'DONE')];
                    break;
                default:
                    break;
            }
            resolve({
                errCode: 0,
                message: 'Lấy dữ liệu thành công!',
                data: listBookings
            });
        } catch (error) {
            console.error('Error', error);
            reject(error);
        }
    })
}

const getAllBookingByDoctorId = async (id, status) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !status) {
                resolve({
                    errCode: -1,
                    message: 'Thiếu thông tin bắt buộc!'
                });
            } else {
                let listBookings = [];
                let currentHours = moment().utcOffset(420).format('HH');
                let currentDate = moment().utcOffset(420).format('YYYY-MM-DD');
                switch (status) {
                    case 'ALL':
                        let bookings = await db.Booking.findAll({
                            where: { doctorId: id },
                            include: [
                                {
                                    model: db.User,
                                    as: 'patient',
                                    attributes: {
                                        exclude: ['password']
                                    }
                                },
                                {
                                    model: db.DoctorInfo,
                                    as: 'doctor',
                                    include: [
                                        { model: db.User, as: 'doctorData', attributes: ['email', 'username', 'image'] },
                                        { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] }
                                    ],
                                    attributes: {
                                        exclude: ['profile', 'certificate', 'descriptionHTML', 'descriptionText', 'statusId']
                                    }
                                },
                                { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                            ],
                            raw: false,
                            nest: true
                        });
                        listBookings = bookings;
                        break;
                    case 'PENDING':
                        bookings = await db.Booking.findAll({
                            where: {
                                doctorId: id,
                                status: status,
                            },
                            include: [
                                {
                                    model: db.User,
                                    as: 'patient',
                                    attributes: {
                                        exclude: ['password']
                                    }
                                },
                                {
                                    model: db.DoctorInfo,
                                    as: 'doctor',
                                    include: [
                                        { model: db.User, as: 'doctorData', attributes: ['email', 'username', 'image'] },
                                        { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] }
                                    ],
                                    attributes: {
                                        exclude: ['profile', 'certificate', 'descriptionHTML', 'descriptionText', 'statusId']
                                    }
                                },
                                { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                            ],
                            raw: true,
                            nest: true
                        });
                        bookings.forEach(element => {
                            if (element.date == currentDate && element.timeData.value.split('-')[0].split(':')[0] - 2 >= currentHours || element.date > currentDate) {
                                listBookings.push(element);
                            }
                        });
                        break;
                    case 'CONFIRMED':
                        bookings = await db.Booking.findAll({
                            where: {
                                doctorId: id,
                                status: status,
                                date: { [db.Sequelize.Op.gte]: currentDate },
                            },
                            include: [
                                {
                                    model: db.User,
                                    as: 'patient',
                                    attributes: {
                                        exclude: ['password']
                                    }
                                },
                                {
                                    model: db.DoctorInfo,
                                    as: 'doctor',
                                    include: [
                                        { model: db.User, as: 'doctorData', attributes: ['email', 'username', 'image'] },
                                        { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] }
                                    ],
                                    attributes: {
                                        exclude: ['profile', 'certificate', 'descriptionHTML', 'descriptionText', 'statusId']
                                    }
                                },
                                { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                            ],
                            raw: true,
                            nest: true
                        });
                        listBookings = bookings;
                        break;
                    case 'CANCELLED':
                        bookings = await db.Booking.findAll({
                            where: { doctorId: id, status: status },
                            include: [
                                {
                                    model: db.User,
                                    as: 'patient',
                                    attributes: {
                                        exclude: ['password']
                                    }
                                },
                                {
                                    model: db.DoctorInfo,
                                    as: 'doctor',
                                    include: [
                                        { model: db.User, as: 'doctorData', attributes: ['email', 'username', 'image'] },
                                        { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] }
                                    ],
                                    attributes: {
                                        exclude: ['profile', 'certificate', 'descriptionHTML', 'descriptionText', 'statusId']
                                    }
                                },
                                { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                            ],
                            raw: true,
                            nest: true
                        });
                        listBookings = bookings;
                        break;
                    case 'DONE':
                        bookings = await db.Booking.findAll({
                            where: { doctorId: id },
                            include: [
                                {
                                    model: db.User,
                                    as: 'patient',
                                    attributes: {
                                        exclude: ['password']
                                    }
                                },
                                {
                                    model: db.DoctorInfo,
                                    as: 'doctor',
                                    include: [
                                        { model: db.User, as: 'doctorData', attributes: ['email', 'username', 'image'] },
                                        { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] }
                                    ],
                                    attributes: {
                                        exclude: ['profile', 'certificate', 'descriptionHTML', 'descriptionText', 'statusId']
                                    }
                                },
                                { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                            ],
                            raw: true,
                            nest: true
                        });
                        bookings.forEach(element => {
                            if (((element.date == currentDate && element.timeData.value.split('-')[0].split(':')[1] < currentHours) || element.date < currentDate) && element.status === 'CONFIRMED') {
                                listBookings.push(element);
                            }
                        });
                        listBookings = [...listBookings, ...bookings.filter(booking => booking.status === 'DONE')];
                        break;
                    default:
                        break;
                }
                resolve({
                    errCode: 0,
                    message: 'Lấy dữ liệu thành công!',
                    data: listBookings
                });
            }
        } catch (e) {
            reject(e);
        }
    })
}

const getBookingById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: -1,
                    message: 'Thiếu thông tin bắt buộc!'
                });
            } else {
                let booking = await db.Booking.findOne({
                    where: { id: id },
                    include: [
                        {
                            model: db.User,
                            as: 'patient',
                            attributes: {
                                exclude: ['password']
                            }
                        },
                        {
                            model: db.DoctorInfo,
                            as: 'doctor',
                            include: [
                                { model: db.User, as: 'doctorData', attributes: ['email', 'username', 'image'] },
                                { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] }
                            ],
                            attributes: {
                                exclude: ['profile', 'certificate', 'descriptionHTML', 'descriptionText', 'statusId']
                            }
                        },
                        { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                    ],
                    raw: false
                });
                if (booking) {
                    resolve({
                        errCode: 0,
                        message: 'Lấy dữ liệu thành công!',
                        data: booking
                    });
                } else {
                    resolve({
                        errCode: 0,
                        message: 'Không có dữ liệu!',
                        data: {}
                    });
                }
            }
        } catch (error) {
            console.error('Error', error);
            reject(error);
        }
    })
}

const doctorRejectBooking = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: -1,
                    message: 'Thiếu thông tin bắt buộc!'
                });
            } else {
                let booking = await db.Booking.findOne({
                    where: { id: id },
                    include: [
                        {
                            model: db.User,
                            as: 'patient',
                            attributes: {
                                exclude: ['password']
                            }
                        },
                        {
                            model: db.DoctorInfo,
                            as: 'doctor',
                            include: [
                                { model: db.User, as: 'doctorData', attributes: ['email', 'username', 'image'] },
                                { model: db.Clinic, as: 'clinicData', attributes: ['id', 'name', 'address'] }
                            ],
                            attributes: {
                                exclude: ['profile', 'certificate', 'descriptionHTML', 'descriptionText', 'statusId']
                            }
                        },
                        { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                    ],
                    raw: false,
                    nest: true
                })
                if (!booking) {
                    resolve({
                        errCode: -1,
                        message: 'Lịch khám không tồn tại!',
                    });
                } else {
                    if (booking.status === 'CANCELLED') {
                        resolve({
                            errCode: -1,
                            message: 'Lịch khám này đã bị hủy!'
                        });
                    } else {
                        booking.status = 'CANCELLED';
                        await booking.save();
                        let sendEmailResponse = await sendBookingConfirmResult({
                            status: booking.status,
                            email: booking.patient.email,
                            patientName: booking.patient.username,
                            timeString: booking.timeData.value,
                            doctorName: booking.doctor.doctorData.username,
                            clinicName: booking.doctor.clinicData.name,
                            clinicAddress: booking.doctor.clinicData.address,
                            reason: booking.reason
                        });
                        resolve({
                            errCode: 0,
                            message: 'Bác sĩ đã hủy lịch khám!'
                        });
                    }
                }
            }
        } catch (error) {
            console.error('Error', error);
            reject(error);
        }
    })
}

const updateBookingResult = async (bookingId, result) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!bookingId || !result) {
                resolve({
                    errCode: -1,
                    message: 'Thiếu thông tin bắt buộc!'
                });
            } else {
                let booking = await db.Booking.findOne({
                    where: { id: bookingId },
                    raw: false
                })
                if (!booking) {
                    resolve({
                        errCode: -1,
                        message: 'Lịch khám không tồn tại!'
                    });
                } else {
                    booking.status = 'DONE';
                    if (booking.result) {
                        const path = booking.result.replace(process.env.URL_BASE, 'src\\'); // delete old image
                        await fs.unlink(path); // delete old image
                    }
                    let modifiedImgPath = '';
                    if (result) {
                        let listPath = result.split('\\');
                        result = listPath.slice(1).join('\\');
                        modifiedImgPath = process.env.URL_BASE + result;
                    }
                    booking.result = modifiedImgPath;
                    await booking.save();
                    resolve({
                        errCode: 0,
                        message: 'Cập nhật kết quả lịch khám thành công!'
                    });
                }
            }
        } catch (error) {
            console.error('Error', error);
            reject(error);
        }
    });
}

const getAllSumBooking = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const completeBookings = await db.Booking.findAll({
                attributes: [
                    [Sequelize.fn('COUNT', Sequelize.col('doctorId')), 'totalBooking'],
                    'doctorId'
                ],
                where: {
                    status: 'DONE'
                },
                group: ['doctorId']
            }); // Lấy tất cả booking đã hoàn thành
            resolve({
                errCode: 0,
                message: 'Lấy dữ liệu thành công!',
                data: completeBookings
            })
        } catch (error) {
            console.error('Error', error);
            reject(error);
        }
    })
}
export default {
    createNewBooking: createNewBooking,
    userConfirmBooking: userConfirmBooking,
    doctorConfirmBooking: doctorConfirmBooking,
    getAllBookingByUserId: getAllBookingByUserId,
    getAllBookingByDoctorId: getAllBookingByDoctorId,
    getBookingById: getBookingById,
    doctorRejectBooking: doctorRejectBooking,
    updateBookingResult: updateBookingResult,
    getAllSumBooking: getAllSumBooking
}