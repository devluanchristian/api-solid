import { IUsersRepository } from '@/repositories/users.repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { User } from '@prisma/client'

interface IRegisterUseCase {
  name: string
  email: string
  password: string
}
interface IRegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute({
    name,
    email,
    password,
  }: IRegisterUseCase): Promise<IRegisterUseCaseResponse> {
    const password_hash = await hash(password, 6)

    const userEithSameEmail = await this.usersRepository.findByEmail(email)

    if (userEithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
    return { user }
  }
}
