import { spawnSync, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const frontendDir = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const shouldOpen = process.argv.includes('--open');

const image = 'mcr.microsoft.com/playwright:v1.60.0-noble';
const baseUrl = process.platform === 'linux'
  ? 'http://127.0.0.1:4200'
  : 'http://host.docker.internal:4200';

const dockerArgs = [
  'run',
  '--rm',
  '-v',
  `${frontendDir}:/work`,
  '-w',
  '/work',
  '-e',
  `PLAYWRIGHT_BASE_URL=${baseUrl}`,
  '-e',
  'PLAYWRIGHT_HTML_REPORT=/work/.playwright-report',
];

if (process.platform === 'linux') {
  dockerArgs.push('--network', 'host');
}

dockerArgs.push(
  image,
  'npx',
  'playwright',
  'test',
  '--config=playwright.host.config.ts',
  '--reporter=html',
);

const result = spawnSync('docker', dockerArgs, { cwd: frontendDir, stdio: 'inherit' });

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}

const reportPath = path.join(frontendDir, '.playwright-report', 'index.html');
console.log(`Playwright report: ${reportPath}`);

if (!shouldOpen) {
  process.exit(0);
}

const opener = process.platform === 'win32'
  ? ['cmd', ['/c', 'start', '', reportPath]]
  : process.platform === 'darwin'
    ? ['open', [reportPath]]
    : ['xdg-open', [reportPath]];

const opened = spawn(opener[0], opener[1], {
  detached: true,
  stdio: 'ignore',
});

opened.on('error', () => {
  console.error(`Could not open report automatically. Open this file instead: ${reportPath}`);
});

opened.unref();
