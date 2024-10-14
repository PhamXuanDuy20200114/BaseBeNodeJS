import ClinicService from '../services/ClinicService';

const createClinic = async (req, res) => {
    const data = req.body;
    const pathImage = req.file.path;
    try {
        const result = await ClinicService.createClinic(data, pathImage);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getAllClinic = async (req, res) => {
    try {
        let data = await ClinicService.getAllClinic();
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

const getClinicById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await ClinicService.getClinicById(id);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

const updateClinicInfo = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const pathImage = req.file.path;
    try {
        const result = await ClinicService.updateClinicInfo(id, data, pathImage);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

const deleteClinic = async (req, res) => {
    let id = req.params.id;
    try {
        let data = await ClinicService.deleteClinic(id);
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

module.exports = {
    createClinic,
    getAllClinic,
    getClinicById,
    updateClinicInfo,
    deleteClinic
}