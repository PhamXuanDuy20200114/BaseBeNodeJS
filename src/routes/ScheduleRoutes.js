import authMiddleware from '../middleware/AuthMiddleware';
import ScheduleController from '../controllers/ScheduleController';
import express from "express";
let router = express.Router();

let initScheduleRoutes = (app) => {
    router.get('/', ScheduleController.getAllScheduleByDate);
    router.post('/:id', authMiddleware.verifyDoctorToken, ScheduleController.saveDoctorSchedule);
    router.get('/get-date-in-week/:id', ScheduleController.getDateInWeekByDoctorId);
    return app.use("/api/schedules", router);
}

module.exports = initScheduleRoutes