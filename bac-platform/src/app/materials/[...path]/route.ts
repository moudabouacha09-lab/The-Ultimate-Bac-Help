import { stat } from "node:fs/promises";
import { createReadStream, existsSync } from "node:fs";
import { Readable } from "node:stream";
import path from "node:path";
import { NextResponse } from "next/server";

const contentTypes: Record<string, string> = {
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ".html": "text/html; charset=utf-8",
  ".rar": "application/vnd.rar",
  ".zip": "application/zip"
};

type MaterialsRouteProps = { params: Promise<{ path: string[] }> };

/** Serves files from the project folders during local/self-hosted deployment. */
export async function GET(request: Request, { params }: MaterialsRouteProps) {
  const segments = (await params).path ?? [];
  if (segments.length === 0) {
    return NextResponse.json({ error: "مسار غير صالح" }, { status: 400 });
  }

  // Safe decoding of all path segments
  const decodedSegments = segments.map((seg) => {
    try {
      return decodeURIComponent(seg);
    } catch {
      return seg;
    }
  });

  // Try possible roots (handles running from bac-platform or repo root)
  const candidateRoots = [
    process.env.MATERIALS_ROOT,
    path.resolve(process.cwd(), ".."),
    process.cwd(),
  ].filter(Boolean) as string[];

  let resolvedFilePath: string | null = null;
  const relativeJoined = decodedSegments.join(path.sep);

  for (const root of candidateRoots) {
    const candidate = path.resolve(root, relativeJoined);
    if (candidate.startsWith(root) && existsSync(candidate)) {
      resolvedFilePath = candidate;
      break;
    }
  }

  if (!resolvedFilePath) {
    return NextResponse.json({ error: "الملف غير موجود على الخادم" }, { status: 404 });
  }

  try {
    const fileStats = await stat(resolvedFilePath);
    const extension = path.extname(resolvedFilePath).toLowerCase();
    
    // Fallback ASCII filename to prevent browser crashes when only filename* is provided
    const asciiFilename = "document" + extension;
    const rawFilename = path.basename(resolvedFilePath);
    const encodedFilename = encodeURIComponent(rawFilename);
    const isDownload = request.url.includes("download=1");
    const disposition = isDownload ? "attachment" : "inline";

    const nodeStream = createReadStream(resolvedFilePath);
    // Convert Node ReadStream to Web ReadableStream for 100% Next.js / Web Response standards
    const webStream = Readable.toWeb(nodeStream);

    return new NextResponse(webStream as ReadableStream, {
      headers: {
        "Content-Type": contentTypes[extension] ?? "application/octet-stream",
        "Content-Length": fileStats.size.toString(),
        "Content-Disposition": `${disposition}; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return NextResponse.json({ error: "فشل تحميل الملف" }, { status: 500 });
  }
}
