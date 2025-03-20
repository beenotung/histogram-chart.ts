import { plot } from './core'

export type BrowserPlotOptions = {
  /** e.g. 600 */
  width: number
  /** e.g. 300 */
  height: number
  data: number[]
  title: string
  /** default: `image/png` */
  mimeType?: 'image/png' | 'image/jpeg' | 'image/webp'
  /** compression quality for jpeg and webp */
  quality?: number
}

export function browser_plot(
  options: BrowserPlotOptions & {
    as?: 'dataUrl'
  },
): string
export function browser_plot(
  options: BrowserPlotOptions & {
    as: 'blob'
  },
): Promise<Blob>
export function browser_plot(
  options: BrowserPlotOptions & {
    /** default: `dataUrl` */
    as?: 'dataUrl' | 'blob'
  },
): string | Promise<Blob> {
  let { width, height, data, title, mimeType, quality, as } = options
  let canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  plot({
    data,
    title,
    canvas,
  })
  if (as === 'dataUrl') {
    return new Promise<Blob>((resolve, reject) =>
      canvas.toBlob(
        blob =>
          blob
            ? resolve(blob)
            : reject(new Error('Failed to convert canvas to blob')),
        mimeType,
        quality,
      ),
    )
  }
  return canvas.toDataURL(mimeType, quality)
}
