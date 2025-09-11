import { NextRequest, NextResponse } from "next/server";
import { verifyToken, extractTokenFromHeader } from "../utils/jwt";
import dbConnect from "../utils/database";
import AdminUser from "../models/AdminUser";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    userId: string;
    email: string;
    role: string;
  };
}

export async function authenticateRequest(request: NextRequest): Promise<{
  user: { userId: string; email: string; role: string } | null;
  response: NextResponse | null;
}> {
  try {
    const authHeader = request.headers.get("authorization");
    const token = extractTokenFromHeader(authHeader);

    if (!token) {
      return {
        user: null,
        response: NextResponse.json(
          { error: "No token provided" },
          { status: 401 }
        ),
      };
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return {
        user: null,
        response: NextResponse.json(
          { error: "Invalid token" },
          { status: 401 }
        ),
      };
    }

    await dbConnect();
    const user = await AdminUser.findById(decoded.userId);

    if (!user || !user.isActive) {
      return {
        user: null,
        response: NextResponse.json(
          { error: "User not found or inactive" },
          { status: 401 }
        ),
      };
    }

    return {
      user: {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      },
      response: null,
    };
  } catch {
    return {
      user: null,
      response: NextResponse.json(
        { error: "Authentication failed" },
        { status: 500 }
      ),
    };
  }
}

export function requireAdminRole(
  requiredRole: "admin" | "super_admin" = "admin"
) {
  return async function adminMiddleware(request: NextRequest) {
    const { user, response } = await authenticateRequest(request);

    if (response) {
      return response;
    }

    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Check if user has required role
    const roleHierarchy = { admin: 1, super_admin: 2 };
    const userRoleLevel =
      roleHierarchy[user.role as keyof typeof roleHierarchy] || 0;
    const requiredRoleLevel = roleHierarchy[requiredRole] || 0;

    if (userRoleLevel < requiredRoleLevel) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    // Add user to request for use in route handlers
    (request as AuthenticatedRequest).user = user;

    return null; // Continue to next middleware/route
  };
}
