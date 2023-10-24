import cors from 'cors'
import express from 'express'
import logger from 'morgan'
import swaggerJSDoc from 'swagger-jsdoc'
import swaggerUI from 'swagger-ui-express'

import { swaggerOptions } from './config/swagger'
import './data-source'
import { authRouter } from './routes/auth'
import { postRouter } from './routes/posts'
import { userRouter } from './routes/users'

export const app = express()

app.use(express.json())
app.use(cors())
app.use(logger('dev'))

app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/posts', postRouter)

const specs = swaggerJSDoc(swaggerOptions)
app.use('/docs', swaggerUI.serve, swaggerUI.setup(specs))
app.get('/swagger.json', (req, res) => { res.setHeader('Content-Type', 'application/json'); res.send(specs) })
app.get('/', (req, res) => res.send('Infoeste Blog API. Acesse /docs para ver a documentação'))
