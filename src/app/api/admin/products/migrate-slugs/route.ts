import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../../../lib/middleware/auth";
import dbConnect from "../../../../../lib/utils/database";
import Product from "../../../../../lib/models/Product";
import { slugify } from "../../../../../lib/utils/slugify";

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

    const products = await Product.find({ $or: [{ slug: { $exists: false } }, { slug: null }, { slug: "" }] });
    let updated = 0;
    const errors: string[] = [];

    for (const product of products) {
      try {
        let baseSlug = slugify(product.name);
        if (!baseSlug) baseSlug = "product";
        let finalSlug = baseSlug;
        let suffix = 1;
        while (await Product.findOne({ slug: finalSlug, _id: { $ne: product._id } })) {
          finalSlug = `${baseSlug}-${suffix}`;
          suffix++;
        }
        product.slug = finalSlug;
        await product.save();
        updated++;
      } catch (err) {
        errors.push(`فشل للمنتج ${product._id}: ${err instanceof Error ? err.message : "خطأ غير معروف"}`);
      }
    }

    return NextResponse.json({
      message: `تم تحديث ${updated} منتج`,
      total: products.length,
      updated,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("خطأ في ترحيل slugs:", error);
    return NextResponse.json({ error: "فشل في ترحيل slugs" }, { status: 500 });
  }
}
