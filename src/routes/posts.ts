import { Request, Response, Router } from 'express'
import { PostController } from '../controllers/PostController'
import { UserController } from '../controllers/UserController'
import { Post } from '../entities/Post'
import { decodeUserEmailFromToken, decodeUserIdFromToken, verifyToken } from '../utils/authentication'
import { validateEntity } from '../utils/validation'

export const postRouter = Router()
const postCtrl = new PostController()
const userCtrl = new UserController()

postRouter.get('/', async (req: Request, res: Response) => {
  const posts = await postCtrl.findAll()
  posts.forEach(p => p.user = p.user.clear())
  return res.status(200).json({ posts })
})

postRouter.post('/', verifyToken, async (req: Request, res: Response) => {
  const { title, content } = req.body

  let messages: string[] = []

  const post = Post.createPost(title, content)
  const errorMessages = await validateEntity(post)
  messages = [...messages, ...errorMessages]

  if (messages.length > 0) {
    return res.status(400).json({ messages })
  }

  let token = req.headers['authorization']
  const userEmail = decodeUserEmailFromToken(token)
  post.user = await userCtrl.findUserByEmail(userEmail)
  const savedPost = await postCtrl.save(post)
  return res.status(201).json({ post: savedPost })
})

postRouter.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params

  const idNumber = parseInt(id)
  if (!isNaN(idNumber)) {
    const post = await postCtrl.findById(idNumber)
    if (post) {
      post.user = post.user.clear()
      return res.status(200).json({ post })
    }

    return res.status(404).json({ message: 'Post não encontrado' })
  }

  return res.status(400).json({ message: 'Id inválido' })
})

postRouter.put('/:id', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params
  const { title, content } = req.body

  let token = req.headers['authorization']
  const currUserId = decodeUserIdFromToken(token)

  let messages: string[] = []

  const idNumber = parseInt(id)
  if (!isNaN(idNumber)) {
    const post = await postCtrl.findById(idNumber)
    if (post) {
      if(post.user.id === currUserId) {
        post.title = title
        post.content = content
        post.user = post.user.clear()

        const errorMessages = await validateEntity(post)
        messages = [...messages, ...errorMessages]

        if (messages.length > 0) {
          return res.status(400).json({ messages })
        }
        postCtrl.save(post)
        return res.status(200).json({ post })
      }

      return res.status(403).json({ message: 'Post não pertence ao usuário' })
    }

    return res.status(404).json({ message: 'Post não encontrado' })
  }

  return res.status(400).json({ message: 'Id inválido' })
})

postRouter.delete('/:id', verifyToken, async (req: Request, res: Response) => {
  const { id } = req.params

  let token = req.headers['authorization']
  const currUserId = decodeUserIdFromToken(token)

  const idNumber = parseInt(id)
  if (!isNaN(idNumber)) {
    const post = await postCtrl.findById(idNumber)
    if (post) {
      if(post.user.id === currUserId) {
        await postCtrl.delete(idNumber)
        return res.status(204).send()
      }
      return res.status(403).json({ message: 'Post não pertence ao usuário' })
    }
    return res.status(404).json({ message: 'Post não encontrado' })
  }
  return res.status(400).json({ message: 'Id inválido' })
})

postRouter.get('/user/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params

  const userIdNumber = parseInt(userId)
  if (!isNaN(userIdNumber)) {
    const posts = await postCtrl.findAllByUserId(userIdNumber)
    return res.status(200).json({ posts })
  }

  return res.status(400).json({ message: 'Id de usuário inválido' })
})