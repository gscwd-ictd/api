import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { DatabaseEntity } from '@gscwd-api/entity';

@Entity('users')
export class User extends DatabaseEntity {
  @PrimaryGeneratedColumn('uuid', { name: 'user_id' })
  userId: string;

  @Column({ unique: true, length: 80 })
  email: string;

  @Column({ length: 200 })
  password: string;

  @Column({ name: 'is_verified', type: 'boolean', default: false })
  isVerified: boolean;
}
