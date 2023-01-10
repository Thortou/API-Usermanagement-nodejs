const express = require('express');
const app = express();
const router = express.Router();
const controller = require('./user.controller');
// const { checktoken } = require('../../middleware/auth')

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
})
function errHandler(err, req, res, next) {
   if(err instanceof multer.MulterError) {
      res.json({status:'err', message:'Img too lagre'})
   }
}
// app.use(errHandler);

router.post('/create',upload.single('image'), controller.create);
router.put('/update', controller.update);
router.get('/checkpass', controller.checkpass);
router.post('/hack', controller.hackpass);//ປ່ຽນລະຫັດຜ່ານເກົ່າເປັນ ລະບຫັດປ່ຽນໃໝ່
router.put('/changepass', controller.changePass); //ລືມລະຫັດຜ່ານຕ້ອງການປ່ຽນ ລະບຫັດປ່ຽນໃໝ່
router.get('/',controller.findeAll)
router.delete("/delete/:UserId", controller.DeleteUser); 
router.get('/:UserId', controller.getByuserid)

module.exports = router