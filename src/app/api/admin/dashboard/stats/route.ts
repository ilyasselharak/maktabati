import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../../../lib/middleware/auth";
import dbConnect from "../../../../../lib/utils/database";
import Product from "../../../../../lib/models/Product";
import Category from "../../../../../lib/models/Category";
import Order from "../../../../../lib/models/Order";

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

    // Get real order statistics
    const totalOrders = await Order.countDocuments();
    const totalRevenueResult = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$totalAmount" },
        },
      },
    ]);
    const totalRevenue =
      totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

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
