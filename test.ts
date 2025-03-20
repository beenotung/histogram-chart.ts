import { node_plot } from './node'

let data: number[] = []
for (let i = 0; i < 1000; i++) {
  data.push(Math.sin(i))
}

node_plot({
  data,
  title: 'Histogram of sin(x)',
  file: 'res/test.png',
  width: 600,
  height: 300,
})
