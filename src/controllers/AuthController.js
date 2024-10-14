import authService from '../services/AuthService';
const register = async (req, res) => {
    let body = req.body;
    try {
        let data = await authService.registerService(body);
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
const login = async (req, res) => {
    let body = req.body;
    try {
        let data = await authService.loginService(body);
        return res.status(200).json(
            data
        );
    } catch (e) {
        console.log('Error: ', e);
        return res.status(200).json({
            errCode: 1,
            message: 'Error from server'
        })
    }
}

const refreshAccessToken = async (req, res) => {
    const { refreshToken, id, roleId } = req.body;
    if (!refreshToken) {
        return res.status(401).json({
            errCode: 5,
            message: 'You are not authenticated'
        });
    }
    if (!id || !roleId) {
        return res.status(200).json({
            errCode: 1,
            message: 'Missing required parameter'
        });
    }
    try {
        let data = await authService.refreshAccessToken(refreshToken, id, roleId, res);
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

const doctorRegister = async (req, res) => {
    let body = req.body;
    try {
        let data = await authService.doctorRegisterService(body);
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

module.exports = {
    register,
    login,
    refreshAccessToken,
    doctorRegister
}