
import fs from 'fs';

const filePath = 'app/page.js';
const buffer = fs.readFileSync(filePath);

try {
    const text = buffer.toString('utf-8');
    // If we can convert to string without error, verify it
    const reEncoded = Buffer.from(text, 'utf-8');
    if (reEncoded.length !== buffer.length || !reEncoded.equals(buffer)) {
        throw new Error('Lossy conversion detected');
    }
    console.log('File is valid UTF-8');
} catch (e) {
    console.log('Error detected in UTF-8 decoding.');
    
    // Find the exact byte that fails by using a streaming decoder or checking chunks
    // But index 11896 is where Turbopack says it is.
    const targetIndex = 11896;
    const start = Math.max(0, targetIndex - 100);
    const end = Math.min(buffer.length, targetIndex + 100);
    const context = buffer.slice(start, end);
    
    console.log('Context around index 11896:');
    console.log('Hex:', context.toString('hex'));
    // Show each byte with its index
    for (let i = 0; i < context.length; i++) {
        const globalIndex = start + i;
        const byte = context[i];
        process.stdout.write(`${globalIndex}: ${byte.toString(16).padStart(2, '0')} `);
        if (i % 8 === 7) process.stdout.write('\n');
    }
    console.log('\n');
    console.log('Latin1 view:', context.toString('latin1'));
}
