import { NextRequest, NextResponse } from "next/server";
import dbConnect from "../../../../../lib/utils/database";
import AdminUser from "../../../../../lib/models/AdminUser";
import { generateToken } from "../../../../../lib/utils/jwt";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "البريد الإلكتروني وكلمة المرور مطلوبان" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await AdminUser.findOne({ email: email.toLowerCase() });

    if (!user) {
      return NextResponse.json(
        { error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    // Check if user is active
    if (!user.isActive) {
      return NextResponse.json({ error: "الحساب معطل" }, { status: 401 });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "بيانات الدخول غير صحيحة" },
        { status: 401 }
      );
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    // Return user data and token
    const userData = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
    };

    return NextResponse.json({
      message: "تم تسجيل الدخول بنجاح",
      user: userData,
      token,
    });
  } catch (error) {
    console.error("خطأ في تسجيل الدخول:", error);
    return NextResponse.json({ error: "خطأ داخلي في الخادم" }, { status: 500 });
  }
}
