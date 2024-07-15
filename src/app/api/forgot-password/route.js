// app/api/forgot-password/route.ts
import { NextResponse } from 'next/server';
import User from "@/app/models/User";
import connect from "@/app/utils/db";
import bcrypt from "bcryptjs";
import crypto from "crypto";


export async function POST(req) {
  try {
    const { email } = await req.json();
    await connect();

    const user = await User.findOne({email });
    if (!user) {
      return NextResponse.json({ error: 'Email does not exist' }, { status: 404 });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

    const passwordResetExpires = new Date(Date.now() + 3600000); // 1 hour from now
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_API_URL}/reset-password/${resetToken}`;


 // Function to email receipt
  const sendEmail = async(email, resetUrl) => {

  try {
  const userFirstname= email;
  const resetPasswordLink = resetUrl;
  const apiBaseUrl = process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:3000';
    console.log("Sending email to:", email);
    console.log("Reset URL:", resetUrl);
    console.log("API endpoint:", `${apiBaseUrl}/api/email/reset-password`);

    const response = await fetch(`${apiBaseUrl}/api/email/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userFirstname,resetPasswordLink}),
    });

    if (response.ok) {
      console.log(' Reset Email sent successfully');
    } else {
      console.error('Failed to send reset email');
    }
  } catch (error) {
    console.error('Error sending reset email:', error);
  }
};

    //log to database
    await User.updateOne(
      { _id: user._id },
      { $set: { resetToken: passwordResetToken, resetTokenExpiry: passwordResetExpires} }
    );

    // send reset email to user
    await sendEmail(email,resetUrl);

    console.log("reset-url",resetUrl);
    console.log ("email",email);
    
    return NextResponse.json({ message: 'Password reset email sent' });

  
  } catch (error) {
    console.error('Error in forgot password:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}