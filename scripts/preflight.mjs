import fs from 'node:fs'

const pkg = JSON.parse(fs.readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const patch = fs.readFileSync(new URL('../cordis.patch.yml', import.meta.url), 'utf8')
const client = fs.readFileSync(new URL('../client/client.js', import.meta.url), 'utf8')
const expected = `window.__ModuleLoader__.load({ id: \"${pkg.name}\", factory: (require) => {`

const failures = []
if (pkg.dsh?.client?.platform !== 'web') failures.push('dsh.client.platform must be web')
if (pkg.dsh?.bundle?.patch !== './cordis.patch.yml') failures.push('dsh.bundle.patch must export cordis.patch.yml')
if (!patch.includes(`name: '${pkg.name}'`)) failures.push('bundle patch package name does not match package.json')
if (!patch.includes('id: session-title-llm') || !patch.includes('disabled: true')) failures.push('bundle patch must disable the built-in provider')
if (!client.startsWith(expected)) failures.push('client bundle does not start with the exact lazy-module banner')
for (const path of ['lib/index.js', 'lib/types/index.d.ts', 'client/client.js', 'cordis.patch.yml', 'README.md', 'LICENSE']) {
  if (!fs.existsSync(new URL(`../${path}`, import.meta.url))) failures.push(`missing packaged file: ${path}`)
}
if (client.includes('C:\\Users\\') || client.includes('AppData/')) failures.push('absolute build-machine path leaked into client bundle')
if (failures.length > 0) throw new Error('Preflight failed: ' + failures.join('; '))
console.log('preflight ok')
