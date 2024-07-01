import mongoose from "mongoose";
import connect from "../../../utils/db";
import MasterOrder from "../../../models/Master_Order";
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // Connect to MongoDB
    await connect();

    // Create a sample order
    const sampleOrder = new MasterOrder({
      name : 'name',
      email:'admin@admin.com',
      address: {
        city: 'Sacramento',
        country: 'USA',
        line1: '7428 La Tour Drive ',
        line2: '',
        postal_code: '95842',
        state: 'CA',
      },
      items: [
        {
            name: 'ladies handbag',
            quantity: 2,
            unit_price: 15.99,
            amount_total:32.22,
        },
        {
            name: 'CRKT Knife',
            quantity: 3,
            unit_price: 15.99,
            amount_total:82.22,
        },
      ],
      sub_total: 199.99,
      currency:'USD',
      shippingAddress: {
        line1: '200 Peters Lane',
        line2:'',
        city: 'Sacramento',
        state: 'CA',
        postal_code: '95842',
        country: 'US',
      },
      paymentMethod: {
        platform: 'PAYPAL',
        cardType: '',
        cardNumber: '',
        expiryDate: '',
        cardHolderName: '',
      },
      status:'paid',
      currentTime: '8:45PM',
      currentDate: '06/18/24',
    });

    // Save the sample order
    const savedOrder = await sampleOrder.save();

    // Send a JSON response with the saved order
    return NextResponse.json({ message: "Sample Master order created", order: savedOrder }, { status: 200 });
  } catch (error) {
    console.error("Error creating sample order:", error);
    return NextResponse.json({ message: "Error creating sample Master order" }, { status: 500 });
  }
}


 

    
  