import mongoose  from "mongoose";

const DBCon=async()=>{
  try{

    mongoose.connect(process.env.MONGODB_URL)
    console.log('Mongodb is connected')
  }catch(err){
    console.log('mongodb error',err)

  }
}

export default DBCon