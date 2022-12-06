const adminModel = require("../model/adminModel")
const userModel = require("../model/userModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { uploadFile } = require("../aws/aws")
const { isValid, validName, isValidMail,
    isValidMobile, isValidRequest,
    isValidPassword, capitalize } = require("../testCases/testCases")


const registerUser = async function (req, res) {
    try {
       

        let userDetails = req.body
        let files = req.files
       
       
        let { name, email, phone, password, role } = userDetails


        if (!isValidRequest(userDetails)) {
            return res.status(400).send({ status: false, message: "Please enter details for user registration." })
        }
        if (!isValid(name)) {
            return res.status(400).send({ status: false, message: "Please enter lname for registration." })
        }
        let fullname = validName(name)
        if (fullname===false) {
            return res.status(400).send({ status: false, message: `${name} is not a valid name.` })
        }
        if (!password) {
            return res.status(400).send({ status: false, message: "Please enter a strong password for registration." })
        }
        if (!isValid(email)) {
            return res.status(400).send({ status: false, message: "Please enter email for registration." })
        }
        if (!isValidMail(email)) {
            return res.status(400).send({ status: false, message: "Please enter a valid email address." })
        }
        let mailCheck=0;
        if(role==="admin"){
        let mailCheck = await adminModel.findOne({ email })
        }
        else if(role==="user"){
        let mailCheck = await userModel.findOne({ email })
        }
        if (mailCheck!=0) {
            return res.status(400).send({ status: false, message: `${email} already registered, try new.` })
        }


        if (files.length == 0) {
            return res.status(400).send({ status: false, message: "Please upload profile image for registration." })
        }  
        
        if (!phone) {
            return res.status(400).send({ status: false, message: "Please enter phone number for registration" })
        }
        if (!isValidMobile(phone)) {
            return res.status(400).send({ status: false, message: "Please enter a valid Indian number." })
        }

        let phoneCheck=0;
        if(role==="admin"){
        let phoneCheck = await adminModel.findOne({ phone })
        }
        if(role==="user"){
        let phoneCheck = await userModel.findOne({ phone })
        }
        if (phoneCheck!=0) {
            return res.status(400).send({ status: false, message: `${phone} already registered, try new.` })
        }
       
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: "Please enter a password which contains min 5 and maximum 15 letters." })
        }
        
        //! Bcrypt & Salt 

        if (password) {
            const salt = await bcrypt.genSalt(10)
            const newPassword = await bcrypt.hash(password, salt)
            password = newPassword
        }

        //! Upload image on AWS s3 

        var uploadedFileURL = await uploadFile(files[0])
        let profileImage = uploadedFileURL
        if (!profileImage) {
            return res.status(400).send({ status: false, message: "Kindly upload profile image" });
        }

        name = fullname
      
        let responseBody = { name, email, phone, password, profileImage}
        let createUser;
        if(role=='admin'){
             createUser = await adminModel.create(responseBody)
        }
        else if(role=='user'){
             createUser = await userModel.create(responseBody)

        }
        return res.status(201).send({ status: true, message: "User created successfully.", data: createUser })
    }
    catch (err) {
        res.status(500).send({ status: false, message: err.message })
    }
};





//================================================userlogin================================================//


const userLogin = async (req,res)=> {
    try {
          let {email,password} = req.body
          if(!email && !password) return res.status(400).send({
            status:false,
            message:" Kindly enter your credential "
         });
         if(!email)  return res.status(400).send({
            status:false,
            message:"  Email is Required "
         });
         if(!password) return res.status(400).send({
            status:false,
            message: " Password is Required "
         })  

        let loginUser = await userModel.findOne({ email: email }).select("-password")
        if(!loginUser) 
        loginUser = await adminModel.findOne({ email: email }).select("-password")
        if (!loginUser) {
            return res.status(401).send({ status: false, message: "Not register email-id" })
        }

        let hashedpass = loginUser.password  
        const validpass = await bcrypt.compare(password, hashedpass)

        if (!validpass) {
            return res.status(401).send({ status: false, message: "Incorrect credential " })
        }

        //! Create JWT token

        let token = jwt.sign(
            {
                userId: loginUser._id,
                iat: Math.floor(Date.now() / 1000),
            }, "geogo", { expiresIn: '10h' }
        )
        let user = loginUser
        return res.status(200).send({
            status:true, user, 
            message:"User Loggedin Successfully",
            token
        });

    } catch (error) {
        console.log(error)
        return res.status(500).send({status:false, message:error.message})
    }
};






module.exports = {registerUser, userLogin}