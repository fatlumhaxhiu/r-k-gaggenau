import { readFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

const CONTENT_TYPES: Record<string, string> = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
};

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string[] }> }
) {
  const { filename } = await params;
  const filePath = join(process.cwd(), 'public', 'uploads', ...filename);

  try {
    const file = await readFile(filePath);
    const ext = filename[filename.length - 1].split('.').pop()?.toLowerCase() ?? '';
    const contentType = CONTENT_TYPES[ext] ?? 'application/octet-stream';

    return new NextResponse(file, {
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}
