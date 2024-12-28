import CommentService from '../services/CommentService';

const createComment = async (req, res) => {
    try {
        let response = await CommentService.createComment(req.body);
        return res.status(200).json(response);

    } catch (error) {
        console.error('Error at CommentController.createComment', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getAllDoctorComment = async (req, res) => {
    let doctorId = req.params.doctorId;
    try {
        let response = await CommentService.getCommentByDoctorId(doctorId);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error at CommentController.getCommentByDoctorId', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getAllClinicComment = async (req, res) => {
    let clinicId = req.params.clinicId;
    try {
        let response = await CommentService.getCommentByClinicId(clinicId);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error at CommentController.getCommentByClinicId', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const updateComment = async (req, res) => {
    const id = req.params.id;
    try {
        let response = await CommentService.updateComment(id, req.body);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error at CommentController.updateComment', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const deleteComment = async (req, res) => {
    let id = req.params.id;
    try {
        let response = await CommentService.deleteComment(id);
        return res.status(200).json(response);
    } catch (error) {
        console.error('Error at CommentController.deleteComment', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

export default {
    createComment,
    getAllDoctorComment,
    getAllClinicComment,
    updateComment,
    deleteComment
}