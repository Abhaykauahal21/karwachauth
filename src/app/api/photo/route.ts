import { get } from "@vercel/blob";
import { type NextRequest, NextResponse } from "next/server";
import { isPhotoPathname } from "@/lib/share";

/**
 * Serves a client photo from the private Blob store: /api/photo?p=photos/…
 * Only the photos/ folder is reachable. Photo names carry a random suffix,
 * so a photo is only reachable through the story link that names it.
 */
export async function GET(request: NextRequest) {
  const pathname = request.nextUrl.searchParams.get("p");
  if (!pathname || !isPhotoPathname(pathname)) {
    return NextResponse.json({ error: "Invalid photo" }, { status: 400 });
  }

  const result = await get(pathname, { access: "private" });
  if (result === null || result.statusCode !== 200) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(result.stream, {
    headers: {
      // names are random and never reused, so a photo can be cached for good
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Type": result.blob.contentType,
      "X-Content-Type-Options": "nosniff",
    },
  });
}
