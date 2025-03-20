import { createCanvas } from 'canvas'
import { plot } from './core'
import { writeFileSync } from 'fs'

export function node_plot(options: {
  /** e.g. 600 */
  width: number
  /** e.g. 300 */
  height: number
  data: number[]
  title: string
  /** .png, .svg, or .pdf */
  file: string
}) {
  let { width, height, data, title, file } = options
  let parse = () => {
    if (file.endsWith('.pdf')) {
      return {
        canvas: createCanvas(width, height, 'pdf'),
      }
    }
    if (file.endsWith('.svg')) {
      return {
        canvas: createCanvas(width, height, 'svg'),
      }
    }
    if (file.endsWith('.png')) {
      return {
        canvas: createCanvas(width, height),
      }
    }
    throw new Error(`Unsupported file type: ${file}`)
  }
  let { canvas } = parse()
  plot({
    data,
    title,
    canvas,
  })
  let buffer = canvas.toBuffer()
  writeFileSync(file, buffer)
}
