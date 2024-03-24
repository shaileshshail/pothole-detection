const pool = require('../database/database')
const crypto = require('crypto');
const sharp = require('sharp');
const { S3Client,PutObjectCommand,GetObjectCommand }  =require('@aws-sdk/client-s3');
require("dotenv").config();
const randomImageName = (byte =32) =>crypto.randomBytes(byte).toString('hex');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const bucketName = process.env.AWS_BUCKET_NAME
const region = process.env.AWS_BUCKET_REGION
const accessKeyId = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3Client = new S3Client({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  })
  
//@desc create contractor
//@route POST /contractor
//@access private
const createContractor = async(req,res)=>{
    console.log('creating contractor');
    const {name,address,pincode,phoneNo,email,password} = req.body;
    console.log(req.body)
    try {
        await pool.query(`INSERT INTO CONTRACTOR(name,address,pincode,phoneNo,email,password) VALUES(?,?,?,?,?,?);`,
            [name,address,pincode,phoneNo,email,password])
        console.log('here')
        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).send('Unable to insert data .');
    }
}



//@desc get all classrooms
//@route GET /classrooms
//@access private
const getContractorById = async(req,res)=>{
    console.log(req.params.id);
    var [data] = await pool.query(`SELECT * FROM CONTRACTOR WHERE id=?;`,[req.params.id])
    //console.log(data)
    res.status(200).json({"data":data});
}

//@desc get all classrooms
//@route GET /classrooms
//@access private
const getAllContractor = async(req,res)=>{
    console.log(req.params.id);
    var [data] = await pool.query(`SELECT * FROM CONTRACTOR;`)
    //console.log(data)
    res.status(200).json({"data":data});
}

//@desc get all classrooms
//@route GET /classrooms
//@access private
const getAllContractorIdName = async(req,res)=>{
    console.log(req.params.id);
    var [data] = await pool.query(`SELECT id,name FROM CONTRACTOR;`)
    //console.log(data)
    res.status(200).json({"data":data});
}


//@desc get all classrooms
//@route PUT /classrooms/:id
//@access private
const updateContractor= async(req,res)=>{
    console.log('updating potholes;')
    console.log(req.user.role)
    const {id,name,address,pincode,logo,phoneNo,altPhoneNo,email,password,jobsCompleted,is_active} = req.body;
    console.log(req.body)

    if(req.user.role =="AD"){//all 
        try{
            await pool.query(`UPDATE CONTRACTOR SET name=?, address=?, pincode=?, logo=?, phoneNo=?,
            altPhoneNo=?, email=?, password=?, jobsCompleted=?, is_active=? 
            WHERE id=? `,[name,address,pincode,logo,phoneNo,altPhoneNo,email,password,jobsCompleted,is_active,id])
            res.sendStatus(200);
        }catch{
            console.log("unable to update contractor by admin");
            res.sendStatus(500);
        }
    }else{//add,pincode,logo,phoneNo,altPhoneNo,password
        try{
            await pool.query(`UPDATE CONTRACTOR SET name=?, address=?, pincode=?, logo=?, phoneNo=?,
            altPhoneNo=?, password=? 
            WHERE id=? `,[name,address,pincode,logo,phoneNo,altPhoneNo,password,id])
            res.sendStatus(200);
        }catch{
            console.log("unable to update contractor by contractor");
            res.sendStatus(500);
        }
    }

}

//@desc delete classrooms by id
//@route DELTE /classrooms/:id
//@access private
const deleteContractorById = async(req,res)=>{
    console.log(req.params.id);
    await pool.query(`DELETE FROM CONTRACTOR WHERE id=?;`,[req.params.id]);
    res.sendStatus(200);
}





const insertToS3 =async(fileName,buffer,contentType) =>{

    const uploadParams = {
        Bucket: bucketName,
        Body: buffer,
        Key: fileName,
        ContentType: contentType
    }
    await s3Client.send(new PutObjectCommand(uploadParams));
}

//@desc get all classrooms
//@route GET /classrooms
//@access private
const getAllReport = async(req,res)=>{

    var [data] = await pool.query(`SELECT * FROM POTHOLES;`)

    for(let record of data){
        record["image_url"]= await getS3Url(record.image);
        record["masked_image_url"] = await getS3Url(record.masked_image);
    }
    //console.log(data)
    res.status(200).json({"data":data});
}

const getS3Url = async(imageName)=>{
    const getObjectParams ={
        Bucket:bucketName,
        Key:imageName,
    }
    const command = new GetObjectCommand(getObjectParams);
    const url =  getSignedUrl(s3Client, command, { expiresIn: 3600 });
    return url;
}

//-------------------------------AUTH MANAGER------------------------------
const jwt = require("jsonwebtoken");


//@desc login user
//@route POST /auth/login
//@access public
const loginContractor = async (req, res) => {
    const {email,password} = req.body;
    console.log(req.body)
    if (!email || !password) {
        res.sendStatus(400);
        return
    }
    
    var [enitity] = await pool.query(`SELECT * FROM CONTRACTOR where email="${email}";`)
    enitity=enitity[0]
    console.log(enitity.name);

    if (enitity && (password==enitity.password)) {
        console.log("creating accesstoken")
        const accessToken = jwt.sign({
            user: {
                name:enitity.nane,
                email: enitity.email,
                role:"CO",
            },
        }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" });
        console.log("creating refreshtoken")
        const refreshToken = jwt.sign({
            user: {
                firstname:enitity.name,
                email: enitity.email,
                role:"CO",
            },
        }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1h" });
        
        //Saving refresh token of current users 
        res.cookie("jwt", refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000,sameSite:"Lax" }); 

        res.status(200).json({ accessToken, refreshToken});
    }
    else {
        res.sendStatus(401);
    }
 
};

//@desc current user information
//@route GET /api/users/currentuser
//@access private
const currentContractor = async (req, res) => {
    console.log("current user",req.user)
    res.status(200).json(req.user);
};


const logoutContractor = async (req, res) => {
    console.log("logging out");
    const cookies = req.cookies;
    if (!cookies?.jwt) {   //No cookies or cookie doesnt have jwt
        res.status(204);
        return res.json({ message: "Logout successfull" });
    }

    res.clearCookie('jwt', { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 ,sameSite:"Lax"});
    res.sendStatus(204);
};

//@desc returns new accesstoken
//@route get /api/refresh
//@access private
const requestNewAccessToken = async(req,res)=>{
    const user = req.user;

    const accessToken=jwt.sign({
        user: {
            name:user.name,
            email: user.email,
            role:user.role,
        },
    },process.env.ACCESS_TOKEN_SECRET,{expiresIn:'10m'})
    res.status(200).json({accessToken})

}

module.exports={
    createContractor,
    getContractorById,
    getAllContractor,
    getAllContractorIdName,
    deleteContractorById,
    updateContractor,
    //-------auth----
    loginContractor,
    logoutContractor,
    currentContractor,
    requestNewAccessToken,
}
