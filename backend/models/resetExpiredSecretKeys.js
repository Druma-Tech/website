const mongoose = require('mongoose');
const moment = require('moment');
const User = require('./userModel');

// Reset expired secret keys
async function resetExpiredSecretKeys() {
  try {
    const now = moment(); 
    const expiredDocs = await User.find({
      secretKeyExpiry: { $lt: now.toDate() },
      secretKey: { $ne: null },
    });

    if (expiredDocs.length > 0) {
      console.log(`Found ${expiredDocs.length} expired documents. Resetting secret keys.`);
      
      // Update expired documents
      await User.updateMany(
        { secretKeyExpiry: { $lt: now.toDate() }, secretKey: { $ne: null } },
        { $set: { secretKey: null } }
      );

      console.log('Expired secret keys have been reset.');
    }
  } catch (error) {
    console.error('Error resetting expired secret keys:', error);
  }
}

// Run the reset function every 60 seconds
setInterval(resetExpiredSecretKeys, 60 * 1000); // 60 seconds

module.exports = resetExpiredSecretKeys;
