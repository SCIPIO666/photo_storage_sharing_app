const cloudinary=require('../config/cloudinary')
const logger=require('../utils/logger')

async function uploadUserAvatar(filePath,userId){
    try {
        const result = await cloudinary.uploader.upload(filePath,{
            folder: "avatars",
            public_id: `user_${userId}_avatar`,
            overwrite: true

        })       
        return result;
    } catch (error) {
        logger.error(`error: ${error.message}`)
        throw error
    }

}
async function uploadMediaFile(filePath,userId){
    try {
        const result = await cloudinary.uploader.upload(filePath,{
            folder: `users/${userId}`

        })       
        return result;
    } catch (error) {
        logger.error(`error: ${error.message}`)
        throw error
    }
}


module.exports={uploadUserAvatar,uploadMediaFile}