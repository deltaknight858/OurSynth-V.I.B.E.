import { NextRequest, NextResponse } from 'next/server';
import { verify } from '@oursynth/capsule/crypto';
import { spawn } from 'child_process';

export async function POST(req: NextRequest) {
  const { filePath, env } = await req.json();
  const signed = await import('fs').then(fs => fs.readFileSync(filePath));
  const opened = verify(signed, process.env.CAPSULE_PUBLIC!);
  if (!opened) return NextResponse.json({ ok: false, error: 'Invalid signature' }, { status: 400 });

  // Write blob to tmp and reconstruct workspace
  // Then run build steps in manifest and promote to env
  // (Pseudo below; wire to your current deploy flow)
  const ok = await new Promise<boolean>((resolve) => {
    const p = spawn('pnpm', ['deploy:capsule', filePath, env], { stdio: 'inherit' });
    p.on('close', (code) => resolve(code===0));
  });
  
  if (!ok) return NextResponse.json({ ok: false, error: 'Deploy failed' }, { status: 500 });
  return NextResponse.json({ ok: true, env });
}