import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../lib/utils/database";
import Category from "../../../../lib/models/Category";
import Product from "../../../../lib/models/Product";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await dbConnect();

    const resolvedParams = await params;
    const slug = resolvedParams.slug;

    const category = await Category.findOne({ slug });

    if (!category) {
      return NextResponse.json(
        { error: "الفئة غير موجودة" },
        { status: 404 }
      );
    }

    // Auto-generate slug if missing (for existing categories)
    if (!category.slug) {
      const { slugify } = await import("../../../../lib/utils/slugify");
      let newSlug = slugify(category.name);
      if (!newSlug) newSlug = "category";
      let suffix = 1;
      const baseSlug = newSlug;
      while (await Category.findOne({ slug: newSlug })) {
        newSlug = `${baseSlug}-${suffix}`;
        suffix++;
      }
      category.slug = newSlug;
      await category.save();
    }

    // Get products in this category
    const products = await Product.find({
      category: category._id,
      isActive: true,
    })
      .populate("category", "name")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description,
      },
      products,
    });
  } catch (error) {
    console.error("خطأ في جلب الفئة:", error);
    return NextResponse.json(
      { error: "فشل في جلب الفئة" },
      { status: 500 }
    );
  }
}
