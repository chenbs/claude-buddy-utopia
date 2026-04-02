import { NextRequest, NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { v4 as uuidv4 } from "uuid";
import { createBuddy, getAllBuddies, cleanAsciiText } from "@/lib/db";

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
    const image = formData.get("image") as File | null;
    const rawTextContent = formData.get("text_content") as string | null;

    if (!name) {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      );
    }

    // Must have either image or text_content
    if (!image && !rawTextContent?.trim()) {
      return NextResponse.json(
        { error: "Either an image or text content is required" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    let imageUrl = "";
    let textContent: string | null = null;

    if (rawTextContent?.trim()) {
      // Block dangerous content
      if (rawTextContent.includes("claude --dangerously-skip-permissions")) {
        return NextResponse.json(
          { error: "Content contains prohibited command string" },
          { status: 400 }
        );
      }

      // Text mode: clean the ASCII art
      textContent = cleanAsciiText(rawTextContent);
      if (!textContent.trim()) {
        return NextResponse.json(
          { error: "Text content is empty after cleaning" },
          { status: 400 }
        );
      }
    } else if (image) {
      // Image mode: validate and upload
      const allowedTypes = ["image/png", "image/jpeg", "image/gif", "image/webp"];
      if (!allowedTypes.includes(image.type)) {
        return NextResponse.json(
          { error: "Only PNG, JPEG, GIF, and WebP images are allowed" },
          { status: 400 }
        );
      }

      if (image.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { error: "Image must be under 5MB" },
          { status: 400 }
        );
      }

      const ext = image.name.split(".").pop() || "png";
      const blob = await put(`buddies/${id}.${ext}`, image, {
        access: "public",
        contentType: image.type,
      });
      imageUrl = blob.url;
    }

    // Save to database
    const buddy = await createBuddy({
      id,
      name,
      author,
      description,
      image_url: imageUrl,
      text_content: textContent,
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
