import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";
import { createBuddy, getAllBuddies } from "@/lib/db";

export async function GET() {
  try {
    const buddies = await getAllBuddies();
    return NextResponse.json(buddies);
  } catch (error) {
    console.error("Failed to fetch buddies:", error);
    return NextResponse.json(
      { error: "Failed to fetch buddies" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get("name") as string;
    const author = (formData.get("author") as string) || "Anonymous";
    const description = (formData.get("description") as string) || "";
    const image = formData.get("image") as File;

    if (!name || !image) {
      return NextResponse.json(
        { error: "Name and image are required" },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json(
        { error: "Only PNG, JPEG, GIF, and WebP images are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (image.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Image must be under 5MB" },
        { status: 400 }
      );
    }

    // Upload to Vercel Blob
    const id = uuidv4();
    const ext = image.name.split(".").pop() || "png";
    const blob = await put(`buddies/${id}.${ext}`, image, {
      access: "public",
      contentType: image.type,
    });

    // Save to database
    const buddy = await createBuddy({
      id,
      name,
      author,
      description,
      image_url: blob.url,
    });

    return NextResponse.json(buddy, { status: 201 });
  } catch (error) {
    console.error("Failed to create buddy:", error);
    return NextResponse.json(
      { error: "Failed to create buddy" },
      { status: 500 }
    );
  }
}
