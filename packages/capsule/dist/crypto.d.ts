export declare function sha256(buf: Buffer | string): string;
export declare function generateKeypair(): {
    publicKey: string;
    secretKey: string;
};
export declare function sign(blob: Buffer, secretKeyB64: string): Buffer<ArrayBuffer>;
export declare function verify(signed: Buffer, publicKeyB64: string): Uint8Array<ArrayBufferLike> | null;
