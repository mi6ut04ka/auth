const db = require('../db')

class UsersController{
    async getUsers(req, res){
        const users = await db.query('SELECT * FROM users')
        res.json(users.rows)
}


}

module.exports = new UsersController();