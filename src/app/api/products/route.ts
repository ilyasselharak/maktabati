import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../lib/utils/database";
import Product from "../../../lib/models/Product";

export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Build query
    const query: Record<
      string,
      | string
      | boolean
      | Record<string, string | number | string[]>
      | Record<string, unknown>[]
      | { $or: Record<string, unknown>[] }[]
    > = { isActive: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      // Search in both product name and tags
      const searchTerms = search.split(" ").filter((term) => term.length > 0);
      const searchConditions = [];

      for (const term of searchTerms) {
        searchConditions.push({
          $or: [
            { name: { $regex: term, $options: "i" } },
            { description: { $regex: term, $options: "i" } },
            { tags: { $elemMatch: { $regex: term, $options: "i" } } },
          ],
        });
      }

      if (searchConditions.length > 0) {
        query.$and = searchConditions;
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice)
        (query.price as { $gte?: number }).$gte = parseFloat(minPrice);
      if (maxPrice)
        (query.price as { $lte?: number }).$lte = parseFloat(maxPrice);
    }

    // Calculate skip
    const skip = (page - 1) * limit;

    // Build sort object
    const sort: Record<string, 1 | -1> = {};
    sort[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get products with pagination
    const products = await Product.find(query)
      .populate("category", "name")
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    return NextResponse.json({
      products,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("Products fetch error:", error);
    return NextResponse.json({ error: "فشل في جلب المنتجات" }, { status: 500 });
  }
}
