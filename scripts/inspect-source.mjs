const url = process.argv[2];
const response = await fetch(url, {signal: AbortSignal.timeout(30000)});
const text = await response.text();
console.log('HTTP', response.status);
if (process.argv.includes('--links')) console.log([...text.matchAll(/href=["']([^"']+)["']/g)].map(m=>m[1]).join('\n'));
else console.log(text.slice(0,14000));
