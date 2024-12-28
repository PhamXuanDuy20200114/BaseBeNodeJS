import NotebookService from '../services/NotebookService'

const createNotebook = async (req, res) => {
    const data = req.body;
    let path = '';
    if (req.file) {
        path = req.file.path;
    }
    try {
        const result = await NotebookService.createNotebook(data, path);
        return res.status(200).json(result);
    } catch (error) {
        console.log('Error: ', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}
const getAllNotebook = async (req, res) => {
    try {
        let data = await NotebookService.getAllNotebook();
        return res.status(200).json(data);
    } catch (error) {
        console.log('Error: ', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const get12RandomNotebook = async (req, res) => {
    try {
        let data = await NotebookService.get12RandomNotebook();
        return res.status(200).json(data);
    } catch (error) {
        console.log('Error: ', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getNotebookById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await NotebookService.getNotebookById(id);
        return res.status(200).json(data);
    } catch (error) {
        console.log('Error: ', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const updateNotebook = async (req, res) => {
    const data = req.body;
    const id = req.params.id;
    let path = '';
    if (req.file) {
        path = req.file.path;
    }
    try {
        const result = await NotebookService.updateNotebook(id, data, path);
        return res.status(200).json(result);
    } catch (error) {
        console.log('Error: ', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const deleteNotebook = async (req, res) => {
    const id = req.params.id;
    try {
        const result = await NotebookService.deleteNotebook(id);
        return res.status(200).json(result);
    } catch (error) {
        console.log('Error: ', error);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}
module.exports = {
    getAllNotebook,
    getNotebookById,
    createNotebook,
    updateNotebook,
    deleteNotebook,
    get12RandomNotebook
}