import connectDB from "@/config/db";
import Address from "@/models/address";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// getting address for users
export async function GET(req) {
  try {
    const { userId } = getAuth(req);

    await connectDB();

    const addresses = await Address.find({ userId });

    return NextResponse.json({ success: true, addresses });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
