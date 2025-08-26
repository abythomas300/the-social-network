const dotenv = require('dotenv')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const userModel = require('./models/user')

dotenv.config()

const DB_URI = process.env.MONGO_URI

// new admin credentials
const username = "abythomas300"
const password = "abythomasadmin"
const role = "admin"

async function user_seed(){

    try{

        const hashString = await bcrypt.hash(password, 10)
        const seed_data = {username: username, password: hashString, role: role}
        await mongoose.connect(DB_URI)
        const newAdmin = new userModel(seed_data)
        await newAdmin.save()
        await mongoose.disconnect()

    }catch(error){

        console.log("Error in seeding, reason: ", error)

    }

}

user_seed()


