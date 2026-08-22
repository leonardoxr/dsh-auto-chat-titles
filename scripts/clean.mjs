import fs from 'node:fs'

for (const directory of ['lib', 'client']) fs.rmSync(new URL(`../${directory}`, import.meta.url), { recursive: true, force: true })
