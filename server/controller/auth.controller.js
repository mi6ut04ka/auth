const { validationResult } = require('express-validator')
const {secret} = require('../config')
const authService = require('../service/auth-service');
const ApiError = require('../exeptions/api-error')


const generateAccessToken = (id , role) => {
    const payload ={
        id,
        role
    }
    return jwt.sign(payload,secret, {expiresIn: "24h"})
}

class AuthController{
    async registation(req,res,next) {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password} = req.body;
            
            const userData = await authService.registration(email, password)

            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})

            return res.json(userData)
        }catch(e){
            next(e);
        }
    }
    async login(req,res,next) {
        try{
            const errors = validationResult(req)
            if(!errors.isEmpty()){
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()))
            }
            const {email, password} = req.body;
            const userData = await authService.login(email,password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData);
        }catch(e){
            next(e);
        }
    }
    async logout (req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const token = await authService.logout(refreshToken);
            res.clearCookie('refreshToken')
            return res.json(token);
        }catch(e){
            next(e);
        }

    }

    async activate (req, res, next){
        try{
            const activationLink = req.params.link;
            await authService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL)
        }catch(e){
            next(e);
        }

    }

    async refresh (req, res, next){
        try{
            const {refreshToken} = req.cookies;
            const userData = await authService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30*24*60*60*1000, httpOnly: true})
            return res.json(userData);
        }catch(e){
            next(e);
        }

    }

    async getUsers(req,res) {
        try{
            const users = await db.query('SELECT * FROM users')
            res.json(users.rows)
        }catch(e){
            next(e);
        }
    }
}
module.exports = new AuthController();