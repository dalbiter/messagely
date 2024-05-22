const express = require('express');
const router = new express.Router()
const User = require('../models/user');
const bcrypt = require('bcrypt')
const { BCRYPT_WORK_FACTOR, SECRET_KEY } = require('../config');
const jwt = require('jsonwebtoken')

/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/
router.post('/login', async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const result = await User.authenticate(username, password) 
        return res.send(result)
    } catch(e) {
        return next(e)
    }
    
})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */
router.post('/register', async (req, res, next) => {
    try {
        const { username, password, first_name, last_name, phone } = req.body;
        const newUser = await User.register({ username, password, first_name, last_name, phone })
        
        if(newUser) {
            const token = jwt.sign({
                username, 
                password: newUser.password, 
                first_name,
                last_name,
                phone
            }, SECRET_KEY)
            newUser.token = token
            return res.json(newUser)
        }
        
    } catch(e) {
        return next(e)
    }
    
});

router.get('/test', (req, res) => {
    res.send("this route is working")
})

module.exports = router;
