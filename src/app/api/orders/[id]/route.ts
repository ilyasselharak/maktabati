import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/utils/database";
import Order from "@/lib/models/Order";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const order = await Order.findById(resolvedParams.id);

    if (!order) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error("خطأ في جلب الطلب:", error);
    return NextResponse.json({ error: "فشل في جلب الطلب" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const resolvedParams = await params;
    const { status } = await request.json();

    // Validate status
    const validStatuses = [
      "pending",
      "confirmed",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
    ];
    if (!status || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "حالة غير صحيحة" }, { status: 400 });
    }

    // Check if order exists
    const existingOrder = await Order.findById(resolvedParams.id);
    if (!existingOrder) {
      return NextResponse.json({ error: "الطلب غير موجود" }, { status: 404 });
    }

    // Update order status
    const updatedOrder = await Order.findByIdAndUpdate(
      resolvedParams.id,
      {
        status: status,
        updatedAt: new Date(),
      },
      { new: true }
    );

    return NextResponse.json({
      message: "تم تحديث حالة الطلب بنجاح",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("خطأ في تحديث الطلب:", error);

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

    return NextResponse.json({ error: "فشل في تحديث الطلب" }, { status: 500 });
  }
}
