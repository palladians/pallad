import { createServer } from 'http'
import { handler } from './app'

const server = createServer((req, res) => {
  handler(req, res)
})

server.listen(3333)
