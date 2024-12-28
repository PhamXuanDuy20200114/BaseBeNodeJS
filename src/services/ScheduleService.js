import db from '../models/index';
const { Op } = require('sequelize');
import moment from 'moment';
const saveDoctorSchedule = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.id || !data.date || !data.listTimes) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            } else {
                await db.Schedule.destroy({
                    where: { doctorId: data.id, date: data.date }
                })
                let listTimes = data.listTimes;
                for (let time of listTimes) {
                    await db.Schedule.create({
                        doctorId: data.id,
                        date: data.date,
                        timeId: time,
                        currentPatient: 0,
                        maxPatient: 5,
                    });
                }
                resolve({
                    errCode: 0,
                    message: 'Success'
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}
const getAllScheduleByDate = async (id, date) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !date) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            } else {
                let data = await db.Schedule.findAll({
                    where: {
                        doctorId: id,
                        date: date,
                    },
                    include: [
                        { model: db.Allcode, as: 'timeData', attributes: ['keyMap', 'value'] }
                    ],
                    raw: false,
                    nest: true
                });
                let currentDate = moment().utcOffset(420).format('YYYY-MM-DD');
                if (date === currentDate) {
                    let currentHours = moment().utcOffset(420).format('HH');
                    data = data.filter(item => item.timeData.value.split('-')[0].split(':')[0] - 2 >= currentHours);
                }
                data = data.filter(item => item.currentPatient < item.maxPatient);
                data = data.sort((a, b) => {
                    const timeA = parseInt(a.timeId.replace('T', ''));
                    const timeB = parseInt(b.timeId.replace('T', ''));
                    return timeA - timeB;
                });
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

const getDateInWeekByDoctorId = async (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            } else {
                let tommorrow = moment().utcOffset(420).startOf('day').add(1, 'days');
                let endDay = tommorrow.clone().add(6, 'days');

                const listDate = await db.Schedule.findAll({
                    where: {
                        doctorId: doctorId,
                        date: {
                            [Op.between]: [tommorrow.format('YYYY-MM-DD'), endDay.format('YYYY-MM-DD')]
                        },
                        [Op.and]: {
                            currentPatient: { [Op.lt]: db.Sequelize.col('maxPatient') } // Điều kiện: currentPatient < maxPatient
                        }
                    },
                    attributes: ['date'],
                    group: ['date'], // Group by date để không bị trùng lặp
                    order: [['date', 'ASC']]
                });

                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: listDate
                });
            }
        } catch (e) {
            reject(e);
        }
    });
}

module.exports = {
    saveDoctorSchedule,
    getAllScheduleByDate,
    getDateInWeekByDoctorId
}