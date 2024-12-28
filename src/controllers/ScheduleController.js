import moment from 'moment';
import scheduleService from '../services/ScheduleService';
const saveDoctorSchedule = async (req, res) => {
    let id = req.params.id;
    let { date, listTimes } = req.body;
    try {
        const data = await scheduleService.saveDoctorSchedule({ id, date, listTimes });
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}
const getAllScheduleByDate = async (req, res) => {
    const { id, date } = req.query;
    try {
        const data = await scheduleService.getAllScheduleByDate(id, date);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getDateInWeekByDoctorId = async (req, res) => {
    const doctorId = req.params.id;
    try {
        const data = await scheduleService.getDateInWeekByDoctorId(doctorId);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

export default {
    getAllScheduleByDate,
    getDateInWeekByDoctorId,
    saveDoctorSchedule
}