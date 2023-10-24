import * as EmailValidator from 'email-validator'
import { Request, Response, Router } from 'express'

import { User } from '../entities/User'
import { decodeUserIdFromToken, verifyToken } from '../utils/authentication'
import { validateEntity } from '../utils/validation'
import { UserController } from './../controllers/UserController'

export const userRouter = Router()
const userCtrl = new UserController()

userRouter.get('/', async (req: Request, res: Response) => {
  const users = await userCtrl.findAll()
  return res.status(200).json({ users: users.map(u => u.clear()) })
})

userRouter.get('/me', verifyToken, async (req: Request, res: Response) => {
  let token = req.headers['authorization']
  const userId = decodeUserIdFromToken(token)

  const user = (await userCtrl.findUserById(userId)).clear()
  return res.status(200).json({ user })
})

userRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  const idNumber = parseInt(id)
  if (!isNaN(idNumber)) {
    const user = await userCtrl.findUserById(idNumber)
    if (user) {
      return res.status(200).json({ user: user.clear() })
    }

    return res.status(404).json({ message: 'Usuário não encontrado' })
  }

  return res.status(400).json({ message: 'Id inválido' })
})

userRouter.post('/', async (req: Request, res: Response) => {
  const { email, name, password } = req.body

  let messages: string[] = []

  if (await userCtrl.userAlreadyExists(email)) {
    messages.push('Já existe um usuário cadastrado com esse email')
  }

  const user: User = User.createUser(name, email, password)
  const errorMessages = await validateEntity(user)
  messages = [...messages, ...errorMessages]

  if (messages.length > 0) {
    return res.status(400).json({ messages })
  }

  const savedUser = await userCtrl.registerUser(user)
  return res.status(201).json({ user: savedUser.clear() })
})

userRouter.delete('/:email', verifyToken, async (req: Request, res: Response) => {
  const { email } = req.params

  if (EmailValidator.validate(email)) {
    const userDeleted = await userCtrl.deleteUserByEmail(email)
    if (userDeleted) {
      return res.status(204)
    }

    return res.status(404).json({ message: 'Usuário não encontrado' })
  }

  return res.status(400).json({ message: 'Email inválido' })
})
