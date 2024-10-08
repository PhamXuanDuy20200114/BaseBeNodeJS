import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // Lấy token từ header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Tách 'Bearer' khỏi token
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.status(403).json({
                    errCode: 5,
                    message: 'Token is not valid'
                })
            }
            //user là token đã được giải mã, được gán vào req.user
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({
            errCode: 6,
            message: 'You are not authenticated'
        });
    }
}

const verifyUserToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if ((req.params.id == req.user.id) & (req.user.roleId == 'R3')) {
            next();
        } else {
            return res.status(403).json({
                errCode: 6,
                message: 'You are not user'
            })
        }
    })
}

const verifyDocterToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if ((req.params.id == req.user.id) & (req.user.roleId == 'R2')) {
            next();
        } else {
            return res.status(403).json({
                errCode: 6,
                message: 'You are not doctor'
            })
        }
    })
}

const verifyAdminToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if ((req.params.id == req.user.id) || (req.user.roleId == 'R1')) {
            next();
        } else {
            return res.status(403).json({
                errCode: 6,
                message: 'You are not Admin'
            })
        }
    })
}

module.exports = {
    verifyToken,
    verifyAdminToken,
    verifyUserToken,
    verifyDocterToken
}