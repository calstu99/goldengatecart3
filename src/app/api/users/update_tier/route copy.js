// app/api/users/update_tier/route.js

import User from "@/app/models/User";
import MasterOrder from "@/app/models/Master_Order";
import connect from "@/app/utils/db";

export async function PUT(request) {
  try {
    await connect(); // Connect to the MongoDB database

    const { userId, newTier } = await request.json();
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { tier: newTier },
      { new: true }
    );

    if (!updatedUser) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    return new Response(JSON.stringify(updatedUser), {
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

// You can also include GET, POST, and DELETE methods if needed

export async function GET(request) {
  try {
    await connect();
    const users = await User.find({});
    return new Response(JSON.stringify(users), {
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