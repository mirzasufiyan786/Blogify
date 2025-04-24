const { randomBytes, createHmac } = require("crypto");
const mongoose = require("mongoose");
const { assignTokenToUser } = require("../services/authentication");
const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    salt: {
      type: String,
    },
    password: {
      type: String,
      require: true,
    },
    profileImageUrl: {
      type: String,
      default: "/images/default.png",
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
  },
  { timestamps: true }
);

// --------------------code to hash password a built in package cryptohash of node js is used to hash password using (createhmac)------------------------

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("password")) return;
  const salt = randomBytes(16).toString();
  const hashedPassword = createHmac("sha256", salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static("matchPasswordAndGenerateToken" , async function (email,password){
    const user = await this.findOne({email});
    if(!user) throw new Error("User not found!");

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvideHash =  createHmac("sha256", salt)
    .update(password)
    .digest("hex");
if(hashedPassword !== userProvideHash ) throw new Error("Incorrect password")
    const token = assignTokenToUser(user)
    return token;

})

const User = mongoose.model("user", userSchema);

module.exports = User;
