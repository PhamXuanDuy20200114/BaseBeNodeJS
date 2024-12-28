import { raw } from 'body-parser';
import db from '../models/index';

const createComment = async (data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.content || (!data.doctorId && !data.clinicId) || !data.patientId) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            } else {
                const comment = await db.Comment.create({
                    content: data.content,
                    patientId: data.patientId,
                    doctorId: data.doctorId,
                    clinicId: data.clinicId,
                    parentId: data.parentId
                });

                const commentData = await db.Comment.findOne({
                    where: { id: comment.id },
                    include: [
                        { model: db.User, as: 'patientComment', attributes: ['id', 'username'] },
                    ],
                    raw: false,
                    nest: true
                });
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: commentData
                });
            }
        } catch (error) {
            console.error('Error at CommentService.createComment', error);
            reject(error);
        }
    });
}

const getCommentByDoctorId = async (doctorId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!doctorId) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            }
            const comments = await db.Comment.findAll({
                where: { doctorId: doctorId },
                include: [{ model: db.User, as: 'patientComment', attributes: ['id', 'username'] }],
                order: [['updatedAt', 'DESC']],
                raw: false,
                nest: true
            });
            resolve({
                errCode: 0,
                message: 'Success',
                data: comments
            });
        } catch (error) {
            console.error('Error at CommentService.getCommentByDoctorId', error);
            reject(error);
        }
    });
}

const getCommentByClinicId = async (clinicId) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!clinicId) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            }
            const comments = await db.Comment.findAll({
                where: { clinicId: clinicId },
                include: [{ model: db.User, as: 'patientComment', attributes: ['id', 'username'] }],
                order: [['updatedAt', 'DESC']],
                raw: false,
                nest: true
            });
            resolve({
                errCode: 0,
                message: 'Success',
                data: comments
            });
        } catch (error) {
            console.error('Error at CommentService.getCommentByClinicId', error);
            reject(error);
        }
    });
}

const updateComment = async (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id || !data.content) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            }
            const comment = await db.Comment.findOne({
                where: { id: id },
                raw: false
            });
            if (!comment) {
                resolve({
                    errCode: 1,
                    message: 'Comment not found'
                });
            } else {
                comment.content = data.content;
                await comment.save();
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: comment
                });
            }
        } catch (error) {
            console.error('Error at CommentService.updateComment', error);
            reject(error);
        }
    });
}

const deleteComment = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Missing required parameter'
                });
            }
            const comment = await db.Comment.findOne({
                where: { id: id }
            });
            if (!comment) {
                resolve({
                    errCode: 1,
                    message: 'Comment not found'
                });
            } else {
                await db.Comment.destroy({
                    where: { id: id }
                });
                resolve({
                    errCode: 0,
                    message: 'Success',
                });
            }
        } catch (error) {
            console.error('Error at CommentService.deleteComment', error);
            reject(error);
        }
    });
}

module.exports = {
    createComment,
    getCommentByDoctorId,
    getCommentByClinicId,
    updateComment,
    deleteComment
};