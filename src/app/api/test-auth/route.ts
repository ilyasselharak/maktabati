import { NextRequest, NextResponse } from "next/server";
import { authenticateRequest } from "../../../lib/middleware/auth";

export async function GET(request: NextRequest) {
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

  return NextResponse.json({
    message: "Authentication successful",
    user: {
      userId: user.userId,
      email: user.email,
      role: user.role,
    },
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: NextRequest) {
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

  try {
    const body = await request.json();
    return NextResponse.json({
      message: "POST request successful",
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
      receivedData: body,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid JSON in request body" },
      { status: 400 }
    );
  }
}

export async function PUT(request: NextRequest) {
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

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Simple test - just return file info without uploading
    return NextResponse.json({
      message: "File received successfully (test mode)",
      fileInfo: {
        name: file.name,
        size: file.size,
        type: file.type,
      },
      user: {
        userId: user.userId,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "Test upload failed" }, { status: 500 });
  }
}
