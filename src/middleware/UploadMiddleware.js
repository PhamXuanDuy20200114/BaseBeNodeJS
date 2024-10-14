const multer = require('multer');
const path = require('path');

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

// Cấu hình Multer để lưu file vào thư mục 'uploads'
const storageFile = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/assets/file/'); // Thư mục lưu file
    },
    filename: (req, file, cb) => {
        // Tạo tên file duy nhất với thời gian và phần mở rộng file gốc
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Tạo tên file duy nhất
    }
});

// Bộ lọc loại file (chỉ chấp nhận ảnh jpg, png)
const imageFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true); // Chấp nhận file
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, and GIF are allowed.'), false); // Loại bỏ file không hợp lệ
    }
};

// Bộ lọc file để chỉ cho phép file DOC, DOCX, và PDF
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
    fileFilter: imageFilter
});
const uploadFile = multer({
    storage: storageFile,
    limits: {
        fileSize: 60 * 1024 * 1024 // Giới hạn 30MB
    },
    fileFilter: fileFilter
});

// Middleware để upload file
const uploadImageMiddleware = (req, res, next) => {
    const singleUpload = uploadImage.single('image'); // Tên field trong form
    singleUpload(req, res, (err) => {
        if (err) {
            console.log(err.message);
            return res.status(400).json({
                errCode: 400,
                message: err.message
            });
        }
        if (!req.file) {
            return res.status(400).json({
                errCode: 400,
                message: 'Please select an image to upload'
            });
        }
        next();
    });
};

const uploadFileMiddleware = (req, res, next) => {
    const singleUpload = uploadFile.single('document'); // Tên field trong form
    singleUpload(req, res, (err) => {
        if (err) {
            console.log(err.message);
            return res.status(400).json({
                errCode: 400,
                message: err.message
            });
        }
        if (!req.file) {
            return res.status(400).json({
                errCode: 400,
                message: 'Please select an image to upload'
            });
        }
        next();
    });
};

// Xuất middleware
module.exports = {
    uploadImageMiddleware,
    uploadFileMiddleware
};
