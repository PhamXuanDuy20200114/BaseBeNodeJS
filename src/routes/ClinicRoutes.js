import authMiddleware from '../middleware/AuthMiddleware';
import { uploadImageClinicMiddleware, uploadImageMiddleware } from '../middleware/UploadMiddleware';
import ClinicController from '../controllers/ClinicController';
import express from "express";
let router = express.Router();

let initClinicRoutes = (app) => {
    router.get('/', ClinicController.getAllClinic);
    router.get('/alphabet', ClinicController.getClinicByAlphabet);
    router.get('/:id', ClinicController.getClinicById);
    router.post('/', authMiddleware.verifyAdminToken, uploadImageClinicMiddleware, ClinicController.createClinic);
    router.post('/:id', authMiddleware.verifyAdminToken, uploadImageClinicMiddleware, ClinicController.updateClinicInfo);
    router.delete('/:id', authMiddleware.verifyAdminToken, ClinicController.deleteClinic);
    return app.use("/api/clinics", router);
}

module.exports = initClinicRoutes