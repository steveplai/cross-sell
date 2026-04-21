import { execFileSync, spawnSync } from 'node:child_process'

function runGit(args) {
  return execFileSync('git', args, { encoding: 'utf8' })
}

function listGitFiles(args) {
  const output = runGit([...args, '-z'])

  return output.split('\0').filter(Boolean)
}

function unique(values) {
  return [...new Set(values)]
}

let repoRoot

try {
  repoRoot = runGit(['rev-parse', '--show-toplevel']).trim()
} catch {
  console.error(
    'Unable to find a git worktree. Use `pnpm format:all` to format the full project.',
  )
  process.exit(1)
}

const changedFiles = unique([
  ...listGitFiles(['diff', '--name-only', '--diff-filter=ACMRT']),
  ...listGitFiles(['diff', '--cached', '--name-only', '--diff-filter=ACMRT']),
  ...listGitFiles(['ls-files', '--others', '--exclude-standard']),
])

if (changedFiles.length === 0) {
  console.log('No changed files to format.')
  process.exit(0)
}

const prettierBin = process.platform === 'win32' ? 'prettier.cmd' : 'prettier'
const result = spawnSync(
  prettierBin,
  ['--write', '--ignore-unknown', ...changedFiles],
  {
    cwd: repoRoot,
    stdio: 'inherit',
  },
)

if (result.error) {
  console.error(result.error.message)
  process.exit(1)
}

process.exit(result.status ?? 1)
