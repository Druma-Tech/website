const mongoose = require('mongoose');
const moment = require('moment');
const User = require('./userModel');
const redisClient = require('../config/redis');

// async function resetExpiredSecretKeys() {
//   try {
//     const now = moment();
//     const expiredDocs = await User.find({
//       secretKeyExpiry: { $lt: now.toDate() },
//       secretKey: { $ne: null },
//     });

//     if (expiredDocs.length > 0) {
//       console.log(`Found ${expiredDocs.length} expired documents. Resetting secret keys.`);

//       // Update expired documents
//       await User.updateMany(
//         { secretKeyExpiry: { $lt: now.toDate() }, secretKey: { $ne: null } },
//         { $set: { secretKey: null } }
//       );

//       // Invalidate all related cached users
//       for (const doc of expiredDocs) {
//         await redisClient.del(`user:${doc._id}`);
//       }

//       console.log('Expired secret keys have been reset.');
//     }
//   } catch (error) {
//     console.error('Error resetting expired secret keys:', error);
//   }
// }

//create a resetExpiredSecretKeys function that will check for all the users stored in redis and reset the secret key if it has expired
//The function will be called every 60 seconds

async function resetExpiredSecretKeys() {
  try{
    const now=moment();
    const expiredDocs= await redisClient.keys('user:*');
    for(const key of expiredDocs){
      const user= await redisClient.get(key);
      if(user.secretKeyExpiry < now.toDate()){
        user.secretKey=null;
        await redisClient.setEx(key,2592000,JSON.stringify(user));
      }
    }
    console.log('Expired secret keys have been reset.');
  }catch(error){
    console.error('Error resetting expired secret keys:', error);
  }
};

setInterval(resetExpiredSecretKeys, 60 * 1000); // 60 seconds

module.exports = resetExpiredSecretKeys;
