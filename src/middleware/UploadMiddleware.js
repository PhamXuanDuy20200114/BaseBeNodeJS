const multer = require('multer');
const path = require('path');


// Middleware để upload file
const uploadImageMiddleware = (req, res, next) => {
    // Cấu hình Multer để lưu file vào thư mục 'uploads'
    const storageImage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'src/assets/image/'); // Thư mục lưu file
        },
        filename: (req, file, cb) => {
            // Tạo tên file duy nhất với thời gian và phần mở rộng file gốc
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname)); // Tạo tên file duy nhất
        }
    });

    // Bộ lọc loại file (chỉ chấp nhận ảnh jpg, png)
    const imageFilter = (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // Chấp nhận file
        } else {
            cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false); // Loại bỏ file không hợp lệ
        }
    };

    // Tạo instance của Multer và giới hạn kích thước file tối đa là 5MB
    const uploadImage = multer({
        storage: storageImage,
        limits: {
            fileSize: 30 * 1024 * 1024 // Giới hạn 30MB
        },
        fileFilter: imageFilter
    });
    const singleUpload = uploadImage.single('image'); // Tên field trong form
    singleUpload(req, res, (err) => {
        if (err) {
            console.log('Upload img err: ', err.message);
            return res.status(400).json({
                errCode: 400,
                message: err.message
            });
        }
        if (!req.file) {
            console.log("Don't have uploaded file");
        }
        next();
    });
};

const uploadImageClinicMiddleware = (req, res, next) => {
    const multiUpload = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                // Kiểm tra loại file để quyết định thư mục lưu trữ
                cb(null, 'src/assets/image/');
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + path.extname(file.originalname));
            }
        }),
        limits: {
            fileSize: 300 * 1024 * 1024 // Giới hạn kích thước file là 30MB
        },
        fileFilter: (req, file, cb) => {
            // Kiểm tra loại file để áp dụng bộ lọc phù hợp 
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            if (allowedTypes.includes(file.mimetype)) {
                cb(null, true);
            } else {
                cb(new Error('Invalid image file type. Only JPEG, PNG, and GIF are allowed.'), false);
            }
        }
    }).fields([
        { name: 'image', maxCount: 1 },
        { name: 'background', maxCount: 1 }
    ]);

    multiUpload(req, res, (err) => {
        if (err) {
            console.log('Upload error: ', err.message);
            return res.status(400).json({
                errCode: 400,
                message: err.message
            });
        }
        next();
    });
};

const uploadProfileDoctorMiddleware = (req, res, next) => {
    const multiUpload = multer({
        storage: multer.diskStorage({
            destination: (req, file, cb) => {
                // Kiểm tra loại file để quyết định thư mục lưu trữ
                if (file.fieldname === 'image') {
                    cb(null, 'src/assets/image/');
                } else {
                    cb(null, 'src/assets/profile/');
                }
            },
            filename: (req, file, cb) => {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
                cb(null, uniqueSuffix + path.extname(file.originalname));
            }
        }),
        limits: {
            fileSize: 300 * 1024 * 1024 // Giới hạn kích thước file là 30MB
        },
        fileFilter: (req, file, cb) => {
            // Kiểm tra loại file để áp dụng bộ lọc phù hợp
            if (file.fieldname === 'image') {
                const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
                if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Invalid image file type. Only JPEG, PNG, and GIF are allowed.'), false);
                }
            } else {
                const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
                if (allowedTypes.includes(file.mimetype)) {
                    cb(null, true);
                } else {
                    cb(new Error('Invalid file type. Only DOC, DOCX, and PDF are allowed.'), false);
                }
            }
        }
    }).fields([
        { name: 'image', maxCount: 1 },
        { name: 'profile', maxCount: 1 },
        { name: 'certificate', maxCount: 1 }
    ]);

    multiUpload(req, res, (err) => {
        if (err) {
            console.log('Upload error: ', err.message);
            return res.status(400).json({
                errCode: 400,
                message: err.message
            });
        }
        next();
    });
};

// Middleware để upload file
const uploadResulltFile = (req, res, next) => {
    // Cấu hình Multer để lưu file vào thư mục 'uploads'
    const storageImage = multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'src/assets/result/'); // Thư mục lưu file
        },
        filename: (req, file, cb) => {
            // Tạo tên file duy nhất với thời gian và phần mở rộng file gốc
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname)); // Tạo tên file duy nhất
        }
    });

    // Bộ lọc loại file (chỉ chấp nhận ảnh jpg, png)
    const fileFilter = (req, file, cb) => {
        const allowedTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true); // Chấp nhận file
        } else {
            cb(new Error('Invalid file type. Only DOC, DOCX, and PDF are allowed.'), false); // Loại bỏ file không hợp lệ
        }
    };

    // Tạo instance của Multer và giới hạn kích thước file tối đa là 5MB
    const uploadImage = multer({
        storage: storageImage,
        limits: {
            fileSize: 30 * 1024 * 1024 // Giới hạn 30MB
        },
        fileFilter: fileFilter
    });
    const singleUpload = uploadImage.single('result'); // Tên field trong form
    singleUpload(req, res, (err) => {
        if (err) {
            console.log('Upload img err: ', err.message);
            return res.status(400).json({
                errCode: 400,
                message: err.message
            });
        }
        if (!req.file) {
            console.log("Don't have uploaded file");
        }
        next();
    });
};


// Xuất middleware
module.exports = {
    uploadImageMiddleware,
    uploadProfileDoctorMiddleware,
    uploadImageClinicMiddleware,
    uploadResulltFile
};
