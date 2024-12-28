import allcodeService from '../services/AllcodeService';

let getAllProvinces = async (req, res) => {
    try {
        let provinces = await allcodeService.getAllProvinces();
        return res.status(200).json(provinces);
    } catch (e) {
        console.log('Error: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

let getAllPrices = async (req, res) => {
    try {
        let prices = await allcodeService.getAllPrices();
        return res.status(200).json(prices);
    } catch (e) {
        console.log('Error: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getAllPaymentMethods = async (req, res) => {
    try {
        let paymentMethods = await allcodeService.getAllPaymentMethods();
        return res.status(200).json(paymentMethods);
    } catch (e) {
        console.log('Error: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getAllPositions = async (req, res) => {
    try {
        let positions = await allcodeService.getAllPositions();
        return res.status(200).json(positions);
    } catch (e) {
        console.log('Error: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getAllTimes = async (req, res) => {
    try {
        let times = await allcodeService.getAllTimes();
        return res.status(200).json(times);
    } catch (e) {
        console.log('Error: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getTimeById = async (req, res) => {
    try {
        let timeId = req.params.id;
        let time = await allcodeService.getTimeById(timeId);
        return res.status(200).json(time);
    } catch (e) {
        console.log('Error: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const searchInfo = async (req, res) => {
    try {
        let {mode, tag} = req.query;
        let result = await allcodeService.searchInfo(mode, tag);
        return res.status(200).json(result);
    } catch (e) {
        console.log('Error: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}
module.exports = {
    getAllProvinces: getAllProvinces,
    getAllPrices: getAllPrices,
    getAllPaymentMethods: getAllPaymentMethods,
    getAllPositions: getAllPositions,
    getAllTimes: getAllTimes,
    getTimeById: getTimeById,
    searchInfo: searchInfo
}