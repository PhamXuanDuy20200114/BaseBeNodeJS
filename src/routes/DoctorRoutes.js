import express from "express";
import userController from '../controllers/UserController';
import authMiddleware from '../middleware/AuthMiddleware';
let router = express.Router();

let initDoctorRoutes = (app) => {
    router.get('/', authMiddleware.verifyAdminToken, userController.getAllUser);
    router.get('/:id', authMiddleware.verifyAdminToken, userController.getUserById);
    router.post('/:id', authMiddleware.verifyUserToken, userController.editUser)
    router.delete('/:id', authMiddleware.verifyAdminToken, userController.deleteUser);
    return app.use("/api/doctors", router);
}

module.exports = initDoctorRoutes