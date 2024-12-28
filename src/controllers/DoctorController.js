import doctorService from '../services/DoctorService';

//Doctor
const getAllDoctorNotConfirm = async (req, res) => {
    try {
        let data = await doctorService.getAllDoctorsNotComfirm();
        return res.status(200).json(
            data
        );
    } catch (e) {
        console.log('Error: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}
const getRandomDoctor = async (req, res) => {
    try {
        let data = await doctorService.getRandomDoctor();
        return res.status(200).json(
            data
        );
    } catch (e) {
        console.log('Error: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getAllDoctorConfirm = async (req, res) => {
    try {
        let data = await doctorService.getAllDoctorConfirm();
        return res.status(200).json(
            data
        );
    } catch (e) {
        console.log('Error: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getDoctorById = async (req, res) => {
    let id = req.params.id;
    try {
        const data = await doctorService.getDoctorById(id);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getMoreDoctorInfo = async (req, res) => {
    let id = req.params.id;
    try {
        const data = await doctorService.getMoreDoctorInfo(id);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const updateDoctorInfo = async (req, res) => {
    let id = req.params.id;
    let newDoctorInfo = req.body;
    let imagePath = '';
    let profilePath = '';
    let certificatePath = '';
    if (req.files && req.files['image']) {
        imagePath = req.files['image'][0].path;
    }
    if (req.files && req.files['profile']) {
        profilePath = req.files['profile'][0].path;
    }
    if (req.files && req.files['certificate']) {
        certificatePath = req.files['certificate'][0].path;
    }
    try {
        const data = await doctorService.updateDoctorInfo(id, newDoctorInfo, imagePath, profilePath, certificatePath);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getDoctorBySpecialty = async (req, res) => {
    let id = req.params.id;
    try {
        const data = await doctorService.getDoctorBySpecialty(id);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getDoctorBySpecialtyAndProvince = async (req, res) => {
    let {specialtyId, provinceId} = req.query;
    try {
        const data = await doctorService.getDoctorBySpecialtyAndProvince(specialtyId, provinceId);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const confirmDoctor = async (req, res) => {
    let id = req.body.id;
    try {
        const data = await doctorService.confirmDoctor(id);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
    }
}

const rejectDoctor = async (req, res) => {
    let id = req.params.id;
    try {
        const data = await doctorService.rejectDoctor(id);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
    }
}

const deleteDoctor = async (req, res) => {
    let id = req.params.id;
    try {
        const data = await doctorService.deleteDoctor(id);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
    }
}

//Schedule
const getScheduleDoctorByDate = async (req, res) => {
    let { id, date } = req.query;
    try {
        const data = await doctorService.getScheduleDoctorByDate(id, date);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const saveDoctorSchedule = async (req, res) => {
    let id = req.params.id;
    let { date, listTimes } = req.body;
    try {
        const data = await doctorService.saveDoctorSchedule(id, date, listTimes);
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
    getAllDoctorNotConfirm,
    confirmDoctor,
    getAllDoctorConfirm,
    getDoctorById,
    getRandomDoctor,
    updateDoctorInfo,
    deleteDoctor,
    getScheduleDoctorByDate,
    saveDoctorSchedule,
    getMoreDoctorInfo,
    getDoctorBySpecialty,
    getDoctorBySpecialtyAndProvince,
    rejectDoctor
}