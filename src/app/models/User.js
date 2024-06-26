import mongoose from "mongoose";

const { Schema } = mongoose;

const addressSchema = new Schema({
  street: { type: String},
  city: { type: String },
  state: { type: String},
  postalCode: { type: String},
  country: { type: String},
}, { _id: false });

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    firstName: {
      type: String,
      
    },
    lastName: {
      type: String,
      
    },
    phoneNumber: {
      type: String,
      
    },
    addresses: [addressSchema],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);