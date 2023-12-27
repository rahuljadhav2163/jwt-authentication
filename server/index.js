import express from "express"
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import user from "./model/user.js";
import dotenv from "dotenv"
dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());


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


app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("All fields are required")
        }

        const loginUser = await user.findOne({ email: email });

        if (loginUser && (await bcrypt.compare(password, loginUser.password))) {
            const token = jwt.sign(
                { id: loginUser._id },
                'shhh',
                {
                    expiresIn: "5m"
                }
            )
            loginUser.token = token
            loginUser.password = undefined

            res.status(201).json(loginUser)

            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            }
            res.status(200).cookie('token', token, option).json({
                success: true, token, signupUser
            })
    
            
        }else{
            message : 'invalid password'
        }
    }
    catch (e) {
        console.log(e.message)
    }
})

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server is start on port ${PORT}`)
})
