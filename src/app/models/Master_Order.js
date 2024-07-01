import mongoose from "mongoose";

const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    address: {
      city: { type: String },
      country: { type: String, required: true },
      line1: { type: String },
      line2: { type: String },
      postal_code: { type: String},
      state: { type: String},
    },
    items: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        unit_price: { type: Number, required: true },
        amount_total: { type: Number, required: true },
      },
    ],
    sub_total: { type: Number, required: true },
    currency: { type: String },
    shippingAddress: {
        city: { type: String, required: true },
        country: { type: String, required: true },
        line1: { type: String, required: true },
        line2: { type: String },
        postal_code: { type: String, required: true },
        state: { type: String, required: true },
    },
    paymentMethod: {
      platform: { type: String, required: true },
      cardType: { type: String },
      cardNumber: { type: String },
      expiryDate: { type: String },
      cardHolderName: { type: String },
    },
    status: { type: String, required: true, default: "pending" },
    currentTime: { type: String, required: true },
    currentDate: { type: String, required: true },
    transaction_id: {
      type: String,
      required: false // This makes the field optional
    }
  },
  { timestamps: true }
);

export default mongoose.models.MasterOrder || mongoose.model("MasterOrder", orderSchema);


// new field transaction Id added to your schema definition:
//you don't need to modify existing create operations, but you might want to update any relevant update operations.
// New documents will have this field. MongoDB and Mongoose will handle this gracefully.

