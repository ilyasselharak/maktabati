import { NextResponse } from "next/server";
import dbConnect from "../../../../lib/utils/database";
import Product from "../../../../lib/models/Product";

export async function GET() {
  try {
    await dbConnect();

    // Get featured products (active products with images, sorted by creation date)
    const products = await Product.find({
      isActive: true,
      images: { $exists: true, $ne: [] },
    })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .limit(12);

    return NextResponse.json({
      products,
      total: products.length,
    });
  } catch (error) {
    console.error("Featured products fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch featured products" },
      { status: 500 }
    );
  }
}
