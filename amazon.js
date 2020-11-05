const mongoose= require('mongoose');

const Schema= mongoose.Schema;

let amazon=new Schema({


  reviews:{
    type:String,
    }

   
});

const amaz=module.exports=mongoose.model('amazon',amazon);
