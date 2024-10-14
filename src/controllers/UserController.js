import userService from '../services/UserService';
const getAllUser = async (req, res) => {
    try {
        let data = await userService.getAllUser();
        return res.status(200).json(
            data
        );
    } catch (e) {
        console.log('Error: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const editUser = async (req, res) => {
    const id = req.params.id;
    const user = req.body;
    const path = req.file.path;
    try {
        const data = await userService.editUser(id, user, path);
        res.status(200).json(data);
    } catch (e) {
        console.log('error: ', e)
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

const deleteUser = async (req, res) => {
    let id = req.params.id;
    try {
        let data = await userService.deleteUser(id);
        return res.status(200).json(
            data
        );
    } catch (e) {
        console.log('Error: ', e);
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        });
    }
}

const getUserById = async (req, res) => {
    const id = req.params.id;
    try {
        const data = await userService.getUserById(id);
        return res.status(200).json(data);
    } catch (e) {
        return res.status(200).json({
            errCode: -1,
            message: 'Error from server'
        })
    }
}

module.exports = {
    getAllUser,
    editUser,
    deleteUser,
    getUserById
}