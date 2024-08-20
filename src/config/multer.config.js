const multer = require("multer");
const path = require("path");




//image filter
const multiUpload = multer({
  limits: { fileSize: "1000000" },
  fileFilter: (req, file, callback) => {
    const fileType = /jpeg|jpg|png|gif/;
    const mimeType = fileType.test(file.mimetype);
    const extname = fileType.test(path.extname(file.originalname));
    if (mimeType && extname) {
      return callback(null, true);
    }
    callback("Give proper file format to upload");
  },
}).array("images");

module.exports = { multiUpload };
