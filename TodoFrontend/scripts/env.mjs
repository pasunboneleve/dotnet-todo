import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';

export function loadDotEnv(frontendDir) {
  const envPath = path.join(frontendDir, '..', '.env');
  if (!existsSync(envPath)) {
    return;
  }

  for (const line of readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separator = trimmed.indexOf('=');
    if (separator < 1) {
      continue;
    }

    const name = trimmed.slice(0, separator).trim();
    const value = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, '');
    process.env[name] ??= value;
  }
}
