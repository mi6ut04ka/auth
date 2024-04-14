const Router = require('express')
const authController = require('../controller/auth.controller')
const userController = require('../controller/users.controller')
const {check} = require('express-validator')
const authMiddleware = require('../middleware/authMiddleware')
const roleMiddleware = require('../middleware/roleMiddleware')


const router = new Router();


router.post('/registration',
    [check('email', 'Введите корректный email').isEmail(),
    check('password', 'Пароль должен состоять не менее чем из 8 символов').isLength({min:8})
    ],authController.registation)
router.post('/login',[check('email', 'Введите корректный email').isEmail()],authController.login)
router.post('/logout', authController.logout)
router.get('/activate/:link', authController.activate)
router.get('/refresh', authController.refresh)
router.get('/users',roleMiddleware('admin'),authMiddleware,userController.getUsers)

module.exports = router;