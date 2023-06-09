import { prisma } from '@/lib/prisma'
import { hash } from 'bcryptjs'

interface IRegisterUseCase {
  name: string
  email: string
  password: string
}

export class RegisterUseCase {
  constructor(private usersRepository: any) {}
  async execute({ name, email, password }: IRegisterUseCase) {
    const password_hash = await hash(password, 6)

    const userEithSameEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    })

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
