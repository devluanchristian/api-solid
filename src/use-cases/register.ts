import { IUsersRepository } from '@/repositories/users.repository'
import { hash } from 'bcryptjs'

interface IRegisterUseCase {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: IUsersRepository) {}
  async execute({ name, email, password }: IRegisterUseCase) {
    const password_hash = await hash(password, 6)

    const userEithSameEmail = await this.usersRepository.findByEmail(email)

    if (userEithSameEmail) {
      throw new Error('E-mail already existis ')
    }

    await this.usersRepository.create({
      name,
      email,
      password_hash,
    })
  }
}
