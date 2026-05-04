const { connect} = require("mongoose");

async function connectMongoose(url){
    connect(url)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((error) => {
        console.log("Error: ",error);
    })
}

module.exports = connectMongoose
