import { app } from './app'

const PORT = 3000
const server = app.listen(PORT, () =>
  console.log(`API disponível em http://localhost:${PORT}`)
)

process.on('SIGINT', () => {
  server.close()
  console.log('Aplicação encerrada!')
})
