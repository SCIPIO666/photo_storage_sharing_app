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
async function  getOneUser(email){//less expensive lookup 
    try {
        const user = await db.user.findUnique({
            where: {email: email},
            select:{
                name: true,
                email: true,
                password: true,
                role: true
                
            }
        });

        return user; 
    } catch (error) {
        logger.error({ err: error.message }, 'failed to retrieve user from db');
        throw error; 
    }    
}
async function getUserWithAvatar(){
try {
    const userWithAvatar= await db.findUnique({
        where: {id: userId},
        include: {
            avatar: true,
            files: true,
            folders: true
        }
    })
} catch (error) {
    
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
async function getUserData(userId){
try {
    const userData=await db.user.findUnique({
        where:{userId: userid},
        include:{
            files: true,
            folders: {
                include: {
                    children: true,
                    files: true
                }
            }
        }
    })
    return userData
} catch (error) {
    logger.error(`error: ${error.message}`)
    throw error
}
}
module.exports={
    createUser,
    removeUser,
    updateUser,
    getOneUser,
    getAllUsers,
    getUserData
}