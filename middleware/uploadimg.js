const multer = require('multer');
const util = require('util');
const path = require('path')
const maxSize = 2 * 1024 * 1024;

let storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, './public/img'); 
     }, 
     filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
     }
});

let uploadFile = multer({ 
  storage: storage,
  limits: { fileSize: maxSize },
}).single("image"); 
let uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;