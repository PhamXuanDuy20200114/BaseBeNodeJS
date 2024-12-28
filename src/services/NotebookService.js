import { raw } from "body-parser";
import db from "../models";
const fs = require('fs').promises;

const createNotebook = async (data, path) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!data.title || !data.contentHTML || !data.contentText || !data.authorId || !data.censorId || !path) {
                resolve({
                    errCode: 1,
                    message: 'Thiếu thông tin bắt buộc'
                });
            } else {
                let modifyPath = '';
                if (path) {
                    let listPath = path.split('\\');
                    path = listPath.slice(1).join('\\');
                    modifyPath = process.env.URL_BASE + path
                }
                const result = await db.Notebook.create({
                    title: data.title,
                    contentHTML: data.contentHTML,
                    contentText: data.contentText,
                    image: modifyPath
                });
                for (let i = 0; i < data.authorId.length; i++) {
                    await db.AuthorNotebook.create({
                        authorId: data.authorId[i],
                        notebookId: result.id
                    });
                }
                for (let i = 0; i < data.censorId.length; i++) {
                    await db.CensorNotebook.create({
                        censorId: data.censorId[i],
                        notebookId: result.id
                    });
                }
                let notebook = await db.Notebook.findOne({
                    where: { id: result.id },
                    include: [
                        { model: db.User, as: 'authorData', through: { attributes: [] }, attributes: ['id', 'username'] },
                        { model: db.User, as: 'censorData', through: { attributes: [] }, attributes: ['id', 'username'] }
                    ],
                    raw: false,
                    nest: true
                });
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: notebook
                });
            }
        } catch (error) {
            console.log('Error: ', error);
            reject(error);
        }
    });
}

const getAllNotebook = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await db.Notebook.findAll(
                {
                    include: [
                        { model: db.User, as: 'authorData', through: { attributes: [] }, attributes: ['id', 'username'] },
                        { model: db.User, as: 'censorData', through: { attributes: [] }, attributes: ['id', 'username'] }
                    ],
                    raw: false,
                    nest: true
                }
            );
            resolve({
                errCode: 0,
                message: 'Success',
                data: data
            });
        } catch (error) {
            console.log('Error: ', error);
            reject(error);
        }
    });
}

const get12RandomNotebook = async () => {
    return new Promise(async (resolve, reject) => {
        try {
            const data = await db.Notebook.findAll(
                {
                    limit: 12
                }
            );
            resolve({
                errCode: 0,
                message: 'Success',
                data: data
            });
        } catch (error) {
            console.log('Error: ', error);
            reject(error);
        }
    });
}

const getNotebookById = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Thiếu thông tin bắt buộc'
                });
            } else {
                const data = await db.Notebook.findOne({
                    where: { id: id },
                    include: [
                        { model: db.User, as: 'authorData', through: { attributes: [] }, attributes: ['id', 'username'] },
                        { model: db.User, as: 'censorData', through: { attributes: [] }, attributes: ['id', 'username'] }
                    ],
                    raw: false,
                    nest: true
                });
                if (!data) {
                    resolve({
                        errCode: 1,
                        message: 'Notebook not found'
                    });
                }
                resolve({
                    errCode: 0,
                    message: 'Success',
                    data: data
                });
            }
        } catch (error) {
            console.log('Error: ', error);
            reject(error);
        }
    });
}

const updateNotebook = async (id, data, path) => {
    return new Promise(async (resolve, reject) => {
        try {
            let modifyPath = '';
            if (path) {
                let listPath = path.split('\\');
                path = listPath.slice(1).join('\\');
                modifyPath = process.env.URL_BASE + path
            }
            const notebook = await db.Notebook.findOne({
                where: { id: id },
                include: [
                    { model: db.User, as: 'authorData', through: { attributes: [] }, attributes: ['id', 'username'] },
                    { model: db.User, as: 'censorData', through: { attributes: [] }, attributes: ['id', 'username'] }
                ],
                raw: false,
                nest: true
            });
            if (!notebook) {
                resolve({
                    errCode: 1,
                    message: 'Notebook not found'
                });
            }
            if (notebook.image) {
                const path = notebook.image.replace(process.env.URL_BASE, 'src\\'); // delete old image
                await fs.unlink(path); // delete old image
            }
            notebook.title = data.title;
            notebook.contentHTML = data.contentHTML;
            notebook.contentText = data.contentText;
            notebook.authorId = data.authorId;
            notebook.censorId = data.censorId;
            notebook.image = modifyPath;
            await notebook.save();
            resolve({
                errCode: 0,
                message: 'Success',
                data: notebook
            });
        } catch (error) {
            console.log('Error: ', error);
            reject(error);
        }
    });
}

const deleteNotebook = async (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            if (!id) {
                resolve({
                    errCode: 1,
                    message: 'Thiếu thông tin bắt buộc'
                });
            } else {
                const notebook = await db.Notebook.findOne({
                    where: { id: id },
                    raw: false,
                });
                if (!notebook) {
                    resolve({
                        errCode: 1,
                        message: 'Notebook not found'
                    });
                }
                await db.AuthorNotebook.destroy({
                    where: { notebookId: id }
                });
                await db.CensorNotebook.destroy({
                    where: { notebookId: id }
                });
                if (notebook.image) {
                    const path = notebook.image.replace(process.env.URL_BASE, 'src\\'); // delete old image
                    await fs.unlink(path); // delete old image
                }
                await notebook.destroy();
                resolve({
                    errCode: 0,
                    message: 'Success'
                });
            }
        } catch (error) {
            console.log('Error: ', error);
            reject(error);
        }
    });
}

module.exports = {
    createNotebook,
    getAllNotebook,
    getNotebookById,
    updateNotebook,
    deleteNotebook,
    get12RandomNotebook
}