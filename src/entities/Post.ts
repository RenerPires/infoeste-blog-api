import { Length } from 'class-validator'
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
import { BaseEntity } from './BaseEntity'
import { User } from './User'

@Entity()
export class Post extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(5, 30, {
    message: 'Título do produto precisa ter entre 5 e 30 caracteres',
  })
  title: string

  @Column()
  @Length(5, 144, {
    message: 'Conteúdo do post precisa ter entre 5 e 144 caracteres',
  })
  content: string

  @ManyToOne(() => User, (user) => user.posts, { onDelete: 'CASCADE' })
  user: User

  static createPost(title: string, content: string) {
    const post = new Post()
    post.title = title
    post.content = content
    return post
  }
}
