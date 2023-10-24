import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { Post } from './entities/Post'
import { User } from './entities/User'

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'database.sqlite',
  synchronize: true,
  logging: false,
  entities: [User, Post],
  migrations: [],
  subscribers: [],
})

AppDataSource.initialize()
  .then(() => {
    console.log('Banco de dados inicializado com sucesso.')
  })
  .catch((err) => {
    console.error('Ocorreu um erro durante a inicialização do Banco de dados local.', err)
  })
