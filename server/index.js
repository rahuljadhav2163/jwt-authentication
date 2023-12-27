import express from "express"
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import user from "./model/user.js";
import dotenv from "dotenv"
dotenv.config();
const app = express();

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.MONGOURI)
    if (conn) {
        console.log("mongodb connected")
    }
}

connectDB();

app.post('/api/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!(name && email && password)) {
            res.status(400).send("All fields are required")
        }
        const encPassword = await bcrypt.hash(password, 10);

        const signupUser = await user.create({
            name,
            email,
            password: encPassword
        })
        const token = jwt.sign(
            { id: signupUser._id, email },
            'shhh',
            {
                expiresIn: "5m"
            }
        )
        signupUser.token = token
        signupUser.password = undefined

        res.status(201).json(signupUser)
    }
    catch (e) {
        console.log(e.message)
    }
})


app.post("/api/login", async(req, res)=>{
try{

}
catch(e){
    console.log(e.message)
}
})

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server is start on port ${PORT}`)
})
