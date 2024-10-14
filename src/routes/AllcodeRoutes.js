import express from "express";
import allcodeController from '../controllers/AllcodeController';
let router = express.Router();

let initAllcodeRoutes = (app) => {
    router.get('/province', allcodeController.getAllProvinces);
    return app.use("/api/allcode", router);
}

module.exports = initAllcodeRoutes