
const mongoose=require('mongoose')
const ObjectId = mongoose.Schema.Types.ObjectId;

const ticketSchema = new mongoose.Schema({

    eventId: {
    type: ObjectId,
    required: true,
    ref: "Event",
    },
    date: {
        type:String, 
        required:true, 
      }, 
      description: {
        start:String,
        end:String
      }, 
      description_in_sec: {
        start:String,
        end:String
      }, 
    price: {
      type:String, 
      required:true
    }, 
    total_quantity: {
      type:String, 
      required:true, 
    }, 
    avaliable_quantity: {
      type:String,
     required:true
    }, 
    pbulished:{
      type: Boolean,
      default: true
    }
   
  }, { timestamp:true})


  module.exports= mongoose.model('Ticket', ticketSchema)