import DoctorController from '../controllers/DoctorController';
import authMiddleware from '../middleware/AuthMiddleware';
import express from "express";
let router = express.Router();

let initDoctorRoutes = (app) => {
    router.get('/not-confirmed', authMiddleware.verifyAdminToken, DoctorController.getAllDoctorNotConfirm);
    router.get('/confirmed', DoctorController.getAllDoctorConfirm);
    router.get('/:id', DoctorController.getAllDoctorConfirm);
    router.post('/confirm', authMiddleware.verifyAdminToken, DoctorController.confirmDoctor);
    router.post('/:id', authMiddleware.verifyOwnerToken, DoctorController.updateDoctorInfo);
    router.delete('/:id', authMiddleware.verifyOwnerToken, DoctorController.deleteDoctor);
    return app.use("/api/doctors", router);
}

module.exports = initDoctorRoutes