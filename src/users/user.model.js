import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  name:        { type: String, required: true, maxLength: 25 },
  surname:     { type: String, required: true, maxLength: 25 },
  username:    { type: String, unique: true },
  email:       { type: String, required: true, unique: true },
  password:    { type: String, required: true, minLength: 8 },
  profilePicture: { type: String },
  role:        { type: String, enum: ["ADMIN_ROLE", "USER_ROLE"], default: "USER_ROLE" },
  estado:      { type: Boolean, default: true }
}, {
  timestamps: true,
  versionKey: false
});

UserSchema.methods.toJSON = function () {
  const { _id, password, ...user } = this.toObject();
  return { uid: _id, ...user };
};

export default model('User', UserSchema);