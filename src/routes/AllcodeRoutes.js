import express from "express";
import allcodeController from '../controllers/AllcodeController';
let router = express.Router();

let initAllcodeRoutes = (app) => {
    router.get('/provinces', allcodeController.getAllProvinces);
    router.get('/prices', allcodeController.getAllPrices);
    router.get('/payments', allcodeController.getAllPaymentMethods);
    router.get('/positions', allcodeController.getAllPositions);
    router.get('/times', allcodeController.getAllTimes);
    router.get('/times/:id', allcodeController.getTimeById);
    router.get('/search', allcodeController.searchInfo);
    return app.use("/api/allcodes", router);
}

module.exports = initAllcodeRoutes