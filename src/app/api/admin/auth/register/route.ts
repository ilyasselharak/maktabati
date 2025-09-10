import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/utils/database";
import AdminUser from "../../../../../lib/models/AdminUser";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { username, email, password } = await request.json();

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "اسم المستخدم والبريد الإلكتروني وكلمة المرور مطلوبة" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "كلمة المرور يجب أن تكون 6 أحرف على الأقل" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await AdminUser.findOne({
      $or: [
        { email: email.toLowerCase() },
        { username: username.toLowerCase() },
      ],
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        return NextResponse.json(
          { error: "البريد الإلكتروني مسجل بالفعل" },
          { status: 409 }
        );
      }
      if (existingUser.username === username.toLowerCase()) {
        return NextResponse.json(
          { error: "اسم المستخدم مأخوذ" },
          { status: 409 }
        );
      }
    }

    // Create new admin user
    const newUser = new AdminUser({
      username: username.toLowerCase(),
      email: email.toLowerCase(),
      password,
      role: "admin", // Default role for new registrations
    });

    await newUser.save();

    // Return success message (don't return password)
    const userData = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    return NextResponse.json(
      {
        message: "تم إنشاء حساب المدير بنجاح",
        user: userData,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("خطأ في التسجيل:", error);

    // Handle mongoose validation errors
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

    return NextResponse.json({ error: "خطأ داخلي في الخادم" }, { status: 500 });
  }
}
