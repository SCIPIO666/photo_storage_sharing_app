const userService = require('../services/usersServices');
const logger = require('../utils/logger');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        
        //  Generate a salt and hash the password
        const saltRounds = 12; 
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        //  Call the model with the hashed password
        const newUser = await userService.createUser(name, email, hashedPassword, role);

        //  Remove password from the response object for security
        logger.info(newUser, 'User registered successfully');
        return res.status(201).json(newUser);

    } catch (error) {
        logger.error({ err: error.message }, 'Registration logic failed');


        if (error.message === 'User with this email already exists') {
            return res.status(409).json({ error: error.message });
        }

        if (error.code === 'P2002') {
            return res.status(409).json({ error: 'Email already in use' });
        }


        return res.status(500).json({ 
            error: 'Internal Server Error',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined 
        });
    }
};
//  LIST ALL
const listUsers = async (req, res) => {
    try {

    } catch (error) {
        logger.error({ err: error.message }, 'List Users Error');
        res.status(500).json({ error: "Internal Server Error" });
    }
};

//  READ ONE (By ID)
// Note: In Express, the 'id' param is often handled by a separate param middleware
const getUserByID = async (req, res, next, id) => {
    try {

    } catch (error) {
        logger.error({ err: error.message, id }, 'Get User By ID Error');
        res.status(400).json({ error: "Could not retrieve user" });
    }
};

//  SIGN OUT
const signOutUser =async  (req, res) => {
    try {

    } catch (error) {
        logger.error({ err: error.message }, 'Sign Out Error');
        res.status(500).json({ error: "Sign out failed" });
    }
};
//  PROTECT ROUTE
const getUserDashboard = async(req, res) => {
    try {

    } catch (error) {


    }
};

//  LOG IN
const logInUser= async (req, res,next) => {
    try {
        const {password,email}=req.body

        const{userWithNoPassword,token}=userService.logInUser(email,password)
        logger.info(`succesful login ${email}`)
    return res.status(200).json({
            message: 'Login successful',
            token,
            user: userWithNoPassword
        });

       
    } catch (error) {
        logger.error({ err: error.message }, 'Login Error');
        res.status(500).json({ error: "Login failed" });
    }
};

//  UPDATE
const updateUser = async (req, res, next) => {
    try {

    } catch (error) {
        logger.error({ err: error.message }, 'Update User Error');
        res.status(400).json({ error: "Update failed" });
    }
};

//  DELETE
const removeUser = async (req, res, next) => {
    try {

    } catch (error) {
        logger.error({ err: error.message }, 'Remove User Error');
        res.status(400).json({ error: "Delete failed" });
    }
};

module.exports = {
    createUser,
    listUsers,
    getUserByID,
    logInUser,
    signOutUser,
    updateUser,
    removeUser,
    getUserDashboard
};

