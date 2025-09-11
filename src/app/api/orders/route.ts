import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/utils/database";
import Order from "@/lib/models/Order";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Parse request body
    const body = await request.json();
    const { customer, items, totalAmount, totalItems } = body;

    // Validate required fields
    if (!customer || !items || !totalAmount || !totalItems) {
      return NextResponse.json(
        { error: "البيانات المطلوبة مفقودة" },
        { status: 400 }
      );
    }

    // Validate customer information
    if (!customer.name || !customer.city || !customer.phone) {
      return NextResponse.json(
        { error: "معلومات العميل غير مكتملة" },
        { status: 400 }
      );
    }

    // Validate phone number format (Moroccan numbers - 10 digits)
    const phoneRegex = /^0[6-7]\d{8}$/;
    if (!phoneRegex.test(customer.phone)) {
      return NextResponse.json(
        {
          error: "رقم الهاتف غير صحيح (يجب أن يكون 10 أرقام ويبدأ بـ 06 أو 07)",
        },
        { status: 400 }
      );
    }

    // Validate items array
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "يجب أن يحتوي الطلب على منتج واحد على الأقل" },
        { status: 400 }
      );
    }

    // Validate each item
    for (const item of items) {
      if (
        !item.productId ||
        !item.name ||
        !item.price ||
        !item.quantity ||
        !item.total
      ) {
        return NextResponse.json(
          { error: "بيانات المنتجات غير مكتملة" },
          { status: 400 }
        );
      }
      if (item.quantity < 1 || item.price < 0 || item.total < 0) {
        return NextResponse.json(
          { error: "قيم غير صحيحة في المنتجات" },
          { status: 400 }
        );
      }
    }

    // Generate unique order ID
    const count = await Order.countDocuments();
    const orderId = `ORD-${(count + 1).toString().padStart(6, "0")}`;

    // Create new order
    const newOrder = new Order({
      orderId: orderId,
      customer: {
        name: customer.name.trim(),
        city: customer.city.trim(),
        phone: customer.phone.trim(),
      },
      items: items.map((item) => ({
        productId: item.productId,
        name: item.name.trim(),
        price: parseFloat(item.price),
        quantity: parseInt(item.quantity),
        total: parseFloat(item.total),
      })),
      totalAmount: parseFloat(totalAmount),
      totalItems: parseInt(totalItems),
      status: "pending",
    });

    // Save order to database
    const savedOrder = await newOrder.save();

    return NextResponse.json(
      {
        message: "تم حفظ الطلب بنجاح",
        orderId: savedOrder.orderId,
        order: {
          id: savedOrder._id,
          orderId: savedOrder.orderId,
          status: savedOrder.status,
          totalAmount: savedOrder.totalAmount,
          createdAt: savedOrder.createdAt,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Error saving order:", error);

    // Handle duplicate order ID
    if (error && typeof error === 'object' && 'code' in error && error.code === 11000) {
      return NextResponse.json(
        { error: "حدث خطأ في إنشاء رقم الطلب. يرجى المحاولة مرة أخرى." },
        { status: 500 }
      );
    }

    // Handle validation errors
    if (error && typeof error === 'object' && 'name' in error && error.name === "ValidationError" && 'errors' in error) {
      const validationError = error as { errors: Record<string, { message: string }> };
      const messages = Object.values(validationError.errors).map(
        (err) => err.message
      );
      return NextResponse.json({ error: messages.join(", ") }, { status: 400 });
    }

    return NextResponse.json(
      { error: "حدث خطأ في حفظ الطلب. يرجى المحاولة مرة أخرى." },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectToDatabase();

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const limit = parseInt(searchParams.get("limit") || "12");
    const page = parseInt(searchParams.get("page") || "1");

    // Build query
    const query: Record<string, unknown> = {};

    // Status filter
    if (status) {
      query.status = status;
    }

    // Category filter (search by category ID in order items)
    if (category) {
      query.items = {
        $elemMatch: {
          "category._id": category,
        },
      };
    }

    // Search filter
    if (search) {
      query.$or = [
        { orderId: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.phone": { $regex: search, $options: "i" } },
      ];
    }

    // Build sort object
    const sortOptions: Record<string, 1 | -1> = {};
    sortOptions[sortBy] = sortOrder === "desc" ? -1 : 1;

    // Get orders with pagination
    const orders = await Order.find(query)
      .sort(sortOptions)
      .limit(limit)
      .skip((page - 1) * limit)
      .select("-__v");

    const total = await Order.countDocuments(query);

    return NextResponse.json(
      {
        orders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(total / limit),
          totalOrders: total,
          hasNext: page * limit < total,
          hasPrev: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "حدث خطأ في استرجاع الطلبات" },
      { status: 500 }
    );
  }
}
