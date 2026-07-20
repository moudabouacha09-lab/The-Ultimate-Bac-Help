import { stat } from "node:fs/promises";
import { createReadStream } from "node:fs";
import path from "node:path";
import { NextResponse } from "next/server";
import { subjects } from "@/lib/subjects";

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

/** Serves files from the sibling subject folders during local/self-hosted deployment. */
export async function GET(_request: Request, { params }: MaterialsRouteProps) {
  const segments = (await params).path ?? [];
  const folderName = decodeURIComponent(segments[0] ?? "");
  const subject = subjects.find((item) => item.folderName === folderName);

  if (!subject || segments.length < 2) {
    return NextResponse.json({ error: "المادة أو الملف غير موجود" }, { status: 404 });
  }

  const fileName = segments.slice(1).map(decodeURIComponent).join(path.sep);
  const materialsRoot = process.env.MATERIALS_ROOT ?? path.resolve(process.cwd(), "..");
  const subjectRoot = path.resolve(materialsRoot, subject.folderName);
  const filePath = path.resolve(subjectRoot, fileName);

  if (filePath !== subjectRoot && !filePath.startsWith(`${subjectRoot}${path.sep}`)) {
    return NextResponse.json({ error: "مسار غير مسموح" }, { status: 400 });
  }

  try {
    const fileStats = await stat(filePath);
    const extension = path.extname(filePath).toLowerCase();
    
    // Fallback ASCII filename to prevent browser crashes when only filename* is provided
    const asciiFilename = "document" + extension;
    const encodedFilename = encodeURIComponent(path.basename(filePath));
    const isDownload = _request.url.includes("download=1");
    const disposition = isDownload ? "attachment" : "inline";

    const stream = createReadStream(filePath);

    // @ts-ignore - Next.js safely handles Node.js Readable streams as body payloads
    return new NextResponse(stream, {
      headers: {
        "Content-Type": contentTypes[extension] ?? "application/octet-stream",
        "Content-Length": fileStats.size.toString(),
        "Content-Disposition": `${disposition}; filename="${asciiFilename}"; filename*=UTF-8''${encodedFilename}`,
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (err) {
    return NextResponse.json({ error: "الملف غير موجود" }, { status: 404 });
  }
}
