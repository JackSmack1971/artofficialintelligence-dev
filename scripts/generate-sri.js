import { createHash } from 'crypto'
import { promises as fs } from 'fs'
import https from 'https'

const resources = {
  plausible: {
    url: 'https://plausible.io/js/script.js',
    output: 'public/plausible.js'
  },
  interCss: {
    url: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap',
    output: 'public/fonts/inter.css'
  }
}

function fetchResource(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const data = []
        res
          .on('data', (chunk) => data.push(chunk))
          .on('end', () => resolve(Buffer.concat(data)))
      })
      .on('error', reject)
  })
}

async function generate() {
  const manifest = {}
  for (const key of Object.keys(resources)) {
    const { url, output } = resources[key]
    const buf = await fetchResource(url)
    await fs.mkdir(output.split('/').slice(0, -1).join('/'), { recursive: true })
    await fs.writeFile(output, buf)
    const hash = createHash('sha384').update(buf).digest('base64')
    manifest[key] = `sha384-${hash}`
  }
  await fs.writeFile('sri-manifest.json', JSON.stringify(manifest, null, 2))
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})
