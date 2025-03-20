import { createCanvas } from 'canvas'
import { plot } from './core'
import { writeFileSync } from 'fs'

export function node_plot(options: {
  /** .png, .svg, or .pdf */
  file: string
  /** e.g. 600 */
  width: number
  /** e.g. 300 */
  height: number
  data: number[]
  title: string
  /** default: `Math.min(...data)` */
  min_value?: number
  /** default: `Math.max(...data)` */
  max_value?: number
}) {
  let { width, height, file, ...rest } = options
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
    canvas,
    ...rest,
  })
  let buffer = canvas.toBuffer()
  writeFileSync(file, buffer)
}
