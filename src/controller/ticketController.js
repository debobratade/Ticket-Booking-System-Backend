
const eventModel = require("../model/eventModel")
const ticketModel = require("../model/ticketModel")

const { 
    hr_to_sec, convert_sec_to_hr } = require("../testCases/testCases")


//==============================================Add Ticket==============================================//


const addTicket= async(req, res)=>{
    try{
      
       
        const Id = Object.values(req.params)[0] 
        
        let event = await eventModel.find({_id:Id })
      

        if(event.published== false)
        return res.status(400).send({ status: false, message: "This movei is unpublished" });
   

        let {date, price, start, end, total_quan} = req.body

        let description={}
        description.start = start
        description.end = end

        let description_in_sec={}
        description_in_sec.start = hr_to_sec(date, start)
        description_in_sec.end = hr_to_sec(date, end)
     

        let duration = description_in_sec.end - description_in_sec.start 

        duration = convert_sec_to_hr(duration)
        if(duration<3)
        return res.status(400).send({ status: false, message: "Movie duration need minimum 3 hours" });


        //! check slot fro ticket

        let events = await ticketModel.find({eventId:Id })
   

        for(let i of events){
            if(i.description_in_sec.start> description_in_sec.start || i.description_in_sec.end> description_in_sec.start)
            return res.status(400).send({ status: false, message: `already ticket is booked in this time preiod. Booking possible after ${i.description.end} ` });
        }


        let eventId =Id
        let total_quantity = total_quan
         let avaliable_quantity = total_quan

        let data = {eventId, date, description, description_in_sec, price, total_quantity, avaliable_quantity }
       
      
     
          const createTcket = await ticketModel.create(data)
        
     
       return res.status(201).send({ status: true, message: "Ticket create successfully.", data: createTcket })
    }catch(error){
        console.log(error)
        return res.status(500).send({status:false, message:error.message})
    }
    }


        //==============================================Get ticket By Event Id==============================================//

const getTicketById = async (req, res) => {
    try {
      let Id = req.params.Id;


      let tickets = await ticketModel
        .find({eventId: Id, published: true })
      
  
      if (!tickets) {
        return res.status(404).send({ status: false, message: "No ticket found" });
      }else{
      return res.status(200).send( tickets );
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ status: false, error: err.message });
    }
  };



   //==============================================Delete By Id==============================================//

  const deletetick = async function (req, res) {
    const id = req.params.Id
  
  
     let del =await ticketModel.deleteOne({_id:id})
     if(del){
      return res
        .status(200)
        .send( { status: true, message: "ticket deleted successfully" } );
     }else{
      res.status(404).send({ status: false, message: "No ticket found" });
     }
  
  }
    
module.exports={addTicket, getTicketById, deletetick}