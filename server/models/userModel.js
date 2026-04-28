const logger = require('../utils/logger');
const db=require('../config/prismaConfig')
const dotenv=require('dotenv')
dotenv.config()
    //CRUD USER DB ACTIONS
async function createUser(name, email, password, role) {
    logger.info('about to create user in db')
    try {
        const newUser = await db.user.create({
            data: { name, email, password, role },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                // password: false // By not including it, it's excluded
            }
        });

        return newUser; 
    } catch (error) {
        logger.error({ err: error.message }, 'failed to create user');
        throw error; 
    }
}
async function removeUser(email){
    try {

        const deletedUser = await db.user.delete({
            where: { email: email}
        });
        return deletedUser; 
    } catch (error) {
        logger.error({ err: error.message }, 'failed to delete user');
        throw error; 
    }   
}
async function  updateUser(email,updatedData){
    try {
        const updatedUser = await db.user.update({
            where: {email : email},
            data: updatedData
        });

        return updatedUser;
    } catch (error) {
        logger.error({ err: error.message }, 'failed to update user details');
        throw error; 
    }
}
async function  getOneUser(email){
    try {
        const user = await db.user.findUnique({
            where: {email: email}
        });

        return user; 
    } catch (error) {
        logger.error({ err: error.message }, 'failed to retrieve user from db');
        throw error; 
    }    
}
async function  getAllUsers(){
    try {
        const allUsers = await db.user.findMany()

        return allUsers; 
    } catch (error) {
        logger.error({ err: error.message }, 'failed to fetch users');
        throw error; 
    }
}

module.exports={
    createUser,
    removeUser,
    updateUser,
    getOneUser,
    getAllUsers
}