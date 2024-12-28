import authMiddleware from '../middleware/AuthMiddleware';
import CommentController from '../controllers/CommentController';
import express from "express";
let router = express.Router();

let initCommentRoutes = (app) => {
    router.post('/create', CommentController.createComment);
    router.get('/get-by-clinic-id/:clinicId', CommentController.getAllClinicComment);
    router.get('/get-by-doctor-id/:doctorId', CommentController.getAllDoctorComment);
    router.post('/update/:id', CommentController.updateComment);
    router.delete('/delete/:id', CommentController.deleteComment);
    return app.use("/api/comments", router);
}

module.exports = initCommentRoutes