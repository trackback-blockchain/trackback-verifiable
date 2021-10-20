import moment from 'moment';

export function bufferToUint8Array(buffer: Buffer): Uint8Array {
  const u8a = new Uint8Array(buffer.length);
  for (let i = 0; i < buffer.length; i++) {
    u8a[i] = buffer[i];
  }
  return u8a;
}

export function checkDate(date: string) {
  throw new Error('not yet implemented');
}

export function toISODateTime(datetime: string, format: string) {
  return moment(datetime).toISOString();
}

export function isNonEmptyArray(item: any): boolean {
  return Array.isArray(item) && item.length > 0;
}
