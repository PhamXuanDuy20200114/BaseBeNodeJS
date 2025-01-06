import DoctorController from '../controllers/DoctorController';
import authMiddleware from '../middleware/AuthMiddleware';
import { uploadProfileDoctorMiddleware, uploadImageMiddleware } from "../middleware/UploadMiddleware";
import express from "express";
let router = express.Router();

let initDoctorRoutes = (app) => {
    router.get('/not-confirmed', authMiddleware.verifyAdminToken, DoctorController.getAllDoctorNotConfirm);
    router.get('/confirmed', DoctorController.getAllDoctorConfirm);
    router.get('/random', DoctorController.getRandomDoctor);
    router.get('/get-by-specialty-and-province', DoctorController.getDoctorBySpecialtyAndProvince);
    router.get('/more-info/:id', DoctorController.getMoreDoctorInfo);
    router.get('/:id', DoctorController.getDoctorById);
    router.get('/get-by-specialty/:id', DoctorController.getDoctorBySpecialty);
    router.post('/confirm', authMiddleware.verifyAdminToken, DoctorController.confirmDoctor);
    router.post('/:id', authMiddleware.verifyDoctorToken, uploadProfileDoctorMiddleware, DoctorController.updateDoctorInfo);
    router.delete('/:id', authMiddleware.verifyDoctorToken, DoctorController.deleteDoctor);
    router.delete('/reject/:id', authMiddleware.verifyAdminToken, DoctorController.rejectDoctor);
    router.post('/update/:id', authMiddleware.verifyDoctorToken, uploadImageMiddleware , DoctorController.doctorUpdateInfo);
    return app.use("/api/doctors", router);
}

module.exports = initDoctorRoutes