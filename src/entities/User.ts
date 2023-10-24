import { IsEmail, Length, Validate } from 'class-validator'
import { pbkdf2Sync, randomBytes } from 'crypto'
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm'
import { PasswordValidator } from './../validators/PasswordValidator'
import { BaseEntity } from './BaseEntity'
import { Post } from './Post'

@Entity()
export class User extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @Length(5, 50, {
    message: 'Nome do usuário precisa ter entre 5 e 50 caracteres',
  })
  name: string

  @Column({ unique: true })
  @IsEmail({}, { message: 'Email inválido' })
  email: string

  @Column()
  hash: string

  @Column()
  salt: string

  @OneToMany(() => Post, (post) => post.user)
  posts: Post[]

  @Validate(PasswordValidator)
  password: string

  static createUser(name: string, email: string, password: string) {
    const user = new User()
    user.name = name
    user.email = email
    user.password = password
    user._generatePassword()
    return user
  }

  isPasswordCorrect(password: string): boolean {
    const hash = pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString(
      'hex'
    )
    return hash == this.hash
  }

  clear(): User {
    const user = this
    delete user.hash
    delete user.salt
    return user
  }

  private _generatePassword() {
    const salt = randomBytes(16).toString('hex')
    const hash = pbkdf2Sync(this.password, salt, 1000, 64, 'sha512').toString(
      'hex'
    )
    this.salt = salt
    this.hash = hash
  }
}
