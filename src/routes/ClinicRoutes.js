import authMiddleware from '../middleware/AuthMiddleware';
import { uploadImageMiddleware } from '../middleware/UploadMiddleware';
import ClinicController from '../controllers/ClinicController';
import express from "express";
let router = express.Router();

let initClinicRoutes = (app) => {
    router.get('/', ClinicController.getAllClinic);
    router.get('/:id', ClinicController.getClinicById);
    router.post('/', authMiddleware.verifyAdminToken, uploadImageMiddleware, ClinicController.createClinic);
    router.post('/:id', authMiddleware.verifyAdminToken, uploadImageMiddleware, ClinicController.updateClinicInfo);
    router.delete('/:id', authMiddleware.verifyAdminToken, ClinicController.deleteClinic);
    return app.use("/api/clinics", router);
}

module.exports = initClinicRoutes