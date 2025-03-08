import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import Location from './location.entity';

@Entity('assets')
export default class Asset {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', length: 50 })
  type!: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  serial!: string;

  @Column({ type: 'enum', enum: ['active', 'inactive'], default: 'active' })
  status!: 'active' | 'inactive';

  @Column({ type: 'text', nullable: true })
  description?: string; // Có thể null nên dùng dấu `?`

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt!: Date;

  @ManyToOne(() => Location, (location) => location.assets, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'location_id' }) // Đặt tên cột khóa ngoại chính xác
  location!: Location;
}
