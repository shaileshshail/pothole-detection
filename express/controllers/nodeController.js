const pool = require('../database/database')

//@desc create pothole
//@route POST /pothole
//@access private
const keepAlive = async(req,res)=>{
    console.log("keep alive")
    const {id,name,ip,port,lat,long,loc} = req.body;
    const [data] = await pool.query(`SELECT * FROM CURRENT_NODES WHERE id=?;`,[req.body.id])
    console.log(data)
    if(!data.length){
        console.log('hi')
        await pool.query(`INSERT INTO CURRENT_NODES(id,name,ip,port,latitude,longitude,loc) VALUES(?,?,?,?,?,?,?);`,[id,name,ip,port,lat,long,loc])
    }else{
        await pool.query(`UPDATE CURRENT_NODES SET lastseen=current_timestamp() WHERE id=?;`,[id]);
    }
    res.sendStatus(200);
}

const getAllNodes =async(req,res)=>{
    const [data] = await pool.query(`SELECT * FROM CURRENT_NODES;`);
    res.status(200).json({"data":data});
}

module.exports={
    keepAlive,
    getAllNodes
}




