import multer from "multer";

// Set up storage configuration
const storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, 'uploads/'); // Specify the directory to save the uploaded files
    },
    filename: function(req, file, callback) {
        callback(null, Date.now() + '-' + file.originalname); // Use a unique filename
    }
});

// Create the multer instance with the storage configuration
const upload = multer({ storage });

// Export the upload middleware
export default upload;