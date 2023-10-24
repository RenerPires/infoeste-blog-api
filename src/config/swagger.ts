export const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Infoeste Blog API',
      version: '0.1.0',
      description: `API para o blog do Infoeste.`,
      contact: {
        name: 'Rener Pires',
        url: 'https://github.com/RenerPires',
        email: 'rener.nascimento@vericode.com.br',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
      },
    ],
  },
  apis: ['**/*.yml'],
}
