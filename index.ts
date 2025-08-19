import express, { Request, Response } from 'express'
import path from 'path'
import opn from 'opn'

const server = express()
const host = 'http://localhost:8082'
server.use('/assets', express.static(path.resolve(__dirname, './assets')))
server.use('/dist', express.static(path.resolve(__dirname, './dist')))

server.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve(__dirname, './index.html'));
})

server.listen(8082, () => {
  console.log(`server started at ${host}`)
  opn(host)
})
