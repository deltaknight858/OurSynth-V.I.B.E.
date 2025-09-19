import nacl from 'tweetnacl';
import { createHash } from 'crypto';
export function sha256(buf) {
    return createHash('sha256').update(buf).digest('hex');
}
export function generateKeypair() {
    const kp = nacl.sign.keyPair();
    return {
        publicKey: Buffer.from(kp.publicKey).toString('base64'),
        secretKey: Buffer.from(kp.secretKey).toString('base64')
    };
}
export function sign(blob, secretKeyB64) {
    const sk = Buffer.from(secretKeyB64, 'base64');
    const signed = nacl.sign(blob, sk);
    return Buffer.from(signed);
}
export function verify(signed, publicKeyB64) {
    const pk = Buffer.from(publicKeyB64, 'base64');
    const opened = nacl.sign.open(signed, pk);
    return opened ?? null;
}
