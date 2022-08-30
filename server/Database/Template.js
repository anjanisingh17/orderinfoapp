import mongoose from "mongoose";

const template = mongoose.Schema({

        title:{
            type:String,
            required:true
        },
        body:{
            type:String,
            required:true
        },
        location:{
            type:String,
            required:true
        },
        

})


const Template = mongoose.model('templatedetails',template)


export default Template;