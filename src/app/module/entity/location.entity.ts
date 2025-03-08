import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import Organization from './organization.entity';
import Asset from './asset.entity';

@Entity('locations')
export default class Location {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: false })
  name!: string;

  @Column({ nullable: false })
  address!: string;

  @ManyToOne(() => Organization, (organization) => organization.locations)
  @JoinColumn({ name: 'organization_id' })
  organization!: Organization;

  @OneToMany(() => Asset, (asset) => asset.location)
  assets!: Asset[];

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
    name: 'updated_at',
  })
  updatedAt!: Date;
}
