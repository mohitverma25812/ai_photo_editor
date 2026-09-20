const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process'); // <-- Python script run karne ke liye add kiya

const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Check agar 'uploads' folder nahi hai toh create kar do
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Multer storage setup (Image kahan aur kis naam se save hogi)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/') // 'uploads' folder mein save karega
    },
    filename: function (req, file, cb) {
        // Image ko ek unique naam dega (time ke hisaab se)
        cb(null, Date.now() + path.extname(file.originalname)) 
    }
});

const upload = multer({ storage: storage });

// API endpoint image receive karne aur AI process karne ke liye
app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No image uploaded' });
    }
    
    const inputPath = req.file.path;
    // Transparent image hamesha PNG format mein hoti hai
    const outputPath = `uploads/nobg_${Date.now()}.png`;

    console.log('Image received, starting AI background removal...');

    // Python script ko run karna
    exec(`python remove_bg.py "${inputPath}" "${outputPath}"`, (error, stdout, stderr) => {
        if (error) {
            console.error(`AI Error: ${error.message}`);
            return res.status(500).json({ error: 'Background removal failed' });
        }

        console.log('Background removed successfully!');
        
        // Flutter app ko processed image ki details bhejna
        res.json({
            message: 'Background removed successfully!',
            originalImage: inputPath,
            processedImage: outputPath
        });
    });
});

// Server Start karna
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Backend server is running on http://localhost:${PORT}`);
});