import mongoose from "mongoose";
import connect from "../../utils/db";
import Order from "../../models/Order";
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Connect to MongoDB
    await connect();

    // Create a sample order
    const sampleOrder = new Order({
      userId: new mongoose.Types.ObjectId(), // Generate a new ObjectId
      items: [
        {
          productId: new mongoose.Types.ObjectId(), // Generate a new ObjectId
          quantity: 2,
          price: 19.99,
        },
        {
          productId: new mongoose.Types.ObjectId(), // Generate a new ObjectId
          quantity: 1,
          price: 29.99,
        },
      ],
      totalAmount: 69.97,
      shippingAddress: {
        street: "7428 La Tour Drive",
        city: "Sacramento",
        state: "CA",
        postalCode: "95842",
        country: "USA",
      },
      paymentMethod: {
        cardType: "Visa",
        cardNumber: "1234567890123456",
        expiryDate: "12/25",
        cardHolderName: "John Doe",
      },
    });

    // Save the sample order
    const savedOrder = await sampleOrder.save();

    // Send a JSON response with the saved order
    return NextResponse.json({ message: "Sample order created", order: savedOrder }, { status: 200 });
  } catch (error) {
    console.error("Error creating sample order:", error);
    return NextResponse.json({ message: "Error creating sample order" }, { status: 500 });
  }
}