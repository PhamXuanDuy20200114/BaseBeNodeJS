import authMiddleware from '../middleware/AuthMiddleware';
import SpecialtyController from '../controllers/SpecialtyController';
import { uploadImageMiddleware } from '../middleware/UploadMiddleware';
import express from "express";
let router = express.Router();

let initSpecialtyRoutes = (app) => {
    router.get('/', SpecialtyController.getAllSpecialty);
    router.get('/:id', SpecialtyController.getSpecialtyById);
    router.get('/random', SpecialtyController.get6Specialty);
    router.post('/', authMiddleware.verifyAdminToken, uploadImageMiddleware, SpecialtyController.createSpecialty);
    router.post('/:id', authMiddleware.verifyAdminToken, uploadImageMiddleware, SpecialtyController.updateSpecialty);
    router.delete('/:id', authMiddleware.verifyAdminToken, SpecialtyController.deleteSpecialty);
    return app.use("/api/specialties", router);
}

module.exports = initSpecialtyRoutes