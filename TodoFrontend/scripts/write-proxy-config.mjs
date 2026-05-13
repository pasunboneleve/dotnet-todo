import { mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { loadDotEnv } from './env.mjs';

const frontendDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
loadDotEnv(frontendDir);
const target = process.env.TODO_API_URL ?? 'http://127.0.0.1:5040';
const generatedDir = new URL('../.generated/', import.meta.url);

mkdirSync(generatedDir, { recursive: true });

writeFileSync(
  new URL('proxy.conf.json', generatedDir),
  `${JSON.stringify({
    '/api': {
      target,
      secure: false,
      changeOrigin: true,
    },
  }, null, 2)}\n`,
);
