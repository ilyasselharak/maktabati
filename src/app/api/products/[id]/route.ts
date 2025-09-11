import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/utils/database";
import Product from "../../../../lib/models/Product";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const resolvedParams = await params;
    const product = await Product.findById(resolvedParams.id).populate(
      "category",
      "name"
    );

    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    // Check if product is active
    if (!product.isActive) {
      return NextResponse.json(
        { error: "المنتج غير متوفر حالياً" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      product,
    });
  } catch (error) {
    console.error("خطأ في جلب المنتج:", error);
    return NextResponse.json({ error: "فشل في جلب المنتج" }, { status: 500 });
  }
}
