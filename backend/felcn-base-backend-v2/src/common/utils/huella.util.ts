import { execSync } from 'child_process'
import * as fs from 'fs'

export function convertirWSQaPNG(input: string, output: string) {
  if (!fs.existsSync(output)) {
    execSync(`dwsq ${input} -o ${output}`)
  }
}

export function imagenBase64(path: string) {
  const file = fs.readFileSync(path)
  return `data:image/png;base64,${file.toString('base64')}`
}