/* Minimal static server for local testing: node tools/serve.js [port] */
import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const TYPES = {
  ".html": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8", ".json": "application/json", ".webmanifest": "application/manifest+json",
  ".svg": "image/svg+xml", ".png": "image/png", ".woff2": "font/woff2", ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml", ".pdf": "application/pdf", ".map": "application/json"
};

export function startServer(port = 8642) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, "http://localhost");
    let p = decodeURIComponent(url.pathname);
    if (p.includes("..")) { res.writeHead(400); res.end(); return; }
    let file = path.join(ROOT, p);
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, "index.html");
    if (!fs.existsSync(file)) {
      if (fs.existsSync(file + ".html")) file = file + ".html";
      else {
        res.writeHead(404, { "content-type": TYPES[".html"] });
        res.end(fs.readFileSync(path.join(ROOT, "404.html")));
        return;
      }
    }
    const headers = { "content-type": TYPES[path.extname(file)] || "application/octet-stream", "cache-control": "no-cache" };
    if (p.endsWith("/sw.js")) headers["service-worker-allowed"] = "/field-kit/";
    res.writeHead(200, headers);
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((resolve) => server.listen(port, () => resolve(server)));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  const port = Number(process.argv[2]) || 8642;
  startServer(port).then(() => console.log(`Serving ${ROOT} at http://localhost:${port}`));
}
