const esbuild = require('esbuild');
const fs = require('fs');
const os = require('os');
const path = require('path');

const root = path.resolve(__dirname, '..');
const testFiles = [
  'tests/watch-menu-context.test.ts',
  'tests/playing-video-block.test.ts',
];
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ytblocker-watch-menu-tests-'));
let failed = false;

try {
  for (const [index, testFile] of testFiles.entries()) {
    const outfile = path.join(tempDir, `test-${index}.cjs`);
    try {
      esbuild.buildSync({
        entryPoints: [path.join(root, testFile)],
        outfile,
        bundle: true,
        platform: 'node',
        format: 'cjs',
        target: 'node20',
        sourcemap: 'inline',
        logLevel: 'silent',
      });
    } catch (error) {
      failed = true;
      console.error(`RED ${testFile}: test bundle could not be built`);
      console.error(error.message);
      continue;
    }

    require(outfile);
  }
} finally {
  fs.rmSync(tempDir, { recursive: true, force: true });
}

process.exitCode = failed ? 1 : 0;
