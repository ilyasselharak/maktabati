import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../../../lib/middleware/auth";
import dbConnect from "../../../../../lib/utils/database";
import Product from "../../../../../lib/models/Product";
import Category from "../../../../../lib/models/Category";

export async function GET(request: NextRequest) {
  const { user, response } = await authenticateRequest(request);

  if (response) {
    return response;
  }

  if (!user) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  try {
    await dbConnect();

    // Get total products count
    const totalProducts = await Product.countDocuments({ isActive: true });

    // Get total categories count
    const totalCategories = await Category.countDocuments();

    // For now, return placeholder values for revenue and orders
    // In a real application, you would have Order/OrderItem models
    const totalRevenue = 0;
    const totalOrders = 0;

    return NextResponse.json({
      totalProducts,
      totalCategories,
      totalRevenue,
      totalOrders,
    });
  } catch (error) {
    console.error("Dashboard stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard statistics" },
      { status: 500 }
    );
  }
}
