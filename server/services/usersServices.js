const userModel = require('../models/userModel');
const logger = require('../utils/logger');
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv').config()
// CREATE
const createUser = async (name, email, password, role) => {
    try {
        // Check if user exists before trying to create
        const existingUser = await userModel.getOneUser(email);
        if (existingUser) {
            throw new Error('User with this email already exists');
        }

        const newUser = await userModel.createUser(name, email, password, role);   

        return newUser;
    } catch (error) {
        //  throw the error so the Controller's catch block can catch it
        logger.info(error.message)
        throw error;
    }
};

//  LIST ALL
const listUsers = async () => {
    try {

    } catch (error) {

    }
};

//  READ ONE (By ID)
const getUserByID = async () => {
    try {

    } catch (error) {

    }
};

//  LOG IN
const logInUser= async (email,password) => {
    try {
             const existingUser= await userModel.getOneUser(email)
        if(!existingUser){
           throw new Error('Invalid email or  password');
        }
        const passwordIsCorrect= await bcrypt.compare(password, existingUser.password);
        if (!passwordIsCorrect) {
          throw new Error('Invalid  password');
        }

        //email and password checks out,now we create token
        const token=jwt.sign(
            { id: existingUser.id, role: existingUser.role }, //user object
            process.env.JWT_SECRET, //secret
            { expiresIn: '1d' }//expiry period


        )
                const {password:_, ...userWithNoPassword}=existingUser
        //Return Token + User Info
        return {token,userWithNoPassword}


    } catch (error) {
        logger.info(error.message)
        throw error;
    }
};

//  SIGN OUT
const signOutUser = async() => {
    try {

    } catch (error) {


    }
};

//  PROTECT ROUTE
const getUserDashboard = async() => {
    try {

    } catch (error) {


    }
};

//  UPDATE
const updateUser = async () => {
    try {

    } catch (error) {

    }
};

//  DELETE
const removeUser = async () => {
    try {

    } catch (error) {


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
