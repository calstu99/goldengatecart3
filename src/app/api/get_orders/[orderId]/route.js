import { NextResponse } from 'next/server';
import connect from "@/app/utils/db";
import MasterOrder from "@/app/models/Master_Order";

export async function GET(request, { params }) {
  const { orderId } = params;

  try {
    await connect();
    const order = await MasterOrder.findById(orderId);
    
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    
    return NextResponse.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

