import MasterOrder from "@/app/models/Master_Order";
import connect from "@/app/utils/db";

  export async function GET(request) {
    try {
      await connect(); // Connect to the MongoDB database
  
      const orders = await MasterOrder.find({});
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
  
    //   const newOrder = new MasterOrder({
    //     userId: orderData.userId,
    //     items: orderData.items,
    //     totalAmount: orderData.totalAmount,
    //     shippingAddress: orderData.shippingAddress,
    //     paymentMethod: orderData.paymentMethod,
    //   });


      const newOrder = new MasterOrder({
        name : 'name',
        email:'jj@jj.com',
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
          state: '4 Park Lane',
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
        currentDate: '06/17/24',
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
  
      const updatedOrder = await MasterOrder.findByIdAndUpdate(
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
  
      const deletedOrder = await MasterOrder.findByIdAndDelete(orderId);
  
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