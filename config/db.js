const mongoose = require('mongoose')

const db = async ()=>{
    try {
        const dbconnect = mongoose.connect(process.env.MONGO_URI)
        if(dbconnect){
            console.log("Database connected successfully");            
        }
        else{
            console.log("Can not connect to DB");            
        }
        
    } catch (error) {
        console.log('error', error);        
    }
}

module.exports = db