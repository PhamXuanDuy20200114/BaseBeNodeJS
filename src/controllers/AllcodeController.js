import allcodeService from '../services/AllcodeService';

let getAllProvinces = async (req, res) => {
    try {
        let provinces = await allcodeService.getAllProvinces();
        return res.status(200).json(provinces);
    } catch (e) {
        return res.status(500).json(e);
    }
}


module.exports = {
    getAllProvinces: getAllProvinces
}