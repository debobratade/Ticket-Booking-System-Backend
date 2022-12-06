const adminModel = require("../model/adminModel")
const eventModel = require("../model/eventModel")
const { uploadFile } = require("../aws/aws")
const { isValid, validName, isValidMail,
    isValidMobile, isValidRequest,
    isValidPassword, capitalize } = require("../testCases/testCases")


//==============================================Add Event==============================================//


const addEvent= async(req, res)=>{
    try{
      
        const uploaderId = req.body.Id
          let poster = req.files
         let {slug, name, description, start, end} = req.body
         
         poster = await uploadFile(poster[0])

          if (req.loginId != uploaderId) {
            return res.status(403).send({ status: false, message: "User logged is not allowed to upload file" })
         }
       
         if (!isValid(slug)) {
            return res.status(400).send({ status: false, message: "Please enter slug name" })
        }
        slug=capitalize(slug)

         if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Please enter name" })
        }
        name=capitalize(name)
        
        if (!isValid(description)) {
           return res.status(400).send({ status: false, message: "Please enter description" })
       }
       description=capitalize(description)

       //Duration start
       const duration_start = new Date(start)
       const duration_start_seconds = duration_start.getTime() / 1000;
      
       //Duration end
       const duration_end = new Date(end)
       const duration_end_seconds = duration_end.getTime() / 1000;
       
       //Total duration
       const total_dur_secs = duration_end_seconds - duration_start_seconds 
       const total_dur_hrs = (Math.floor(total_dur_secs / 3600))
     

      
     if (total_dur_hrs < 24) 
     return res.status(400).send({ status: false, message: "Event must be published for 24 hours" })

        

      
    let start_date = start
    let end_date = end
    data = {slug, name, description, end, start, uploaderId, poster, start_date, end_date}
     
        let createEvent = await eventModel.create(data)
       
        if(createEvent){
            console.log(createEvent);
        return res.status(201).send({ status: true, message: "User created successfully.", data: createEvent })
        }
    }catch(error){
        console.log(error)
        return res.status(500).send({status:false, message:error.message})
    }
    }
    


    //==============================================Get Event By User Id==============================================//

const getEventtByUserId = async (req, res) => {
    try {
      let Id = req.params.Id;
      if (req.loginId != Id) {
        return res.status(403).send({ status: false, message: "User logged is not allowed to get file" })
     }

      let event = await eventModel
        .find({ uploaderId: Id, published: true })
      
  
      if (!event) {
        return res.status(404).send({ status: false, message: "No event found" });
      }else{
      return res.status(200).send( event );
      }
    } catch (err) {
      console.log(err);
      return res.status(500).send({ status: false, error: err.message });
    }
  };
  

    //==============================================Get All Event By User Id==============================================//

const getAllEventtByUserId = async (req, res) => {
  try {
    let Id = req.params.Id;

    if (req.loginId != Id) {
      return res.status(403).send({ status: false, message: "User logged is not allowed to get file" })
   }

    let event = await eventModel
      .find({ uploaderId: Id})
    

    if (!event) {
      return res.status(404).send({ status: false, message: "No event found" });
    }else{
    return res.status(200).send( event );
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, error: err.message });
  }
};


    //==============================================Get All Event==============================================//

const getAllEventt = async (req, res) => {
  try {

    let event = await eventModel
      .find({ published:true})
    

    if (!event) {
      return res.status(404).send({ status: false, message: "No event found" });
    }else{
    return res.status(200).send( event );
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send({ status: false, error: err.message });
  }
};

  //==============================================Delete Event==============================================//

  const deleteDocById = async function (req, res) {
    try {
        let Id = req.params.Id

        let document = await eventModel
        .findOne({ _id: Id, published: true })

        if (req.loginId != document.uploaderId) {
          return res.status(403).send({ status: false, message: "User logged is not allowed to delete the file" })
       }
            if (document) {
             let del = await eventModel.findOneAndUpdate(
              { _id: Id },
              { published: false },
              { new: true }
             );
               return res.status(200).send({status:true, message: "Your event is unpublished successfully",})
            } else{
               return res.status(404).send({message : "The event is already deleted"})
            }
        
    }
    catch(err){
        res.status(500).send({message : err.message})
    }
    
  }



  //================================================ Update Event================================================//


const updateEventstatus = async (req, res) => {
  try {
      let Id = req.params.Id
     
        let published;
      const findEvent = await eventModel.findById({_id:Id})

       //!checking Authorization

      if (req.loginId != findEvent.uploaderId) {
          return res.status(403).send({ status: false, message: "User logged is not allowed to update the profile details" })
      }
     
       if(findEvent.published==false)
       published=true
         else
         published=false
       
      

      let updateStatus = await eventModel.findOneAndUpdate({ _id: Id },{ published: published}, { new: true })

      if(updateStatus){
      return res.status(200).send({ status: true, message: "Update successful" })
      }
  }
  catch (err) {
      console.log(err)
      return res.status(500).send({ status: false, error: err.message })
  }
};


    module.exports ={addEvent, getEventtByUserId, deleteDocById, getAllEventtByUserId, updateEventstatus, getAllEventt}



    