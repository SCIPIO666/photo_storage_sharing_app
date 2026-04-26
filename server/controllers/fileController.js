const logger=require('../utils/logger')

async function uploadFile(req,res){

    if(req.files){
        logger.info(req.files)
    }
logger.info(req.file)
res.end()
}

module.exports={uploadFile}