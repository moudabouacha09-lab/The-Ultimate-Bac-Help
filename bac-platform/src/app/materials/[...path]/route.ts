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

const githubOwner = process.env.GITHUB_OWNER ?? "moudabouacha09-lab";
const githubRepository = process.env.GITHUB_REPOSITORY ?? "The-Ultimate-Bac-Help";
const githubBranch = process.env.GITHUB_BRANCH ?? "main";

function decodeSegment(segment: string) {
  try {
    return decodeURIComponent(segment);
  } catch {
    return segment;
  }
}

function isSafePathSegment(segment: string) {
  return segment.length > 0 && segment !== "." && segment !== ".." && !segment.includes("\0") && !segment.includes("/") && !segment.includes("\\");
}

function materialHeaders(filePath: string, isDownload: boolean, contentLength?: string) {
  const extension = path.extname(filePath).toLowerCase();
  const rawFilename = path.basename(filePath);
  const disposition = isDownload ? "attachment" : "inline";

  return {
    "Content-Type": contentTypes[extension] ?? "application/octet-stream",
    ...(contentLength ? { "Content-Length": contentLength } : {}),
    "Content-Disposition": `${disposition}; filename="document${extension}"; filename*=UTF-8''${encodeURIComponent(rawFilename)}`,
    "Cache-Control": "public, max-age=3600",
    "Access-Control-Allow-Origin": "*"
  };
}

async function fetchFromGitHub(segments: string[], isDownload: boolean) {
  // Encode one segment at a time. Encoding the complete path would turn its slashes into %2F.
  const encodedPath = segments.map(encodeURIComponent).join("/");
  const url = new URL(`https://api.github.com/repos/${githubOwner}/${githubRepository}/contents/${encodedPath}`);
  url.searchParams.set("ref", githubBranch);

  const token = process.env.GITHUB_TOKEN;
  const response = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.raw+json",
      "User-Agent": "bac-platform-materials",
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    next: { revalidate: 3600 }
  });

  if (!response.ok) return null;

  return new NextResponse(response.body, {
    headers: materialHeaders(segments.at(-1) ?? "document", isDownload, response.headers.get("content-length") ?? undefined)
  });
}

/** Serves files from the project folders during local/self-hosted deployment. */
export async function GET(request: Request, { params }: MaterialsRouteProps) {
  const segments = (await params).path ?? [];
  if (segments.length === 0) {
    return NextResponse.json({ error: "مسار غير صالح" }, { status: 400 });
  }

  const decodedSegments = segments.map(decodeSegment);
  if (!decodedSegments.every(isSafePathSegment)) {
    return NextResponse.json({ error: "مسار غير صالح" }, { status: 400 });
  }

  // Try possible roots (handles running from bac-platform or repo root)
  const candidateRoots = [
    process.env.MATERIALS_ROOT,
    path.resolve(process.cwd(), ".."),
    process.cwd(),
  ].filter(Boolean) as string[];

  let resolvedFilePath: string | null = null;
  const relativeJoined = decodedSegments.join(path.sep);

  for (const root of candidateRoots) {
    const resolvedRoot = path.resolve(root);
    const candidate = path.resolve(resolvedRoot, relativeJoined);
    if (candidate.startsWith(`${resolvedRoot}${path.sep}`) && existsSync(candidate)) {
      resolvedFilePath = candidate;
      break;
    }
  }

  if (!resolvedFilePath) {
    try {
      const githubFile = await fetchFromGitHub(decodedSegments, request.url.includes("download=1"));
      if (githubFile) return githubFile;
    } catch {
      // Fall through to the same not-found result: do not expose GitHub/token details.
    }
    return NextResponse.json({ error: "الملف غير موجود على الخادم" }, { status: 404 });
  }

  try {
    const fileStats = await stat(resolvedFilePath);
    const isDownload = request.url.includes("download=1");

    const nodeStream = createReadStream(resolvedFilePath);
    // Convert Node ReadStream to Web ReadableStream for 100% Next.js / Web Response standards
    const webStream = Readable.toWeb(nodeStream);

    return new NextResponse(webStream as ReadableStream, {
      headers: {
        ...materialHeaders(resolvedFilePath, isDownload, fileStats.size.toString())
      }
    });
  } catch (err) {
    return NextResponse.json({ error: "فشل تحميل الملف" }, { status: 500 });
  }
}
