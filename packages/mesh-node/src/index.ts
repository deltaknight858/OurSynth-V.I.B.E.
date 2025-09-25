import mdns from 'multicast-dns';
import http from 'http';
import { readdirSync, readFileSync } from 'fs';
const capsDir = process.env.CAPSULE_DIR || './capsules';

const server = http.createServer((req, res) => {
  if (req.url === '/capsules') {
    const files = readdirSync(capsDir).filter(f => f.endsWith('.caps'));
    res.setHeader('Content-Type','application/json');
    res.end(JSON.stringify(files));
  } else if (req.url?.startsWith('/capsule/')) {
    const name = decodeURIComponent(req.url.split('/capsule/')[1]);
    const buf = readFileSync(`${capsDir}/${name}`);
    res.setHeader('Content-Type','application/octet-stream');
    res.end(buf);
  } else { res.statusCode = 404; res.end(); }
});
server.listen(7423);

const md = mdns();
setInterval(() => {
  md.respond({ answers: [{ name: '_oursynth._tcp.local', type: 'SRV', data: { port: 7423, target: 'mesh.local' } }] });
}, 2000);