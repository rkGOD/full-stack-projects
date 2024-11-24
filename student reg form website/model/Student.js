const mongoose=require('mongoose')
const studentSchema = mongoose.Schema({
    first_name:String,
    last_name:String,
    email:String,
    gender:String,
    department: String
})
module.exports=mongoose.model('Student',studentSchema)