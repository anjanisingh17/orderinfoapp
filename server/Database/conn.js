
import mongoose from "mongoose";

const username = 'root';
const password = 'root';
const cluster = 'cluster0.6locl';
const dbName = 'orderinfoappDb'; 

//Create Connection and new Db
export default mongoose.connect(
   `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbName}`,
      {
         useNewUrlParser: true,
         useUnifiedTopology: true
      }).then(() => {
           console.log('Mongoose Connection successful')
      }).catch((err) => {
           console.log(`no connectoin error -> ${err}`)
   });