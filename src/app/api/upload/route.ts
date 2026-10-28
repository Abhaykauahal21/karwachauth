import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

/**
 * Issues short-lived tokens so the /create page can upload client photos
 * straight to Vercel Blob. Needs a Blob store connected to the Vercel
 * project (it sets BLOB_READ_WRITE_TOKEN). If CREATE_PASSCODE is set,
 * uploads must send it — so strangers can't fill your storage.
 */
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        const passcode = process.env.CREATE_PASSCODE;
        if (passcode && clientPayload !== passcode) throw new Error("Passcode galat hai.");
        if (!pathname.startsWith("photos/")) throw new Error("Invalid upload path.");
        return {
          allowedContentTypes: ["image/jpeg", "image/png", "image/webp"],
          maximumSizeInBytes: 8 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
    });
    return NextResponse.json(json);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
