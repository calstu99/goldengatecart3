import connect from "./connect";
import Order from "../../app/models/Order";

const createSampleOrder = async () => {
  try {
    // Connect to MongoDB
    await connect();

    // Create a sample order
    const sampleOrder = new Order({
      userId: "6456789012345678901234", // Replace with a valid user ID
      items: [
        {
          productId: "6456789012345678901234", // Replace with a valid product ID
          quantity: 2,
          price: 19.99,
        },
        {
          productId: "6456789012345678901235", // Replace with a valid product ID
          quantity: 1,
          price: 29.99,
        },
      ],
      totalAmount: 69.97,
      shippingAddress: {
        street: "123 Main St",
        city: "New York",
        state: "NY",
        postalCode: "10001",
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
    console.log("Sample order created:", savedOrder);
  } catch (error) {
    console.error("Error creating sample order:", error);
  }
};

createSampleOrder();