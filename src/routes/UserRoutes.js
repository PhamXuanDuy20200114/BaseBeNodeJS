import express from "express";
import userController from '../controllers/UserController';
import authMiddleware from '../middleware/AuthMiddleware';
import { uploadImageMiddleware } from "../middleware/UploadMiddleware";
let router = express.Router();

let initUserRoutes = (app) => {
    router.get('/', authMiddleware.verifyAdminToken, userController.getAllUser);
    router.get('/and-doctor', authMiddleware.verifyAdminToken, userController.getAllUserAndDoctor);
    router.get('/:id', authMiddleware.verifyOwnerToken, userController.getUserById);
    router.post('/', uploadImageMiddleware, userController.createUser)
    router.post('/:id', authMiddleware.verifyOwnerToken, uploadImageMiddleware, userController.editUser)
    router.delete('/:id', authMiddleware.verifyOwnerToken, userController.deleteUser);
    return app.use("/api/users", router);
}

module.exports = initUserRoutes