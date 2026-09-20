const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) 
    }
});
const upload = multer({ storage: storage });

// 1. Route: Background Removal ke liye
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    
    const inputPath = req.file.path;
    const outputPath = `uploads/nobg_${Date.now()}.png`;

    exec(`python remove_bg.py "${inputPath}" "${outputPath}"`, (error, stdout, stderr) => {
        if (error) return res.status(500).json({ error: 'Background removal failed' });
        res.json({ message: 'Background removed successfully!', processedImage: outputPath });
    });
});

// 2. NAYA ROUTE: Face Editing/Retouching ke liye
app.post('/api/face-edit', upload.single('image'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No image uploaded' });
    
    const inputPath = req.file.path;
    const outputPath = `uploads/face_${Date.now()}.jpg`;

    console.log('Image received, starting Face Editing...');

    exec(`python face_edit.py "${inputPath}" "${outputPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Face Edit Error: ${error.message}`);
            return res.status(500).json({ error: 'Face editing failed' });
        }
        console.log('Face edited successfully!');
        res.json({ message: 'Face edited successfully!', processedImage: outputPath });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});