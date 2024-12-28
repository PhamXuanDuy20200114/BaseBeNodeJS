import authMiddleware from '../middleware/AuthMiddleware';
import { uploadImageMiddleware } from '../middleware/UploadMiddleware';
import NotebookController from '../controllers/NotebookController';
import express from "express";
let router = express.Router();

let initBookRoute = (app) => {
    router.get('/', NotebookController.getAllNotebook);
    router.get('/get-12-notebook', NotebookController.get12RandomNotebook);
    router.post('/', authMiddleware.verifyAdminToken, uploadImageMiddleware, NotebookController.createNotebook);
    router.get('/:id', NotebookController.getNotebookById);
    router.post('/:id', authMiddleware.verifyAdminToken, uploadImageMiddleware, NotebookController.updateNotebook);
    router.delete('/:id', authMiddleware.verifyAdminToken, NotebookController.deleteNotebook);
    return app.use("/api/notebooks", router);
}

module.exports = initBookRoute