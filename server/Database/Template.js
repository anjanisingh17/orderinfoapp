import mongoose from "mongoose";

const template = mongoose.Schema({

        shop:{
            type:String,
            required:true
        },
        merchant:{
            type:String
        },
        user:{
            type:String
        },
        

})


const Template = mongoose.model('templatedetails',template)


export default Template;