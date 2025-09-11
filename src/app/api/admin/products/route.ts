import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../../lib/middleware/auth";
import dbConnect from "../../../../lib/utils/database";
import Product from "../../../../lib/models/Product";

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

    const products = await Product.find()
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      products,
      total: products.length,
    });
  } catch (error) {
    console.error("خطأ في جلب المنتجات:", error);
    return NextResponse.json({ error: "فشل في جلب المنتجات" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const { user, response } = await authenticateRequest(request);

  if (response) {
    return response;
  }

  if (!user) {
    return NextResponse.json({ error: "المصادقة مطلوبة" }, { status: 401 });
  }

  try {
    await dbConnect();

    const { name, description, price, category, stock, images, tags } =
      await request.json();

    // Validate required fields
    if (
      !name ||
      !description ||
      !price ||
      !category ||
      !images ||
      images.length === 0
    ) {
      return NextResponse.json(
        { error: "جميع الحقول مطلوبة، بما في ذلك صورة واحدة على الأقل" },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: "السعر يجب أن يكون أكبر من 0" },
        { status: 400 }
      );
    }

    if (stock < 0) {
      return NextResponse.json(
        { error: "لا يمكن أن يكون المخزون سالباً" },
        { status: 400 }
      );
    }

    // Create new product
    const newProduct = new Product({
      name: name.trim(),
      description: description.trim(),
      price,
      category,
      stock: stock || 0,
      images,
      tags: tags || [],
    });

    await newProduct.save();

    // Populate category for response
    await newProduct.populate("category", "name");

    return NextResponse.json(
      {
        message: "تم إنشاء المنتج بنجاح",
        product: newProduct,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("خطأ في إنشاء المنتج:", error);

    if (
      error &&
      typeof error === "object" &&
      "name" in error &&
      error.name === "ValidationError"
    ) {
      const mongooseError = error as unknown as {
        errors: Record<string, { message: string }>;
      };
      const errors = Object.values(mongooseError.errors).map(
        (err) => err.message
      );
      return NextResponse.json({ error: errors.join(", ") }, { status: 400 });
    }

    return NextResponse.json({ error: "فشل في إنشاء المنتج" }, { status: 500 });
  }
}
