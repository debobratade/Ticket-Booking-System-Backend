
const mongoose=require('mongoose')

const userSchema = new mongoose.Schema({

    name: {
      type: String, 
      required: true,
      trim:true
    },
    profileImage: {
      type:String, 
      required:true
    }, 
    email: {
      type: String, 
      required:true, 
      unique:true,
      trim:true
    }, 
    phone: {
      type:String, 
      required:true, 
      unique:true,
      trim:true
    }, 
    password: {
      type:String,
      required:true, 
      min: 5, 
      max: 15,
      trim:true
    }, 
    role: {
      type:String,
      default: "user"
    }, 
    isDeleted: {
      type: Boolean,
      default: false,
    },
   
  }, { timestamp:true})


  module.exports= mongoose.model('User', userSchema)