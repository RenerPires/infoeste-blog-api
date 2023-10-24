import { Request, Response, Router } from 'express'
import { sign } from 'jsonwebtoken'

import { SECRET } from '../config/secret'
import { UserController } from './../controllers/UserController'

export const authRouter = Router()
const userCtrl = new UserController()

authRouter.post('/', async (req: Request, res: Response) => {
    const { email, password } = req.body
  
    const user = await userCtrl.findUserByEmail(email)
    if (user && user.isPasswordCorrect(password)) {
      const token = sign({ user: email, id: user.id, timestamp: new Date() }, SECRET, {
        expiresIn: '1h',
      })
  
      res.json({
        authorized: true,
        user: user.clear(),
        token,
      })
    } else {
      return res.status(401).json({
        authorized: false,
        message: 'Usuário não autorizado',
      })
    }
})