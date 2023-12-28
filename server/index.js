import express from "express"
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import path from 'path';
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import user from "./model/user.js";
import dotenv from "dotenv"
dotenv.config();
const app = express();
const __dirname = path.resolve();
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

        res.status(201).json({token:token, signupUser,
             message:"Signup succesfully",success:true})
    }
    catch (e) {
        console.log(e.message)
    }
})


app.post("/api/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!(email && password)) {
            res.status(400).send("All fields are required");
            return;
        }

        const loginUser = await user.findOne({ email: email });

        if (loginUser && (await bcrypt.compare(password, loginUser.password))) {

            const accessToken = jwt.sign(
                { id: loginUser._id },
                'shhh',
                {
                    expiresIn: "5m"
                }
            );

            const refreshToken = jwt.sign(
                { id: loginUser._id },
                'shhh',
                {
                    expiresIn: "5m"
                }
            );


            loginUser.refreshToken = refreshToken;
            await loginUser.save();
            loginUser.password = undefined;

            const option = {
                expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                httpOnly: true
            };
            res.cookie('token', accessToken, option);
            res.cookie('refreshToken', refreshToken, { httpOnly: true });

            res.status(200).json({
                success: true,
                accessToken,
                refreshToken,
                user: loginUser
            });
        } else {
            res.status(404).json({ message: "User not found" });
        }
    } catch (e) {
        console.log(e.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});



app.post('/api/refresh-token', async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;

        if (!refreshToken) {
            return res.status(401).json({ message: 'Refresh token not provided' });
        }

        jwt.verify(refreshToken, 'shhh', (err, user) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid refresh token' });
            }

            const newAccessToken = jwt.sign(
                { id: user.id },
                'shhh',
                { expiresIn: '5m' }
            );

            res.json({ accessToken: newAccessToken });
        });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.post('/api/logout', (req, res) => {
    try {
        res.clearCookie('refreshToken');
        res.status(200).json({ success: true, message: 'Logout successful' });
    } catch (error) {
        console.log(error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/api/invalidate-refresh-token', async (req, res) => {
  try {
    const { refreshToken } = req.body;

    await user.updateOne({ refreshTokens: refreshToken }, { $pull: { refreshTokens: refreshToken } });

    res.status(200).json({ success: true, message: 'Refresh token invalidated' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

  


app.get('/api/protected', authenticateToken, (req, res) => {
    res.json({ message: `Hello, user! This is a protected resource.` });
});0


function authenticateToken(req, res, next) {
    const accessToken = req.cookies.token;

    if (!accessToken) {
        return res.status(401).json({ message: 'Access token not provided' });
    }

    jwt.verify(accessToken, 'shhh', (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid access token' });
        }

        req.user = user;

        next();
    });
}


if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

    app.get('*', (req, res) => { res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html')) });
}


const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server is start on port ${PORT}`)
})
