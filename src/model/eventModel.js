
const mongoose=require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const eventSchema = new mongoose.Schema({

    uploaderId: {
    type: ObjectId,
    // required: true,
    ref: "Admin",
    },

    slug: {
      type: String, 
      required: true,
    },
    name: {
      type:String, 
      required:true
    }, 
    poster: {
      type:String, 
      // required:true
    }, 

    description: {
      type: String, 
      required:true, 
    }, 
    start_date: {
      type:String, 
      required:true, 
    }, 
    end_date: {
      type:String, 
      required:true, 
    }, 
    published: {
      type:Boolean,
     default:true
    }, 
   
  }, { timestamp:true})


  module.exports= mongoose.model('Event', eventSchema)