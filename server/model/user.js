import { Schema, model } from "mongoose";

const userSchema = new Schema({
    name:{
        type : String,
        required : true,
        default:"-"
    },
    email:{
        type : String,
        required : true
    },
    password:{
        type : String,
        required : true
    },
    token:{
        type: String,
        default: null
    }
});

const user = model("user",userSchema);

export default user;