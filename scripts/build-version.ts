import { execSync } from 'node:child_process'
import { lstat, readdir, rm } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'

function getGitShortSha(): string {
  return execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim()
}

function isGitDirty(): boolean {
  return execSync('git status --porcelain', { encoding: 'utf8' }).trim() !== ''
}

function formatTimestamp(): string {
  return new Date()
    .toISOString()
    .replace(/[-:T.Z]/g, '')
    .slice(0, 14)
}

export async function pruneOldVersions(
  distDir: string,
  keep: number,
): Promise<void> {
  let entries: string[]

  try {
    entries = await readdir(distDir)
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return
    throw error
  }

  const allStats = await Promise.all(
    entries.map(async (name) => {
      const dirPath = join(distDir, name)
      const stats = await lstat(dirPath)
      if (stats.isSymbolicLink()) return null
      return { name, dirPath, mtimeMs: stats.mtimeMs }
    }),
  )

  const versions = allStats.filter(
    (v): v is NonNullable<typeof v> => v !== null,
  )

  versions.sort((a, b) => a.mtimeMs - b.mtimeMs)

  const toDelete = versions.slice(0, Math.max(0, versions.length - keep))

  await Promise.all(
    toDelete.map(({ dirPath }) =>
      rm(dirPath, { force: true, recursive: true }),
    ),
  )

  if (toDelete.length > 0) {
    console.log(
      `Pruned ${toDelete.length} old version(s): ${toDelete.map((v) => v.name).join(', ')}`,
    )
  }
}

export function getBuildVersion(): string {
  const { version } = createRequire(import.meta.url)('../package.json') as {
    version: string
  }

  if (process.env.BUILD_MODE === 'release') {
    return version
  }

  const sha = getGitShortSha()
  const devSuffix = isGitDirty() ? `${sha}.${formatTimestamp()}` : sha

  return `${version}-dev.${devSuffix}`
}
