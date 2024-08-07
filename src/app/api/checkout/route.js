import { NextResponse } from "next/server";
const stripe = require("stripe")(process.env.STRIPE_SECRET);

const getActiveProducts = async () => {
  const checkProducts = await stripe.products.list();
  const availableProducts = checkProducts.data.filter(
    (product) => product.active === true
  );
  // console.log(availableProducts);
  return availableProducts;
};

const getPriceDetails = async (priceId) => {
  const price = await stripe.prices.retrieve(priceId);
  return price;
};

export const POST = async (request) => {
  const { products } = await request.json();
  const data = products;

  let activeProducts = await getActiveProducts();

  try {
    for (const product of data) {
      const stripeProduct = activeProducts?.find(
        (stripeProduct) =>
          stripeProduct?.name?.toLowerCase() == product?.name?.toLowerCase()
      );

      if (stripeProduct == undefined) {
        const prod = await stripe.products.create({
          name: product.name,
          // images: [product.imageUrl], // Add the product image URL here
          default_price_data: {
            unit_amount: parseInt((product.price * 100).toFixed(0)),
            currency: "usd",
          },
        });
      } else {
        // Retrieve the current default price details
        const currentPrice = await getPriceDetails(stripeProduct.default_price);

        // Check if the price has changed
        const newUnitAmount = parseInt((product.price * 100).toFixed(0));
        if (currentPrice.unit_amount !== newUnitAmount) {
          // Step 1: Create a new price
          const newPrice = await stripe.prices.create({
            unit_amount: newUnitAmount,
            currency: 'usd',
            product: stripeProduct.id,
          });

          // Step 2: Update the product to set the new price as default
          await stripe.products.update(stripeProduct.id, {
            default_price: newPrice.id,
          });

          // Step 3: Archive the old price
          await stripe.prices.update(stripeProduct.default_price, {
            active: false,
          });
        }
      }
    }
  } catch (error) {
    console.error("Error in creating or updating a product", error);
    throw error;
  }

  activeProducts = await getActiveProducts();
  let stripeItems = [];

  for (const product of data) {
    const stripeProduct = activeProducts?.find(
      (prod) => prod?.name?.toLowerCase() == product?.name?.toLowerCase()
    );

    if (stripeProduct) {
      stripeItems.push({
        price: stripeProduct?.default_price,
        quantity: product?.quantity,
        // images: product?.imageUrl ? [String(product?.imageUrl)] : [], // Add the product image URL here
      });
    }
  }

  const session = await stripe.checkout.sessions.create({
    line_items: stripeItems,
    mode: "payment",
    billing_address_collection: 'required',
    success_url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/cancel`,
  });

  return NextResponse.json({ url: session.url });
};


//https://docs.stripe.com/payments/checkout/customization