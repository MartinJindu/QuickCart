import connectDB from "@/config/db";
import Address from "@/models/address";
import Order from "@/models/order";
import Product from "@/models/product";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// to get list of orders for user
export async function GET(req) {
  try {
    const { userId } = getAuth(req);
    console.log(process.env.CLOUDINARY_CLOUD_NAME);

    await connectDB();

    Address.length;
    Product.length;

    const orders = await Order.find({ userId }).populate(
      "address items.product"
    );

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
