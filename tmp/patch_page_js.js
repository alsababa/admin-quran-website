
import fs from 'fs';

const filePath = 'app/page.js';
const buffer = fs.readFileSync(filePath);

// Fix 1: The stray d9 at index 11897
// Let's see what's around it again, more clearly.
const offset = 11897;
console.log('Byte at 11897:', buffer[offset].toString(16));
console.log('Bytes after:', buffer.slice(offset, offset + 20).toString('hex'));

// Replace d9 at 11897 with 20 (space) or just 27 (single quote) if it's meant to close the string.
// But the word was لأجل... let's assume it should have been 'جمعية لأجلهم' or just close the quote.
// Looking at the context, it seems to be an array used for something.
// I'll replace d9 with 20 for now to valid the UTF-8, then I'll read the file correctly.

buffer[offset] = 0x20; // replace d9 with space

fs.writeFileSync(filePath, buffer);
console.log('Patched app/page.js at index 11897');
