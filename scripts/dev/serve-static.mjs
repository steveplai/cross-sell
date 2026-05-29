import { createReadStream, existsSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { extname, join, normalize, resolve } from 'node:path'

const port = Number(process.argv[2] ?? 4174)
const root = process.cwd()

const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
}

function resolvePath(url) {
  const pathname = decodeURIComponent(new URL(url, 'http://localhost').pathname)
  const safePath = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  return resolve(join(root, safePath))
}

const server = createServer(async (request, response) => {
  if (!request.url) {
    response.writeHead(400)
    response.end('Bad request')
    return
  }

  const filePath = resolvePath(request.url)

  if (!filePath.startsWith(root) || !existsSync(filePath)) {
    response.writeHead(404)
    response.end('Not found')
    return
  }

  const fileStat = await stat(filePath)

  if (fileStat.isDirectory()) {
    response.writeHead(404)
    response.end('Not found')
    return
  }

  response.writeHead(200, {
    'Content-Length': fileStat.size,
    'Content-Type': mimeTypes[extname(filePath)] ?? 'application/octet-stream',
  })
  createReadStream(filePath).pipe(response)
})

server.listen(port, '127.0.0.1', () => {
  console.log(`Serving ${root} at http://127.0.0.1:${port}`)
})
