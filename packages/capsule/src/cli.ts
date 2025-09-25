#!/usr/bin/env node

import { CapsuleManifest } from './manifest.js';
import { sign, verify, sha256 } from './crypto.js';
import { create } from 'tar';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const cmd = process.argv[2];

if (cmd === 'keygen') {
  const { generateKeypair } = await import('./crypto.js');
  const kp = generateKeypair();
  console.log(JSON.stringify(kp, null, 2));
  process.exit(0);
}

if (cmd === 'pack') {
  // capsule pack ./apps/appA --manifest ./capsule.json --out ./out/appA.caps
  const dir = resolve(process.argv[3] || '.');
  const manifestPath = resolve(process.argv[5]);
  const outPath = resolve(process.argv[7]);

  const manifestRaw = readFileSync(manifestPath, 'utf8');
  const manifest = CapsuleManifest.parse(JSON.parse(manifestRaw));
  const tarBuf = await create({ gzip: true, cwd: dir }, ['.']).read();
  const header = Buffer.from(JSON.stringify({ manifest, hash: sha256(tarBuf) }), 'utf8');

  const sk = process.env.CAPSULE_SECRET!;
  const signed = sign(Buffer.concat([header, Buffer.from('\n--\n'), tarBuf]), sk);
  writeFileSync(outPath, signed);
  console.log(JSON.stringify({ ok: true, outPath }, null, 2));
  process.exit(0);
}

if (cmd === 'unpack') {
  // capsule unpack ./out/appA.caps --pub <base64>
  const file = resolve(process.argv[3]);
  const pk = process.argv[5];
  const signed = readFileSync(file);
  const opened = verify(signed, pk);
  if (!opened) throw new Error('Signature verification failed');
  const openedBuf = Buffer.from(opened);
  const [headerStr] = openedBuf.toString('utf8').split('\n--\n');
  const header = JSON.parse(headerStr);
  console.log(JSON.stringify({ ok: true, header, blobBytes: opened.length }, null, 2));
  process.exit(0);
}

console.log('Usage: capsule keygen | pack <dir> --manifest <file> --out <file> | unpack <file> --pub <b64>');