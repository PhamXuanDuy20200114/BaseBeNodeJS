import express from "express";
import authController from '../controllers/AuthController';
let router = express.Router();

let initAuthRoutes = (app) => {
    router.post('/register', authController.register);
    router.post('/doctor-register', authController.doctorRegister);
    router.post('/login', authController.login);
    router.post('/refresh-token', authController.refreshAccessToken);
    return app.use("/api", router);
}

module.exports = initAuthRoutes