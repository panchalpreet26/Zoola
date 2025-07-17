const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Zulas",{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{console.log("MongoDB Connected Successfully")}).catch((e)=>{console.log(e);});