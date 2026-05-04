const { Schema, model} = require("mongoose");
const {createHmac, randomBytes } = require("crypto");
const { setToken } = require("../services/auth");

const userSchema = new Schema({
    fullName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
        //required: true,
    },
    password: {
        type: String,
        required: true,
    },
    profileImageURL: {
        type: String,
        default: "/images/image.png"
    },
    role: {
        type: String,
        enum: ["USER", "ADMIN"], // inn dono ke alava koi value asign nahi kar skte
        default: "USER"
    }
}, { timestamps: true})

userSchema.pre('save',async function (){
    const user  = this; // current user jo b hai
    if(!user.isModified("password")) return;
    const salt = randomBytes(16).toString("hex"); // secret key
    const hashed = createHmac("sha256", salt).update(user.password).digest("hex");
    this.salt = salt;
    this.password = hashed; // Ab original password replace ho gya, or usko change krne ke liye secret key dedi gyi hai
})

userSchema.static("matchPassword",async function (email,password){
    const user = await this.findOne({email});
    if(!user) return false;
    const salt = user.salt;
    const hashed = user.password;

    const providedHashed = createHmac("sha256", salt).update(password).digest("hex");
    if(providedHashed === hashed){
    const token = setToken(user);
    return token;
    }

})

const User = model("user", userSchema);

module.exports = User;