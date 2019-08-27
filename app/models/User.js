const mongoose = require('mongoose');

const Schema = mongoose.Schema;

let UserSchema = new Schema({

    userId:{
        type:String,
        default:'',
        index:true,
        unique:true
    },
    firstName:{
        type:String,
        default:''
    },
    lastName:{
        type:String,
        default:''
    },
    email:{
        type:String,
        default:''
    },
    password:{
        type:String,
        default:''
    },
    mobileNumber:{
        type:Number,
        default:0
    },
    country_code:{
        type:String,
        default:''
    },
    country_name:{
        type:String,
        default:''
    },
    createdOn:{
        type:Date,
        default:''
    },
    is_verified:{
        type:Boolean,
        default:false
    },
    is_admin:{
        type:Boolean,
        default:false
    }

});

module.exports = mongoose.model('User',UserSchema);