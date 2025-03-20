import { readFileSync } from 'fs'
import { node_plot } from './node'

let data_file = ''
let image_file = ''
let title = ''
let min_value = undefined
let max_value = undefined
let bucket_count = undefined

for (let i = 2; i < process.argv.length; i++) {
  let arg = process.argv[i]
  switch (arg) {
    case '-h':
    case '--help': {
      console.log(
        `
histogram-chart

Usage: histogram-chart [options] <data_file> <image_file>

Options:
  --title=<title>  Title of the chart, default: "Histogram"
  --width=<width>  Width of the chart, default: 600
  --height=<height>  Height of the chart, default: 300
  --min-value=<min_value>  Minimum value of the chart, default: min value of data
  --max-value=<max_value>  Maximum value of the chart, default: max value of data
  --bucket-count=<bucket_count>  Number of buckets, default: sqrt(data.length)
  <data_file>  File containing the data, can be txt, csv, tsv
  <image_file>  File to save the image, can be png, jpg

Remark:
  The data file and image file can be given in any order.

Examples:
  histogram-chart log.txt chart.png
  histogram-chart --title="Histogram of Request Latency" log.txt chart.png
`.trim(),
      )
      process.exit(0)
    }
    default: {
      if (arg.startsWith('--title=')) {
        title = arg.slice('--title='.length)
        break
      }
      if (arg.startsWith('--min-value=')) {
        min_value = parseFloat(arg.slice('--min-value='.length))
        if (Number.isNaN(min_value)) {
          console.error(`Error: invalid min value: '${arg}'`)
          process.exit(1)
        }
        break
      }
      if (arg.startsWith('--max-value=')) {
        max_value = parseFloat(arg.slice('--max-value='.length))
        if (Number.isNaN(max_value)) {
          console.error(`Error: invalid max value: '${arg}'`)
          process.exit(1)
        }
        break
      }
      if (arg.startsWith('--bucket-count=')) {
        bucket_count = parseInt(arg.slice('--bucket-count='.length))
        if (Number.isNaN(bucket_count)) {
          console.error(`Error: invalid bucket count: '${arg}'`)
          process.exit(1)
        }
        break
      }
      if (
        arg.endsWith('.png') ||
        arg.endsWith('.jpg') ||
        arg.endsWith('.jpeg')
      ) {
        image_file = arg
        break
      }
      if (
        arg.endsWith('.csv') ||
        arg.endsWith('.txt') ||
        arg.endsWith('.tsv')
      ) {
        data_file = arg
        break
      }
      console.error(`Unknown argument: '${arg}'`)
      process.exit(1)
    }
  }
}

if (!data_file) {
  console.error(`Error: missing data file in argument`)
  process.exit(1)
}

if (!image_file) {
  console.error(`Error: missing image file in argument`)
  process.exit(1)
}

let data: number[] = []

let lines = readFileSync(data_file, 'utf-8').split('\n')

lines.forEach(line => {
  line = line.trim()
  if (!line) return
  let parts = line.split(' ')
  for (let part of parts) {
    let value = parseFloat(part)
    if (!Number.isNaN(value)) {
      data.push(value)
      return
    }
  }
  title ||= line
})

if (data.length === 0) {
  console.error(`Error: no data found in file '${data_file}'`)
  process.exit(1)
}

title ||= 'Histogram'

node_plot({
  width: 600,
  height: 300,
  data,
  title,
  file: image_file,
  min_value,
  max_value,
  bucket_count,
})
