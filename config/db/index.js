
import mongoose from "mongoose";

import dotenv from "dotenv";



dotenv.config();
 
// const uri= `${process.env.DATABASE}`

async function connect() {
    try {
      await mongoose.connect(`${process.env.DATABASE_CONNECT}`, {
        useNewUrlParser: true,
        // useCreateIndex: true,
        useUnifiedTopology: true,
        
      })
      console.log('Connect successfully!!!');
    } catch (error) {
      console.log('Connect failure!!!',error);
    }
  }

  export default connect;