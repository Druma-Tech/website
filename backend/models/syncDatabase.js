const redisClient = require('../config/redis');
const User = require('./userModel');
const Service = require('./serviceModel');
const Demo = require('./demoModel');

const syncCacheToDatabase = async () => {
    try {
      console.log('Starting full cache-to-database sync...');
  
      // 1. Sync Demo Requests
      const cachedDemos = await redisClient.keys('demo:*'); // Pattern to fetch all demo-related keys
      for (const demoKey of cachedDemos) {
        const cachedDemoData = await redisClient.get(demoKey);
  
        if (cachedDemoData) {
          const parsedDemo = JSON.parse(cachedDemoData);
          await Demo.findOneAndUpdate(
            { email: parsedDemo.email },
            parsedDemo,
            { upsert: true, new: true } // Create if not exists, update otherwise
          );
          console.log('Demo requests synchronized successfully.');
        }
      }
  
      const cachedUsers = await redisClient.keys('user:*'); 
      for (const userKey of cachedUsers) {
        const cachedUserData = await redisClient.get(userKey);
  
        if (cachedUserData) {
          const parsedUser = JSON.parse(cachedUserData);
  
          await User.findByIdAndUpdate(
            parsedUser._id,
            parsedUser,
            { upsert: true, new: true }
          );
        }
      }
      console.log('User details synchronized successfully.');
  
      const cachedServices = await redisClient.keys('service:*');
      for (const serviceKey of cachedServices) {
        const cachedServiceData = await redisClient.get(serviceKey);
  
        if (cachedServiceData) {
          const parsedService = JSON.parse(cachedServiceData);
  
          await Service.findOneAndUpdate(
            { userId: parsedService.userId },
            parsedService,
            { upsert: true, new: true }
          );
        }
        console.log('Service details synchronized successfully.');
      }
  
      console.log('Cache-to-database sync completed.');
    } catch (error) {
      console.error('Error during cache-to-database sync:', error);
    }
  };

module.exports = syncCacheToDatabase;
  