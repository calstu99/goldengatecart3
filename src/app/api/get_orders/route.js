import Order from "../../models/Order";
import connect from "../../utils/db";

  export async function GET(request) {
    try {
      await connect(); // Connect to the MongoDB database
  
      const orders = await Order.find({});
      return new Response(JSON.stringify(orders), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: "Internal server error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
  

  /*
The POST and DELETE functions in the provided code are placeholders for handling
 HTTP POST and DELETE requests, respectively, to create and delete orders in the database.
  */
  export async function POST(request) {
    // Handle POST requests for creating new orders
    // ...
    try {
      await connect(); // Connect to the MongoDB database
  
      const orderData = await request.json();
  
      const newOrder = new Order({
        userId: orderData.userId,
        items: orderData.items,
        totalAmount: orderData.totalAmount,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
      });
  
      const savedOrder = await newOrder.save();
  
      return new Response(JSON.stringify(savedOrder), {
        status: 201, // Created
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: "Internal server error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
  
  export async function PUT(request) {
    // Handle PUT requests for updating orders
    // ...
    try {
      await connect(); // Connect to the MongoDB database
  
      const { orderId, newStatus } = await request.json();
  
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: newStatus },
        { new: true }
      );
  
      if (!updatedOrder) {
        return new Response(JSON.stringify({ message: "Order not found" }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
  
      return new Response(JSON.stringify(updatedOrder), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: "Internal server error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }
  
  export async function DELETE(request) {
    // Handle DELETE requests for deleting orders
    // ...
    try {
      await connect(); // Connect to the MongoDB database
  
      const { orderId } = await request.json();
  
      const deletedOrder = await Order.findByIdAndDelete(orderId);
  
      if (!deletedOrder) {
        return new Response(JSON.stringify({ message: "Order not found" }), {
          status: 404,
          headers: {
            "Content-Type": "application/json",
          },
        });
      }
  
      return new Response(JSON.stringify({ message: "Order deleted successfully" }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ message: "Internal server error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  }