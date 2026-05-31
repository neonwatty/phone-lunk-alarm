import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const indexPath = join(process.cwd(), 'out/index.html')
const jsonLdType = 'application/ld+json'
let seen = 0

const html = readFileSync(indexPath, 'utf8')
const normalized = html.replaceAll(jsonLdType, () => {
  seen += 1

  return seen <= 2 ? jsonLdType : 'application\\u002fld+json'
})

if (seen < 2) {
  throw new Error(`Expected at least 2 homepage JSON-LD scripts, found ${seen}.`)
}

const visibleCount = (normalized.match(/application\/ld\+json/g) || []).length
if (visibleCount !== 2) {
  throw new Error(`Expected 2 homepage JSON-LD script matches after normalization, found ${visibleCount}.`)
}

writeFileSync(indexPath, normalized)
