import { cp, mkdir, mkdtemp, readFile, writeFile, rm } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';

// Static counterpart to the Sites shell helper, for Windows and static exports.
const project = process.cwd();
const output = resolve(process.argv[2] || '../ajay-portfolio-site.tar.gz');
const manifest = JSON.parse((await readFile(join(project, '.openai/hosting.json'), 'utf8')).replace(/^\uFEFF/, ''));
if (!manifest.project_id || manifest.static?.directory !== 'dist/client') throw new Error('Expected the registered static Site manifest.');
await readFile(join(project, 'dist/client/index.html'));
const stage = await mkdtemp(join(tmpdir(), 'ajay-portfolio-package-'));
try {
  await cp(join(project, 'dist/client'), join(stage, 'dist'), { recursive: true });
  await mkdir(join(stage, 'dist/.openai'), { recursive: true });
  await writeFile(join(stage, 'dist/.openai/hosting.json'), JSON.stringify({ project_id: manifest.project_id, static: { directory: 'dist' } }, null, 2));
  execFileSync('tar', ['-czf', output, '-C', stage, 'dist'], { stdio: 'inherit' });
  const entries = execFileSync('tar', ['-tzf', output], { encoding: 'utf8' });
  if (!entries.includes('dist/index.html') || !entries.includes('dist/.openai/hosting.json')) throw new Error('Archive is missing required files.');
  if (entries.includes('dist/server/')) throw new Error('Static archive must contain public assets only.');
  console.log(`Validated static site archive: ${output}`);
} finally {
  const resolvedStage = resolve(stage);
  if (!resolvedStage.startsWith(resolve(tmpdir()) + '\\') && !resolvedStage.startsWith(resolve(tmpdir()) + '/')) throw new Error('Unexpected staging location.');
  await rm(resolvedStage, { recursive: true, force: true });
}
