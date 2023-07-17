import { Prisma, CheckIn } from '@prisma/client'
import { ICheckInsRepository } from '../@type-check-ins-repository'
import { prisma } from '@/lib/prisma'
import dayjs from 'dayjs'

export class PrismaCheckInsRepository implements ICheckInsRepository {
  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIns = await prisma.checkIn.create({
      data,
    })
    return checkIns
  }

  async save(data: CheckIn) {
    const checkIns = await prisma.checkIn.update({
      where: {
        id: data.id,
      },
      data,
    })
    return checkIns
  }

  async findById(id: string) {
    const checkIn = await prisma.checkIn.findUnique({
      where: {
        id,
      },
    })
    return checkIn
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endtOfTheDay = dayjs(date).endOf('date')

    const checkIns = await prisma.checkIn.findFirst({
      where: {
        user_id: userId,
        created_at: {
          gte: startOfTheDay.toDate(),
          lte: endtOfTheDay.toDate(),
        },
      },
    })
    return checkIns
  }

  async findManyByUserId(userId: string, page: number) {
    const checkIns = await prisma.checkIn.findMany({
      where: {
        user_id: userId,
      },
      take: 20,
      skip: (page - 1) * 20,
    })
    return checkIns
  }

  async countById(userId: string) {
    const count = await prisma.checkIn.count({
      where: {
        user_id: userId,
      },
    })
    return count
  }
}
