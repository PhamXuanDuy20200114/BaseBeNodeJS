import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    // Lấy token từ header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Tách 'Bearer' khỏi token
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                res.status(403).json({
                    errCode: 403,
                    message: 'Token is not valid'
                })
            } else {
                //user là token đã được giải mã, được gán vào req.user
                req.user = user;
                next();
            }
        });
    } else {
        res.status(401).json({
            errCode: 401,
            message: 'You are not authenticated'
        });
    }
}

const verifyOwnerToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if ((req.params.id == req.user.id) || (req.user.roleId == 'R1')) {
            next();
        } else {
            res.status(403).json({
                errCode: 403,
                message: 'You are not owner'
            })
        }
    })
}

const verifyDoctorToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if (((req.params.id == req.user.id) && (req.user.roleId == 'R2')) || (req.user.roleId == 'R1')) {
            next();
        } else {
            res.status(403).json({
                errCode: 403,
                message: 'You are not doctor'
            })
        }
    })
}

const verifyAdminToken = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user && req.user.roleId == 'R1') {
            next();
        } else {
            res.status(403).json({
                errCode: 403,
                message: 'You are not Admin'
            })
        }
    })
}

module.exports = {
    verifyToken,
    verifyAdminToken,
    verifyDoctorToken,
    verifyOwnerToken
}