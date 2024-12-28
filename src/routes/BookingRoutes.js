import express from "express";
import bookingController from '../controllers/BookingController';
import authMiddleware from '../middleware/AuthMiddleware';
import { uploadResulltFile } from "../middleware/UploadMiddleware";
let router = express.Router();

let initBookingRoutes = (app) => {
    router.post('/', bookingController.createNewBooking);
    router.get('/sum', bookingController.getAllSumBooking);
    router.get('/:id', bookingController.getBookingById);
    router.post('/user-confirm/:id', bookingController.userConfirmBooking);
    router.post('/doctor-confirm/:id', authMiddleware.verifyDoctorToken, bookingController.doctorConfirmBooking);
    router.post('/reject/:id', authMiddleware.verifyDoctorToken, bookingController.doctorRejectBooking);
    router.post('/result/:id', authMiddleware.verifyDoctorToken, uploadResulltFile, bookingController.updateBookingResult);
    router.get('/get-by-user-id/:id', authMiddleware.verifyOwnerToken, bookingController.getBookingByUserId);
    router.get('/get-by-doctor-id/:id', authMiddleware.verifyDoctorToken, bookingController.getBookingByDoctorId);
    return app.use("/api/bookings", router);
}

module.exports = initBookingRoutes