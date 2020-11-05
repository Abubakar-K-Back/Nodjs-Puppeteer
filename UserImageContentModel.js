const mongoose= require('mongoose');

const Schema= mongoose.Schema;

let User=new Schema({


  name:{
    type:String,
    },
   Content:{
       type:String
   }

   
});

const Users=module.exports=mongoose.model('Users',User);
