import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'
import dotenv from 'dotenv'

dotenv.config()

export enum EstadoEntrega {
  REQUESTED = 'requested',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  FAILED = 'failed',
}

@Entity({ name: 'otp_delivery', schema: process.env.DB_SCHEMA })
export class OtpDelivery {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'user_id', type: 'bigint', nullable: true })
  userId: string | null

  @Column({ type: 'varchar', length: 30, default: 'whatsapp' })
  channel: string

  @Column({ name: 'message_id', type: 'varchar', length: 255, nullable: true, unique: true })
  messageId: string | null

  @Column({ type: 'varchar', length: 30 })
  recipient: string

  @Column({ type: 'varchar', length: 20, default: EstadoEntrega.REQUESTED })
  status: string

  @Column({ name: 'error_detail', type: 'text', nullable: true })
  errorDetail: string | null

  @Column({ name: 'created_at', type: 'timestamptz', default: () => 'NOW()' })
  createdAt: Date

  @Column({ name: 'updated_at', type: 'timestamptz', default: () => 'NOW()' })
  updatedAt: Date
}
