const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const authenticateUser = require('../middleware/authMiddleware');

const router = express.Router();

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const cleanExt = path.extname(file.originalname).toLowerCase();
        const baseName = path.basename(file.originalname, cleanExt).replace(/[^a-zA-Z0-9_-]/g, '_');
        cb(null, `receipt-${baseName}-${uniqueSuffix}${cleanExt}`);
    }
});

// File Filter (Images and PDF only)
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/webp',
        'application/pdf'
    ];

    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPG, PNG, WEBP, and PDF files are allowed.'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10 MB max file size
    }
});

// POST /api/upload
router.post('/', authenticateUser, (req, res) => {
    // Accepts field name 'receipt' or 'file'
    const uploadHandler = upload.fields([
        { name: 'receipt', maxCount: 1 },
        { name: 'file', maxCount: 1 }
    ]);

    uploadHandler(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(400).json({
                success: false,
                message: `Upload error: ${err.message}`
            });
        } else if (err) {
            return res.status(400).json({
                success: false,
                message: err.message || 'File upload failed'
            });
        }

        const uploadedFile = (req.files?.receipt && req.files.receipt[0]) || (req.files?.file && req.files.file[0]);

        if (!uploadedFile) {
            return res.status(400).json({
                success: false,
                message: 'No receipt file was provided in the request'
            });
        }

        const host = req.get('host');
        const protocol = req.protocol;
        const fileUrl = `${protocol}://${host}/uploads/${uploadedFile.filename}`;

        return res.status(200).json({
            success: true,
            message: 'Receipt uploaded successfully',
            file_url: fileUrl,
            filename: uploadedFile.filename,
            original_name: uploadedFile.originalname,
            size: uploadedFile.size,
            mimetype: uploadedFile.mimetype
        });
    });
});

module.exports = router;