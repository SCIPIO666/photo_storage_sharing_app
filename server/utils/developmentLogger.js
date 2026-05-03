const logger=require('../utils/logger')
const dotenv=require("dotenv").config()

function logIndevlopment(message){
    if(process.env.NODE_ENVIROMENT==='development'){
        logger.info(message)
    }
}

module.exports(logIndevlopment)