const mongoose=require('mongoose');
const demoSchema=new mongoose.Schema({
    contactName:{
        type:String,
        required:true
    },
    companyName:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    phoneNumber:{
        type:String,
        required:true
    },
    website:{
        type:String,
    },
    requestPurpose:{
        type:String,
        required:true
    },
    status:{
        type:String,
        default:"pending"
    }
});

module.exports=mongoose.model('Demo',demoSchema);