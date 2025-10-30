import { createServer } from 'https';
import { parse } from 'url';
import next from 'next';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dev = process.env.NODE_ENV !== 'production';
const hostname = '0.0.0.0';
const port = 3001;

// Initialize Next.js app
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpsOptions = {
    key: readFileSync(join(__dirname, 'certs', 'localhost+3-key.pem')),
    cert: readFileSync(join(__dirname, 'certs', 'localhost+3.pem')),
  };

  createServer(httpsOptions, async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on https://${hostname}:${port}`);
      console.log(`> Local:    https://localhost:${port}`);
      console.log(`> Network:  https://192.168.1.19:${port}`);
    });
});
