const router=require('express').Router();
const authController=require('../controllers/authController');
const verifyToken=require('../middleware/auth');

router.post('/signup', authController.signup_post);
router.post('/login', authController.login_post);

module.exports=router;