import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/utils/database";
import Product from "../../../../lib/models/Product";
import mongoose from "mongoose";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const resolvedParams = await params;
    const slugOrId = resolvedParams.id;

    let product;

    // Try to find by slug first
    product = await Product.findOne({ slug: slugOrId }).populate("category", "name slug");

    // If not found by slug, try by _id (for backward compatibility)
    if (!product && mongoose.Types.ObjectId.isValid(slugOrId)) {
      product = await Product.findById(slugOrId).populate("category", "name slug");
    }

    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    // Auto-generate slug if missing (for existing products)
    if (!product.slug) {
      const { slugify } = await import("../../../../lib/utils/slugify");
      let newSlug = slugify(product.name);
      if (!newSlug) newSlug = "product";
      let suffix = 1;
      const baseSlug = newSlug;
      while (await Product.findOne({ slug: newSlug, _id: { $ne: product._id } })) {
        newSlug = `${baseSlug}-${suffix}`;
        suffix++;
      }
      product.slug = newSlug;
      await product.save();
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
