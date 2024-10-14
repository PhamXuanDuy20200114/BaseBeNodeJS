import specialtyService from '../services/SpecialtyService';

const createSpecialty = async (req, res) => {
    const data = req.body;
    const pathImage = req.file.path;
    try {
        const result = await specialtyService.createSpecialty(data, pathImage);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getAllSpecialty = async (req, res) => {
    try {
        let data = await specialtyService.getAllSpecialty();
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

const getSpecialtyById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await specialtyService.getSpecialtyById(id);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

const updateSpecialty = async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const pathImage = req.file.path;
    try {
        const result = await specialtyService.updateSpecialty(id, data, pathImage);
        return res.status(200).json(result);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

const deleteSpecialty = async (req, res) => {
    let id = req.params.id;
    try {
        let data = await specialtyService.deleteSpecialty(id);
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


export default {
    createSpecialty,
    getAllSpecialty,
    getSpecialtyById,
    updateSpecialty,
    deleteSpecialty
}