import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/utils/database";
import Product from "@/lib/models/Product";

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("slug");
  if (!slug) {
    return NextResponse.json({ error: "?slug= is required" }, { status: 400 });
  }

  try {
    await dbConnect();

    // Query by exact slug
    const product = await Product.findOne({ slug }).populate("category", "name slug").lean();

    if (!product) {
      // Also try case-insensitive
      const caseInsensitive = await Product.findOne({
        slug: { $regex: new RegExp(`^${slug.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') }
      }).lean();

      return NextResponse.json({
        found: false,
        slug,
        caseInsensitiveMatch: caseInsensitive
          ? { _id: caseInsensitive._id, name: caseInsensitive.name, slug: caseInsensitive.slug, isActive: caseInsensitive.isActive }
          : null,
        totalProductsWithSameSlug: await Product.countDocuments({ slug }),
        allSlugsStartingWith: await Product.find({ slug: { $regex: `^${slug.substring(0, 10)}` } }).select("slug isActive name").limit(10).lean(),
      });
    }

    return NextResponse.json({
      found: true,
      slug,
      _id: product._id,
      name: product.name,
      isActive: product.isActive,
      slugHex: Buffer.from(product.slug as string).toString("hex"),
      slugLength: (product.slug as string).length,
      category: product.category,
      hasPrice: !!product.price,
      hasStock: typeof product.stock === "number",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
