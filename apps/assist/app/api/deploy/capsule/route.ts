import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

// Lazy import to avoid ESM resolution issues during edge bundling
async function readFileBuffer(filePath: string): Promise<Buffer> {
  const fs = await import('fs');
  return fs.readFileSync(filePath);
}

// TODO: Wire real signature verification from @oursynth/capsule when available.
async function verifyCapsule(data: Buffer): Promise<boolean> {
  void data;
  // Placeholder: always allow during local development
  return true;
}

export async function POST(req: NextRequest) {
  try {
    const { filePath, env } = await req.json();
    if (!filePath || !env) {
      return NextResponse.json({ ok: false, error: 'Missing filePath or env' }, { status: 400 });
    }

    const signed = await readFileBuffer(filePath);
    const openedOk = await verifyCapsule(signed);
    if (!openedOk) {
      return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 });
    }

    const ok = await new Promise<boolean>((resolve) => {
      const p = spawn(process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm', ['deploy:capsule', filePath, env], { stdio: 'inherit' });
      p.on('close', (code) => resolve(code === 0));
    });

    if (!ok) return NextResponse.json({ ok: false, error: 'Deploy failed' }, { status: 500 });
    return NextResponse.json({ ok: true, env });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
