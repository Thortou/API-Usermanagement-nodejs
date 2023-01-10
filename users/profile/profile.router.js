const express = require('express');
const app = express();
const router = express.Router();
const controller = require('./profile.controller');

const multer = require('multer');
const path = require('path');
const maxSize = 2 * 1024 * 1024; 

let storage = multer.diskStorage({
    destination: function (req, file, cb) { 
        cb(null, './public/img'); 
     }, 
     filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
     }
});

let upload = multer({ 
  storage: storage,
  limits: { fileSize: maxSize },
  fileFilter: function(req,file, cb) {
   if(!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)){
       console.log('Only image...');
       // req.fileValidationError = 'Only image';
       return cb(new Error('Only jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF!'), false);
   }
   cb(null, true)
}
}) 


router.post('/create',controller.create); //api insert into 
router.get('/', controller.findeAll); //api select information all
router.get('/:ProfileId', controller.findeOne); // api select information by ID
router.put('/update', controller.updateprofile); // api Update information of Profiles
router.delete('/delete/:UserId', controller.DeleteUserAndeProfiles); // api Delete information of Profiles
router.put('/update/img',upload.single('image'), controller.updateOnly)
router.put('/update/img/name', controller.updateFirstName)

router.get("/findeimg/:ProfileId",  controller.findeImg); 
router.get("/getdistrict/:ProvinceId",  controller.getdistrict);
// router.get("/getimg", controller.getimg);

module.exports = router //export file router to use in file index.js