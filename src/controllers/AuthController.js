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
    let refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.status(401).json({
            errCode: 5,
            message: 'You are not authenticated'
        });
    }
    try {
        let data = authService.refreshAccessToken(refreshToken);
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

const logout = async (req, res) => {
    const id = req.body.id;
    try {
        let data = await authService.logout(id);
        return res.status(200).json(data);
    } catch (e) {
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
    logout
}