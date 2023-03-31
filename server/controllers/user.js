const {verify} = require("jsonwebtoken");
const bcrypt = require('bcryptjs');

const User = require('../models/User');
const authService = require("../services/auth.service")

exports.register = async (req, res) =>{
    try {
        reqBody = req.body;
        let {username, password, email, birthday} = {reqBody}
        const user = await User.findOne({ username });

        if (user)
            return res.status(400).json({
                message: 'User already exists!'
            });

        await User.createUser(username, password, email, birthday, function(err, admin){

            if (err){
                return res.status(400).json({
                    message: err
                });
                
            } else {
                return res.status(201).json({
                    status: 'success',
                    message: 'User created successfully.'
                });
            }
        });

    } catch (err) {
        return res.status(500).json({
            message: 'Something went wrong. Please,try again.'
        });
    }

}

exports.login = async (req, res) =>{
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email }, {password: 1, userID: 1, confirmed: 1}).lean();
        if (!user)
            return res.status(400).json({
                message: 'User with this email does not exist!'
            });

        if (!await bcrypt.compare(password, user.password))
            return res.status(401).json({
                message: 'Wrong password!'
            });

        await User.authorize(password, function(err, admin){

            if (err){
                return res.status(401).json({
                    message: err
                });
            } else {

                const payload = {
                    id: user._id,
                };
        
                const token = authService.signPayload(payload, "24h");
                return res.status(201).json( {
                    accessToken: `Bearer ${token}`
                });
            }
        })
    } catch (err) {
        return res.status(500).json({
            message: 'Something went wrong. Please,try again.'
        });
    }
}