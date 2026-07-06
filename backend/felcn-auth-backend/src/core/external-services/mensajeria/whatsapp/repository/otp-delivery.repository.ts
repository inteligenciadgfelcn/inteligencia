import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { OtpDelivery } from '../entity/otp-delivery.entity'

@Injectable()
export class OtpDeliveryRepository {
  constructor(private dataSource: DataSource) {}

  async crear(data: Partial<OtpDelivery>): Promise<OtpDelivery> {
    return await this.dataSource.getRepository(OtpDelivery).save(data)
  }

  async buscarPorMessageId(messageId: string): Promise<OtpDelivery | null> {
    return await this.dataSource
      .getRepository(OtpDelivery)
      .findOne({ where: { messageId } })
  }

  async actualizarPorId(id: string, update: Partial<OtpDelivery>): Promise<void> {
    await this.dataSource
      .getRepository(OtpDelivery)
      .update(id, { ...update, updatedAt: new Date() })
  }

  async actualizarEstadoPorMessageId(
    messageId: string,
    status: string,
    errorDetail?: string
  ): Promise<void> {
    await this.dataSource
      .getRepository(OtpDelivery)
      .update(
        { messageId },
        { status, errorDetail: errorDetail ?? null, updatedAt: new Date() }
      )
  }
}
