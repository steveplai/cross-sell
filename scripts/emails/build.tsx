import { mkdir, rename, rm, symlink, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

import { render } from '@react-email/render'

import {
  createCrossSellEmailAssetUrls,
  resolveCrossSellEmailDomainMode,
} from '../../src/emails/cross-sell-email/content/index'
import { getBuildVersion, pruneOldVersions } from '../build-version'
import { emailBuildOutputs } from './build-core'

interface EmailOutput {
  relativePath: string
  html: string
}

function getDomainModeArg(args: string[]) {
  const domainModeFlag = '--domain-mode'

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]

    if (arg === domainModeFlag) {
      const value = args[index + 1]

      if (!value) {
        throw new Error(`Missing value for ${domainModeFlag}.`)
      }

      return value
    }

    if (arg.startsWith(`${domainModeFlag}=`)) {
      return arg.slice(`${domainModeFlag}=`.length)
    }
  }

  return undefined
}

const version = getBuildVersion()
const outDir = resolve(process.cwd(), 'dist/emails', version)

console.log(`Building emails: ${version}`)
const crossSellEmailDomainMode = resolveCrossSellEmailDomainMode(
  getDomainModeArg(process.argv.slice(2)) ?? process.env.EMAIL_DOMAIN_MODE,
)
const crossSellEmailAssetUrls = createCrossSellEmailAssetUrls(
  crossSellEmailDomainMode,
)

await rm(outDir, { force: true, recursive: true })
await mkdir(outDir, { recursive: true })

const emails: EmailOutput[] = await Promise.all(
  emailBuildOutputs.map(async (email) => ({
    relativePath: email.relativePath,
    html: await render(email.createReactEmail(crossSellEmailAssetUrls)),
  })),
)

await Promise.all(
  emails.map(async (email) => {
    const filePath = resolve(outDir, email.relativePath)

    await mkdir(dirname(filePath), { recursive: true })
    await writeFile(filePath, email.html, 'utf8')
  }),
)

await pruneOldVersions(resolve(process.cwd(), 'dist/emails'), 5)

const latestLink = resolve(process.cwd(), 'dist/emails/latest')
const latestTmp = `${latestLink}.tmp`
await symlink(version, latestTmp)
await rename(latestTmp, latestLink)
