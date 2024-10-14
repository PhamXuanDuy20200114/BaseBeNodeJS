import doctorService from '../services/DoctorService';

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

const getDocyorById = async (req, res) => {
    let id = req.params.id;
    try {
        const data = await doctorService.getDoctorById(id);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
    }
}

const updateDoctorInfo = async (req, res) => {
    let id = req.params.id;
    let newDoctorInfo = req.body;
    try {
        const data = await doctorService.updateDoctorInfo(id, newDoctorInfo);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
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
const deleteDoctor = async (req, res) => {
    let id = req.params.id;
    try {
        const data = await doctorService.deleteDoctor(id);
        return res.status(200).json(data);
    } catch (e) {
        console.log('err: ', e);
    }
}
export default {
    getAllDoctorNotConfirm,
    confirmDoctor,
    getAllDoctorConfirm,
    getDocyorById,
    updateDoctorInfo,
    deleteDoctor
}