import connectDB from "@/config/db";
import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// adding shipping address
export async function POST(req) {
  try {
    const { userId } = getAuth(req); // getting userId from logged in user

    const { address } = await req.json();

    await connectDB();
    const newAddress = await Address.create({ ...address, userId });

    return NextResponse.json({
      success: true,
      message: "Address added successfully",
      newAddress,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
