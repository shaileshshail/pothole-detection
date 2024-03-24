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
  
//@desc create pothole
//@route POST /pothole
//@access private
const createReport = async(req,res)=>{
    console.log('create pothole');
    try {
        const image = req.files[0];
        const masked_image = req.files[1];
        const imageBuffer = await sharp(image.buffer).resize({height:640,width:480,fit:'contain'}).toBuffer();
        const maskedImageBuffer = await sharp(masked_image.buffer).resize({height:640,width:480,fit:'contain'}).toBuffer();
        const imageName = randomImageName();
        const maskedImageName = randomImageName();

        const data = JSON.parse(req.body.data);

        try{
            await insertToS3(imageName,imageBuffer,image.mimetype);
            await insertToS3(maskedImageName,maskedImageBuffer,masked_image.mimetype);
        }catch(error){

        } 
            
        await pool.query(`INSERT INTO POTHOLES(LATITUDE,LONGITUDE,ADDRESS,IMAGE,MASKED_IMAGE) VALUES(?,?,?,?,?);`,
            [data.lat,data.long,data.address,imageName,maskedImageName])


        res.status(200).send('Image received and processed successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing image.');
    }
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
const getReportByContractorId = async(req,res)=>{
    console.log(req.user.email)
    try{
        var [data] = await pool.query(`SELECT id FROM CONTRACTOR WHERE email=?;`,[req.user.email])
        data = data[0].id;

        var [result] = await pool.query(`SELECT * FROM POTHOLES WHERE contractorId=?;`,[data])
        return res.status(200).json({'data':result});
    }catch{
        
    }
    res.sendStatus(500);
}

//@desc get all classrooms
//@route GET /classrooms
//@access private
const getAllReport = async(req,res)=>{

    var [data] = await pool.query(`SELECT * FROM POTHOLES;`)

    for(let record of data){
        record["image_url"]= await getS3Url(record.image);
        record["masked_image_url"] = await getS3Url(record.masked_image);
        if(record["afterImage"]!=null){
            record["afterImage_image_url"] = await getS3Url(record.afterImage);
        }
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

//@desc get all classrooms
//@route PUT /classrooms/:id
//@access private
const updateReportByContractor= async(req,res)=>{
    console.log('updating potholes by contractor;')
    const {id}=req.body;
    try{
        const image = req.file;
        const imageBuffer = await sharp(image.buffer).resize({height:640,width:480,fit:'contain'}).toBuffer();
        const imageName = randomImageName();

        await insertToS3(imageName,imageBuffer,image.mimetype);

        await pool.query(`UPDATE potholes SET afterImage=? WHERE id=?;`,[imageName,id])
    }catch{

    }
}

//@desc delete classrooms by id
//@route DELTE /classrooms/:id
//@access private
const deleteReportById = async(req,res)=>{
    console.log(req.params.id);
    await pool.query(`DELETE FROM potholes WHERE id=?;`,[req.params.id]);
    res.sendStatus(200);
}

module.exports={
    createReport,
    getAllReport,
    deleteReportById,
    getReportByContractorId,
    updateReportByContractor
}




