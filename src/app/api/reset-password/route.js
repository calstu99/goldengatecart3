// app/api/reset-password/route.ts
import { NextResponse } from 'next/server';
import User from "@/app/models/User";
import connect from "@/app/utils/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";

export async function POST(req) {
  try {
    const { token, password } = await req.json();
    await connect();

    const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    const user = await User.findOne({
        resetToken: hashedToken,
        resetTokenExpiry: { $gt: Date.now() },
      });

     if (!user) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);


    await User.updateOne(
        { _id: user._id },
        {
            $set: { password: hashedPassword },
            $unset: { resetToken: 1, resetTokenExpires: 1 },
          }
      );

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error in reset password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}