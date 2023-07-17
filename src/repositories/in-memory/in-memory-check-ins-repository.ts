import { Prisma, CheckIn } from '@prisma/client'
import { ICheckInsRepository } from '../@type-check-ins-repository'
import { randomUUID } from 'crypto'
import dayjs from 'dayjs'

export class InMemoryCheckInsRepository implements ICheckInsRepository {
  public items: CheckIn[] = []

  async findById(id: string) {
    const checkIns = this.items.find((item) => item.id === id)

    if (!checkIns) {
      return null
    }
    return checkIns
  }

  async findByUserIdOnDate(userId: string, date: Date) {
    const startOfTheDay = dayjs(date).startOf('date')
    const endtOfTheDay = dayjs(date).endOf('date')

    const checkOnSameDate = this.items.find((checkIn) => {
      const checkInDate = dayjs(checkIn.created_at)

      const isOnSameDate =
        // intervalo
        checkInDate.isAfter(startOfTheDay) && checkInDate.isBefore(endtOfTheDay)
      return checkIn.user_id === userId && isOnSameDate
    })

    if (!checkOnSameDate) {
      return null
    }
    return checkOnSameDate
  }

  async findManyByUserId(userId: string, page: number) {
    return this.items
      .filter((checkIn) => checkIn.user_id === userId)
      .slice((page - 1) * 20, page * 20)
  }

  async countById(userId: string) {
    return this.items.filter((item) => item.user_id === userId).length
  }

  async create(data: Prisma.CheckInUncheckedCreateInput) {
    const checkIn = {
      id: randomUUID(),
      user_id: data.user_id,
      gym_id: data.gym_id,
      validated_at: data.validated_at ? new Date(data.validated_at) : null,
      created_at: new Date(),
    }

    this.items.push(checkIn)
    return checkIn
  }

  async save(checkIn: CheckIn) {
    const checkInIndex = this.items.findIndex((item) => item.id === checkIn.id)

    if (checkInIndex >= 0) {
      this.items[checkInIndex] = checkIn
    }
    return checkIn
  }
}
