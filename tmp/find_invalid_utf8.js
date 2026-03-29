
import fs from 'fs';

const filePath = 'app/page.js';
const buffer = fs.readFileSync(filePath);

try {
    const decoder = new TextDecoder('utf-8', { fatal: true });
    decoder.decode(buffer);
    console.log('File is valid UTF-8');
} catch (e) {
    console.log('Error:', e.message);
    // Find the position
    for (let i = 0; i < buffer.length; i++) {
        try {
            new TextDecoder('utf-8', { fatal: true }).decode(buffer.slice(i, i + 4));
        } catch (err) {
            // This is not perfect as it might be in the middle of a multi-byte char
            // but let's check chunks
        }
    }
    
    // Better way: find where it breaks
    let lastValidIndex = 0;
    const decoder2 = new TextDecoder('utf-8', { fatal: true });
    for (let i = 1; i <= buffer.length; i++) {
        try {
            decoder2.decode(buffer.slice(0, i));
            lastValidIndex = i;
        } catch (err) {
            console.log('Invalid sequence starts at index:', i - 1);
            const context = buffer.slice(Math.max(0, i - 50), Math.min(buffer.length, i + 50));
            console.log('Context (hex):', context.toString('hex'));
            console.log('Context (latin1):', context.toString('latin1'));
            break;
        }
    }
}
