import { Canvas } from 'canvas'

export function plot(options: {
  data: number[]
  /** default: `Math.sqrt(data.length)` */
  bucket_count?: number
  title: string
  canvas: Canvas | HTMLCanvasElement
}) {
  let { data, title, canvas } = options

  let min_value = Math.min(...data)
  let max_value = Math.max(...data)
  let value_range = max_value - min_value

  let bucket_count = options.bucket_count ?? Math.sqrt(data.length)
  let step = 1 / bucket_count

  let counts: number[] = []
  for (let i = 0; i < bucket_count; i++) {
    let min = i * step * value_range + min_value
    let max = min + step * value_range
    let count = data.filter(value => min <= value && value < max).length
    counts.push(count)
  }
  let max_count = Math.max(...counts)

  let canvas_width = canvas.width
  let canvas_height = canvas.height
  let context = canvas.getContext('2d') as CanvasRenderingContext2D

  context.fillStyle = 'white'
  context.fillRect(0, 0, canvas_width, canvas_height)

  context.font = '12px Arial'

  function centerText(text: string, x: number, y: number) {
    let rect = context.measureText(text)
    let height = rect.emHeightAscent
    let dx = x + height / 2
    let dy = y
    let deg = -Math.PI / 2
    context.translate(dx, dy)
    context.rotate(deg)
    context.textAlign = 'center'
    context.fillText(text, 0, 0)
    context.rotate(-deg)
    context.translate(-dx, -dy)
  }

  let text_margin = 4

  let margin_top = 30
  let margin_left = 30
  let margin_right = 30
  let margin_bottom = 30

  // in case the min value has negative sign, or the max value is large, we need more space for display
  margin_bottom = Math.max(
    margin_bottom,
    context.measureText(min_value.toFixed(2)).width + text_margin * 2,
    context.measureText(max_value.toFixed(2)).width + text_margin * 2,
  )

  // in case the count is large, we need more space for display
  margin_left = Math.max(
    margin_left,
    context.measureText(max_count.toString()).width + text_margin * 2,
  )

  let chart_width = canvas_width - margin_left - margin_right
  let chart_height = canvas_height - margin_top - margin_bottom

  /* draw the y-axis labels and grid lines */
  let line_interval = 1 / 5
  let number_height = context.measureText('0123456789').emHeightAscent
  for (let i = 0; i < 1; i += line_interval) {
    let y = margin_top + i * chart_height
    context.fillStyle = '#cccccc'
    context.fillRect(margin_left, y, chart_width, 1)
    let text = ((1 - i) * max_count).toFixed(0)
    let bottom = y + number_height / 2
    context.textAlign = 'right'
    context.fillStyle = 'black'
    context.fillText(text, margin_left - text_margin, bottom)
  }
  context.fillText(
    '0',
    margin_left - text_margin,
    margin_top + chart_height + number_height / 2,
  )

  /* draw the bars and x-axis labels */
  let bar_width = chart_width / counts.length
  let bar_margin = data.length > 1000 ? 1 : 2
  for (let i = 0; i < counts.length; i++) {
    let bar_height = (counts[i] / max_count) * chart_height
    let left = i * bar_width + margin_left
    let top = chart_height - bar_height + margin_top
    context.fillStyle = '#4285F4'
    context.fillRect(
      left + bar_margin,
      top,
      bar_width - bar_margin * 2,
      bar_height,
    )
    context.fillStyle = 'black'
    context.fillRect(left, canvas_height - margin_bottom, bar_width, 1)
    centerText(
      (i * step * value_range + min_value).toFixed(2),
      left,
      canvas_height - margin_bottom / 2,
    )
  }
  centerText(
    max_value.toFixed(2),
    counts.length * bar_width + margin_left,
    canvas_height - margin_bottom / 2,
  )

  context.font = '18px Arial'
  context.textAlign = 'center'
  let text = `${title}`
  let rect = context.measureText(text)
  let text_height = rect.emHeightAscent
  context.fillText(
    text,
    canvas_width / 2,
    (margin_top - text_margin + text_height) / 2,
  )
}
