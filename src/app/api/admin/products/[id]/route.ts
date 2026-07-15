import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../../../lib/middleware/auth";
import dbConnect from "../../../../../lib/utils/database";
import Product from "../../../../../lib/models/Product";
import { slugify } from "../../../../../lib/utils/slugify";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await authenticateRequest(request);

  if (response) {
    return response;
  }

  if (!user) {
    return NextResponse.json({ error: "المصادقة مطلوبة" }, { status: 401 });
  }

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

    return NextResponse.json({ product });
  } catch (error: unknown) {
    console.error("خطأ في جلب المنتج:", error);
    return NextResponse.json({ error: "فشل في جلب المنتج" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await authenticateRequest(request);

  if (response) {
    return response;
  }

  if (!user) {
    return NextResponse.json({ error: "المصادقة مطلوبة" }, { status: 401 });
  }

  try {
    await dbConnect();

    const resolvedParams = await params;
    const {
      name,
      description,
      price,
      categoryId,
      stock,
      isActive,
      images,
      tags,
    } = await request.json();

    // Validate required fields
    if (!name || !description || !price || !categoryId) {
      return NextResponse.json(
        { error: "الاسم والوصف والسعر والفئة مطلوبة" },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: "السعر يجب أن يكون أكبر من 0" },
        { status: 400 }
      );
    }

    if (stock !== undefined && stock < 0) {
      return NextResponse.json(
        { error: "لا يمكن أن يكون المخزون سالباً" },
        { status: 400 }
      );
    }

    // Check if product exists
    const existingProduct = await Product.findById(resolvedParams.id);
    if (!existingProduct) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    // Generate new slug if name changed or slug is missing
    const nameChanged = name.trim() !== existingProduct.name;
    const shouldUpdateSlug = nameChanged || !existingProduct.slug;
    let finalSlug = existingProduct.slug;

    if (shouldUpdateSlug) {
      let baseSlug = slugify(name.trim());
      if (!baseSlug) baseSlug = "product";
      finalSlug = baseSlug;
      let suffix = 1;
      while (await Product.findOne({ slug: finalSlug, _id: { $ne: resolvedParams.id } })) {
        finalSlug = `${baseSlug}-${suffix}`;
        suffix++;
      }
    }

    // Update product
    const updateData: Record<string, unknown> = {
      name: name.trim(),
      description: description.trim(),
      price,
      category: categoryId,
      stock: stock !== undefined ? stock : existingProduct.stock,
      isActive: isActive !== undefined ? isActive : existingProduct.isActive,
      images: images || existingProduct.images,
      tags: tags !== undefined ? tags : existingProduct.tags,
      updatedAt: new Date(),
    };

    if (shouldUpdateSlug) {
      updateData.slug = finalSlug;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      resolvedParams.id,
      updateData,
      { new: true }
    ).populate("category", "name slug");

    return NextResponse.json({
      message: "تم تحديث المنتج بنجاح",
      product: updatedProduct,
    });
  } catch (error: unknown) {
    console.error("خطأ في تحديث المنتج:", error);

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

    return NextResponse.json({ error: "فشل في تحديث المنتج" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { user, response } = await authenticateRequest(request);

  if (response) {
    return response;
  }

  if (!user) {
    return NextResponse.json({ error: "المصادقة مطلوبة" }, { status: 401 });
  }

  try {
    await dbConnect();

    const resolvedParams = await params;

    // Check if product exists
    const product = await Product.findById(resolvedParams.id);
    if (!product) {
      return NextResponse.json({ error: "المنتج غير موجود" }, { status: 404 });
    }

    // Delete the product
    await Product.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({
      message: "تم حذف المنتج بنجاح",
    });
  } catch (error: unknown) {
    console.error("خطأ في حذف المنتج:", error);
    return NextResponse.json({ error: "فشل في حذف المنتج" }, { status: 500 });
  }
}
