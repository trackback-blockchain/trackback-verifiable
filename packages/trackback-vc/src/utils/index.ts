export function bufferToUint8Array(buffer: Buffer): Uint8Array {
    const u8a = new Uint8Array(buffer.length);
    for (let i = 0; i < buffer.length; i++) {
        u8a[i] = buffer[i];
    }
    return u8a;
}